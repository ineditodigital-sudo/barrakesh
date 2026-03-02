import React, { useState } from 'react';
import { useBarbers, useAppointments } from './data';
import { useTheme } from './ThemeContext';

const GeneralAgenda = () => {
    const [selectedDate, setSelectedDate] = useState('2026-03-02');
    const [barbers] = useBarbers();
    const [appointments] = useAppointments();
    const { isDarkMode } = useTheme();

    const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Agenda Global</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Control maestro de citas y disponibilidad.</p>
                </div>
                <div className={`flex items-center gap-3 p-1.5 rounded-xl border w-full md:w-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <span className={`material-symbols-outlined ml-2 !text-lg ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>event</span>
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
                                {barbers.map(barber => (
                                    <th key={barber.id} className="p-4 min-w-[160px]">
                                        <div className="flex flex-col items-center">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] mb-1.5 overflow-hidden border border-primary/20 shadow-sm">
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
                                    {barbers.map(barber => {
                                        const apt = appointments.find(a => a.barber === barber.name && a.time === time);
                                        return (
                                            <td key={barber.id} className={`p-2 relative border-r last:border-r-0 min-h-[80px] ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                                                {apt ? (
                                                    <div className={`p-3 rounded-xl h-full flex flex-col justify-center transition-all hover:scale-[1.02] cursor-pointer shadow-md ${apt.status === 'Confirmado'
                                                        ? 'bg-primary text-black'
                                                        : isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-black/5 border border-black/10 text-black'
                                                        }`}>
                                                        <span className="text-[10px] font-extrabold uppercase truncate">{apt.client}</span>
                                                        <span className={`text-[8px] font-bold uppercase tracking-tight mt-0.5 ${apt.status === 'Confirmado' ? 'text-black/60' : isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                                                            {apt.service}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className={`h-12 w-full rounded-xl border-2 border-dashed transition-all flex items-center justify-center group/btn cursor-pointer ${isDarkMode ? 'border-white/5 hover:border-primary/20 hover:bg-primary/5' : 'border-black/5 hover:border-primary/40'
                                                        }`}>
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
                    <div className={`size-2.5 rounded-full border-2 ${isDarkMode ? 'border-white/20' : 'border-black/20'}`}></div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Disponible</span>
                </div>
            </div>
        </div>
    );
};

export default GeneralAgenda;
