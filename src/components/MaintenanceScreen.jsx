import React from 'react';
import { motion } from 'framer-motion';

const MaintenanceScreen = () => {
    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 size-96 bg-primary/5 blur-[120px] rounded-full animate-pulse delay-700"></div>

            {/* Caution Tapes Container */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-center gap-24 opacity-20">
                {[...Array(4)].map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ x: i % 2 === 0 ? '-100%' : '100%' }}
                        animate={{ x: i % 2 === 0 ? '100%' : '-100%' }}
                        transition={{ duration: 20 + (i * 5), repeat: Infinity, ease: "linear" }}
                        className={`h-12 w-[300%] bg-primary flex items-center gap-12 whitespace-nowrap rotate-${(i - 1.5) * 5}`}
                    >
                        {[...Array(20)].map((_, j) => (
                            <span key={j} className="text-black font-black text-sm uppercase tracking-tighter italic">
                                CAUTION • BARRAKESH UNDER CONSTRUCTION • DO NOT CROSS •
                            </span>
                        ))}
                    </motion.div>
                ))}
            </div>

            {/* Central Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex flex-col items-center text-center px-6"
            >
                <div className="mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                    <img 
                        src="/LOGO-BARRAKESH-CUADRADO-TXT-BLANCO.png" 
                        alt="Barrakesh Logo" 
                        className="w-32 md:w-40 object-contain drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] relative z-10"
                    />
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                    Sitio en <span className="text-primary italic">Construcción</span>
                </h1>
                
                <p className="text-white/40 max-w-md font-medium text-sm md:text-base leading-relaxed mb-12">
                    Estamos diseñando una nueva experiencia digital para ti. Vuelve pronto para agendar tu próximo corte con el mejor estilo de Barrakesh.
                </p>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    <div className="size-2 bg-primary rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Sistema en Mantenimiento</span>
                </div>

                {/* Admin Access Link (Subtle) */}
                <a 
                    href="/admin/login" 
                    className="mt-16 text-[9px] font-bold text-white/10 hover:text-primary transition-colors uppercase tracking-widest"
                >
                    Acceso Administrativo
                </a>
            </motion.div>

            {/* Animated Patterns */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        </div>
    );
};

export default MaintenanceScreen;
