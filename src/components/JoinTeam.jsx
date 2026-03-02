import React from 'react';

const JoinTeam = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-black font-display text-white selection:bg-white selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-1 bg-white opacity-10 animate-pulse"></div>
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-screen bg-white opacity-5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 blur-[150px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fade-in-up text-center">
                <header className="mb-20">
                    <span className="text-white font-mono text-[10px] tracking-[0.6em] uppercase mb-4 block animate-pulse">/// RECLUTAMIENTO /// BARRAKESH CREW</span>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8 italic">
                        ÚNETE AL<br /><span className="text-white not-italic">CREW. 🔥</span>
                    </h1>
                    <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-xl mx-auto">
                        Buscamos especialistas con actitud, técnica de precisión y ganas de redefinir la cultura urbana. No es solo un trabajo, es una declaración.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-20">
                    <div className="p-10 border-2 border-white/5 bg-surface/50 backdrop-blur-sm group hover:border-white transition-all text-left relative overflow-hidden">
                        <span className="material-symbols-outlined !text-4xl text-white mb-4 group-hover:scale-110 transition-transform">content_cut</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2">BARBERO ELITE</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Dominio total de fades, barbas y cortes clásicos con un toque industrial.</p>
                        <div className="absolute -bottom-4 -right-4 size-16 bg-white opacity-0 group-hover:opacity-10 rotate-45 transition-opacity"></div>
                    </div>
                    <div className="p-10 border-2 border-white/5 bg-surface/50 backdrop-blur-sm group hover:border-[#00ccff] transition-all text-left relative overflow-hidden">
                        <span className="material-symbols-outlined !text-4xl text-[#00ccff] mb-4 group-hover:scale-110 transition-transform">graphic_eq</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2 text-white">PRODUCCIÓN</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Expertos en sonido, DJ sets y creación de beats en el estudio Barrakesh.</p>
                        <div className="absolute -bottom-4 -right-4 size-16 bg-[#00ccff] opacity-0 group-hover:opacity-10 rotate-45 transition-opacity"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <button className="bg-white text-black px-16 py-6 font-display font-black text-2xl uppercase tracking-widest shadow-[8px_8px_0px_#ccc] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                        APLICAR AHORA
                    </button>
                    <button
                        onClick={onBack}
                        className="border-2 border-white/10 text-white/40 px-16 py-6 font-display font-black text-2xl uppercase tracking-widest hover:border-white hover:text-white transition-all"
                    >
                        PÉLANOS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinTeam;
