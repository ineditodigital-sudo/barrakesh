import React from 'react';

const IntentSelection = ({ onSelect }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-noise opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-hazard-stripe opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary opacity-5 blur-[150px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                {/* Logo Central */}
                <div className="mb-12 animate-scale-in">
                    <img
                        src="/LOGO-BARRAKESH-CUADRADO-TXT-BLANCO.png"
                        alt="BARRAKESH"
                        className="h-32 md:h-48 w-auto object-contain"
                    />
                </div>

                <h1 className="font-display text-4xl md:text-7xl font-black text-white uppercase text-center leading-[0.8] tracking-tighter mb-16 animate-fade-in-up">
                    ¿QUÉ QUIERES<br /><span className="text-primary italic-none">HACER HOY?</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in-up [animation-delay:200ms]">
                    {/* Opción A: Barbería */}
                    <button
                        onClick={() => onSelect('BARBER')}
                        className="group relative h-48 md:h-64 bg-surface border-2 border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:border-primary active:scale-95"
                    >
                        <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="material-symbols-outlined !text-6xl text-primary group-hover:scale-110 transition-transform">content_cut</span>
                        <div className="text-center relative z-10">
                            <h3 className="font-display text-2xl font-black text-white uppercase leading-none mb-1">Corte + Barba</h3>
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Asegura tu flow</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>

                    {/* Opción B: Estudio */}
                    <button
                        onClick={() => onSelect('STUDIO')}
                        className="group relative h-48 md:h-64 bg-surface border-2 border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:border-accent-blue hover:text-white active:scale-95"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="material-symbols-outlined !text-6xl text-primary group-hover:scale-110 transition-transform" style={{ color: '#00ccff' }}>graphic_eq</span>
                        <div className="text-center relative z-10">
                            <h3 className="font-display text-2xl font-black text-white uppercase leading-none mb-1">Grabar Música</h3>
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Barrakesh Studio</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ccff] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>

                    {/* Opción C: Trabajar */}
                    <button
                        onClick={() => onSelect('JOIN')}
                        className="group relative h-48 md:h-64 bg-surface border-2 border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:border-white active:scale-95"
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="material-symbols-outlined !text-6xl text-white/20 group-hover:text-white group-hover:scale-110 transition-all">handshake</span>
                        <div className="text-center relative z-10">
                            <h3 className="font-display text-2xl font-black text-white uppercase leading-none mb-1">Trabajar Aquí</h3>
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Únete al Crew</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </div>

                <div className="mt-16 text-center animate-fade-in-up [animation-delay:400ms]">
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.8em]">BARRAKESH_OPERATING_SYSTEM_V1.0.9</p>
                </div>
            </div>
        </div>
    );
};

export default IntentSelection;
