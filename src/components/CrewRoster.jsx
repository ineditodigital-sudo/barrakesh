import React from 'react';
import { useBarbers, useAppointments } from '../admin/data';

const CrewRoster = ({ onSelect, onBack, selectedBarber }) => {
    const [barbers, { loading: barbersLoading }] = useBarbers();
    const [appointments, { loading: appointmentsLoading }] = useAppointments();

    if (barbersLoading || appointmentsLoading) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-black">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-10 opacity-[0.2]"></div>

            {/* Header Section */}
            <header className="flex-none px-6 pt-8 pb-4 z-10 relative">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={onBack}
                        className="text-white hover:text-primary transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-steel font-mono text-[10px] uppercase">PASO 02</span>
                    </div>
                </div>
                <h1 className="text-5xl font-bold text-white uppercase leading-[0.85] tracking-tighter">
                    EL<br />
                    <span className="text-primary">CREW</span>
                </h1>
                <p className="text-neutral-400 text-xs font-mono uppercase mt-2 tracking-widest">/// Selecciona tu especialista de flow 🔥</p>
            </header>

            {/* Main Carousel Area / Grid on Desktop */}
            <main className="flex-1 w-full overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory flex md:flex-row md:flex-wrap md:justify-center gap-6 md:gap-12 md:gap-y-24 px-6 md:px-16 items-center md:items-start no-scrollbar pb-16 md:pb-32 md:pt-12 relative z-0">
                {barbers.map((b, idx) => {
                    const isAway = b.status === "AWAY" || b.status === "Inactivo";
                    return (
                        <div
                            key={b.id}
                            onClick={() => !isAway && onSelect(b)}
                            className={`snap-center shrink-0 w-[80vw] md:w-[280px] h-[60vh] md:h-[450px] relative group cursor-pointer animate-scale-in [animation-delay:${idx * 150}ms] ${isAway ? 'opacity-70 grayscale' : 'hover:translate-y-[-8px] transition-transform duration-300'}`}
                        >
                            {/* Card Container */}
                            <div className={`absolute inset-0 bg-surface rounded-sm overflow-hidden border ${isAway ? 'border-none' : 'border-neutral-800 group-hover:border-primary transition-colors duration-300'}`}>
                                {/* Image Background */}
                                <div
                                    className={`absolute inset-0 bg-cover bg-center img-brutal transition-transform duration-700 ${!isAway && 'group-hover:scale-105'}`}
                                    style={{ backgroundImage: `url('${b.image || 'https://via.placeholder.com/400x600?text=' + b.name}')` }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

                                {/* Vertical Name */}
                                <div className="absolute top-0 left-0 h-full w-16 md:w-20 flex items-center justify-center pointer-events-none z-10">
                                    <h2 className={`writing-vertical text-7xl md:text-8xl font-bold uppercase tracking-tighter drop-shadow-xl whitespace-nowrap transition-colors duration-300 ${isAway ? 'text-outline-white opacity-30' : 'text-outline group-hover:text-primary group-hover:text-opacity-20'}`}>
                                        {b.name}
                                    </h2>
                                </div>

                                {/* Off Duty Stamp */}
                                {isAway && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                        <div className="border-4 border-neutral-500 text-neutral-500 px-6 py-2 -rotate-12 text-4xl font-bold uppercase tracking-widest opacity-80 backdrop-blur-sm bg-black/30 text-center">
                                            Fuera de<br />Servicio
                                        </div>
                                    </div>
                                )}

                                {/* Status Indicator */}
                                <div className={`absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 border border-neutral-700 rounded-sm ${isAway ? 'opacity-50' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full ${isAway ? 'bg-neutral-500' : 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                                    <span className={`${isAway ? 'text-neutral-400' : 'text-white'} text-[10px] font-bold tracking-widest uppercase`}>
                                        {isAway ? 'AUSENTE' : 'ACTIVO'}
                                    </span>
                                </div>

                                {/* Barber Stats */}
                                {!isAway && (
                                    <div className="absolute bottom-20 right-4 text-right">
                                        <p className="text-neutral-400 text-[10px] font-mono uppercase mb-1">Espec.</p>
                                        <p className="text-white text-lg font-bold uppercase leading-none group-hover:text-primary transition-colors">{b.spec} ///</p>
                                    </div>
                                )}

                                {/* Select Button (Inside Container) */}
                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-16 font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 z-20 ${isAway ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border-t border-neutral-700' :
                                        'bg-primary text-black group-hover:bg-white group-active:scale-95'
                                        }`}
                                >
                                    <span className="text-sm md:text-lg">{isAway ? 'No Disponible' : 'ELEGIR ESTILO'}</span>
                                    {!isAway && <span className="material-symbols-outlined text-xl font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Spacer for scroll padding */}
                <div className="snap-center shrink-0 w-12"></div>
            </main>



            {/* Bottom Navigation / Stats Bar */}
            <div className="flex-none bg-surface border-t border-neutral-800 px-6 py-6 font-mono uppercase" style={{ zIndex: 50 }}>
                <div className="flex justify-between items-center text-xs">
                    <div className="text-neutral-500">
                        <span className="text-primary mr-1">///</span> Disponibilidad
                    </div>
                    <div className="flex gap-4">
                        <div className="text-white">Hoy <span className="text-primary">ACTIVO</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrewRoster;
