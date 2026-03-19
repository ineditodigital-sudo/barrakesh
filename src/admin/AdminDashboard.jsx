import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useBarbers, useAppointments } from './data';
import Skeleton from './Skeleton';
import PerformanceChart from './PerformanceChart';
import { useToast } from './ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { exportToCSV } from './utils';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [barbers, { loading: barbersLoading }] = useBarbers();
    const [appointments, { updateItem, deleteItem, loading: appointmentsLoading }] = useAppointments();
    const [selectedApt, setSelectedApt] = useState(null);

    const isLoading = barbersLoading || appointmentsLoading;

    const [showArchivePrompt, setShowArchivePrompt] = useState(false);
    const [archiving, setArchiving] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'SUPER_ADMIN') {
            navigate('/admin/my-agenda');
            return;
        }

        // --- AUTO CLEANUP SYSTEM ---
        const lastCleanup = localStorage.getItem('barrakesh_last_cleanup');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        if (lastCleanup !== todayStr) {
            performAutoCleanup();
            localStorage.setItem('barrakesh_last_cleanup', todayStr);
        }

        // --- MONTHLY ARCHIVE SYSTEM ---
        const lastBackupMonth = localStorage.getItem('barrakesh_last_backup_month');
        const currentMonth = now.getMonth();
        if (lastBackupMonth !== null && parseInt(lastBackupMonth) !== currentMonth) {
            setShowArchivePrompt(true);
        }
        if (lastBackupMonth === null) {
            localStorage.setItem('barrakesh_last_backup_month', currentMonth.toString());
        }

    }, [user, navigate]);

    const performAutoCleanup = () => {
        console.log("Iniciando limpieza automática...");
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        appointments.forEach(apt => {
            const aptDate = new Date(apt.date);
            // 1. Delete Cancelled items older than 7 days
            if (apt.status === 'Cancelada' || apt.status === 'Cancelled') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                if (aptDate < sevenDaysAgo) {
                    console.log(`Borrando cita cancelada antigua: ${apt.id}`);
                    deleteItem(apt.id);
                }
            }
            // 2. Delete Finalized items older than 30 days
            else if (aptDate < thirtyDaysAgo) {
                console.log(`Purgando cita antigua (30+ días): ${apt.id}`);
                deleteItem(apt.id);
            }
        });
    };

    const runMonthlyBackup = async () => {
        setArchiving(true);
        try {
            const now = new Date();
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
            const monthName = lastMonth.toLocaleString('es-MX', { month: 'long', year: 'numeric' }).toUpperCase();

            const exportData = appointments.map(apt => ({
                ID: apt.id,
                Fecha: apt.date,
                Hora: apt.time,
                Cliente: apt.customer?.name || apt.client,
                Telefono: apt.customer?.phone || '',
                Barbero: apt.barber?.name || apt.barber,
                Servicios: Array.isArray(apt.services) ? apt.services.map(s => s.name).join('; ') : apt.service,
                Total: apt.total,
                Estado: apt.status
            }));

            const csvContent = "data:text/csv;charset=utf-8," +
                ["ID,Fecha,Hora,Cliente,Telefono,Barbero,Servicios,Total,Estado",
                    ...exportData.map(r => Object.values(r).join(','))].join("\n");

            // 1. Local download (Safety first)
            handleExportCSV();

            // 2. Server-side save via PHP (Custom cPanel setup)
            const response = await fetch('/save_archive.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: `BACKUP_${monthName.replace(/\s+/g, '_')}`,
                    content: [
                        "ID,Fecha,Hora,Cliente,Telefono,Barbero,Servicios,Total,Estado",
                        ...exportData.map(r => Object.values(r).join(','))
                    ].join("\n")
                })
            });

            if (response.ok) {
                addToast(`Registro mensual de ${monthName} guardado en servidor.`, 'success');
                localStorage.setItem('barrakesh_last_backup_month', new Date().getMonth().toString());
                setShowArchivePrompt(false);
            }
        } catch (e) {
            console.error("Backup error:", e);
            addToast("El backup se descargó localmente pero falló la subida al servidor.", "error");
        }
        setArchiving(false);
    };

    if (!user || user.role !== 'SUPER_ADMIN') return null;

    const [timeRange, setTimeRange] = useState('TODO'); // 'HOY', 'MES', 'TODO'

    const filteredByRange = appointments.filter(apt => {
        if (apt.status === 'Cancelada' || apt.status === 'Cancelled') return false;
        if (timeRange === 'TODO') return true;
        
        const now = new Date();
        const year = now.getFullYear();
        const monthNum = now.getMonth();
        const todayStr = `${year}-${(monthNum + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        
        if (timeRange === 'HOY') return apt.date === todayStr;
        if (timeRange === 'MES') {
            const [aptYear, aptMonth] = apt.date.split('-');
            return parseInt(aptMonth) === (monthNum + 1) && aptYear === year.toString();
        }
        return true;
    });

    const totalRevenue = filteredByRange.reduce((acc, apt) => {
        const priceStr = String(apt.total || '0').replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr) || 0;
        return acc + price;
    }, 0);

    const stats = [
        { 
            label: timeRange === 'HOY' ? "Ventas Hoy" : timeRange === 'MES' ? "Ventas Mes" : "Ventas Totales", 
            value: `$${totalRevenue.toLocaleString()}`, 
            icon: "payments", 
            trend: timeRange, 
            color: "primary" 
        },
        { 
            label: timeRange === 'HOY' ? "Citas Hoy" : timeRange === 'MES' ? "Citas Mes" : "Total Citas", 
            value: filteredByRange.length, 
            icon: "calendar_today", 
            trend: `Global`, 
            color: "white" 
        },
        { 
            label: "Equipo", 
            value: barbers.length, 
            icon: "monitoring", 
            trend: "Personal", 
            color: "white" 
        },
    ];

    // --- RECENT PERFORMANCE DATA ---
    const getWeeklyData = () => {
        const days = ["D", "L", "M", "X", "J", "V", "S"];
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const count = appointments.filter(a => a.date === dateStr).length;
            return {
                label: days[d.getDay()],
                value: count
            };
        });
    };
    const weeklyPerf = getWeeklyData();

    const generateWeeklyPDF = async () => {
        try {
            const doc = new jsPDF();
            const img = new Image();
            img.src = '/LOGO-BARRAKESH-HORIZONTAL-TXT-NEGRO.png';
            
            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = () => resolve();
            });

            // --- HEADER DESIGN ---
            doc.setFillColor(254, 225, 1); // Barrakesh Primary Yellow
            doc.rect(0, 0, 210, 45, 'F');

            if (img.complete && img.naturalWidth !== 0) {
                doc.addImage(img, 'PNG', 15, 10, 50, 15);
            } else {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("BARRAKESH", 15, 20);
            }

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("ADMINISTRATION // BUSINESS PERFORMANCE REPORT", 15, 32);

            const today = new Date().toLocaleDateString('es-MX', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            });
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text(`DATE GENERATED: ${today.toUpperCase()}`, 145, 15);
            doc.text(`AUTHORIZED BY: ${user.name.toUpperCase()} (${user.role})`, 145, 20);

            // --- SECTION 1: GLOBAL SUMMARY ---
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("I. RESUMEN GLOBAL", 15, 60);

            autoTable(doc, {
                startY: 65,
                head: [['MÉTRICA', 'RESULTADO']],
                body: [
                    ['INGRESOS TOTALES (ACUMULADO)', `$${totalRevenue.toLocaleString()}`],
                    ['TOTAL DE CITAS EN SISTEMA', String(appointments.length)],
                    ['STAFF ACTIVO', String(barbers.length)],
                    ['ULTIMA ACTUALIZACIÓN', new Date().toISOString().split('T')[0]]
                ],
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
            });

            // --- DATA ANALYSIS ---
            const barberStats = {};
            const serviceStats = {};
            const branchStats = {};
            
            appointments.forEach(apt => {
                const priceStr = String(apt.total || '0').replace(/[^0-9.]/g, '');
                const price = parseFloat(priceStr) || 0;
                
                // Barber Stats
                const bName = apt.barber?.name || apt.barber || 'Sin Asignar';
                if (!barberStats[bName]) barberStats[bName] = { count: 0, revenue: 0 };
                barberStats[bName].count++;
                barberStats[bName].revenue += price;
                
                // Branch Stats
                const loc = apt.location || 'Matriz (Default)';
                if (!branchStats[loc]) branchStats[loc] = { count: 0, revenue: 0 };
                branchStats[loc].count++;
                branchStats[loc].revenue += price;
                
                // Service Stats
                if (Array.isArray(apt.services)) {
                    apt.services.forEach(s => {
                        if (!serviceStats[s.name]) serviceStats[s.name] = { count: 0, revenue: 0 };
                        serviceStats[s.name].count++;
                        // If multiple services, we approximate revenue per service if price exists
                        serviceStats[s.name].revenue += parseFloat(s.price) || 0;
                    });
                } else if (apt.service) {
                    if (!serviceStats[apt.service]) serviceStats[apt.service] = { count: 0, revenue: 0 };
                    serviceStats[apt.service].count++;
                    serviceStats[apt.service].revenue += price;
                }
            });

            // --- SECTION 2: PERFORMANCE POR BARBERO ---
            doc.setFontSize(14);
            doc.text("II. RENDIMIENTO POR ESPECIALISTA", 15, doc.lastAutoTable.finalY + 20);

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 25,
                head: [['BARBERO', 'CITAS', 'INGRESOS TOTALES', '% APORTACIÓN']],
                body: Object.entries(barberStats).sort((a,b) => b[1].revenue - a[1].revenue).map(([name, data]) => [
                    name.toUpperCase(),
                    data.count,
                    `$${data.revenue.toLocaleString()}`,
                    totalRevenue > 0 ? `${((data.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%'
                ]),
                theme: 'striped',
                headStyles: { fillColor: [40, 40, 40] },
                styles: { fontSize: 8 }
            });

            // --- SECTION 3: POPULARIDAD DE SERVICIOS ---
            doc.setFontSize(14);
            doc.text("III. ANÁLISIS DE SERVICIOS", 15, doc.lastAutoTable.finalY + 20);

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 25,
                head: [['SERVICIO', 'FRECUENCIA', 'RECUPERACIÓN ESTIMADA']],
                body: Object.entries(serviceStats).sort((a,b) => b[1].count - a[1].count).slice(0, 10).map(([name, data]) => [
                    name.toUpperCase(),
                    data.count,
                    `$${data.revenue.toLocaleString()}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [254, 225, 1], textColor: [0, 0, 0] },
                styles: { fontSize: 8 }
            });

            // Check if we need new page
            if (doc.lastAutoTable.finalY > 200) doc.addPage(); else doc.text("", 15, doc.lastAutoTable.finalY + 15);

            // --- SECTION 4: HISTORIAL TRANSACCIONAL RECIENTE ---
            doc.setFontSize(14);
            const nextY = doc.lastAutoTable.finalY > 200 ? 25 : doc.lastAutoTable.finalY + 20;
            doc.text("IV. REPORTE DETALLADO (ÚLTIMOS MOVIMIENTOS)", 15, nextY);

            autoTable(doc, {
                startY: nextY + 5,
                head: [['CLIENTE', 'FECHA', 'HORA', 'BARBERO', 'TOTAL', 'ESTADO']],
                body: appointments.slice(0, 50).map(apt => [
                    (apt.customer?.name || apt.client || 'N/A').toUpperCase(),
                    apt.date,
                    apt.time,
                    (apt.barber?.name || apt.barber || 'N/A').toUpperCase(),
                    `$${apt.total || 0}`,
                    (apt.status || 'N/A').toUpperCase()
                ]),
                theme: 'striped',
                styles: { fontSize: 7, cellPadding: 2 },
                headStyles: { fillColor: [20, 20, 20] }
            });

            // --- FOOTER ---
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Barrakesh Professional Management System - Página ${i} de ${pageCount}`, 15, 285);
            }

            doc.save(`Reporte_Barrakesh_${new Date().toISOString().split('T')[0]}.pdf`);
            addToast('Reporte PDF generado correctamente', 'success');
        } catch (error) {
            console.error("PDF Error:", error);
            addToast('Error al generar el reporte PDF', 'error');
        }
    };

    const handleExportCSV = () => {
        const exportData = appointments.map(apt => ({
            ID: apt.id,
            Fecha: apt.date,
            Hora: apt.time,
            Cliente: apt.customer?.name || apt.client,
            Telefono: apt.customer?.phone || '',
            Barbero: apt.barber?.name || apt.barber,
            Servicios: Array.isArray(apt.services) ? apt.services.map(s => s.name).join('; ') : apt.service,
            Total: apt.total,
            Estado: apt.status
        }));
        exportToCSV(exportData, `Barrakesh_Historial_${new Date().toISOString().split('T')[0]}`);
    };

    const handleCancelApt = async (apt) => {
        if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
            await updateItem(apt.id, { ...apt, status: 'Cancelada' });
            setSelectedApt(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Detail Modal */}
            {selectedApt && (
                <div className="modal-overlay" onClick={() => setSelectedApt(null)}>
                    <div className="modal-content-wrapper">
                        <div className="modal-body max-w-lg" onClick={e => e.stopPropagation()}>
                            <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-primary/20 bg-[#0a0a0a]' : 'border-black/5 bg-white'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-primary font-black text-[10px] tracking-widest uppercase mb-1 block">Detalles de Cita</span>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedApt.customer?.name || selectedApt.client}</h2>
                                    </div>
                                    <button onClick={() => setSelectedApt(null)} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Especialista</span>
                                        <p className="font-bold">{selectedApt.barber?.name || selectedApt.barber}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Horario</span>
                                        <p className="font-bold text-primary">{selectedApt.date} @ {selectedApt.time}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Servicios</span>
                                        <p className="text-sm">
                                            {Array.isArray(selectedApt.services) ? selectedApt.services.map(s => s.name).join(', ') : selectedApt.service}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Monto</span>
                                        <p className="text-xl font-black">${selectedApt.total}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Estado</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${selectedApt.status === 'Cancelada' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{selectedApt.status}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {selectedApt.status !== 'Cancelada' ? (
                                        <>
                                            <a
                                                href={`https://wa.me/${selectedApt.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selectedApt.customer?.name || ''}! 👋 Te contacto de *Barrakesh* 💈 para confirmar tu cita del ${selectedApt.date} a las ${selectedApt.time} ⏰.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 h-12 bg-green-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95"
                                            >
                                                <span className="material-symbols-outlined !text-xl">chat</span> WhatsApp Confirmar
                                            </a>
                                            <button
                                                onClick={() => handleCancelApt(selectedApt)}
                                                className="px-6 h-12 border border-red-500/30 text-red-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/10 transition-all"
                                            >
                                                Cancelar Cita
                                            </button>
                                        </>
                                    ) : (
                                        <a
                                            href={`https://wa.me/${selectedApt.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selectedApt.customer?.name || ''}, lamentamos informarte que tu cita en *Barrakesh* 💈 para el día ${selectedApt.date} ha sido cancelada ❌. Por favor, agenda una nueva fecha en nuestra web. 🙏`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-12 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95"
                                        >
                                            <span className="material-symbols-outlined !text-xl">mail</span> Notificar Cancelación
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Archive Prompt */}
            {showArchivePrompt && (
                <div className="bg-primary p-6 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 animate-pulse-subtle border-4 border-black group">
                    <div className="flex items-center gap-5">
                        <div className="size-14 rounded-2xl bg-black flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-xl">
                            <span className="material-symbols-outlined !text-3xl">archive</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-black uppercase tracking-tighter leading-none">Cierre de Mes Pendiente</h2>
                            <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest mt-1">Es hora de respaldar y limpiar la base de datos.</p>
                        </div>
                    </div>
                    <button
                        disabled={archiving}
                        onClick={runMonthlyBackup}
                        className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl"
                    >
                        {archiving ? 'Procesando...' : (
                            <>
                                <span className="material-symbols-outlined !text-base">auto_awesome</span>
                                Respaldar y Purgar Mes
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Page Title Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Métricas de Negocio</h1>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[11px] font-bold mt-1 uppercase tracking-widest`}>Visión global del rendimiento de Barrakesh.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportCSV} className={`ios-button h-10 px-4 gap-2 text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                        <span className="material-symbols-outlined !text-base">download</span> CSV
                    </button>
                    <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                        <button 
                            onClick={() => setTimeRange('HOY')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${timeRange === 'HOY' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-black') : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')}`}
                        >Hoy</button>
                        <button 
                            onClick={() => setTimeRange('MES')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${timeRange === 'MES' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-black') : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')}`}
                        >Mes</button>
                        <button 
                            onClick={() => setTimeRange('TODO')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${timeRange === 'TODO' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-black') : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')}`}
                        >Todo</button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)
                ) : (
                    stats.map((stat) => (
                        <div key={stat.label} className={`ios-card p-5 hover:bg-white/[0.02] transition-all duration-300 group ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <span className="material-symbols-outlined !text-xl">{stat.icon}</span>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className={`${isDarkMode ? 'text-white/40' : 'text-black/50'} text-[9px] font-black uppercase tracking-widest mb-1`}>{stat.label}</h3>
                            <div className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{stat.value}</div>
                        </div>
                    ))
                )}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Table */}
                <div className={`lg:col-span-2 ios-card overflow-hidden flex flex-col min-h-[400px] ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10 shadow-sm'}`}>
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <h3 className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Citas Recientes</h3>
                        <button onClick={() => navigate('/admin/appointments')} className="text-[10px] font-black text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">Ver Todo</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={isDarkMode ? 'bg-white/5' : 'bg-black/5'}>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Cliente</th>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Barbero</th>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Hora</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : appointments.length > 0 ? (
                                    appointments.slice(0, 10).map((apt, idx) => (
                                        <tr key={idx} onClick={() => setSelectedApt(apt)} className={`hover:bg-primary/5 transition-colors cursor-pointer group ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black tracking-tight uppercase leading-none">{apt.customer?.name || apt.client}</span>
                                                    <span className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[9px] mt-2 font-bold`}>
                                                        {Array.isArray(apt.services) ? apt.services.map(s => s.name).join(', ') : apt.service}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-[11px] font-bold ${isDarkMode ? 'text-white/60' : 'text-black/80'}`}>{apt.barber?.name || apt.barber}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{apt.time}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">No hay citas registradas</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="space-y-4">
                    {/* Performance Card */}
                    <div className={`ios-card p-6 ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10 shadow-sm'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Demanda Semanal</h3>
                            <span className="text-[8px] font-bold text-primary animate-pulse uppercase">En Vivo</span>
                        </div>
                        <PerformanceChart data={weeklyPerf} isDarkMode={isDarkMode} />
                    </div>


                    {/* Quick Action Card */}
                    <div className={`p-8 relative overflow-hidden rounded-2xl group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl border ${isDarkMode ? '!bg-primary !border-primary shadow-primary/20' : '!bg-black !border-black shadow-black/30'}`}>
                        <div className={`absolute top-[-10px] right-[-10px] p-3 text-white/10`}>
                            <span className="material-symbols-outlined !text-7xl rotate-12">receipt_long</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className={`text-lg font-black tracking-tighter mb-1 select-none ${isDarkMode ? '!text-black' : '!text-white'}`}>Resumen</h3>
                            <p className={`text-[11px] font-bold mb-6 select-none leading-tight ${isDarkMode ? '!text-black/80' : '!text-white'}`}>Generar reporte PDF ahora.</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); generateWeeklyPDF(); }}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isDarkMode
                                    ? '!bg-black !text-white hover:!bg-white'
                                    : '!bg-primary !text-black hover:!bg-white'
                                    }`}
                            >
                                Descargar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
