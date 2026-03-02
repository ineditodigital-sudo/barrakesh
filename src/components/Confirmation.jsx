import React from 'react';

const Confirmation = ({ booking, onReset }) => {
    const barber = booking?.barber || { name: "Kash" };
    const service = booking?.service || { name: "Skin Fade", price: 35 };
    const dateStr = booking?.date || "12 SEP";
    const timeStr = booking?.time || "14:00";

    return (
        <div className="bg-void min-h-screen flex flex-col font-display antialiased overflow-hidden brutalist-grid relative">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Marquee Loader (Top) */}
            <div className="fixed top-0 left-0 w-full bg-primary z-50 overflow-hidden py-2 border-b-2 border-white">
                <div className="whitespace-nowrap animate-marquee flex gap-8 items-center font-mono font-bold text-sm tracking-widest text-black">
                    <span>GENERANDO TICKET...</span>
                    <span>///</span>
                    <span>ASEGURA EL FLOW 🔥</span>
                    <span>///</span>
                    <span>LOCKED IN 🔥</span>
                    <span>///</span>
                    <span>GENERANDO TICKET...</span>
                    <span>///</span>
                    <span>ASEGURA EL FLOW 🔥</span>
                    <span>///</span>
                    <span>LOCKED IN 🔥</span>
                    <span>///</span>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 relative mt-12 pb-20 z-10 overflow-hidden">
                {/* Status Header */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-white text-6xl font-black uppercase tracking-tighter leading-none mb-1">LOCKED IN <span className="text-primary italic-none">🔥</span></h1>
                    <p className="text-primary font-mono text-[10px] tracking-[0.4em] uppercase">LISTO PA'L FLOW /// PASO 04</p>
                </div>

                {/* The Ticket Component */}
                <div className="relative w-full max-w-sm bg-white text-black shadow-2xl transform transition-transform duration-700 hover:scale-[1.02] animate-scale-in [animation-delay:200ms]">
                    {/* Ticket Notches */}
                    <div className="ticket-notch ticket-notch-left"></div>
                    <div className="ticket-notch ticket-notch-right"></div>
                    <div className="ticket-dash"></div>

                    {/* Top Section */}
                    <div className="p-6 pb-12 flex flex-col items-center border-b-0">
                        {/* Header Logo / Brand */}
                        <div className="w-full flex justify-between items-start mb-8">
                            <div className="flex flex-col">
                                <img
                                    src="/LOGO-BARRAKESH-HORIZONTAL-TXT-NEGRO.png"
                                    alt="BARRAKESH"
                                    className="h-8 w-auto object-contain"
                                />
                                <span className="font-mono text-[10px] tracking-widest mt-1">EST. 2024</span>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="w-full h-16 barcode mb-8 opacity-90 mix-blend-multiply"></div>

                        <div className="w-full space-y-6">
                            {/* Client Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Cliente</span>
                                <span className="text-xl font-bold font-display uppercase tracking-wide">{booking?.customer?.name || 'TI'}</span>
                            </div>
                            {/* Location Row */}
                            <div className="flex flex-col gap-1 mb-4">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-primary">Sucursal</span>
                                <span className="text-xl font-bold font-display uppercase tracking-wide">{booking?.location || 'CENTRO'}</span>
                            </div>
                            {/* Barber Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Barbero</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold font-display uppercase tracking-wide">{barber.name}</span>
                                    <span className="material-symbols-outlined text-sm pt-0.5">verified</span>
                                </div>
                            </div>
                            {/* Service Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Servicio</span>
                                <span className="text-xl font-bold font-display uppercase tracking-wide">{service.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section (Below Fold/Notch) */}
                    <div className="p-6 pt-8 bg-gray-50">
                        <div className="flex justify-between items-end mb-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Horario</span>
                                <span className="text-2xl font-bold font-display uppercase leading-none">{timeStr}</span>
                                <span className="text-sm font-mono font-bold uppercase">{dateStr}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-bold font-mono tracking-tighter bg-primary px-1">
                                    ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                                </span>
                            </div>
                        </div>
                        {/* Footer Link */}
                        <div className="pt-4 border-t border-gray-200 flex justify-center">
                            <button className="group flex items-center gap-1">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest relative">
                                    Obtener Direcciones
                                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-primary group-hover:h-full group-hover:opacity-30 transition-all"></span>
                                </span>
                                <span className="material-symbols-outlined text-sm transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Wallet Integration */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button className="flex-1 bg-black text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 border border-white/20 hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">apple</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[10px] uppercase font-mono opacity-60">Add to</span>
                            <span className="text-sm font-bold font-display">Apple Wallet</span>
                        </div>
                    </button>
                    <button className="flex-1 bg-black text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 border border-white/20 hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">wallet</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[10px] uppercase font-mono opacity-60">Add to</span>
                            <span className="text-sm font-bold font-display">Google Wallet</span>
                        </div>
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 w-full max-w-sm flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="material-symbols-outlined text-white text-sm">info</span>
                        <p className="text-white font-mono text-[10px] uppercase">Muestra este ticket al llegar</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-white font-display text-lg uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 py-4 group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
                        Volver al Club
                    </button>
                </div>
            </main>

            {/* Background Decor */}
            <div className="fixed bottom-0 right-0 w-64 h-64 bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="fixed top-20 left-0 w-32 h-32 bg-white opacity-5 blur-[60px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default Confirmation;

