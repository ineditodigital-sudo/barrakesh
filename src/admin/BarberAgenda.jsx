import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useAppointments } from './data';
import { useTheme } from './ThemeContext';

const BarberAgenda = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    // Helper to parse YYYY-MM-DD string into a local Date object at midnight
    const parseLocalDate = (str) => {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    // Helper to format Date object into YYYY-MM-DD string
    const formatLocalDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Use current local date instead of UTC
    const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
    const [selectedApt, setSelectedApt] = useState(null);
    const [appointments] = useAppointments();
    const [viewMode, setViewMode] = useState('DIARIO'); // DIARIO or MENSUAL


    // Generate 7 days around selectedDate (3 before, 3 after)
    const weekOfDays = [...Array(7)].map((_, i) => {
        const d = parseLocalDate(selectedDate);
        d.setDate(d.getDate() - 3 + i);
        return {
            date: formatLocalDate(d),
            dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
            dayNum: d.getDate()
        };
    });

    const matchesMe = (apt) => {
        if (!apt || !user || !apt.barber) return false;
        if (apt.status === 'Cancelada' || apt.status === 'Cancelado') return false;
        
        const aptBarberId = String(apt.barberId || apt.barber?.id || "");
        const myBarberId = String(user.barberId || "");
        
        // Match by ID primarily
        if (aptBarberId && myBarberId && aptBarberId === myBarberId) return true;
        
        // Normalization fallback
        const normalize = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, '');
        return normalize(apt.barber?.name || apt.barber) === normalize(user?.name);
    };

    const barberAppointments = appointments.filter(apt => matchesMe(apt) && apt.date === selectedDate);

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Modal for Details */}
            {selectedApt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className={`ios-card w-full max-w-sm p-8 border-2 animate-scale-in ${isDarkMode ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/5 bg-white'}`}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Detalles de Cita</h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Resumen del servicio asignado</p>
                            </div>
                            <button onClick={() => setSelectedApt(null)} className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined !text-lg">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary block mb-2">Cliente</span>
                                <div className="text-xl font-bold uppercase mb-1">{selectedApt.customer?.name || selectedApt.client}</div>
                                <div className="text-[11px] opacity-60">{selectedApt.customer?.phone || 'Sin teléfono'}</div>
                            </div>

                            <div className="space-y-3">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">Agenda de Servicios</span>
                                <div className="space-y-2">
                                    {(Array.isArray(selectedApt.services) ? selectedApt.services : [{ name: selectedApt.service, price: 0 }]).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{s.name}</span>
                                            <span className="text-[11px] font-mono opacity-60">${s.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-end border-t border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Inversión Final</span>
                                    <span className="text-3xl font-black tracking-tighter text-primary">${selectedApt.total || selectedApt.services?.reduce((acc, s) => acc + (s.price || 0), 0) || 0}</span>
                                </div>
                                <a
                                    href={`https://wa.me/${(selectedApt.customer?.phone || '').replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 px-6 rounded-xl bg-green-600 text-white flex items-center justify-center gap-2 hover:bg-green-700 transition-all font-bold text-[10px] uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined !text-xl">chat</span>
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Mi Diario de Trabajo</h2>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión diaria de servicios asignados.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                    <div className={`flex gap-2 overflow-x-auto pb-2 flex-1 scrollbar-thin`}>
                        {weekOfDays.map((day) => {
                            const isActive = selectedDate === day.date;
                            const dailyAppointments = appointments.filter(a => matchesMe(a) && a.date === day.date);
                            const aptCount = dailyAppointments.length;

                            return (
                                <button
                                    key={day.date}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`flex flex-col items-center min-w-[70px] py-4 rounded-2xl border transition-all relative ${isActive
                                        ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 scale-105'
                                        : isDarkMode ? 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10' : 'bg-white border-black/5 text-black/40 hover:border-primary/40 shadow-sm'
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-1">{day.dayName}</span>
                                    <span className="text-xl font-black">{day.dayNum}</span>
                                    {aptCount > 0 && (
                                        <div className="absolute -top-1 -right-1 flex gap-0.5">
                                            <span className={`size-4 rounded-full flex items-center justify-center text-[8px] font-black border-2 ${isActive ? 'bg-black text-primary border-primary' : 'bg-primary text-black border-[#121212]'}`}>
                                                {aptCount}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                        <div className={`flex items-center gap-1 p-1 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                            <button 
                                onClick={() => setViewMode('DIARIO')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'DIARIO' ? 'bg-primary text-black' : 'opacity-40 hover:opacity-100'}`}
                            >Diario</button>
                            <button 
                                onClick={() => setViewMode('MENSUAL')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'MENSUAL' ? 'bg-[#007AFF] text-white' : 'opacity-40 hover:opacity-100'}`}
                            >Mensual</button>
                        </div>
                        <div className={`flex items-center gap-2 p-2 px-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                             <span className="material-symbols-outlined !text-lg text-primary">calendar_month</span>
                             <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                                className="bg-transparent font-bold text-[10px] focus:outline-none uppercase tracking-tighter w-24"
                             />
                        </div>
                    </div>
                </div>
            </div>            {viewMode === 'DIARIO' ? (
                <>
                    {/* Quick Stats Summary */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-mono opacity-40">Total Hoy</span>
                            <span className="text-xl font-black text-primary">{barberAppointments.length}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-mono opacity-40">Confirmados</span>
                            <span className="text-xl font-black text-green-500">{barberAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Confirmado').length}</span>
                        </div>
                        <div className="flex flex-col border-l border-white/5 pl-4">
                            <span className="text-[8px] uppercase font-mono opacity-40">Pendientes</span>
                            <span className="text-xl font-black text-red-500">{barberAppointments.filter(a => !a.status || a.status === 'Pendiente').length}</span>
                        </div>
                        <div className="flex flex-col border-l border-white/5 pl-4">
                            <span className="text-[8px] uppercase font-mono opacity-40">Status Crew</span>
                            <span className="text-[10px] font-black uppercase text-white bg-green-500/20 px-2 py-0.5 rounded-sm inline-block w-fit mt-1">OPERATIVO</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {barberAppointments.length > 0 ? barberAppointments.map((apt, idx) => {
                            const phone = apt.customer?.phone?.replace(/\D/g, '') || '';
                            const waLink = `https://wa.me/${phone}?text=Hola%20${encodeURIComponent(apt.customer?.name || '')}!%20👋%20Te%20contacto%20de%20*Barrakesh*%20💈%20por%20tu%20cita%20de%20hoy%20a%20las%20${apt.time}%20⏰.%20¿Confirmas%20tu%20asistencia?%20🔥`;

                            return (
                                <div key={idx} className={`ios-card p-6 group transition-all duration-300 hover:scale-[1.02] border-2 ${apt.status === 'Confirmado' || apt.status === 'Confirmed' ? (isDarkMode ? 'bg-white/[0.02] border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-lg') :
                                    (isDarkMode ? 'bg-white/[0.01] opacity-60 border-white/5' : 'bg-black/[0.02] opacity-60 border-black/5')
                                    }`}>
                                    <div className="flex justify-between items-start mb-4 md:mb-8">
                                        <div className="text-4xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform">{apt.time}</div>
                                        <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border ${apt.status === 'Confirmed' || apt.status === 'Confirmado' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>{apt.status || 'Pendiente'}</span>
                                    </div>

                                    <div className="space-y-1 mb-4 md:mb-8">
                                        <span className="text-primary font-black text-[9px] uppercase tracking-[0.3em] block mb-1">Cliente</span>
                                        <h3 className={`text-xl font-black tracking-tight uppercase leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>{apt.customer?.name || apt.client || 'Invitado'}</h3>
                                        <p className={`${isDarkMode ? 'text-white/30' : 'text-black/40'} text-[9px] font-bold uppercase tracking-widest mt-2 leading-tight overflow-hidden text-ellipsis`}>
                                            {Array.isArray(apt.services) ? apt.services.map(s => s.name).join(' + ') : apt.service}
                                        </p>
                                    </div>

                                    <div className={`flex flex-col gap-3 pt-5 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-10 rounded-lg bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white transition-all flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest"
                                        >
                                            <span className="material-symbols-outlined !text-xl opacity-60">chat</span>
                                            Confirmar WhatsApp
                                        </a>
                                        <button
                                            onClick={() => setSelectedApt(apt)}
                                            className="h-10 rounded-lg bg-white/5 hover:bg-white/10 text-[8px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Detalle de la Cita
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-20 capitalize italic">
                                <span className={`material-symbols-outlined !text-6xl ${isDarkMode ? 'text-white' : 'text-black'}`}>event_busy</span>
                                <div className="text-sm font-bold tracking-widest uppercase">No hay citas para hoy</div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className={`ios-card p-4 border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <div className="overflow-x-auto pb-4">
                        <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden min-w-[700px]">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                            <div key={d} className={`p-4 text-center text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-[#1a1a1a] text-white/40' : 'bg-gray-50 text-black/40'}`}>{d}</div>
                        ))}
                        {(() => {
                            const now = parseLocalDate(selectedDate);
                            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                            const days = [];
                            
                            // Padding for start of month
                            for (let i = 0; i < startOfMonth.getDay(); i++) {
                                days.push(<div key={`pad-${i}`} className={isDarkMode ? 'bg-[#121212]' : 'bg-gray-50/30'}></div>);
                            }
                            
                            for (let d = 1; d <= endOfMonth.getDate(); d++) {
                                const fullDate = formatLocalDate(new Date(now.getFullYear(), now.getMonth(), d));
                                const isSelected = selectedDate === fullDate;
                                const myApts = appointments.filter(a => matchesMe(a) && a.date === fullDate);
                                const aptCount = myApts.length;

                                days.push(
                                    <div 
                                        key={d} 
                                        onClick={() => { setSelectedDate(fullDate); setViewMode('DIARIO'); }}
                                        className={`min-h-[100px] p-2 flex flex-col cursor-pointer transition-all ${isDarkMode ? 'bg-[#121212] hover:bg-white/5' : 'bg-white hover:bg-black/5'} ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
                                    >
                                        <span className={`text-[11px] font-bold ${isSelected ? 'text-primary' : 'opacity-40'}`}>{d}</span>
                                        <div className="mt-1 space-y-1">
                                            {aptCount > 0 && (
                                                <div className="flex items-center gap-1.5 p-1 rounded-md bg-primary/10 border border-primary/20">
                                                    <div className="size-1.5 rounded-full bg-primary"></div>
                                                    <span className="text-[8px] font-black text-primary uppercase">{aptCount} CITAS</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            return days;
                        })()}
                    </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default BarberAgenda;
