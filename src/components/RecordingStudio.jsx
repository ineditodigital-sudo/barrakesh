import React, { useState } from 'react';

const RecordingStudio = ({ onBack }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleWhatsAppRedirect = () => {
        if (!selectedOption) return;
        const message = `Hola!%20Me%20interesa%20reservar%20el%20estudio%20de%20Barrakesh%20para%20${selectedOption}%20🎙️`;
        window.open(`https://wa.me/524495452271?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-black font-display text-white selection:bg-accent-blue selection:text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Noise Texture Overlay Removed */}

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 blur-[100px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fade-in-up text-center">
                <header className="mb-12">
                    <span className="text-[#00ccff] font-mono text-[10px] tracking-[0.6em] uppercase mb-4 block animate-pulse">/// BARRAKESH STUDIO /// ESTADO: OPERATIVO</span>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8 italic">
                        CAPTURA<br /><span className="text-[#00ccff] not-italic">TU FLOW.</span>
                    </h1>
                    <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
                        Donde el corte se encuentra con el ritmo. El primer estudio de grabación integrado en una barbería industrial.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-12">
                    <div
                        onClick={() => setSelectedOption('GRABACIÓN')}
                        className={`p-8 border-2 bg-surface/50 backdrop-blur-sm cursor-pointer transition-all text-left ${selectedOption === 'GRABACIÓN' ? 'border-[#00ccff] shadow-[0_0_20px_rgba(0,204,255,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined !text-4xl text-[#00ccff] mb-4">mic</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2">GRABACIÓN</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Vocales cristalinas, equipo de alta gama y ambiente con actitud.</p>
                    </div>
                    <div
                        onClick={() => setSelectedOption('PRODUCCIÓN')}
                        className={`p-8 border-2 bg-surface/50 backdrop-blur-sm cursor-pointer transition-all text-left ${selectedOption === 'PRODUCCIÓN' ? 'border-[#00ccff] shadow-[0_0_20px_rgba(0,204,255,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined !text-4xl text-[#00ccff] mb-4">equalizer</span>
                        <h3 className="font-display text-3xl font-black uppercase mb-2">PRODUCCIÓN</h3>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Beats a medida, mezcla y masterización con el sello Barrakesh.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <button
                        onClick={handleWhatsAppRedirect}
                        disabled={!selectedOption}
                        className={`px-12 py-5 font-display font-black text-2xl uppercase tracking-widest transition-all ${selectedOption ? 'bg-[#00ccff] text-black shadow-[8px_8px_0px_#003344] hover:shadow-none hover:translate-x-2 hover:translate-y-2' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'}`}
                    >
                        {selectedOption ? `RESERVAR ${selectedOption}` : 'ELIGE SERVICIO'}
                    </button>
                    <button
                        onClick={onBack}
                        className="border-2 border-white/10 text-white/40 px-12 py-5 font-display font-black text-2xl uppercase tracking-widest hover:border-white hover:text-white transition-all"
                    >
                        VOLVER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordingStudio;
