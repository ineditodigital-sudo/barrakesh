import React, { useState } from 'react';

const services = [
    {
        id: 1,
        category: "MÉTELE AL CABELLO",
        name: "Fade a Navaja",
        price: 35,
        desc: "Cero o foil shaver. Degradado de precisión. Acabado a navaja.",
        tag: "Popular"
    },
    {
        id: 2,
        category: "MÉTELE AL CABELLO",
        name: "Corte a Tijera",
        price: 40,
        desc: "Solo tijera. Textured crop o clásico. Lavado y peinado incluido."
    },
    {
        id: 3,
        category: "MÉTELE AL CABELLO",
        name: "Corte Rapado",
        price: 25,
        desc: "Un solo nivel en toda la cabeza. Delineado incluido. Rápido y limpio."
    },
    {
        id: 4,
        category: "BARBA Y MÁS",
        name: "Esculpido de Barba",
        price: 25,
        desc: "Toalla caliente. Tratamiento de aceite. Delineado a navaja y forma."
    },
    {
        id: 5,
        category: "BARBA Y MÁS",
        name: "El Paquete Completo",
        price: 60,
        desc: "Corte completo + barba + facial.",
        disabled: true,
        tag: "Agotado"
    },
];

const ServiceMenu = ({ onSelect, onBack, selectedService: initialSelected }) => {
    const [selected, setSelected] = useState(initialSelected);

    const categories = [...new Set(services.map(s => s.category))];

    return (
        <div className="relative min-h-screen bg-background-dark font-display selection:bg-primary selection:text-asphalt">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Main Container */}
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
                        <div className="flex flex-col items-end">
                            <span className="text-primary font-mono text-xs tracking-widest uppercase">ORDEN #4492</span>
                            <span className="text-steel font-mono text-[10px] uppercase">PASO 01</span>
                        </div>
                    </div>
                    <h1 className="text-white font-display text-4xl leading-[0.9] tracking-tighter uppercase mb-1">
                        EL ARSENAL
                    </h1>
                    <p className="text-steel font-mono text-xs uppercase tracking-wide">Elige tu flow abajo</p>
                </header>

                {/* Service List */}
                <main className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pb-32 overflow-y-auto no-scrollbar content-start overflow-x-hidden">
                    {categories.map((cat, catIdx) => (
                        <React.Fragment key={cat}>
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3 mb-2 mt-6 animate-fade-in-up">
                                <div className="h-[1px] bg-primary w-6"></div>
                                <span className="text-primary font-mono text-xs tracking-widest uppercase">{cat}</span>
                                <div className="h-[1px] bg-[#333] flex-1"></div>
                            </div>

                            {services.filter(s => s.category === cat).map((s, sIdx) => {
                                const isSelected = selected?.id === s.id;
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => !s.disabled && setSelected(s)}
                                        className={`group relative p-5 border transition-all cursor-pointer active:scale-[0.98] animate-fade-in-up [animation-delay:${(catIdx * 100) + (sIdx * 50)}ms] ${s.disabled ? 'bg-concrete/40 opacity-60 pointer-events-none border-dashed border-[#333]' :
                                            isSelected ? 'bg-surface border-2 border-primary hard-shadow shadow-primary/20' :
                                                'bg-surface border-transparent border-b border-dashed border-b-[#444] hover:border-l-2 hover:border-l-white'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-display font-bold text-xl uppercase tracking-tight ${isSelected ? 'text-white' :
                                                        s.disabled ? 'text-steel line-through' :
                                                            'text-white group-hover:text-primary transition-colors'
                                                        }`}>
                                                        {s.name}
                                                    </h3>
                                                    {s.tag && (
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 font-mono uppercase ${s.disabled ? 'border border-accent-red text-accent-red' : 'bg-primary text-black'
                                                            }`}>
                                                            {s.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`font-mono text-xs leading-relaxed max-w-[200px] ${isSelected ? 'text-steel' :
                                                    s.disabled ? 'text-[#444]' : 'text-steel'
                                                    }`}>
                                                    {s.desc}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <span className={`font-display text-2xl ${isSelected || (!s.disabled && isSelected) ? 'text-primary' : 'text-white'
                                                    }`}>
                                                    ${s.price}
                                                </span>
                                                <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' :
                                                    s.disabled ? 'border-[#333]' : 'border-[#444] group-hover:border-white'
                                                    }`}>
                                                    {isSelected && <span className="material-symbols-outlined text-black !text-lg font-bold">close</span>}
                                                    {s.disabled && <span className="material-symbols-outlined text-[#444] !text-lg">block</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Decorative Icon */}
                                        <div className="absolute bottom-0 right-0 p-1 opacity-10">
                                            <span className="material-symbols-outlined text-white !text-4xl">content_cut</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </main>

                {/* Sticky Footer Summary */}
                <div className="fixed bottom-0 left-0 w-full z-40 px-5 pb-6 pt-10 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent pointer-events-none">
                    <div className="max-w-md md:max-w-xl mx-auto pointer-events-auto">
                        <div className="flex justify-between items-end mb-3 px-1">
                            <div className="flex flex-col">
                                <span className="text-steel font-mono text-[10px] uppercase">Total Est.</span>
                                <span className="text-primary font-display text-3xl leading-none">${selected ? selected.price.toFixed(2) : '0.00'}</span>
                            </div>
                            <span className="text-white font-mono text-xs mb-1 uppercase">
                                {selected ? '1 ÍTEM SELECCIONADO' : '0 ÍTEMS SELECCIONADOS'}
                            </span>
                        </div>

                        <button
                            disabled={!selected}
                            onClick={() => selected && onSelect(selected)}
                            className={`w-full relative group transition-all ${selected ? 'active:translate-y-1' : 'opacity-50 grayscale cursor-not-allowed'
                                }`}
                        >
                            {/* Hazard Stripe Deco */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-hazard-stripe opacity-50"></div>
                            <div className="relative flex items-center justify-between px-6 py-4 border-2 border-primary bg-primary overflow-hidden">
                                <span className="text-black font-display font-black text-lg uppercase tracking-wider">Confirmar Flow 🔥</span>
                                <span className="material-symbols-outlined text-black font-bold !text-2xl animate-pulse">arrow_forward</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceMenu;

