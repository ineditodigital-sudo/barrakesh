import React, { useState } from 'react';
import { useAppointments } from './data';
import { useTheme } from './ThemeContext';

const AppointmentHistory = () => {
    const [appointments] = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const { isDarkMode } = useTheme();

    const filtered = appointments.filter(apt => {
        const clientName = apt.customer?.name || apt.client || "";
        const serviceNames = Array.isArray(apt.services) ? apt.services.map(s => s.name).join(' ') : apt.service || "";
        return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            serviceNames.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleExportCSV = () => {
        const headers = ["ID,Fecha,Hora,Cliente,Telefono,Barbero,Servicios,Sede,Total,Estado"];
        const rows = filtered.map(apt => {
            const clientName = (apt.customer?.name || apt.client || 'N/A').replace(/,/g, '');
            const phone = (apt.customer?.phone || '').replace(/\D/g, '');
            const barberName = (apt.barber?.name || apt.barber || 'N/A').replace(/,/g, '');
            const services = (Array.isArray(apt.services) ? apt.services.map(s => s.name).join('; ') : apt.service || 'N/A').replace(/,/g, '');
            const total = String(apt.total || '0').replace(/[^0-9.]/g, '');

            return `${apt.id},${apt.date},${apt.time},${clientName},${phone},${barberName},${services},${apt.branch || 'N/A'},${total},${apt.status}`;
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Barrakesh_Historial_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print px-1">
                <div>
                    <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Historial Operativo</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[11px] font-bold mt-1 uppercase tracking-widest`}>Reporte detallado de citas y transacciones.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className={`relative flex-1 md:w-72 rounded-xl group overflow-hidden border transition-all ${isDarkMode ? 'bg-white/[0.03] border-white/5' : 'bg-black/5 border-black/10'}`}>
                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/20' : 'text-black/30'} !text-lg`}>search</span>
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente o servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full bg-transparent pl-10 py-3 font-bold text-[10px] uppercase tracking-widest outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className={`ios-button px-8 py-3 font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 shadow-lg active:scale-95 ${isDarkMode
                            ? 'bg-primary text-black hover:bg-white shadow-primary/20'
                            : 'bg-black text-white hover:bg-primary hover:text-black shadow-black/30'
                            }`}
                    >
                        <span className="material-symbols-outlined !text-lg">download</span>
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Print Header (Only visible when printing) */}
            <div className="print-only mb-10 text-black border-b-4 border-black pb-6 px-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">BARRAKESH</h1>
                        <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">REPORTE OPERATIVO DETALLADO</h2>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                        <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest leading-none">Status: Operativo</div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">GÉNERADO: {new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            <div className={`ios-card overflow-hidden border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/10 shadow-sm'}`}>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} print:bg-gray-100 print:border-b-2 print:border-black`}>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Folio ID</th>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Fecha / Hora</th>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Detalles Operativos</th>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'} hidden sm:table-cell`}>Sede</th>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Inversión</th>
                                <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest print:text-black ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Estado</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y print:divide-gray-200 ${isDarkMode ? 'divide-white/5' : 'divide-black/10'}`}>
                            {filtered.length > 0 ? filtered.map(apt => (
                                <tr key={apt.id} className={`hover:bg-primary/5 transition-all group cursor-pointer print:text-black print:bg-white page-break-inside-avoid ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black tracking-tighter print:text-black flex items-center gap-1.5 ${isDarkMode ? 'text-primary' : 'text-black'}`}>
                                            <span className="material-symbols-outlined !text-[10px]">drag_handle</span>
                                            {apt.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black tracking-tight leading-none mb-1.5">{apt.date}</span>
                                            <span className={`text-[9px] font-mono italic ${isDarkMode ? 'text-white/40' : 'text-black/60'} print:text-gray-500`}>{apt.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black tracking-tight uppercase leading-none">{apt.customer?.name || apt.client || 'N/A'}</span>
                                            <span className={`text-[9px] font-bold uppercase tracking-tight mt-2 ${isDarkMode ? 'text-white/40' : 'text-black/60'} print:text-gray-500`}>
                                                {Array.isArray(apt.services) ? apt.services.map(s => s.name).join(', ') : apt.service} /// {apt.barber?.name || apt.barber || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-[10px] font-black uppercase hidden sm:table-cell ${isDarkMode ? 'text-white/40' : 'text-black/60'} print:text-black`}>{apt.branch}</td>
                                    <td className={`px-6 py-4 text-right text-base font-black tracking-tighter print:text-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{apt.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest border print:border-black print:text-black ${apt.status === 'Confirmado' ? 'bg-primary/20 text-primary border-primary/20' :
                                            apt.status === 'Finalizado' ? 'bg-green-500/10 text-green-500 border-green-500/10' :
                                                'bg-red-500/10 text-red-500 border-red-500/10'
                                            }`}>{apt.status}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className={`p-10 rounded-3xl mx-auto w-fit mb-4 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-black/5'}`}>
                                            <span className={`material-symbols-outlined !text-6xl ${isDarkMode ? 'text-white/5' : 'text-black/5'}`}>event_busy</span>
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Folio sin resultados operativos</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print Footer */}
            <div className="print-only mt-20 pt-6 border-t-2 border-black flex justify-between items-end">
                <div className="text-[9px] font-black uppercase tracking-widest opacity-40">
                    BARRAKESH SYSTEMS /// CONTROL DE OPERACIONES
                </div>
                <div className="text-[10px] font-black text-right">
                    AGUASCALIENTES, MÉXICO /// {new Date().getFullYear()}
                    <br />
                    <span className="opacity-40 text-[8px]">CONFIDENTIAL REPORT</span>
                </div>
            </div>
        </div>
    );
};

export default AppointmentHistory;
