import React, { useState } from 'react';
import { useServices } from '../admin/data';

const ServiceMenu = ({ onSelect, onBack, initialSelected = [], preferredCategory }) => {
    const [services, { loading, error }] = useServices();
    const [selected, setSelected] = useState(initialSelected);

    const filteredServices = preferredCategory
        ? services.filter(s => s.category === preferredCategory)
        : services;

    const categories = [...new Set(filteredServices.map(s => s.category))];

    const toggleService = (s) => {
        if (s.disabled) return;
        setSelected(prev => {
            const isSelected = prev.find(item => item.id === s.id);
            if (isSelected) {
                return prev.filter(item => item.id !== s.id);
            } else {
                return [...prev, s];
            }
        });
    };

    const totalPrice = selected.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-8 text-center">
                <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                    <span className="material-symbols-outlined !text-4xl">
                        {error.type === 'CONNECTION' ? 'wifi_off' : 'database_off'}
                    </span>
                </div>
                <h2 className="font-display text-3xl font-black text-white uppercase mb-4">
                    {error.type === 'CONNECTION' ? 'Error de Conexión' : 'Servicios no configurados'}
                </h2>
                <p className="text-white/60 font-mono text-xs uppercase tracking-widest max-w-xs mb-8">
                    {error.type === 'NOT_FOUND'
                        ? 'Aún no has agregado servicios a la base de datos desde el panel de administración.'
                        : error.message}
                </p>
                <div className="space-y-4 w-full max-w-xs">
                    {error.type === 'CONNECTION' ? (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Reintentar Conexión
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/admin/services'}
                            className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Ir a Configurar Servicios
                        </button>
                    )}
                    <button
                        onClick={onBack}
                        className="w-full text-white/40 font-mono text-[10px] uppercase tracking-widest hover:text-white"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className="relative min-h-screen bg-background-dark font-display selection:bg-primary selection:text-asphalt">
            {/* Noise Texture Overlay Removed */}

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
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-white font-display text-4xl leading-[0.9] tracking-tighter uppercase mb-1">
                                EL ARSENAL
                            </h1>
                            <p className="text-steel font-mono text-xs uppercase tracking-wide">Elige tu flow (Selección Múltiple)</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">Carrito de Servicios</span>
                            <div className="flex gap-1 mt-1">
                                {selected.map(s => (
                                    <div key={s.id} className="size-2 bg-primary"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Service List */}
                <main className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 pb-48 md:pb-32 overflow-y-auto no-scrollbar content-start overflow-x-hidden">
                    {categories.map((cat, catIdx) => {
                        const isStudioCat = cat === "Music Studio";
                        const themeColor = isStudioCat ? "#007AFF" : "#FEE101"; // Blue for Studio
                        const textColorClass = isStudioCat ? "text-[#007AFF]" : "text-primary";
                        const borderColorClass = isStudioCat ? "border-[#007AFF]" : "border-primary";
                        const bgSelectedClass = isStudioCat ? "bg-[#007AFF]/20" : "bg-surface";

                        return (
                            <React.Fragment key={cat}>
                                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3 mb-2 mt-6 animate-fade-in-up">
                                    <div className={`h-[1px] w-6`} style={{ backgroundColor: themeColor }}></div>
                                    <span className={`font-mono text-xs tracking-widest uppercase`} style={{ color: themeColor }}>{cat}</span>
                                    <div className="h-[1px] bg-[#333] flex-1"></div>
                                </div>

                                {filteredServices.filter(s => s.category === cat).map((s, sIdx) => {
                                    const isSelected = selected.find(item => item.id === s.id);
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => toggleService(s)}
                                            className={`group relative p-5 border transition-all cursor-pointer active:scale-[0.98] animate-fade-in-up [animation-delay:${(catIdx * 100) + (sIdx * 50)}ms] ${s.disabled ? 'bg-concrete/40 opacity-60 pointer-events-none border-dashed border-[#333]' :
                                                isSelected ? `${bgSelectedClass} border-2 hard-shadow` :
                                                    'bg-surface border-transparent border-b border-dashed border-b-[#444] hover:border-l-2 hover:border-l-white'
                                                }`}
                                            style={isSelected ? { borderColor: themeColor, boxShadow: `6px 6px 0px ${themeColor}33` } : {}}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-display font-bold text-xl uppercase tracking-tight ${isSelected ? 'text-white' :
                                                            s.disabled ? 'text-steel line-through' :
                                                                'text-white transition-colors'
                                                            }`}
                                                            style={!isSelected && !s.disabled ? { '--hover-color': themeColor } : {}}
                                                        >
                                                            {s.name}
                                                        </h3>
                                                        {s.tag && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 font-mono uppercase ${s.disabled ? 'border border-accent-red text-accent-red' : ''
                                                                }`}
                                                                style={!s.disabled ? { backgroundColor: themeColor, color: isStudioCat ? 'white' : 'black' } : {}}
                                                            >
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
                                                    <span className={`font-display text-2xl ${isSelected ? '' : 'text-white'}`} style={isSelected ? { color: themeColor } : {}}>
                                                        ${s.price}
                                                    </span>
                                                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${isSelected ? '' :
                                                        s.disabled ? 'border-[#333]' : 'border-[#444] group-hover:border-white'
                                                        }`}
                                                        style={isSelected ? { borderColor: themeColor, backgroundColor: themeColor } : {}}
                                                    >
                                                        {isSelected && <span className={`material-symbols-outlined !text-lg font-bold ${isStudioCat ? 'text-white' : 'text-black'}`}>check</span>}
                                                        {s.disabled && <span className="material-symbols-outlined text-[#444] !text-lg">block</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Decorative Icon */}
                                            <div className="absolute bottom-0 right-0 p-1 opacity-10">
                                                <span className="material-symbols-outlined text-white !text-4xl">{isStudioCat ? 'mic' : 'content_cut'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </main>

                {/* Sticky Footer Summary */}
                <div className="fixed bottom-0 left-0 w-full z-40 px-5 pb-8 pt-12 bg-gradient-to-t from-[#111111] via-[#111111]/90 to-transparent pointer-events-none">
                    <div className="max-w-md md:max-w-2xl mx-auto pointer-events-auto">
                        <div className="flex justify-between items-end mb-4 px-1">
                            <div className="flex flex-col">
                                <span className="text-steel font-mono text-[10px] uppercase tracking-widest">Total Est.</span>
                                <span className="text-primary font-display text-4xl leading-none font-black">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-white font-mono text-[10px] uppercase font-bold bg-white/10 px-2 py-1 mb-1">
                                    {selected.length} {selected.length === 1 ? 'SERVICIO' : 'SERVICIOS'}
                                </span>
                                <span className="text-steel font-mono text-[8px] uppercase tracking-tighter">Click para continuar</span>
                            </div>
                        </div>

                        <button
                            disabled={selected.length === 0}
                            onClick={() => selected.length > 0 && onSelect(selected)}
                            className={`w-full relative group transition-all duration-300 ${selected.length > 0 ? 'active:translate-y-1 hover:scale-[1.01]' : 'opacity-50 grayscale cursor-not-allowed'
                                }`}
                        >
                            {/* Hazard Stripe Deco */}
                            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-hazard-stripe opacity-50 z-10"></div>
                            <div className="relative flex items-center justify-between px-8 py-5 border-2 border-primary bg-primary overflow-hidden shadow-[0_10px_20px_rgba(254,225,1,0.2)]">
                                <span className="text-black font-display font-black text-xl uppercase tracking-wider">Confirmar Flow 🔥</span>
                                <span className="material-symbols-outlined text-black font-bold !text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceMenu;
