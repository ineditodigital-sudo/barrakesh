import React, { useState, useEffect } from 'react';
import { useBarbers, useAppointments } from './data';
import { useTheme } from './ThemeContext';

const GeneralAgenda = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [barbers] = useBarbers();
    const [appointments, { updateItem }] = useAppointments();
    const { isDarkMode } = useTheme();
    const [selectedApt, setSelectedApt] = useState(null);
    const [viewMode, setViewMode] = useState('DAILY'); // DAILY or MONTHLY


    // Generate 7 days around selectedDate (3 before, 3 after)
    const weekOfDays = [...Array(7)].map((_, i) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 3 + i);
        return {
            date: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
            dayNum: d.getDate()
        };
    });

    const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    const handleCancelApt = async (apt) => {
        if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
            await updateItem(apt.id, { ...apt, status: 'Cancelada' });
            setSelectedApt(null);
        }
    };

    const isStudioOccupied = (time, date) => {
        return appointments.find(a => {
            if (a.status === 'Cancelada' || !a.services?.some(s => s.category === 'Music Studio')) return false;
            if (a.date !== date) return false;

            const startHour = parseInt(a.time.split(':')[0]);
            const duration = parseInt(a.studioInfo?.hours || 1);
            const currentHour = parseInt(time.split(':')[0]);

            return currentHour >= startHour && currentHour < startHour + duration;
        });
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Appointment Detail Modal */}
            {selectedApt && (
                <div className="modal-overlay" onClick={() => setSelectedApt(null)}>
                    <div className="modal-content-wrapper">
                        <div className="modal-body max-w-lg" onClick={e => e.stopPropagation()}>
                            <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-primary/20 bg-[#0a0a0a]' : 'border-black/5 bg-white'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-primary font-black text-[10px] tracking-widest uppercase mb-1 block">Gestión de Cita</span>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedApt.customer?.name || selectedApt.client}</h2>
                                    </div>
                                    <button onClick={() => setSelectedApt(null)} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Asignado a</span>
                                        <p className="font-bold">{selectedApt.barber?.name || selectedApt.barber || 'Estudio Musical'}</p>
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
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`https://wa.me/${selectedApt.customer?.phone?.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 h-12 bg-green-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined !text-xl">chat</span> Contactar
                                    </a>
                                    {selectedApt.status !== 'Cancelada' && (
                                        <button
                                            onClick={() => handleCancelApt(selectedApt)}
                                            className="px-6 h-12 border border-red-500/30 text-red-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/10 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Agenda Global</h2>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Control maestro de citas y disponibilidad.</p>
                    </div>
                </div>

                {/* Weekly Strip Navigation */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                    <div className={`flex gap-2 overflow-x-auto pb-2 flex-1 scrollbar-thin`}>
                        {weekOfDays.map((day) => {
                            const isActive = selectedDate === day.date;
                            const dailyAppointments = appointments.filter(a => a.date === day.date && a.status !== 'Cancelada');
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
                                onClick={() => setViewMode('DAILY')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'DAILY' ? 'bg-primary text-black' : 'opacity-40 hover:opacity-100'}`}
                            >Daily</button>
                            <button 
                                onClick={() => setViewMode('MONTHLY')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'MONTHLY' ? 'bg-[#007AFF] text-white' : 'opacity-40 hover:opacity-100'}`}
                            >Monthly</button>
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
            </div>

            {viewMode === 'DAILY' ? (
                <div className={`ios-card border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <div className="overflow-x-auto pb-4 overscroll-contain touch-pan-x scrollbar-thin">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className={isDarkMode ? 'bg-white/5' : 'bg-black/5'}>
                                    <th className={`p-4 border-r min-w-[100px] sticky left-0 z-30 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.5)] ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10'}`}>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/50'}`}>Horario</span>
                                    </th>
                                    <th className="p-4 min-w-[170px] border-r border-[#007AFF]/20 bg-[#007AFF]/5">
                                        <div className="flex flex-col items-center">
                                            <div className="size-8 rounded-lg bg-[#007AFF]/20 flex items-center justify-center text-[#007AFF] font-bold text-[10px] mb-1.5 border border-[#007AFF]/30">
                                                <span className="material-symbols-outlined !text-base">mic</span>
                                            </div>
                                            <span className="text-xs font-bold tracking-tight text-[#007AFF]">MUSIC STUDIO</span>
                                        </div>
                                    </th>
                                    {barbers.map(barber => (
                                        <th key={barber.id} className="p-4 min-w-[170px]">
                                            <div className="flex flex-col items-center">
                                                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] mb-1.5 overflow-hidden border border-primary/20">
                                                    {barber.image ? <img src={barber.image} className="w-full h-full object-cover" /> : barber.initials}
                                                </div>
                                                <span className="text-xs font-bold tracking-tight">{barber.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
                                {timeSlots.map(time => (
                                    <tr key={time} className="group">
                                        <td className={`p-4 border-r text-center sticky left-0 z-20 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.5)] transition-colors ${isDarkMode ? 'bg-[#121212] border-white/10 text-white/40 group-hover:text-primary' : 'bg-white border-black/10 text-black/60 group-hover:text-primary'}`}>
                                            <span className="text-xs font-bold">{time}</span>
                                        </td>
                                        {/* Music Studio Column */}
                                        <td className={`p-2 relative border-r bg-[#007AFF]/5 border-[#007AFF]/10`}>
                                            {(() => {
                                                const studioApt = isStudioOccupied(time, selectedDate);
                                                if (studioApt) {
                                                    const isStart = studioApt.time === time;
                                                    return (
                                                        <div
                                                            onClick={() => setSelectedApt(studioApt)}
                                                            className={`p-3 rounded-xl h-full flex flex-col justify-center bg-[#007AFF] text-white shadow-md mb-1 cursor-pointer hover:scale-[1.02] transition-transform ${!isStart ? 'opacity-40 animate-pulse' : ''}`}
                                                        >
                                                            <span className="text-[10px] font-extrabold uppercase truncate">
                                                                {isStart ? (studioApt.customer?.name || studioApt.client) : 'ESTUDIO OCUPADO'}
                                                            </span>
                                                            <span className="text-[8px] font-bold opacity-80">
                                                                {isStart ? `${studioApt.studioInfo?.hours} HRS` : `SESIÓN EN CURSO`}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </td>

                                        {barbers.map(barber => {
                                            const apt = appointments.find(a =>
                                                (a.barber?.id === barber.id || a.barber?.name === barber.name || a.barber === barber.name) &&
                                                a.time === time && a.date === selectedDate
                                            );
                                            return (
                                                <td key={barber.id} className={`p-2 relative border-r last:border-r-0 min-h-[80px] ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                                                    {apt && apt.status !== 'Cancelada' ? (
                                                        <div onClick={() => setSelectedApt(apt)} className={`p-3 rounded-xl h-full flex flex-col justify-center transition-all hover:scale-[1.02] cursor-pointer shadow-md ${apt.status === 'Confirmed' || apt.status === 'Confirmado'
                                                            ? 'bg-primary text-black'
                                                            : isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-black/5 border border-black/10 text-black'
                                                            }`}>
                                                            <span className="text-[10px] font-extrabold uppercase truncate">{apt.customer?.name || apt.client || 'Sin Nombre'}</span>
                                                            <span className={`text-[8px] font-bold uppercase tracking-tight mt-0.5 ${(apt.status === 'Confirmed' || apt.status === 'Confirmado') ? 'text-black/60' : isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                                                                {Array.isArray(apt.services) ? apt.services.map(s => s.name).join(', ') : apt.service}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className={`h-12 w-full rounded-xl border-2 border-dashed transition-all flex items-center justify-center group/btn cursor-pointer ${isDarkMode ? 'border-white/5 hover:border-primary/20 hover:bg-primary/5' : 'border-black/5 hover:border-primary/40'}`}>
                                                            <span className={`material-symbols-outlined !text-lg transition-colors ${isDarkMode ? 'text-white/5 group-hover/btn:text-primary/30' : 'text-black/5 group-hover/btn:text-primary/40'}`}>add</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className={`ios-card p-4 border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <div className="overflow-x-auto overscroll-contain touch-pan-x pb-4">
                        <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden min-w-[700px]">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                            <div key={d} className={`p-4 text-center text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-[#1a1a1a] text-white/40' : 'bg-gray-50 text-black/40'}`}>{d}</div>
                        ))}
                        {(() => {
                            const now = new Date(selectedDate);
                            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                            const days = [];
                            
                            // Padding for start of month
                            for (let i = 0; i < startOfMonth.getDay(); i++) {
                                days.push(<div key={`pad-${i}`} className={isDarkMode ? 'bg-[#121212]' : 'bg-gray-50/30'}></div>);
                            }
                            
                            for (let d = 1; d <= endOfMonth.getDate(); d++) {
                                const fullDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                                const isSelected = selectedDate === fullDate;
                                const dayApts = appointments.filter(a => a.date === fullDate && a.status !== 'Cancelada');
                                const studioCount = dayApts.filter(a => a.services?.some(s => s.category === 'Music Studio')).length;
                                const barberCount = dayApts.length - studioCount;

                                days.push(
                                    <div 
                                        key={d} 
                                        onClick={() => { setSelectedDate(fullDate); setViewMode('DAILY'); }}
                                        className={`min-h-[100px] p-2 flex flex-col cursor-pointer transition-all ${isDarkMode ? 'bg-[#121212] hover:bg-white/5' : 'bg-white hover:bg-black/5'} ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
                                    >
                                        <span className={`text-[11px] font-bold ${isSelected ? 'text-primary' : 'opacity-40'}`}>{d}</span>
                                        <div className="mt-1 space-y-1">
                                            {studioCount > 0 && (
                                                <div className="flex items-center gap-1.5 p-1 rounded-md bg-[#007AFF]/10 border border-[#007AFF]/20">
                                                    <div className="size-1.5 rounded-full bg-[#007AFF]"></div>
                                                    <span className="text-[8px] font-black text-[#007AFF] uppercase">{studioCount} STUDIO</span>
                                                </div>
                                            )}
                                            {barberCount > 0 && (
                                                <div className="flex items-center gap-1.5 p-1 rounded-md bg-primary/10 border border-primary/20">
                                                    <div className="size-1.5 rounded-full bg-primary"></div>
                                                    <span className="text-[8px] font-black text-primary uppercase">{barberCount} CITAS</span>
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

            <div className={`flex justify-center gap-6 py-6 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(254,225,1,0.4)]"></div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.4)]"></div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Estudio Musical</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full border-2 ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}></div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Disponible</span>
                </div>
            </div>
        </div>
    );
};

export default GeneralAgenda;
