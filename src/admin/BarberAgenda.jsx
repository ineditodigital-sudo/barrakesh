import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useAppointments } from './data';

const BarberAgenda = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState('2026-03-02');
    const [appointments] = useAppointments();

    const barberAppointments = appointments.filter(apt =>
        apt.barber.toLowerCase() === user.name.toLowerCase()
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Mi Diario de Trabajo</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Gestión diaria de servicios asignados.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
                    <span className="material-symbols-outlined text-white/20 ml-2 !text-lg">event</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-4"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {barberAppointments.length > 0 ? barberAppointments.map((apt, idx) => (
                    <div key={idx} className={`ios-card p-5 group transition-all duration-300 hover:scale-[1.01] ${apt.status === 'Confirmado' ? 'bg-white/[0.02]' :
                            'bg-white/[0.01] opacity-50'
                        }`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-3xl font-bold tracking-tighter text-primary group-hover:scale-105 transition-transform">{apt.time}</div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${apt.status === 'Confirmado' ? 'bg-green-500/10 text-green-500' :
                                    'bg-red-500/10 text-red-500'
                                }`}>{apt.status}</span>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-base font-bold tracking-tight">{apt.client}</h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{apt.service}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                            <button className="flex-1 h-9 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-tight hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined !text-base">call</span>
                                Contactar
                            </button>
                            <button className="size-9 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined !text-base">more_vert</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <span className="material-symbols-outlined !text-4xl text-white/5 mb-3">event_busy</span>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">Agenda vacía para hoy</p>
                    </div>
                )}

                <div className="ios-card bg-white/[0.01] border-2 border-dashed border-white/5 p-6 flex flex-col items-center justify-center min-h-[200px] text-white/5 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                    <span className="material-symbols-outlined !text-3xl mb-3 group-hover:scale-110 transition-transform">add_circle</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Añadir Cita</span>
                </div>
            </div>
        </div>
    );
};

export default BarberAgenda;
