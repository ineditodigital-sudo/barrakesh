import React from 'react';
import { useBranches } from '../admin/data';

const Confirmation = ({ booking, onReset }) => {
    const [branches] = useBranches();
    const isStudioBooking = booking?.services?.some(s => s.category === 'Music Studio');
    const themeColor = isStudioBooking ? "#007AFF" : "#FEE101";

    const barber = booking?.barber || { name: "KASH" };
    const services = booking?.services || [];
    const dateStr = booking?.date || "03 MAR";
    const timeStr = booking?.time || "14:00";

    const selectedBranch = branches.find(b => b.name === booking?.location);
    const googleMapsUrl = selectedBranch
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Barrakesh ' + selectedBranch.name + ' ' + selectedBranch.addr)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Barrakesh Aguascalientes')}`;

    const handleDirections = () => {
        window.open(googleMapsUrl, '_blank');
    };

    const handleWallet = (platform) => {
        alert(`¡Cita guardada en ${platform}! Revisa tus notificaciones.`);
    };

    const basePrice = services.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    const totalPrice = isStudioBooking ? basePrice * (booking.studioInfo?.hours || 1) : basePrice;

    return (
        <div className="bg-[#050505] min-h-screen flex flex-col font-display antialiased overflow-hidden brutalist-grid relative">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Marquee Loader (Top) */}
            <div className="fixed top-0 left-0 w-full z-50 overflow-hidden py-2 border-b-2 border-white" style={{ backgroundColor: themeColor }}>
                <div className="whitespace-nowrap animate-marquee flex gap-8 items-center font-mono font-bold text-sm tracking-widest text-black">
                    <span>GENERANDO TICKET...</span>
                    <span>///</span>
                    <span>{isStudioBooking ? 'STUDIO SECURED' : 'ASEGURA EL FLOW 🔥'}</span>
                    <span>///</span>
                    <span>LOCKED IN 🔥</span>
                    <span>///</span>
                    <span>GENERANDO TICKET...</span>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 relative mt-16 pb-20 z-10 overflow-hidden">
                {/* Status Header */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-white text-6xl font-black uppercase tracking-tighter leading-none mb-1">LOCKED IN <span style={{ color: themeColor }}>🔥</span></h1>
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: themeColor }}>{isStudioBooking ? 'ESTUDIO RESERVADO' : 'LISTO PA\'L FLOW'} /// PASO 04</p>
                </div>

                {/* The Ticket Component - Updated to Black Background */}
                <div className="relative w-full max-w-sm bg-black text-white border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:scale-[1.02] animate-scale-in [animation-delay:200ms]">

                    {/* Decorative Cutouts */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-[#050505] border-r border-white/20"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-[#050505] border-l border-white/20"></div>

                    {/* Top Section */}
                    <div className="p-8 flex flex-col items-center">
                        {/* Header Logo */}
                        <div className="w-full flex justify-between items-start mb-10">
                            <div className="flex flex-col">
                                <img
                                    src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png"
                                    alt="BARRAKESH"
                                    className="h-9 w-auto object-contain"
                                />
                                <span className="font-mono text-[8px] tracking-[0.3em] mt-2 opacity-40">MEMBRESÍA EXCLUSIVA</span>
                            </div>
                            <div className="size-12 rounded-full border border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined !text-xl" style={{ color: themeColor }}>{isStudioBooking ? 'mic' : 'content_cut'}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-8">
                            {/* Client Row */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Cliente</span>
                                <span className="text-2xl font-black font-display uppercase tracking-tight">{booking?.customer?.name || 'ESTIMADO CLIENTE'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Location Row */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Sede</span>
                                    <span className="text-sm font-bold font-mono uppercase text-white leading-none">{booking?.location || 'BK CENTRO'}</span>
                                    <span className="text-[10px] font-mono text-white/40 uppercase truncate">{selectedBranch?.addr || 'VER MAPA'}</span>
                                </div>
                                {/* Barber/Studio Row */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">{isStudioBooking ? 'Tipo' : 'Barbero'}</span>
                                    <span className="text-sm font-bold font-mono uppercase" style={{ color: themeColor }}>{isStudioBooking ? 'STUDIO RENTAL' : barber.name}</span>
                                </div>
                            </div>

                            {/* Service Row */}
                            <div className="flex flex-col gap-1.5 pt-4 border-t border-white/10">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Servicios Selección</span>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((s, idx) => (
                                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-mono font-bold uppercase">{s.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Dash Line */}
                    <div className="w-full border-b border-dashed border-white/20"></div>

                    {/* Bottom Section */}
                    <div className="p-8">
                        <div className="flex justify-between items-end mb-8">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Horario Confirmado</span>
                                <span className="text-4xl font-black font-display uppercase leading-none">{timeStr}</span>
                                <span className="text-xs font-mono font-bold uppercase opacity-60">{dateStr}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Inversión</span>
                                <span className="text-3xl font-black font-display tracking-tight px-2 py-0.5" style={{ backgroundColor: themeColor, color: isStudioBooking ? 'white' : 'black' }}>
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Directions Link */}
                        <div className="flex justify-center flex-col items-center gap-6">
                            <button
                                onClick={handleDirections}
                                className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                            >
                                <span className="font-mono text-[9px] font-bold uppercase tracking-widest ">
                                    Obtener Mapa de Acceso
                                </span>
                                <span className="material-symbols-outlined text-sm transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Wallet Integration - Enhanced Contrast */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                        onClick={() => handleWallet('Apple Wallet')}
                        className="flex-1 bg-white text-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                    >
                        <span className="material-symbols-outlined !text-2xl">apple</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[8px] uppercase font-mono font-black opacity-40">Add to</span>
                            <span className="text-xs font-black font-display uppercase tracking-tighter">Apple Wallet</span>
                        </div>
                    </button>
                    <button
                        onClick={() => handleWallet('Google Wallet')}
                        className="flex-1 bg-white text-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                    >
                        <span className="material-symbols-outlined !text-2xl">wallet</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[8px] uppercase font-mono font-black opacity-40">Add to</span>
                            <span className="text-xs font-black font-display uppercase tracking-tighter">Google Wallet</span>
                        </div>
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="mt-10 w-full max-w-sm flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-40">
                        <span className="material-symbols-outlined text-white text-sm">qr_code_2</span>
                        <p className="text-white font-mono text-[9px] uppercase tracking-widest">Escanea el código en recepción</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-white/60 font-display text-sm uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center gap-3 py-6 group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
                        Volver al Inicio
                    </button>
                </div>
            </main>

            {/* Background Decor */}
            <div className="fixed bottom-0 right-0 w-96 h-96 opacity-10 blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: themeColor }}></div>
            <div className="fixed top-40 left-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default Confirmation;
