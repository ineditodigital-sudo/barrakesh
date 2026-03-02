import React from 'react';

const ModulePlaceholder = ({ title }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in-up">
            <div className="size-32 border-4 border-white/5 flex items-center justify-center mb-8">
                <span className="material-symbols-outlined !text-7xl text-white/10 animate-pulse">construction</span>
            </div>
            <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-4">{title}</h2>
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em]">Terminal en desarrollo /// Paso 01</p>

            <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="h-32 bg-surface border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-[10px] uppercase font-bold tracking-widest">
                    Modulo CRUD_V1
                </div>
                <div className="h-32 bg-surface border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-[10px] uppercase font-bold tracking-widest">
                    Interfaz Terminal
                </div>
            </div>
        </div>
    );
};

export default ModulePlaceholder;
