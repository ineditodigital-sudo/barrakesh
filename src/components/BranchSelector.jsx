import React from 'react';
import { motion } from 'framer-motion';
import { useBranches, useServices } from '../admin/data';

const BranchSelector = ({ onSelect, onBack, preferredCategory }) => {
    const [branches, { loading: branchesLoading }] = useBranches();
    const [services, { loading: servicesLoading }] = useServices();

    if (branchesLoading || servicesLoading) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    // Filter branches based on preferredCategory
    let operativeBranches = branches.filter(b => b.status === 'Operativo');
    
    if (preferredCategory) {
        // Find branches that have at least one service of this category
        const branchesWithCategory = new Set();
        services.filter(s => s.category === preferredCategory).forEach(s => {
            if (!s.availableBranches || s.availableBranches.length === 0) {
                // If no availableBranches specified, assume all branches support it? 
                // Actually, for "Music Studio", it's safer to assume it needs explicit selection if we want to be strict.
                // But for now, if empty, show in all.
                branches.forEach(b => branchesWithCategory.add(b.id));
            } else {
                s.availableBranches.forEach(bid => branchesWithCategory.add(Number(bid)));
            }
        });
        operativeBranches = operativeBranches.filter(b => branchesWithCategory.has(Number(b.id)));
    }

    return (
        <div className="relative min-h-screen bg-background-dark font-display text-white selection:bg-primary selection:text-black overflow-x-hidden">
            <div className="relative z-10 flex flex-col min-h-screen max-w-md md:max-w-6xl mx-auto bg-[#111111] shadow-2xl border-x border-[#333]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b-2 border-primary pt-6 pb-4 px-5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="text-white hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                        </button>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm">00</span>
                                <span className="text-steel font-mono text-[10px] uppercase">INICIO</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-white font-display text-4xl leading-[0.9] tracking-tighter uppercase mb-1">
                        ELIGE TU <span className="text-primary italic">ZONA.</span>
                    </h1>
                    <p className="text-steel font-mono text-xs uppercase tracking-wide">Selecciona la sucursal donde quieres tu cita</p>
                </header>

                <main className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 pb-20 overflow-y-auto no-scrollbar content-start">
                    {operativeBranches.map((branch, idx) => (
                        <motion.div
                            key={branch.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onSelect(branch)}
                            className="group relative bg-surface border border-white/5 p-6 hover:border-primary transition-all cursor-pointer overflow-hidden hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                            {/* Background Image Overlay */}
                            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                {branch.image && (
                                    <img src={branch.image} alt="" className="w-full h-full object-cover grayscale" />
                                )}
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined !text-3xl">location_on</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-primary border border-primary px-2 py-0.5 uppercase tracking-widest">Activa</span>
                                </div>

                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">
                                    {branch.name}
                                </h2>
                                <p className="text-xs font-mono text-white/40 uppercase leading-relaxed mb-6">
                                    {branch.addr}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <span className="text-[8px] font-mono text-white/20 uppercase block mb-1">Ciudad</span>
                                        <span className="text-[10px] font-bold uppercase">{branch.city}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-mono text-white/20 uppercase block mb-1">Horario</span>
                                        <span className="text-[10px] font-bold uppercase">{branch.hours || '11AM - 8PM'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decoration */}
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <span className="font-display text-8xl font-black italic">{idx + 1}</span>
                            </div>
                        </motion.div>
                    ))}

                    {branches.filter(b => b.status !== 'Operativo').map((branch, idx) => (
                        <div
                            key={branch.id}
                            className="relative bg-surface/50 border border-white/5 p-6 opacity-60 cursor-not-allowed grayscale"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                    <span className="material-symbols-outlined !text-3xl">lock</span>
                                </div>
                                <span className="text-[10px] font-mono text-white/20 border border-white/10 px-2 py-0.5 uppercase tracking-widest">{branch.status}</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white/20">
                                {branch.name}
                            </h2>
                            <p className="text-xs font-mono text-white/10 uppercase leading-relaxed">
                                {branch.addr}
                            </p>
                        </div>
                    ))}
                </main>

                {/* Footer Decor */}
                <div className="p-5 border-t border-white/5 bg-black/40">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] text-center">
                        BARRAKESH_SYSTEMS // MULTIBRANCH_MODULE_v2.1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BranchSelector;
