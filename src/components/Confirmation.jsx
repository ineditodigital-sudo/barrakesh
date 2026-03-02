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
                    <span>GENERATING TICKET...</span>
                    <span>///</span>
                    <span>SECURE THE BAG</span>
                    <span>///</span>
                    <span>CONFIRMING APPOINTMENT</span>
                    <span>///</span>
                    <span>GENERATING TICKET...</span>
                    <span>///</span>
                    <span>SECURE THE BAG</span>
                    <span>///</span>
                    <span>CONFIRMING APPOINTMENT</span>
                    <span>///</span>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 relative mt-12 pb-20 z-10">
                {/* Status Header */}
                <div className="text-center mb-8 animate-pulse">
                    <h1 className="text-white text-5xl font-bold uppercase tracking-tighter leading-none mb-1">LOCKED IN</h1>
                    <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">Appointment Confirmed</p>
                </div>

                {/* The Ticket Component */}
                <div className="relative w-full max-w-sm bg-white text-black shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                    {/* Ticket Notches */}
                    <div className="ticket-notch ticket-notch-left"></div>
                    <div className="ticket-notch ticket-notch-right"></div>
                    <div className="ticket-dash"></div>

                    {/* Top Section */}
                    <div className="p-6 pb-12 flex flex-col items-center border-b-0">
                        {/* Header Logo / Brand */}
                        <div className="w-full flex justify-between items-start mb-8">
                            <div className="flex flex-col">
                                <span className="font-display font-black text-2xl tracking-tight leading-none">BARRAKESH</span>
                                <span className="font-mono text-[10px] tracking-widest mt-1">EST. 2024</span>
                            </div>
                            <div className="border-2 border-black px-2 py-0.5 transform rotate-[-2deg]">
                                <span className="font-bold text-xs uppercase tracking-wider">Paid</span>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="w-full h-16 barcode mb-8 opacity-90 mix-blend-multiply"></div>

                        <div className="w-full space-y-6">
                            {/* Client Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Client</span>
                                <span className="text-xl font-bold font-display uppercase tracking-wide">You</span>
                            </div>
                            {/* Barber Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Barber</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold font-display uppercase tracking-wide">{barber.name}</span>
                                    <span className="material-symbols-outlined text-sm pt-0.5">verified</span>
                                </div>
                            </div>
                            {/* Service Row */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Service</span>
                                <span className="text-xl font-bold font-display uppercase tracking-wide">{service.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section (Below Fold/Notch) */}
                    <div className="p-6 pt-8 bg-gray-50">
                        <div className="flex justify-between items-end mb-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Time</span>
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
                                    Get Directions
                                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-primary group-hover:h-full group-hover:opacity-30 transition-all"></span>
                                </span>
                                <span className="material-symbols-outlined text-sm transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-12 w-full max-w-sm flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="material-symbols-outlined text-white text-sm">info</span>
                        <p className="text-white font-mono text-[10px] uppercase">Show this ticket upon arrival</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-white font-display text-lg uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 py-4 group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
                        Back to Base
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

