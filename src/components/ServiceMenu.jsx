import React, { useState } from 'react';

const services = [
    {
        id: 1,
        category: "Hair Procedures",
        name: "Razor Fade",
        price: 35,
        desc: "Zero guard or foil shaver. Precision gradient. Straight razor finish.",
        tag: "Pop"
    },
    {
        id: 2,
        category: "Hair Procedures",
        name: "Scissor Cut",
        price: 40,
        desc: "All shear work. Textured crop or classic flow. Wash & style included."
    },
    {
        id: 3,
        category: "Hair Procedures",
        name: "Buzz Cut",
        price: 25,
        desc: "Single guard all over. Line up included. Quick & clean."
    },
    {
        id: 4,
        category: "Grooming",
        name: "Beard Sculpt",
        price: 25,
        desc: "Hot towel prep. Oil treatment. Razor line up and shape."
    },
    {
        id: 5,
        category: "Grooming",
        name: "The Works",
        price: 60,
        desc: "Full service cut + beard + facial.",
        disabled: true,
        tag: "Booked Out"
    },
];

const ServiceMenu = ({ onSelect, selectedService: initialSelected }) => {
    const [selected, setSelected] = useState(initialSelected);

    const categories = [...new Set(services.map(s => s.category))];

    return (
        <div className="relative min-h-screen bg-background-dark font-display selection:bg-primary selection:text-asphalt">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Main Container */}
            <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto bg-[#111111] shadow-2xl border-x border-[#333]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b-2 border-primary pt-6 pb-4 px-5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => window.location.reload()} // Simplified back to home
                            className="text-white hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                        </button>
                        <div className="flex flex-col items-end">
                            <span className="text-primary font-mono text-xs tracking-widest uppercase">ORDER #4492</span>
                            <span className="text-steel font-mono text-[10px] uppercase">STEP 1/4</span>
                        </div>
                    </div>
                    <h1 className="text-white font-display text-4xl leading-[0.9] tracking-tighter uppercase mb-1">
                        Service<br />Manifest
                    </h1>
                    <p className="text-steel font-mono text-xs uppercase tracking-wide">Select procedure below</p>
                </header>

                {/* Service List */}
                <main className="flex-1 p-5 flex flex-col gap-4 pb-32 overflow-y-auto no-scrollbar">
                    {categories.map(cat => (
                        <React.Fragment key={cat}>
                            <div className="flex items-center gap-3 mb-2 mt-2">
                                <div className="h-[1px] bg-primary w-6"></div>
                                <span className="text-primary font-mono text-xs tracking-widest uppercase">{cat}</span>
                                <div className="h-[1px] bg-[#333] flex-1"></div>
                            </div>

                            {services.filter(s => s.category === cat).map(s => {
                                const isSelected = selected?.id === s.id;
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => !s.disabled && setSelected(s)}
                                        className={`group relative p-5 border transition-all cursor-pointer active:scale-[0.98] ${s.disabled ? 'bg-concrete/40 opacity-60 pointer-events-none border-dashed border-[#333]' :
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
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="flex justify-between items-end mb-3 px-1">
                            <div className="flex flex-col">
                                <span className="text-steel font-mono text-[10px] uppercase">Est. Total</span>
                                <span className="text-primary font-display text-3xl leading-none">${selected ? selected.price.toFixed(2) : '0.00'}</span>
                            </div>
                            <span className="text-white font-mono text-xs mb-1 uppercase">
                                {selected ? '1 ITEM SELECTED' : '0 ITEMS SELECTED'}
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
                                <span className="text-black font-display font-black text-lg uppercase tracking-wider">Confirm Selection</span>
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

