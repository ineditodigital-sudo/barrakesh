import React, { useState } from 'react';

const StudioDetails = ({ onComplete, onBack, booking }) => {
    const [details, setDetails] = useState({
        description: '',
        hours: 1
    });

    const totalServicesPrice = booking.services.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    const totalPrice = totalServicesPrice * details.hours;

    return (
        <div className="bg-[#050505] text-white font-mono antialiased min-h-screen flex flex-col relative overflow-hidden">
            {/* Noise Texture Overlay Removed */}

            <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b-2 border-[#007AFF] relative">
                <div className="flex items-center justify-between p-4 h-16">
                    <button onClick={onBack} className="text-white hover:text-[#007AFF] transition-colors">
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="font-display font-bold text-2xl tracking-tighter uppercase text-white">PROYECTO STUDIO</h1>
                        <span className="text-[#007AFF] font-mono text-[8px] uppercase tracking-widest leading-none mt-1">PASO 02</span>
                    </div>
                    <div className="size-10"></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 pb-48 z-10 space-y-12 overflow-y-auto no-scrollbar">
                <section className="animate-fade-in-up md:mt-8">

                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 bg-[#007AFF]/10 border border-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
                            <span className="material-symbols-outlined !text-3xl">mic</span>
                        </div>
                        <h2 className="font-display text-4xl font-bold uppercase tracking-tighter">Detalles del Proyecto</h2>
                    </div>
                    <p className="text-white/40 text-xs mb-6 uppercase tracking-widest">Cuéntanos brevemente qué planeas grabar o producir hoy.</p>

                    <textarea
                        value={details.description}
                        onChange={(e) => setDetails({ ...details, description: e.target.value })}
                        placeholder="EJ: GRABACIÓN DE VOCALES PARA ÁLBUM TRAP... / MIXING DE SESIÓN PREVIA..."
                        className="w-full h-32 bg-white/5 border border-white/10 p-4 text-sm focus:border-[#007AFF] focus:bg-white/10 outline-none transition-all placeholder:text-white/10 uppercase"
                    />
                </section>

                <section className="animate-fade-in-up [animation-delay:100ms]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 bg-[#007AFF]/10 border border-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
                            <span className="material-symbols-outlined !text-3xl">schedule</span>
                        </div>
                        <h2 className="font-display text-4xl font-bold uppercase tracking-tighter">Tiempo de Renta</h2>
                    </div>
                    <p className="text-white/40 text-xs mb-6 uppercase tracking-widest">El estudio se renta por horas. Define tu sesión abajo.</p>

                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 4, 8].map(h => (
                            <button
                                key={h}
                                onClick={() => setDetails({ ...details, hours: h })}
                                className={`h-20 flex flex-col items-center justify-center border transition-all ${details.hours === h ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.4)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-[#007AFF]/50'}`}
                            >
                                <span className="font-display text-3xl font-black">{h}</span>
                                <span className="text-[10px] font-bold uppercase">HRS</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-[#007AFF]/5 border border-[#007AFF]/10 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#007AFF] font-bold uppercase tracking-[0.2em]">Costo x Hora</span>
                            <span className="font-display text-2xl font-bold text-white">${totalServicesPrice.toFixed(2)}</span>
                        </div>
                        <div className="size-10 rounded-full border border-white/10 flex items-center justify-center opacity-20">
                            <span className="material-symbols-outlined">close</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-[#007AFF] font-bold uppercase tracking-[0.2em]">Horas Seleccionadas</span>
                            <span className="font-display text-2xl font-bold text-white">{details.hours} HRS</span>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#050505] to-transparent z-40">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-end px-2">
                        <div className="flex flex-col">
                            <span className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Subtotal Estimado</span>
                            <span className="text-[#007AFF] font-display text-4xl font-black leading-none">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-white/20 text-[10px] uppercase font-mono tracking-widest block">Impuestos Incluidos</span>
                        </div>
                    </div>

                    <button
                        disabled={!details.description}
                        onClick={() => onComplete(details)}
                        className={`w-full h-16 flex items-center justify-between px-8 font-black uppercase tracking-[0.2em] transition-all ${details.description ? 'bg-[#007AFF] text-white shadow-[6px_6px_0px_#003366] active:translate-y-1 active:shadow-none' : 'bg-white/5 text-white/20 border border-white/10 grayscale cursor-not-allowed'}`}
                    >
                        <span>SIGUIENTE PASO</span>
                        <span className="material-symbols-outlined !text-3xl font-bold">arrow_forward</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default StudioDetails;
