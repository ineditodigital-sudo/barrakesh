import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useAppointments } from './data';
import { useTheme } from './ThemeContext';

const BarberAgenda = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedApt, setSelectedApt] = useState(null);
    const [appointments] = useAppointments();

    const barberAppointments = appointments.filter(apt => {
        const aptBarberName = apt.barber?.name || apt.barber || "";
        return aptBarberName.toLowerCase() === user.name.toLowerCase() && apt.date === selectedDate;
    });

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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Mi Diario de Trabajo</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión diaria de servicios asignados.</p>
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
                                    className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}>
                                    <span className="material-symbols-outlined !text-xl">chat</span>
                                    WhatsApp Contact
                                </a>
                                <button
                                    onClick={() => setSelectedApt(apt)}
                                    className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' : 'bg-black/5 text-black/40 hover:text-black/10'}`}>
                                    Detalles del Servicio
                                </button>
                            </div>
                        </div>
                    );
                })
                    : (
                        <div className={`col-span-full py-24 text-center border-2 border-dashed rounded-3xl ${isDarkMode ? 'border-white/5' : 'border-black/5'
                            }`}>
                            <span className={`material-symbols-outlined !text-6xl mb-4 ${isDarkMode ? 'text-white/5' : 'text-black/5'} animate-pulse`}>event_busy</span>
                            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/10' : 'text-black/10'}`}>Sin Reservaciones en esta Fecha</p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default BarberAgenda;
