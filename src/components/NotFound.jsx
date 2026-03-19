import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements - Raw Industrial / Cyberpunk aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #FEE101 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 w-full max-w-lg text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative inline-block mb-8">
                        <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-transparent opacity-20 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] translate-y-4">
                                Perdido
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-[2px] w-12 bg-primary"></div>
                            <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                                Error de Navegación
                            </p>
                            <div className="h-[2px] w-12 bg-primary"></div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                            Esta zona no tiene el flow que buscas
                        </h2>

                        <p className="text-white/40 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed">
                            El enlace que seguiste parece estar roto o la página ha sido movida a otro sector del estudio.
                        </p>

                        <div className="pt-8">
                            <button
                                onClick={() => navigate('/')}
                                className="group relative inline-flex items-center gap-4 bg-primary text-black font-black px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(254,225,1,0.3)]"
                            >
                                <span className="text-xs uppercase tracking-[0.2em]">Volver al Inicio</span>
                                <span className="material-symbols-outlined !text-xl group-hover:translate-x-1 transition-transform">content_cut</span>

                                {/* Button Glitch Decor */}
                                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-20 flex justify-center items-center gap-6 opacity-20">
                    <div className="h-[1px] w-12 bg-white"></div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.5em]">
                        SISTEMA BARRAKESH /// STATUS: REDIRECT
                    </p>
                    <div className="h-[1px] w-12 bg-white"></div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
