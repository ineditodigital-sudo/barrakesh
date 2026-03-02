import React from 'react';

const Landing = ({ onNext }) => {
    return (
        <div className="bg-background-dark text-text-main font-body antialiased selection:bg-primary selection:text-black min-h-screen overflow-x-hidden">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-noise opacity-40 mix-blend-overlay"></div>

            {/* HERO SECTION */}
            <section className="relative h-screen w-full flex flex-col md:flex-row justify-between overflow-hidden border-b border-white/10">
                {/* Video/Image Background Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-75 transition-transform duration-[10s] hover:scale-110"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfhFq9nwBUdKN8_zGwYY7VJq59KFXF-Zia9TtfDbWTcbQaof64buUXaL5LbUmXFPacCpROmaXQEMgpp3F91sS7dY4GjE7DTcqNODIcUFcAFlFNNveQ-2geKTuuRQiz9m1OOCuYdLL394hEl09xZEgVc_ZPqT49arfS6iYk_joUDSIRjsiwrnlYIO6h6vMDfUhuL0gXjljwJ42g1O07ttgNvKCgsluGMI6N577MYhAH1VOtOJ7Bfdog02ixQ_6aowsyO6R-lDTNdm8')" }}
                    />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111111] via-[#111111]/80 md:via-[#111111]/40 to-transparent bottom-0 h-full"></div>
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
                            <h2 className="font-display font-black text-6xl uppercase leading-[0.8] tracking-tighter italic text-white/90">
                                CORTES<br />INDUSTRIALES<br /><span className="text-primary italic-none">CRUDOS</span>
                            </h2>
                            <p className="font-mono text-xs text-white/40 uppercase mt-6 tracking-[0.3em] border-l-2 border-primary pl-4">
                                Ingeniería de Precisión <br />para el Rebelde Moderno
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
                            onClick={onNext}
                            className="group relative w-full h-16 md:h-20 bg-primary text-black font-display text-xl md:text-3xl uppercase tracking-wider flex items-center justify-center overflow-hidden hard-shadow md:shadow-[6px_6px_0px_#000000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-[0.99]"
                        >
                            <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2 font-bold group-hover:tracking-[0.15em] transition-all">
                                Súbete a la silla
                                <span className="material-symbols-outlined text-2xl md:text-4xl font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </span>
                            <div className="absolute top-0 right-0 w-3 h-3 bg-black transform rotate-45 translate-x-1.5 -translate-y-1.5"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 bg-black transform rotate-45 -translate-x-1.5 translate-y-1.5"></div>
                        </button>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <button onClick={onNext} className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs md:text-sm uppercase py-3 md:py-5 px-4 flex items-center justify-between hover:bg-white/10 transition-colors shadow-hard">
                                <span>Servicios</span>
                                <span className="material-symbols-outlined text-sm md:text-xl text-primary">content_cut</span>
                            </button>
                            <button onClick={onNext} className="bg-surface/80 backdrop-blur-sm border border-white/10 text-white font-mono text-xs md:text-sm uppercase py-3 md:py-5 px-4 flex items-center justify-between hover:bg-white/10 transition-colors shadow-hard">
                                <span>El Equipo</span>
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

            {/* NUMERIALA (STATS) SECTION */}
            <section className="py-20 px-6 bg-[#0a0a0a] border-b border-white/10 overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { val: "4.9/5", label: "Calificación" },
                        { val: "10,000+", label: "Clientes felices" },
                        { val: "4", label: "Sucursales" },
                        { val: "15+", label: "Años de experiencia" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group border-l border-white/5 pl-4 hover:border-primary transition-colors">
                            <div className="font-display text-4xl md:text-6xl font-black text-primary leading-none mb-2 tracking-tighter group-active:scale-95 transition-transform">{stat.val}</div>
                            <div className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-24 px-6 relative overflow-hidden bg-background-dark">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-20">
                        <span className="text-primary font-mono text-xs tracking-[0.5em] uppercase block mb-4">/// El Proceso</span>
                        <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter italic">
                            Cómo<br /><span className="text-primary not-italic">Obtener tu Corte</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 bg-surface/30">
                        {[
                            { step: "01", title: "Seleccionar Servicio", desc: "Elige tu procedimiento del manifiesto. Fades, buzzes o el servicio completo.", icon: "content_cut" },
                            { step: "02", title: "Elegir Barbero", desc: "Selecciona a tu especialista. Cada barbero tiene su propio estilo distintivo.", icon: "person_search" },
                            { step: "03", title: "Asegurar Cita", desc: "Reserva tu horario y obtén tu ticket de confirmación digital.", icon: "confirmation_number" }
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
                </div>
            </section>

            {/* BRANCHES (SUCURSALES) SECTION */}
            <section className="py-24 px-6 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div>
                            <span className="text-primary font-mono text-xs tracking-[0.5em] uppercase block mb-4">/// Ubicaciones</span>
                            <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter">
                                La<br /><span className="text-primary italic">Red</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
                                Distribuidos por la jungla de asfalto.<br />Encuentra tu estación más cercana.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Map Container */}
                        <div className="relative aspect-square md:aspect-video lg:aspect-square bg-surface border border-white/10 grayscale contrast-125 brightness-75 hover:grayscale-0 transition-all duration-700 overflow-hidden group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118497.1082142289!2d-102.378978018286!3d21.882315800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429ee671125879b%3A0xc3f8e584f27c444c!2sAguascalientes%2C%20Ags.!5e0!3m2!1ses-419!2smx!4v1709395200000!5m2!1ses-419!2smx"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(150%)' }}
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
                                <div key={i} className="bg-surface/50 border border-white/5 p-6 hover:border-primary transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined !text-4xl text-primary">location_on</span>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 uppercase">Estado: Abierto</span>
                                        <span className="text-white/40 font-mono text-[10px]">{branch.dist}</span>
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{branch.name}</h3>
                                    <p className="text-white/40 font-mono text-[10px] uppercase mb-6 leading-relaxed">{branch.addr}</p>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
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
                                        onClick={onNext}
                                        className="mt-6 w-full py-3 bg-white/5 text-white/60 font-mono text-[10px] uppercase tracking-widest border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95"
                                    >
                                        Reservar Aquí
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CALL TO ACTION */}
            <section className="py-32 px-6 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-hazard-stripe opacity-10"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-6xl md:text-9xl font-black text-black uppercase leading-[0.85] tracking-tighter mb-12">
                        Deja de<br />Verte Mal
                    </h2>
                    <button
                        onClick={onNext}
                        className="bg-black text-primary font-display text-2xl md:text-4xl px-12 py-6 uppercase font-black hover:tracking-widest transition-all duration-300 active:scale-95 shadow-[8px_8px_0px_rgba(0,0,0,0.3)]"
                    >
                        Reserva Ahora
                    </button>
                </div>
                {/* Visual Distortions */}
                <div className="absolute top-0 left-0 w-full h-2 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20"></div>
            </section>

            {/* FOOTER */}
            <footer className="bg-background-dark py-20 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                        <div className="flex flex-col gap-8">
                            <img src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png" alt="Logo" className="h-12 w-auto object-contain self-start grayscale" />
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xs">
                                Ingeniería de precisión para el rebelde moderno. Establecido 2024. Especialistas con licencia.
                            </p>
                            <div className="flex gap-4">
                                {['facebook', 'instagram', 'twitter'].map(social => (
                                    <div key={social} className="size-10 border border-white/10 flex items-center justify-center hover:border-primary cursor-pointer transition-colors group">
                                        <img src={`https://cdn.simpleicons.org/${social}/white`} className="size-4 opacity-40 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 col-span-2">
                            <div>
                                <h4 className="font-mono text-primary text-xs font-bold uppercase tracking-[0.3em] mb-8">Navegación</h4>
                                <ul className="space-y-4 font-display text-2xl font-bold uppercase text-white/60">
                                    <li className="hover:text-primary transition-colors cursor-pointer" onClick={onNext}>Manifiesto</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer" onClick={onNext}>El Equipo</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer" onClick={onNext}>Asegurar Cita</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Iniciar Sesión</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-mono text-primary text-xs font-bold uppercase tracking-[0.3em] mb-8">Legal</h4>
                                <ul className="space-y-4 font-mono text-[10px] uppercase text-white/30 tracking-widest">
                                    <li className="hover:text-white cursor-pointer">Protocolo de Privacidad</li>
                                    <li className="hover:text-white cursor-pointer">Términos de Servicio</li>
                                    <li className="hover:text-white cursor-pointer">Política de Reembolso</li>
                                    <li className="hover:text-white cursor-pointer">Registros de Cookies</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 font-mono text-[10px] uppercase tracking-widest">
                        <span>© 2024 BARRAKESH_SYSTEMS. TODOS LOS DERECHOS RESERVADOS.</span>
                        <div className="flex gap-8">
                            <span>NY_72°F</span>
                            <span>ESTADO: OPERATIVO</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
