import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useAppointments } from './data';
import { useTheme } from './ThemeContext';

const BarberAgenda = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [selectedDate, setSelectedDate] = useState('2026-03-02');
    const [appointments] = useAppointments();

    const barberAppointments = appointments.filter(apt => {
        const aptBarberName = apt.barber?.name || apt.barber || "";
        return aptBarberName.toLowerCase() === user.name.toLowerCase();
    });

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Mi Diario de Trabajo</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión diaria de servicios asignados.</p>
                </div>
                <div className={`flex items-center gap-3 p-1.5 rounded-xl border w-full md:w-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <span className={`material-symbols-outlined ml-2 !text-lg ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>event</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={`bg-transparent font-bold text-xs focus:outline-none cursor-pointer pr-4 flex-1 md:flex-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {barberAppointments.length > 0 ? barberAppointments.map((apt, idx) => (
                    <div key={idx} className={`ios-card p-5 group transition-all duration-300 hover:scale-[1.01] border ${apt.status === 'Confirmado' ? (isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/5 shadow-sm') :
                        (isDarkMode ? 'bg-white/[0.01] opacity-50 border-white/5' : 'bg-black/[0.02] opacity-50 border-black/5')
                        }`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-3xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform">{apt.time}</div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${apt.status === 'Confirmed' || apt.status === 'Confirmado' ? 'bg-green-500/10 text-green-500 border-green-500/10' :
                                'bg-red-500/10 text-red-500 border-red-500/10'
                                }`}>{apt.status === 'Confirmed' ? 'Confirmado' : apt.status}</span>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{apt.customer?.name || apt.client || 'Sin Nombre'}</h3>
                            <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-[10px] font-bold uppercase tracking-widest`}>
                                {Array.isArray(apt.services) ? apt.services.map(s => s.name).join(', ') : apt.service}
                            </p>
                        </div>

                        <div className={`flex items-center gap-2 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                            <button className={`flex-1 h-9 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-primary hover:text-black' : 'bg-black/5 hover:bg-black hover:text-white'
                                }`}>
                                <span className="material-symbols-outlined !text-base">call</span>
                                Contactar
                            </button>
                            <button className={`size-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-black/5 text-black/40 hover:text-black'
                                }`}>
                                <span className="material-symbols-outlined !text-base">more_vert</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className={`col-span-full py-20 text-center border-2 border-dashed rounded-2xl ${isDarkMode ? 'border-white/5' : 'border-black/5'
                        }`}>
                        <span className={`material-symbols-outlined !text-4xl mb-3 ${isDarkMode ? 'text-white/5' : 'text-black/5'}`}>event_busy</span>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Agenda vacía para hoy</p>
                    </div>
                )}

                <div className={`ios-card border-2 border-dashed p-6 flex flex-col items-center justify-center min-h-[200px] transition-all cursor-pointer group ${isDarkMode ? 'bg-white/[0.01] border-white/5 text-white/5 hover:text-primary hover:border-primary/20 hover:bg-primary/5' :
                    'bg-black/[0.01] border-black/5 text-black/5 hover:text-primary hover:border-primary/40 hover:bg-white'
                    }`}>
                    <span className="material-symbols-outlined !text-3xl mb-3 group-hover:scale-110 transition-transform">add_circle</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Añadir Cita</span>
                </div>
            </div>
        </div>
    );
};

export default BarberAgenda;
