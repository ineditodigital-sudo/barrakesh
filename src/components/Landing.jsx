import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Lenis from 'lenis';

const Landing = ({ onBarberStart, onStudioStart, onJoinStart }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            lerp: 0.1, // Smoothness intensity
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className="bg-background-dark text-text-main font-body antialiased selection:bg-primary selection:text-black">
            <style>{`
                html.lenis, html.lenis body {
                  height: auto;
                }
                .lenis.lenis-smooth {
                  scroll-behavior: auto !important;
                }
                .lenis.lenis-smooth [data-lenis-prevent] {
                  overscroll-behavior: contain;
                }
                .lenis.lenis-stopped {
                  overflow: hidden;
                }
                .lenis.lenis-scrolling iframe {
                  pointer-events: none;
                }
                /* Snapping works better when managed by CSS on the root while Lenis handles delta */
                html {
                   scroll-behavior: auto !important;
                }
                section {
                   min-height: 100vh;
                   width: 100%;
                }
                /* Hidden scrollbar */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            {/* Noise Texture Overlay (Fixed) */}
            <div className="fixed inset-0 pointer-events-none z-[60] bg-noise opacity-40 mix-blend-overlay"></div>

            {/* HERO SECTION */}
            <section id="hero" className="relative h-screen w-full flex flex-col md:flex-row justify-between overflow-hidden border-b border-white/10 shrink-0">
                {/* Video Background Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50 opacity-60 transition-transform duration-[10s] hover:scale-105"
                    >
                        <source src="/Video Barrakesh Web.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111111] via-[#111111]/70 md:via-[#111111]/30 to-transparent bottom-0 h-full"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-between h-full p-6 md:p-16">
                    {/* Top Navigation / Header Area */}
                    <header className="w-full pt-12 md:pt-0 flex flex-col items-center md:items-start">
                        {/* Logo Stamp */}
                        <div className="border-2 border-primary p-2 md:p-4 bg-black/80 backdrop-blur-md transform -rotate-1 hard-shadow md:shadow-[8px_8px_0px_#000000] mb-8 md:mb-16 animate-scale-in">
                            <img
                                src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png"
                                alt="BARRAKESH"
                                className="h-10 md:h-20 w-auto object-contain"
                            />
                        </div>

                        {/* Desktop Headline */}
                        <div className="hidden md:block mb-12 animate-fade-in-up [animation-delay:200ms]">
                            <h2 className="font-display font-black text-7xl uppercase leading-[0.8] tracking-tighter italic text-white/90">
                                NUEVO LOOK.<br />MISMO <span className="text-primary italic-none">FLOW.</span>
                            </h2>
                            <p className="font-mono text-xs text-white/40 uppercase mt-6 tracking-[0.3em] border-l-2 border-primary pl-4">
                                Donde el estilo no se improvisa.<br />Se vive. 🔥
                            </p>
                        </div>

                        {/* Status Ticker */}
                        <div className="w-full md:w-auto mt-6 bg-primary text-black font-mono text-sm uppercase py-1 md:px-6 overflow-hidden border-y-2 md:border-2 border-black relative transform rotate-1 md:-rotate-1 shadow-lg animate-fade-in-up [animation-delay:300ms]">
                            <div className="whitespace-nowrap animate-marquee md:animate-none font-bold tracking-widest flex items-center">
                                <span className="mx-4 md:mx-0 whitespace-nowrap">/// ABIERTO HASTA LAS 9PM /// BIENVENIDOS SIN CITA</span>
                            </div>
                        </div>
                    </header>

                    {/* Bottom Action Area */}
                    <div className="w-full flex flex-col gap-4 md:max-w-md animate-fade-in-up [animation-delay:400ms]">
                        <button
                            onClick={onBarberStart}
                            className="group relative w-full h-16 md:h-20 bg-primary text-black font-display text-xl md:text-3xl uppercase tracking-wider flex items-center justify-center overflow-hidden hard-shadow md:shadow-[6px_6px_0px_#000000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.99]"
                        >
                            <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2 font-bold group-hover:tracking-[0.15em] transition-all">
                                Agenda tu cita 😎
                                <span className="material-symbols-outlined text-2xl md:text-4xl font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </span>
                            <div className="absolute top-0 right-0 w-3 h-3 bg-black transform rotate-45 translate-x-1.5 -translate-y-1.5"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 bg-black transform rotate-45 -translate-x-1.5 translate-y-1.5"></div>
                        </button>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <button onClick={onBarberStart} className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs md:text-sm uppercase py-3 md:py-5 px-4 flex items-center justify-between hover:bg-white/10 transition-colors shadow-hard">
                                <span>Servicios</span>
                                <span className="material-symbols-outlined text-sm md:text-xl text-primary">content_cut</span>
                            </button>
                            <button onClick={onBarberStart} className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs md:text-sm uppercase py-3 md:py-5 px-4 flex items-center justify-between hover:bg-white/10 transition-colors shadow-hard">
                                <span>Únete al Club</span>
                                <span className="material-symbols-outlined text-sm md:text-xl text-primary">groups</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Decorative (Desktop) */}
                <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden">
                    <div className="opacity-10 border-2 border-white/20 p-12 rounded-full h-[30rem] w-[30rem] flex items-center justify-center animate-[spin_60s_linear_infinite] scale-0 animate-scale-in [animation-delay:600ms]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rotate-45"></div>
                        <img
                            src="/LOGO-BARRAKESH-CUADRADO-TXT-BLANCO.png"
                            alt=""
                            className="w-48 h-48 object-contain opacity-50 grayscale invert"
                        />
                    </div>
                    <div className="absolute bottom-12 right-12 text-right opacity-30 animate-fade-in-up [animation-delay:800ms]">
                        <p className="font-mono text-[10px] uppercase tracking-[1em]">Terminal_Núcleo_v1.0.9</p>
                    </div>
                </div>
            </section>

            {/* NUMERIALA & IDENTITY GROUPED */}
            <section className="min-h-screen w-full flex flex-col justify-center snap-start bg-background-dark border-b border-white/10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    {/* NUMERIALA (STATS) */}
                    <div className="py-12 px-6 bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
                        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { val: "4.9/5", label: "Rating Real" },
                                { val: "10k+", label: "Fieles al Club" },
                                { val: "4", label: "Estaciones" },
                                { val: "15+", label: "Años rompiéndola" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group border-l border-white/5 pl-4 hover:border-primary transition-colors">
                                    <div className="font-display text-4xl md:text-6xl font-black text-primary leading-none mb-2 tracking-tighter group-active:scale-95 transition-transform">{stat.val}</div>
                                    <div className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IDENTITY */}
                    <div className="py-20 px-6 overflow-hidden text-white/90">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="font-display text-4xl md:text-7xl font-black text-white uppercase leading-none mb-8 tracking-tighter">
                                Aquí se arma el <span className="text-primary italic">estilo.</span>
                            </h2>
                            <p className="font-mono text-lg md:text-xl text-white/60 leading-relaxed uppercase">
                                Barrakesh es más que una barbería. 💈 Es un punto de encuentro, es música, es cultura urbana y es imagen con actitud. Cáele y queda fino. 🔥
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* RECORDING STUDIO SECTION */}
            <section id="studio" className="min-h-screen w-full flex items-center snap-start relative bg-black overflow-hidden border-b border-white/10 py-12 px-6">
                <div className="absolute inset-0 bg-blue-500/5 opacity-40"></div>
                <motion.div
                    className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="flex-1 order-2 md:order-1">
                        <div className="relative aspect-video bg-surface overflow-hidden border border-white/10 hard-shadow">
                            <img
                                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"
                                alt="Studio"
                                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <span className="text-[#00ccff] font-mono text-xs tracking-[0.5em] uppercase block mb-4">/// El Laboratorio</span>
                        <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter mb-8">
                            Barrakesh<br /><span className="text-[#00ccff] italic">Studio.</span>
                        </h2>
                        <p className="font-mono text-lg text-white/40 uppercase mb-10 leading-relaxed border-l-2 border-[#00ccff] pl-6">
                            Captura tu flow en nuestra cabina profesional. Sonido cristalino, beats a medida y la actitud de la calle en cada toma.
                        </p>
                        <button
                            onClick={onStudioStart}
                            className="bg-[#00ccff] text-black px-10 py-5 font-display font-black text-xl uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-[6px_6px_0px_#003344] active:shadow-none active:translate-y-0"
                        >
                            Reservar Estudio 🎙️
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="services" className="min-h-screen w-full flex items-center snap-start py-24 px-6 relative overflow-hidden bg-background-dark border-b border-white/10">
                <motion.div
                    className="max-w-6xl mx-auto w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="mb-20">
                        <span className="text-primary font-mono text-xs tracking-[0.5em] uppercase block mb-4">/// Armamos tu Flow</span>
                        <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter italic">
                            Cada detalle<br /><span className="text-primary not-italic">cuenta.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 bg-surface/30">
                        {[
                            { step: "01", title: "Corte Superior", desc: "Cada corte habla. Precisión y técnica para que quedes al 100.", icon: "content_cut" },
                            { step: "02", title: "Barba con Actitud", desc: "Afeitado clásico y delineado fino. Actitud en cada trazado.", icon: "face" },
                            { step: "03", title: "Experiencia Club", desc: "DJ sets, eventos y comunidad exclusiva. Esto es Barrakesh.", icon: "music_note" }
                        ].map((item, i) => (
                            <div key={i} className="p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-primary/5 transition-colors group">
                                <div className="font-mono text-primary text-sm mb-8 flex justify-between items-center text-white/20 group-hover:text-primary transition-colors">
                                    <span>#{item.step}</span>
                                    <span className="material-symbols-outlined !text-4xl opacity-20 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                                </div>
                                <h3 className="font-display text-3xl font-bold text-white uppercase mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-white/40 font-mono text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* BARRAKESH CLUB SECTION */}
            <section id="club" className="min-h-screen w-full flex items-center snap-start py-24 px-6 bg-primary text-black relative overflow-hidden">
                <div className="absolute inset-0 bg-hazard-stripe opacity-10"></div>
                <motion.div
                    className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="flex-1">
                        <h2 className="font-display text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-6">
                            BARRAKESH<br />CLUB 🔥
                        </h2>
                        <p className="font-mono text-lg font-bold uppercase mb-8">
                            No todos entran. Solo clientes. Accede a precios especiales, promociones exclusivas y eventos privados.
                        </p>
                        <button onClick={onBarberStart} className="bg-black text-primary px-8 py-4 font-display font-black text-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-[4px_4px_0px_#333]">
                            ¿Listo para ser parte?
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="border-[10px] border-black p-4 rotate-3 bg-white hard-shadow">
                            <img src="/LOGO-BARRAKESH-CUADRADO-TXT-NEGRO.png" alt="Club" className="w-64 h-64 object-contain" />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* JOIN THE CREW SECTION */}
            <section id="join" className="min-h-screen w-full flex items-center snap-start py-32 px-6 relative bg-background-dark overflow-hidden border-y border-white/10">
                <motion.div
                    className="max-w-6xl mx-auto text-center w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <span className="text-white font-mono text-xs tracking-[0.8em] uppercase block mb-6 opacity-30">/// Reclutamiento Abierto</span>
                    <h2 className="font-display text-6xl md:text-[10rem] font-black text-white uppercase leading-[0.7] tracking-tighter mb-12">
                        ÚNETE AL<br /><span className="text-primary italic">CREW.</span>
                    </h2>
                    <p className="font-mono text-lg text-white/40 uppercase mb-16 max-w-2xl mx-auto tracking-widest leading-relaxed">
                        Buscamos barberos elite y productores con hambre de romperla. Si tienes la técnica y la actitud, aquí es tu lugar.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button
                            onClick={onJoinStart}
                            className="bg-white text-black font-display font-black text-2xl px-16 py-6 uppercase tracking-widest hover:bg-primary shadow-[6px_6px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 transition-all"
                        >
                            Aplicar Ahora ⚡
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* BRANCHES (SUCURSALES) SECTION */}
            <section id="branches" className="min-h-screen w-full flex flex-col justify-center snap-start py-12 md:py-24 px-6 bg-[#0a0a0a] overflow-y-auto no-scrollbar">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-4">
                        <div>
                            <span className="text-primary font-mono text-xs tracking-[0.5em] uppercase block mb-2 md:mb-4">/// Ubicaciones</span>
                            <h2 className="font-display text-4xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter">
                                La<br /><span className="text-primary italic">Red</span>
                            </h2>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
                                Distribuidos por la jungla de asfalto.<br />Cáele a la estación más cercana. 💈
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Map Container */}
                        <div className="relative aspect-square md:aspect-video lg:aspect-square bg-surface border border-white/10 brightness-110 hover:brightness-100 transition-all duration-700 overflow-hidden group hidden md:block">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118497.1082142289!2d-102.378978018286!3d21.882315800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429ee671125879b%3A0xc3f8e584f27c444c!2sAguascalientes%2C%20Ags.!5e0!3m2!1ses-419!2smx!4v1709395200000!5m2!1ses-419!2smx"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-4 border-black/10 group-hover:border-primary/20 transition-colors"></div>
                        </div>

                        {/* Branches Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: "Barrakesh Centro", addr: "Av. Francisco I. Madero 234, Zona Centro, Aguascalientes", dist: "389m", hours: "09:00 - 20:00", phone: "+52 449 123 4567" },
                                { name: "Barrakesh Pulgas Pandas", addr: "Av. Universidad 1001, Pulgas Pandas, Aguascalientes", dist: "2.6km", hours: "09:00 - 19:00", phone: "+52 449 456 7890" },
                                { name: "Barrakesh Altaria", addr: "Plaza Altaria, Blvd. a Zacatecas Nte. 849, Aguascalientes", dist: "4.4km", hours: "10:00 - 21:00", phone: "+52 449 234 5678" },
                                { name: "Barrakesh Villasunción", addr: "Av. Aguascalientes Sur 220, Villasunción, Aguascalientes", dist: "4.8km", hours: "09:00 - 20:00", phone: "+52 449 345 6789" }
                            ].map((branch, i) => (
                                <div key={i} className="bg-surface/50 border border-white/5 p-4 md:p-6 hover:border-primary transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined !text-4xl text-primary">location_on</span>
                                    </div>
                                    <div className="flex justify-between items-start mb-2 md:mb-4">
                                        <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 uppercase">Estado: Abierto</span>
                                        <span className="text-white/40 font-mono text-[10px]">{branch.dist}</span>
                                    </div>
                                    <h3 className="font-display text-lg md:text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{branch.name}</h3>
                                    <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase mb-4 md:mb-6 leading-relaxed">{branch.addr}</p>

                                    <div className="space-y-2 md:space-y-4 pt-2 md:pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-white/20 uppercase tracking-widest">Horario</span>
                                            <span className="text-white/60">{branch.hours}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-white/20 uppercase tracking-widest">Teléfono</span>
                                            <span className="text-white/60">{branch.phone}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onBarberStart}
                                        className="mt-4 md:mt-6 w-full py-2 md:py-3 bg-white/5 text-white/60 font-mono text-[8px] md:text-[10px] uppercase tracking-widest border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95"
                                    >
                                        Reservar Aquí
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CALL TO ACTION & FOOTER GROUPED */}
            <section className="min-h-screen w-full flex flex-col snap-start bg-black overflow-y-auto no-scrollbar">
                <div className="py-20 md:py-32 px-6 relative border-y border-primary/20 text-white/90">
                    <div className="absolute inset-0 bg-noise opacity-30"></div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="font-display text-4xl md:text-7xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-8">
                            Si buscas buen estilo…<br /><span className="text-primary italic">La respuesta es Barrakesh.</span>
                        </h2>
                        <button
                            onClick={onBarberStart}
                            className="bg-primary text-black font-display text-2xl md:text-4xl px-12 py-6 uppercase font-black hover:tracking-widest transition-all duration-300 active:scale-95 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]"
                        >
                            📲 Agenda tu cita ahora
                        </button>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="bg-background-dark py-12 md:py-20 px-6 border-t border-white/10 text-white/90 flex-1 flex items-center">
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
                            <div className="flex flex-col gap-6 md:gap-8">
                                <img src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png" alt="Logo" className="h-8 md:h-12 w-auto object-contain self-start grayscale" />
                                <p className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-widest leading-relaxed max-w-xs">
                                    Ingeniería de precisión para el rebelde moderno. Establecido 2024. Especialistas con licencia.
                                </p>
                                <div className="flex gap-4">
                                    {['facebook', 'instagram', 'twitter'].map(social => (
                                        <div key={social} className="size-8 md:size-10 border border-white/10 flex items-center justify-center hover:border-primary cursor-pointer transition-colors group">
                                            <img src={`https://cdn.simpleicons.org/${social}/white`} className="size-3 md:size-4 opacity-40 group-hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 col-span-1 md:col-span-2">
                                <div>
                                    <h4 className="font-mono text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-8">Navegación</h4>
                                    <ul className="space-y-2 md:space-y-4 font-display text-lg md:text-2xl font-bold uppercase text-white/60">
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('hero')}>Inicio</li>
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('services')}>Servicios</li>
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('studio')}>Renta de Estudio</li>
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('join')}>Sé Parte de Barrakesh</li>
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('club')}>Club Barrakesh</li>
                                        <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => scrollToId('branches')}>Sucursales</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-mono text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-8">Legal</h4>
                                    <ul className="space-y-2 md:space-y-4 font-mono text-[8px] md:text-[10px] uppercase text-white/30 tracking-widest">
                                        <li className="hover:text-white cursor-pointer">Privacidad</li>
                                        <li className="hover:text-white cursor-pointer">Términos</li>
                                        <li className="hover:text-white cursor-pointer">Reembolsos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 font-mono text-[8px] md:text-[10px] uppercase tracking-widest">
                            <span>© 2024 BARRAKESH_SYSTEMS.</span>
                            <div className="flex gap-4 md:gap-8">
                                <span>AGS_72°F</span>
                                <span>ESTADO: OPERATIVO</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </div>
    );
};

export default Landing;
