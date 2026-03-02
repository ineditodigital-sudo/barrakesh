import React, { useState } from 'react';
import { useBarbers, useAppointments } from './data';

const GeneralAgenda = () => {
    const [selectedDate, setSelectedDate] = useState('2026-03-02');
    const [barbers] = useBarbers();
    const [appointments] = useAppointments();

    const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Agenda Global</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Control maestro de citas y disponibilidad.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5">
                    <span className="material-symbols-outlined text-white/20 ml-2 !text-lg">event</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-4 py-1"
                    />
                </div>
            </div>

            <div className="ios-card bg-white/[0.01] overflow-hidden flex flex-col">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 border-r border-white/10 min-w-[100px]">
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Horario</span>
                                </th>
                                {barbers.map(barber => (
                                    <th key={barber.id} className="p-4 min-w-[160px]">
                                        <div className="flex flex-col items-center">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] mb-1.5 overflow-hidden">
                                                {barber.image ? <img src={barber.image} className="w-full h-full object-cover" /> : barber.initials}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{barber.name}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {timeSlots.map(time => (
                                <tr key={time} className="group">
                                    <td className="p-4 border-r border-white/10 text-center bg-white/[0.01]">
                                        <span className="text-xs font-bold text-white/40 group-hover:text-primary transition-colors">{time}</span>
                                    </td>
                                    {barbers.map(barber => {
                                        const apt = appointments.find(a => a.barber === barber.name && a.time === time);
                                        return (
                                            <td key={barber.id} className="p-2 relative border-r border-white/5 last:border-r-0 min-h-[80px]">
                                                {apt ? (
                                                    <div className={`p-3 rounded-xl h-full flex flex-col justify-center transition-all hover:scale-[1.02] cursor-pointer shadow-md ${apt.status === 'Confirmado'
                                                            ? 'bg-primary text-black'
                                                            : 'bg-white/5 border border-white/10 text-white'
                                                        }`}>
                                                        <span className="text-[10px] font-extrabold uppercase truncate">{apt.client}</span>
                                                        <span className={`text-[8px] font-bold uppercase tracking-tight mt-0.5 ${apt.status === 'Confirmado' ? 'text-black/60' : 'text-white/40'}`}>
                                                            {apt.service}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-full rounded-xl border-2 border-dashed border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center group/btn cursor-pointer">
                                                        <span className="material-symbols-outlined text-white/5 group-hover/btn:text-primary/30 !text-lg">add</span>
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

            <div className="flex justify-center gap-6 py-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full border border-white/20"></div>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Disponible</span>
                </div>
            </div>
        </div>
    );
};

export default GeneralAgenda;
