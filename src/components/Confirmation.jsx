import React, { useRef, useCallback, useState } from 'react';
import { useBranches } from '../admin/data';
import * as htmlToImage from 'html-to-image';

const Confirmation = ({ booking, onReset }) => {
    const ticketRef = useRef(null);
    const [branches] = useBranches();
    const [isDownloading, setIsDownloading] = useState(false);
    const isStudioBooking = booking?.services?.some(s => s.category === 'Music Studio');
    const themeColor = isStudioBooking ? "#007AFF" : "#FEE101";

    const barber = booking?.barber || { name: "KASH" };
    const services = booking?.services || [];
    const dateStr = booking?.dateLabel || booking?.date || "03 MAR";
    const timeStr = booking?.time || "14:00";

    const selectedBranch = branches.find(b => b.name === booking?.location);
    const googleMapsUrl = selectedBranch
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Barrakesh ' + selectedBranch.name + ' ' + selectedBranch.addr)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Barrakesh Aguascalientes')}`;

    const handleDirections = () => {
        window.open(googleMapsUrl, '_blank');
    };

    const downloadReceipt = useCallback(() => {
        if (ticketRef.current === null) return;
        setIsDownloading(true);

        // Ensure we capture with high quality and correct styles
        htmlToImage.toPng(ticketRef.current, {
            cacheBust: true,
            backgroundColor: '#050505',
            style: {
                transform: 'scale(1)',
                margin: '0',
            },
            pixelRatio: 2 // Higher resolution
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `Recibo-Barrakesh-${booking?.customer?.name || 'Cliente'}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error al generar el recibo:', err);
            })
            .finally(() => {
                setIsDownloading(false);
            });
    }, [ticketRef, booking]);

    const basePrice = services.reduce((acc, s) => acc + parseFloat(s.price || 0), 0);
    const totalPrice = isStudioBooking ? basePrice * (booking.studioInfo?.hours || 1) : basePrice;
    const hasVariablePrice = services.some(s => s.priceIsVariable);

    return (
        <div className="bg-[#020202] min-h-screen flex flex-col font-display antialiased overflow-y-auto no-scrollbar brutalist-grid relative">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-[0.2]"></div>

            {/* Marquee Loader (Top) */}
            <div className="fixed top-0 left-0 w-full z-50 overflow-hidden py-2 border-b-2 border-white" style={{ backgroundColor: themeColor }}>
                <div className="whitespace-nowrap animate-marquee flex gap-8 items-center font-mono font-bold text-sm tracking-widest text-black">
                    <span>GENERANDO TICKET...</span>
                    <span>///</span>
                    <span>{isStudioBooking ? 'STUDIO SECURED' : 'ASEGURA EL FLOW'}</span>
                    <span>///</span>
                    <span>LOCKED IN</span>
                    <span>///</span>
                    <span>GENERANDO TICKET...</span>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center px-4 relative mt-20 pb-20 pt-10 z-10">

                {/* Status Header */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-white text-6xl font-black uppercase tracking-tighter leading-none mb-1">LOCKED IN <span style={{ color: themeColor }}></span></h1>
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: themeColor }}>{isStudioBooking ? 'ESTUDIO RESERVADO' : 'LISTO PA\'L FLOW'} /// PASO 04</p>
                </div>

                {/* The Ticket Component - Updated to Black Background */}
                <div ref={ticketRef} className="relative w-full max-w-sm bg-black text-white border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:scale-[1.02] animate-scale-in [animation-delay:200ms]">

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
                                {isStudioBooking ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                                        <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                                        <circle cx="6" cy="6" r="3" />
                                        <circle cx="6" cy="18" r="3" />
                                        <line x1="20" y1="4" x2="8.12" y2="15.88" />
                                        <line x1="14.47" y1="14.48" x2="20" y2="20" />
                                        <line x1="8.12" y1="8.12" x2="12" y2="12" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div className="w-full space-y-8">
                            {/* Client Row */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">Cliente</span>
                                <span className="text-2xl font-black font-display uppercase tracking-tight">{booking?.customer?.name || 'ESTIMADO CLIENTE'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Location Row */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">Sede</span>
                                    <span className="text-sm font-bold font-mono uppercase text-white leading-none">{booking?.location || 'BK CENTRO'}</span>
                                    <span className="text-[10px] font-mono text-white/60 uppercase truncate">{selectedBranch?.addr || 'VER MAPA'}</span>
                                </div>
                                {/* Barber/Studio Row */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">{isStudioBooking ? 'Tipo' : 'Barbero'}</span>
                                    <span className="text-sm font-bold font-mono uppercase" style={{ color: themeColor }}>{isStudioBooking ? 'STUDIO RENTAL' : barber.name}</span>
                                </div>
                            </div>

                            {/* Service Row */}
                            <div className="flex flex-col gap-1.5 pt-4 border-t border-white/10">
                                <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">Servicios Selección</span>
                                 <div className="flex flex-wrap gap-2">
                                    {services.map((s, idx) => (
                                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-mono font-bold uppercase">{s.priceIsVariable ? 'Desde ' : ''}{s.name}</span>
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
                                <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.2em]">Horario Confirmado</span>
                                <span className="text-4xl font-black font-display uppercase leading-none">{timeStr}</span>
                                <span className="text-xs font-mono font-bold uppercase opacity-80">{dateStr}</span>
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
                                    Ver Ubicación
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-3 transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Download Button - Replaced Wallet Buttons */}
                <div className="mt-10 w-full max-w-sm scale-in [animation-delay:400ms]">
                    <button
                        onClick={downloadReceipt}
                        className="w-full bg-white text-black py-5 px-8 rounded-2xl flex items-center justify-center gap-4 border border-white/10 hover:bg-white/90 transition-all active:scale-95 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] group"
                    >
                        <span className="material-symbols-outlined !text-3xl group-hover:bounce">download</span>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[8px] uppercase font-mono font-black opacity-40 mb-1">Clover Receipt</span>
                            <span className="text-lg font-black font-display uppercase tracking-tight">Descargar Recibo</span>
                        </div>
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="mt-10 w-full max-w-sm flex flex-col items-center gap-4">
                    <button
                        onClick={onReset}
                        className="text-white/60 font-display text-sm uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center gap-3 py-6 group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
                        Volver al Inicio
                    </button>
                </div>
            </main>

            {/* Global Loader Overlay */}
            {isDownloading && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                    <div className="relative">
                        <div className="size-32 border-4 border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 size-32 border-4 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-white animate-pulse">download</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <h3 className="text-white font-display text-2xl font-black uppercase tracking-tighter mb-2">Procesando Recibo</h3>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">Capturando flow en alta resolución...</p>
                    </div>
                </div>
            )}

            {/* Background Decor */}
            <div className="fixed bottom-0 right-0 w-96 h-96 opacity-10 blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: themeColor }}></div>
            <div className="fixed top-40 left-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default Confirmation;
