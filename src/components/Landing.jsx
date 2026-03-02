import React from 'react';

const Landing = ({ onNext }) => {
    return (
        <main className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-background-dark text-text-main font-body antialiased">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-40 mix-blend-overlay"></div>

            {/* Video/Image Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-75"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfhFq9nwBUdKN8_zGwYY7VJq59KFXF-Zia9TtfDbWTcbQaof64buUXaL5LbUmXFPacCpROmaXQEMgpp3F91sS7dY4GjE7DTcqNODIcUFcAFlFNNveQ-2geKTuuRQiz9m1OOCuYdLL394hEl09xZEgVc_ZPqT49arfS6iYk_joUDSIRjsiwrnlYIO6h6vMDfUhuL0gXjljwJ42g1O07ttgNvKCgsluGMI6N577MYhAH1VOtOJ7Bfdog02ixQ_6aowsyO6R-lDTNdm8')" }}
                />
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent bottom-0 h-full"></div>
            </div>

            {/* Top Navigation / Header Area */}
            <header className="relative z-10 w-full pt-12 pb-4 flex flex-col items-center">
                {/* Floating Menu Buttons */}
                <button className="absolute top-12 left-6 p-2 bg-black/40 border border-white/20 backdrop-blur-sm active:bg-primary active:text-black transition-colors hard-shadow-sm group">
                    <span className="material-symbols-outlined text-2xl group-active:scale-90 transition-transform">menu</span>
                </button>
                <button className="absolute top-12 right-6 p-2 bg-black/40 border border-white/20 backdrop-blur-sm active:bg-primary active:text-black transition-colors hard-shadow-sm group">
                    <span className="material-symbols-outlined text-2xl group-active:scale-90 transition-transform">person</span>
                </button>

                {/* Logo Stamp */}
                <div className="border-2 border-primary px-4 py-2 bg-black/80 backdrop-blur-md transform -rotate-1 hard-shadow">
                    <h1 className="font-display text-4xl tracking-tighter text-white uppercase select-none">
                        BARRAKESH
                    </h1>
                </div>

                {/* Status Ticker */}
                <div className="w-full mt-6 bg-primary text-black font-mono text-sm uppercase py-1 overflow-hidden border-y-2 border-black relative transform rotate-1 shadow-lg">
                    <div className="whitespace-nowrap animate-marquee font-bold tracking-widest flex items-center">
                        <span className="mx-4">/// OPEN TIL 9PM</span>
                        <span className="mx-4">/// WALK-INS WELCOME</span>
                        <span className="mx-4">/// CASH ONLY</span>
                        <span className="mx-4">/// NO APPOINTMENT NO ENTRY</span>
                        <span className="mx-4">/// RAW CUTS</span>
                        <span className="mx-4">/// OPEN TIL 9PM</span>
                        <span className="mx-4">/// WALK-INS WELCOME</span>
                        <span className="mx-4">/// CASH ONLY</span>
                    </div>
                </div>
            </header>

            {/* Spacer for Layout Balance */}
            <div className="flex-grow relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="opacity-30 border border-white/30 p-8 rounded-full h-64 w-64 flex items-center justify-center relative">
                    <div className="border border-primary/20 p-2 h-full w-full rounded-full animate-[spin_10s_linear_infinite]">
                        <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="relative z-20 w-full px-6 pb-10 flex flex-col gap-4">
                {/* Info badges */}
                <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col gap-1">
                        <span className="bg-surface text-white/60 text-[10px] font-mono px-2 py-0.5 inline-block w-max border-l-2 border-primary uppercase">
                            LOC: BROOKLYN, NY
                        </span>
                        <span className="bg-surface text-white/60 text-[10px] font-mono px-2 py-0.5 inline-block w-max border-l-2 border-primary uppercase">
                            TEMP: 72°F
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-primary font-display text-xl leading-none uppercase">EST. 2024</div>
                        <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Concrete Jungle</div>
                    </div>
                </div>

                {/* Primary CTA Button */}
                <button
                    onClick={onNext}
                    className="group relative w-full h-16 bg-primary text-black font-display text-xl uppercase tracking-wider flex items-center justify-center overflow-hidden hard-shadow hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.99]"
                >
                    {/* Hazard Stripes (Hover Effect) */}
                    <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2 font-bold group-hover:tracking-[0.15em] transition-all">
                        Get In The Chair
                        <span className="material-symbols-outlined text-2xl font-bold">arrow_forward</span>
                    </span>
                    {/* Corner Cut decoration */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-black transform rotate-45 translate-x-1.5 -translate-y-1.5"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-black transform rotate-45 -translate-x-1.5 translate-y-1.5"></div>
                </button>

                {/* Secondary Links / Nav */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <button className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs uppercase py-3 px-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                        <span>Services</span>
                        <span className="material-symbols-outlined text-sm text-primary">content_cut</span>
                    </button>
                    <button className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs uppercase py-3 px-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                        <span>The Crew</span>
                        <span className="material-symbols-outlined text-sm text-primary">groups</span>
                    </button>
                </div>

                {/* Bottom decoration line */}
                <div className="w-full h-px bg-white/10 mt-4 flex items-center justify-center gap-1">
                    <div className="w-1 h-1 bg-primary"></div>
                    <div className="w-full h-px bg-white/10"></div>
                    <div className="w-1 h-1 bg-primary"></div>
                </div>
            </div>
        </main>
    );
};

export default Landing;

