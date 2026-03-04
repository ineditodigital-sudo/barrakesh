import React, { useState } from 'react';
import { useBarbers, useAppointments } from './data';
import { useTheme } from './ThemeContext';

const GeneralAgenda = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [barbers] = useBarbers();
    const [appointments, { updateItem }] = useAppointments();
    const { isDarkMode } = useTheme();
    const [selectedApt, setSelectedApt] = useState(null);

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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Agenda Global</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Control maestro de citas y disponibilidad.</p>
                </div>
                <div className={`flex items-center gap-3 p-1.5 rounded-xl border w-full md:w-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <span className="material-symbols-outlined ml-2 !text-lg text-primary">calendar_today</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={`bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-4 py-1 flex-1 md:flex-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                    />
                </div>
            </div>

            <div className={`ios-card overflow-hidden border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className={isDarkMode ? 'bg-white/5' : 'bg-black/5'}>
                                <th className={`p-4 border-r min-w-[100px] ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
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
                                    <td className={`p-4 border-r text-center ${isDarkMode ? 'border-white/10 bg-white/[0.01]' : 'border-black/10 bg-black/[0.01]'}`}>
                                        <span className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-white/40 group-hover:text-primary' : 'text-black/60 group-hover:text-primary'}`}>{time}</span>
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
