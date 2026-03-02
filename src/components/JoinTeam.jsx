import React, { useState } from 'react';

const JoinTeam = ({ onBack }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleWhatsAppRedirect = () => {
        if (!selectedRole) return;
        const message = `Hola!%20Me%20interesa%20unirme%20al%20crew%20de%20Barrakesh%20como%20${selectedRole}%20⚡`;
        window.open(`https://wa.me/524495452271?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-black font-display text-white selection:bg-white selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-1 bg-white opacity-10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 blur-[150px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fade-in-up text-center">
                <header className="mb-16">
                    <span className="text-white font-mono text-[10px] tracking-[0.6em] uppercase mb-4 block animate-pulse">/// RECLUTAMIENTO /// BARRAKESH CREW</span>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8 italic">
                        ÚNETE AL<br /><span className="text-white not-italic">CREW. 🔥</span>
                    </h1>
                    <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-xl mx-auto">
                        Buscamos especialistas con actitud, técnica de precisión y ganas de redefinir la cultura urbana. No es solo un trabajo, es una declaración.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-16">
                    <div
                        onClick={() => setSelectedRole('BARBERO ELITE')}
                        className={`p-10 border-2 bg-surface/50 backdrop-blur-sm cursor-pointer transition-all text-left relative overflow-hidden ${selectedRole === 'BARBERO ELITE' ? 'border-primary shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined !text-4xl text-white mb-4">content_cut</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2">BARBERO ELITE</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Dominio total de fades, barbas y cortes clásicos con un toque industrial.</p>
                        <div className="absolute -bottom-4 -right-4 size-16 bg-white opacity-10 rotate-45 transform"></div>
                    </div>
                    <div
                        onClick={() => setSelectedRole('PRODUCTOR')}
                        className={`p-10 border-2 bg-surface/50 backdrop-blur-sm cursor-pointer transition-all text-left relative overflow-hidden ${selectedRole === 'PRODUCTOR' ? 'border-[#00ccff] shadow-[0_0_20px_rgba(0,204,255,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined !text-4xl text-[#00ccff] mb-4">graphic_eq</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2 text-white">PRODUCCIÓN</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Expertos en sonido, DJ sets y creación de beats en el estudio Barrakesh.</p>
                        <div className="absolute -bottom-4 -right-4 size-16 bg-[#00ccff] opacity-10 rotate-45 transform"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <button
                        onClick={handleWhatsAppRedirect}
                        disabled={!selectedRole}
                        className={`px-16 py-6 font-display font-black text-2xl uppercase tracking-widest transition-all ${selectedRole ? 'bg-white text-black shadow-[8px_8px_0px_#ccc] hover:shadow-none hover:translate-x-2 hover:translate-y-2' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'}`}
                    >
                        {selectedRole ? 'APLICAR AHORA' : 'ELIGE UNA OPCIÓN'}
                    </button>
                    <button
                        onClick={onBack}
                        className="border-2 border-white/10 text-white/40 px-16 py-6 font-display font-black text-2xl uppercase tracking-widest hover:border-white hover:text-white transition-all"
                    >
                        VOLVER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinTeam;
