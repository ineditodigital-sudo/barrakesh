import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Lenis from 'lenis';
import { useBranches } from '../admin/data';

const Landing = ({ onBarberStart, onStudioStart, onJoinStart }) => {
    const [branches] = useBranches();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.2,
            lerp: 0.1,
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
            {/* Status Ticker - Fixed at top edge */}
            <div className="fixed top-0 left-0 right-0 z-[100] bg-primary text-black font-mono text-[10px] md:text-sm uppercase py-2 md:py-1 md:px-6 overflow-hidden border-b-2 border-black">
                <div className="whitespace-nowrap animate-marquee font-bold tracking-[0.2em] flex items-center">
                    <span className="mx-4 whitespace-nowrap">/// ABIERTO HASTA LAS 9PM /// BIENVENIDOS SIN CITA /// BARRAKESH_SYSTEMS_v2.0 ///</span>
                    <span className="mx-4 whitespace-nowrap">/// ABIERTO HASTA LAS 9PM /// BIENVENIDOS SIN CITA /// BARRAKESH_SYSTEMS_v2.0 ///</span>
                    <span className="mx-4 whitespace-nowrap">/// ABIERTO HASTA LAS 9PM /// BIENVENIDOS SIN CITA /// BARRAKESH_SYSTEMS_v2.0 ///</span>
                </div>
            </div>

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
            {/* Noise Texture Overlay Removed for Performance */}

            {/* HERO SECTION */}
            <section id="hero" className="relative h-screen w-full flex flex-col md:flex-row justify-between overflow-hidden border-b border-white/10 shrink-0">
                {/* Video Background Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="/hero.png"
                        className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 brightness-[0.5] opacity-90"
                        style={{ willChange: 'transform' }}
                    >
                        <source src="/Video Barrakesh Web.mp4" type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>
                    <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-[#050505]/80 md:via-[#050505]/20 to-transparent bottom-0 h-full"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-between h-full p-6 md:p-16 pt-24 pb-20">
                    {/* Top Area: Logo */}
                    <div className="flex justify-center md:justify-start">
                        <div className="p-2 md:p-0 border-2 border-primary md:border-0 bg-black/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none transform md:-rotate-0 hard-shadow md:shadow-none animate-scale-in">
                            <img
                                src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png"
                                alt="BARRAKESH"
                                className="h-14 md:h-36 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Middle Area: Headline */}
                    <div className="flex-1 flex flex-col justify-center items-center md:items-start">
                        <div className="animate-fade-in-up [animation-delay:200ms] text-center md:text-left">
                            <h2 className="font-display font-black text-4xl md:text-7xl uppercase leading-[0.8] tracking-tighter italic text-white/90">
                                NUEVO LOOK.<br />MISMO <span className="text-primary italic-none">FLOW.</span>
                            </h2>
                            <p className="font-mono text-[10px] md:text-xs text-white/40 uppercase mt-6 tracking-[0.3em] md:border-l-2 border-primary md:pl-4 inline-block">
                                Donde el estilo no se improvisa.<br />Se vive. 🔥
                            </p>
                        </div>
                    </div>

                    {/* Bottom Area: Action Button */}
                    <div className="w-full flex justify-center md:justify-start relative z-20 animate-fade-in-up [animation-delay:400ms] md:max-w-md">
                        <button
                            onClick={onBarberStart}
                            className="group relative w-full h-16 md:h-20 bg-primary text-black font-display text-xl md:text-3xl uppercase tracking-wider flex items-center justify-center overflow-hidden hard-shadow md:shadow-[6px_6px_0px_#000000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.99]"
                        >
                            <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2 font-bold group-hover:tracking-[0.15em] transition-all">
                                Agenda tu cita 😎
                                <span className="material-symbols-outlined text-2xl md:text-4xl font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right Side Decorative (Desktop) Removed */}
            </section>

            {/* NUMERIALA & IDENTITY GROUPED */}
            <section className="min-h-screen w-full flex flex-col justify-center bg-background-dark border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/image 88.webp" className="w-full h-full object-cover opacity-40 grayscale brightness-[0.7]" alt="" loading="lazy" />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <motion.div
                    className="relative z-10"
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
            <section id="studio" className="min-h-screen w-full flex items-center relative bg-black overflow-hidden border-b border-white/10 py-12 px-6">
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
                                src="/ESTUDIO/image 90.webp"
                                alt="Studio"
                                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                                loading="lazy"
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
            <section id="services" className="min-h-screen w-full flex items-center py-24 px-6 relative overflow-hidden bg-background-dark border-b border-white/10">
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
                            { step: "01", title: "Corte Superior", desc: "Cada corte habla. Precisión y técnica para que quedes al 100.", icon: "content_cut", img: "/BARBER/image 91.webp" },
                            { step: "02", title: "Barba con Actitud", desc: "Afeitado clásico y delineado fino. Actitud en cada trazado.", icon: "face", img: "/BARBER/image 92.webp" },
                            { step: "03", title: "Experiencia Club", desc: "DJ sets, eventos y comunidad exclusiva. Esto es Barrakesh.", icon: "music_note", img: "/BARBER/image 93.webp" }
                        ].map((item, i) => (
                            <div key={i} className="relative p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-primary/5 transition-colors group overflow-hidden">
                                <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity grayscale" alt="" />
                                <div className="relative z-10">
                                    <div className="font-mono text-primary text-sm mb-8 flex justify-between items-center text-white/20 group-hover:text-primary transition-colors">
                                        <span>#{item.step}</span>
                                        <span className="material-symbols-outlined !text-4xl opacity-20 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold text-white uppercase mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-white/40 font-mono text-sm leading-relaxed">{item.desc}</p>
                                </div>
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
                        <button
                            onClick={() => window.open('https://wa.me/524495452271?text=Hola!%20Me%20interesa%20unirme%20al%20club%20Barrakesh%20🔥', '_blank')}
                            className="bg-black text-primary px-8 py-4 font-display font-black text-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-[4px_4px_0px_#333]"
                        >
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
                <div className="absolute inset-0 z-0">
                    <img src="/BARBER/image 91.webp" className="w-full h-full object-cover opacity-30 grayscale brightness-[0.7]" alt="" />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <motion.div
                    className="max-w-6xl mx-auto text-center w-full relative z-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <span className="text-white font-mono text-xs tracking-[0.8em] uppercase block mb-6">/// Reclutamiento Abierto</span>
                    <h2 className="font-display text-6xl md:text-[10rem] font-black text-white uppercase leading-[0.7] tracking-tighter mb-12">
                        ÚNETE AL<br /><span className="text-primary italic">CREW.</span>
                    </h2>
                    <p className="font-mono text-lg text-white uppercase mb-16 max-w-2xl mx-auto tracking-widest leading-relaxed">
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
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-16 gap-4">
                        <div className="text-left">
                            <span className="text-primary font-mono text-xs tracking-[0.5em] uppercase block mb-2 md:mb-4">/// Ubicaciones</span>
                            <h2 className="font-display text-4xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter">
                                La <span className="text-primary italic">Red</span>
                            </h2>
                        </div>
                        <div className="text-left hidden md:block">
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
                            {branches.map((branch, i) => (
                                <div key={i} className="bg-surface/50 border border-white/5 p-4 md:p-6 hover:border-primary transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined !text-4xl text-primary">location_on</span>
                                    </div>
                                    <div className="flex justify-between items-start mb-2 md:mb-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${branch.status === 'Operativo' ? 'bg-primary text-black' : 'bg-red-500 text-white'}`}>
                                            {branch.status === 'Operativo' ? 'Estado: Abierto' : 'Estado: ' + branch.status}
                                        </span>
                                    </div>
                                    <h3
                                        className="font-display text-lg md:text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors cursor-pointer"
                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Barrakesh ' + branch.name + ' ' + branch.addr)}`, '_blank')}
                                    >
                                        Barrakesh {branch.name}
                                    </h3>
                                    <p
                                        className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase mb-4 md:mb-6 leading-relaxed cursor-pointer hover:text-white"
                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.addr)}`, '_blank')}
                                    >
                                        {branch.addr}
                                    </p>

                                    <div className="space-y-2 md:space-y-4 pt-2 md:pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-white/20 uppercase tracking-widest">Capacidad</span>
                                            <span className="text-white/60">{branch.capacity}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-white/20 uppercase tracking-widest">Ciudad</span>
                                            <span className="text-white/60">{branch.city}</span>
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
            <section className="min-h-screen w-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
                <div className="py-20 md:py-32 px-6 relative border-y border-primary/20 text-white/90">
                    <div className="absolute inset-0 z-0">
                        <img src="/BARBER/image 92.webp" className="w-full h-full object-cover opacity-40 grayscale brightness-[0.7]" alt="" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 z-[1]"></div>
                    <div className="absolute inset-0 bg-noise opacity-30 z-[2]"></div>
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
                                    {[
                                        { name: 'facebook', url: 'https://www.facebook.com/BARRAKESH/' },
                                        { name: 'instagram', url: 'https://www.instagram.com/barrakesh.ags/' },
                                        { name: 'tiktok', url: 'https://www.tiktok.com/@barrakesh_barbershop' }
                                    ].map(social => (
                                        <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="size-8 md:size-10 border border-white/10 flex items-center justify-center hover:border-primary cursor-pointer transition-colors group">
                                            <img src={`https://cdn.simpleicons.org/${social.name}/white`} className="size-3 md:size-4 opacity-40 group-hover:opacity-100" alt={social.name} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:gap-8 col-span-1 md:col-span-2">
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
                            </div>
                        </div>

                    </div>
                </footer>
            </section>
            {/* Floating Navigation Button */}
            <FloatingNav scrollToId={scrollToId} onBarberStart={onBarberStart} />
        </div>
    );
};

const FloatingNav = ({ scrollToId, onBarberStart }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const menuItems = [
        { label: 'Agendar Cita', action: onBarberStart, icon: 'calendar_month', highlight: true },
        { label: 'Servicios', action: () => scrollToId('services'), icon: 'content_cut' },
        { label: 'Estudio', action: () => scrollToId('studio'), icon: 'mic' },
        { label: 'Club', action: () => scrollToId('club'), icon: 'stars' },
        { label: 'Sucursales', action: () => scrollToId('branches'), icon: 'location_on' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-4">
            {/* Menu Items */}
            {isOpen && (
                <div className="flex flex-col items-end gap-2 mb-2 animate-fade-in-up">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => { item.action(); setIsOpen(false); }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all hover:scale-105 active:scale-95 shadow-xl ${item.highlight ? 'bg-primary border-primary text-black' : 'bg-black/80 backdrop-blur-md border-white/20 text-white'}`}
                        >
                            <span className="font-display font-bold text-sm uppercase italic">{item.label}</span>
                            <span className="material-symbols-outlined !text-xl">{item.icon}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-4 ${isOpen ? 'bg-white border-black text-black rotate-90' : 'bg-primary border-black text-black'}`}
            >
                <span className="material-symbols-outlined !text-3xl font-black">
                    {isOpen ? 'close' : 'menu'}
                </span>
            </button>
        </div>
    );
};

export default Landing;
