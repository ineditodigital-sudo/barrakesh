import React from 'react';

const barbers = [
    {
        id: 1,
        name: "KASH",
        spec: ["Fades", "Delineados"],
        status: "LIVE",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLgrqD8JRSoso5i_J9RPepkZYNZh7692WWxPJar-WkNUtKc9USsnyppiEjqiR6e9LXqDboycnkgJqbVmId6gAJhufkkKa2-bOTfy_Mz8kasLPBy5HZmStSwTmrxm0V22-yjFPQgpcsLIon3U4dCiTN0_hK5lXVr4J6J7fYfK9WmEECTLiPvOBst-KIC_5PPnJmfJxR9seaDAYtXgGyHLGiQ5Oz1wokSl2h8kjrNatOVhRR5jW69ycD0xDKPw_Fon909ks2KSFD7fs"
    },
    {
        id: 2,
        name: "JAX",
        spec: ["Barba", "Clásico"],
        status: "AWAY",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKggvCU8UeYT6V0IbhZuT8v4IerSC33clz1BFiAbEHn9cTC3ta_YQZOW-cVy-dKTJAHqfY9iQPKICKjDaQdmDJpYycugseT9RVwliCd5L_blOTWWGtBPRpXnEOObLbCgKmXYj0Ij4KkesMpXpNu6Mx3_Q5pen_6IA3sJPaiJqnO8BfKJY3JnDXvfsNw4GqRYRxpbfq0tbuSjiMZp_DFfN5Nai_RIF0h50GnbbHMk3pbGQiPi86f1eY2dzoRSgDzhU12Vo8uMniwhA"
    },
    {
        id: 3,
        name: "RICO",
        spec: ["Tijera", "Estilo"],
        status: "LIVE",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_zO8TF93ZyE2qtxYd9z4eDkRi9hz_Lf3rlOCMWac8fZyOMRaBTNxBpN8kYDhiMwKOIiPNB0HJ-gRHniIjafEHg0qyLkDIeu-f85wkW_48FRd6Noo0_0dZF93aZpfVPwSZxpdVHe63XV4VY2vuQKaxTNBaxvQpmMn_Q4gbsiH5UMYkXoAsBO-cb46ojMh51ktIhWfqPKZNojUOSkKAELtshfq_tEm20i9juE4unFekNnexMm0ThAqHAYE8ZVwvFLAU8NqzqkRMgI"
    }
];

const CrewRoster = ({ onSelect, onBack, selectedBarber }) => {
    return (
        <div className="bg-background-dark font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-black">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-10 opacity-40"></div>

            {/* Header Section */}
            <header className="flex-none px-6 pt-8 pb-4 z-10 relative">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={onBack}
                        className="text-white hover:text-primary transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-steel font-mono text-[10px] uppercase">PASO 02</span>
                    </div>
                </div>
                <h1 className="text-5xl font-bold text-white uppercase leading-[0.85] tracking-tighter">
                    EL<br />
                    <span className="text-primary">CREW</span>
                </h1>
                <p className="text-neutral-400 text-xs font-mono uppercase mt-2 tracking-widest">/// Selecciona tu especialista de flow 🔥</p>
            </header>

            {/* Main Carousel Area / Grid on Desktop */}
            <main className="flex-1 w-full overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory flex md:flex-row md:flex-wrap md:justify-center gap-6 md:gap-12 md:gap-y-24 px-6 md:px-16 items-center md:items-start no-scrollbar pb-12 md:pb-32 md:pt-12 relative z-0">
                {barbers.map((b, idx) => {
                    const isAway = b.status === "AWAY";
                    return (
                        <div
                            key={b.id}
                            className={`snap-center shrink-0 w-[80vw] md:w-[280px] h-[55vh] md:h-[420px] relative group cursor-pointer animate-scale-in [animation-delay:${idx * 150}ms] ${isAway ? 'opacity-70 grayscale' : ''}`}
                        >
                            {/* Card Container */}
                            <div className="absolute inset-0 bg-surface rounded-sm overflow-hidden border border-neutral-800">
                                {/* Image Background */}
                                <div
                                    className={`absolute inset-0 bg-cover bg-center img-brutal transition-transform duration-700 ${!isAway && 'group-hover:scale-105'}`}
                                    style={{ backgroundImage: `url('${b.image}')` }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                {/* Vertical Name */}
                                <div className="absolute top-0 left-0 h-full w-16 md:w-20 flex items-center justify-center pointer-events-none z-10">
                                    <h2 className={`writing-vertical text-7xl md:text-8xl font-bold uppercase tracking-tighter drop-shadow-xl whitespace-nowrap ${isAway ? 'text-outline-white opacity-50' : 'text-outline'}`}>
                                        {b.name}
                                    </h2>
                                </div>

                                {/* Off Duty Stamp */}
                                {isAway && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                        <div className="border-4 border-neutral-500 text-neutral-500 px-6 py-2 -rotate-12 text-4xl font-bold uppercase tracking-widest opacity-80 backdrop-blur-sm bg-black/30">
                                            Fuera de Servicio
                                        </div>
                                    </div>
                                )}

                                {/* Status Indicator */}
                                <div className={`absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 border border-neutral-700 rounded-sm ${isAway ? 'opacity-50' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full ${isAway ? 'bg-neutral-500' : 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                                    <span className={`${isAway ? 'text-neutral-400' : 'text-white'} text-[10px] font-bold tracking-widest uppercase`}>
                                        {isAway ? 'AUSENTE' : 'ACTIVO'}
                                    </span>
                                </div>

                                {/* Barber Stats */}
                                {!isAway && (
                                    <div className="absolute bottom-12 right-4 text-right">
                                        <p className="text-neutral-400 text-[10px] font-mono uppercase mb-1">Espec.</p>
                                        {b.spec.map((s, idx) => (
                                            <p key={idx} className="text-white text-lg font-bold uppercase leading-none">{s} ///</p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Select Button */}
                            <button
                                onClick={() => !isAway && onSelect(b)}
                                className={`absolute -bottom-6 left-0 right-0 h-14 font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${isAway ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border-t border-neutral-700' :
                                    'bg-primary text-black hover:bg-white border-2 border-transparent hover:border-primary active:scale-95'
                                    }`}
                            >
                                <span>{isAway ? 'No Disponible' : 'ELEGIR ESTILO'}</span>
                                {!isAway && <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>}
                            </button>
                        </div>
                    );
                })}
                {/* Spacer for scroll padding */}
                <div className="snap-center shrink-0 w-6"></div>
            </main>


            {/* Bottom Navigation / Stats Bar */}
            <div className="flex-none bg-surface border-t border-neutral-800 px-6 py-6 font-mono uppercase">
                <div className="flex justify-between items-center text-xs">
                    <div className="text-neutral-500">
                        <span className="text-primary mr-1">///</span> Disponibilidad
                    </div>
                    <div className="flex gap-4">
                        <div className="text-white">Hoy <span className="text-primary">4 espacios</span></div>
                        <div className="text-neutral-500">Mañana <span className="text-white">Lleno</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrewRoster;

