import React from 'react';
import { useAppointments } from './data';

const AppointmentHistory = () => {
    const [appointments] = useAppointments();

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Historial</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Registro transaccional de todas las citas.</p>
                </div>
                <div className="flex gap-2">
                    <button className="ios-button bg-white/5 border border-white/5 px-4 py-2 font-bold text-[10px] tracking-tight hover:bg-white/10 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined !text-base">filter_list</span>
                        Filtros
                    </button>
                    <button className="ios-button bg-white text-black px-4 py-2 font-bold text-[10px] tracking-tight hover:bg-primary transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined !text-base">download</span>
                        Reporte
                    </button>
                </div>
            </div>

            <div className="ios-card bg-white/[0.01] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Fecha/Hora</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Servicio</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Ubicación</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">Monto</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {appointments.map(apt => (
                                <tr key={apt.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-primary tracking-tighter">{apt.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold tracking-tight">{apt.date}</span>
                                            <span className="text-[10px] text-white/40">{apt.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold tracking-tight">{apt.client}</span>
                                            <span className="text-[9px] text-white/40 font-bold uppercase tracking-tight">{apt.service} /// {apt.barber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold uppercase text-white/40">{apt.branch}</td>
                                    <td className="px-6 py-4 text-right text-base font-bold tracking-tighter text-white">{apt.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${apt.status === 'Confirmado' ? 'bg-primary/20 text-primary' :
                                                apt.status === 'Finalizado' ? 'bg-white/10 text-white/40' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>{apt.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentHistory;
