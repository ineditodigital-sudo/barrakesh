import React, { useState } from 'react';

const dates = [
    { day: "SEP", num: "12", label: "Lun" },
    { day: "SEP", num: "13", label: "Mar" },
    { day: "SEP", num: "14", label: "Mié" },
    { day: "SEP", num: "15", label: "Jue" },
    { day: "SEP", num: "16", label: "Vie" },
    { day: "SEP", num: "17", label: "Sáb" },
];

const timeBlocks = [
    {
        label: "Mañana",
        slots: [
            { time: "10:00", booked: true },
            { time: "10:45", booked: true },
            { time: "11:30", booked: false },
        ]
    },
    {
        label: "Tarde",
        slots: [
            { time: "13:00", booked: false },
            { time: "14:00", booked: false },
            { time: "14:45", booked: false },
            { time: "15:30", booked: true },
            { time: "16:15", booked: false },
            { time: "17:00", booked: false },
        ]
    },
    {
        label: "Noche",
        slots: [
            { time: "18:00", booked: true },
            { time: "18:45", booked: true },
            { time: "19:30", booked: true },
        ]
    }
];

const BookingFlow = ({ onComplete, onBack, booking }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [selectedTime, setSelectedTime] = useState(null);

    const branches = [
        { id: 1, name: "CENTRO", addr: "Madero 234" },
        { id: 2, name: "PULGAS PANDAS", addr: "Univ. 1001" },
        { id: 3, name: "ALTARIA", addr: "Blvd. Zacatecas" },
        { id: 4, name: "VILLASUNCIÓN", addr: "S. Sur 220" },
    ];

    const barber = booking?.barber || { name: "Kash", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjVGDclJ03HtJjhEY6sT6KueaFJU_KAkN31hOhCRfLwLmPzv_YRURdqMtKosR6vetPwImfMt_ERO3D7Dhw7qbeIaKvIV_qOs-8JvPD3zcdvqMlJMruutzUf4SiAIGeDNc36dICIuHQEAqGey-BKdCdgLq_gFeGvPCc2XIv8YUcj5TQqWkxPwiqseAUszCZXwA5UdXhgT8xToVYiivSJ9z5xm0XmmfsOTkfl0OV9FxydiIaZAo8i1NskqS3nWMo37pG3g9bcAJchQw" };
    const service = booking?.service || { name: "Skin Fade", price: 35 };

    return (
        <div className="bg-background-dark text-white font-mono antialiased overflow-x-hidden min-h-screen flex flex-col relative">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b border-white/10 relative">
                <div className="flex items-center justify-between p-4 h-16">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center size-10 text-white hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="font-display font-bold text-2xl tracking-tighter uppercase text-white">ASEGURA EL FLOW</h1>
                        <span className="text-steel font-mono text-[8px] uppercase tracking-widest leading-none mt-1">PASO 03</span>
                    </div>
                    <div className="size-10"></div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-surface">
                    <div className="h-full w-3/4 bg-primary transition-all duration-500"></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row md:max-w-6xl md:mx-auto md:w-full md:gap-16 pb-24 md:pb-12 relative z-10 p-4">
                {/* Left Side: Selection */}
                <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-160px)] no-scrollbar overflow-x-hidden md:pr-4">
                    {/* Barber Info Strip (Mobile only) */}
                    <div className="md:hidden py-6 border-b border-white/10 bg-surface/50 mb-8 -mx-4 px-4 animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <div className="relative size-14 overflow-hidden border border-white/20">
                                <img src={barber.image} alt={barber.name} className="object-cover w-full h-full grayscale contrast-125" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-primary font-bold tracking-widest uppercase mb-1">Barbero</span>
                                <span className="font-display text-3xl font-bold uppercase leading-none tracking-tight">{barber.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection */}
                    {/* Location Selection */}
                    <section className="animate-fade-in-up md:mt-4">
                        <div className="px-4 mb-4">
                            <h2 className="font-display text-4xl font-bold uppercase text-white leading-none">Seleccionar Sucursal</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                            {branches.map((b) => {
                                const isSelected = selectedLocation?.id === b.id;
                                return (
                                    <button
                                        key={b.id}
                                        onClick={() => setSelectedLocation(b)}
                                        className={`p-4 border transition-all text-left group ${isSelected ? 'bg-primary border-primary text-black' : 'bg-surface border-white/10 text-white hover:border-white/30'}`}
                                    >
                                        <div className={`font-mono text-[8px] uppercase tracking-widest mb-1 ${isSelected ? 'text-black/60' : 'text-white/40'}`}>Sucursal</div>
                                        <div className="font-display text-xl font-bold uppercase leading-none mb-1">{b.name}</div>
                                        <div className={`font-mono text-[8px] uppercase ${isSelected ? 'text-black/60' : 'text-white/20'}`}>{b.addr}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-8 animate-fade-in-up [animation-delay:100ms]">
                        <div className="px-4 mb-4 flex justify-between items-end">
                            <h2 className="font-display text-4xl font-bold uppercase text-white leading-none">Seleccionar Fecha</h2>
                            <span className="text-[10px] font-mono text-primary animate-pulse uppercase">ACTUALIZACIONES EN VIVO</span>
                        </div>
                        <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
                            {dates.map((d, idx) => {
                                const isSelected = selectedDate.num === d.num;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(d)}
                                        className={`snap-start shrink-0 w-20 h-24 flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-primary text-black border-2 border-primary relative' : 'bg-transparent text-white border border-white/20 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected ? 'font-bold' : 'font-mono opacity-60'}`}>{d.day}</span>
                                        <span className="font-display text-4xl font-bold leading-none">{d.num}</span>
                                        <span className={`text-[10px] uppercase mt-1 ${isSelected ? 'font-bold' : 'font-mono opacity-60'}`}>{d.label}</span>
                                        {isSelected && <div className="absolute -bottom-1 -right-1 size-3 bg-black"></div>}
                                    </button>
                                );
                            })}
                            <div className="w-4 shrink-0"></div>
                        </div>
                    </section>

                    {/* Marquee Separator */}
                    <div className="my-6 border-y border-white/10 bg-surface py-2 overflow-hidden whitespace-nowrap animate-fade-in-up [animation-delay:200ms]">
                        <div className="inline-block animate-marquee font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">
            /// ASEGURA EL FLOW /// SIN REEMBOLSOS /// CÁELE CON TODO /// ASEGURA EL FLOW /// SIN REEMBOLSOS /// CÁELE CON TODO /// ASEGURA EL FLOW /// SIN REEMBOLSOS /// CÁELE CON TODO ///
                        </div>
                    </div>

                    {/* Time Grid */}
                    <section className="px-4 flex-1 animate-fade-in-up [animation-delay:300ms]">
                        <h2 className="font-display text-4xl font-bold uppercase text-white mb-6">Disponibilidad</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {timeBlocks.map((block, bIdx) => (
                                <React.Fragment key={bIdx}>
                                    <div className="col-span-3 text-[10px] text-white/40 font-mono uppercase tracking-widest mt-6 first:mt-2 mb-1 pl-1">{block.label}</div>
                                    {block.slots.map((slot, sIdx) => {
                                        const isSelected = selectedTime === slot.time;
                                        return (
                                            <button
                                                key={sIdx}
                                                disabled={slot.booked}
                                                onClick={() => setSelectedTime(slot.time)}
                                                className={`relative h-14 w-full flex items-center justify-center border font-mono text-sm font-bold transition-all ${slot.booked ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed' :
                                                    isSelected ? 'bg-primary text-black border-2 border-primary shadow-[0_0_15px_rgba(254,225,1,0.3)] z-10' :
                                                        'border-white text-white hover:bg-white hover:text-black'
                                                    }`}
                                            >
                                                <span className={slot.booked ? 'line-through decoration-white/30' : ''}>{slot.time}</span>
                                                {isSelected && <div className="absolute -top-1 -right-1 w-0 h-0 border-t-[8px] border-r-[8px] border-t-black border-r-transparent rotate-90"></div>}
                                            </button>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="h-20"></div>
                    </section>
                </div>

                {/* Right Side: Desktop Summary Panel */}
                <aside className="hidden md:flex flex-col w-1/3 sticky top-32 h-max bg-surface border border-white/10 p-8 shadow-2xl animate-slide-in-right">
                    <div className="flex flex-col gap-8">
                        <div>
                            <span className="text-[10px] text-primary font-bold tracking-[0.3em] uppercase block mb-4">/// Resumen</span>
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="size-20 overflow-hidden border border-white/20 border-primary">
                                    <img src={barber.image} alt={barber.name} className="object-cover w-full h-full grayscale" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[10px] uppercase font-mono">Estilista</span>
                                    <h3 className="font-display text-4xl font-black uppercase text-white">{barber.name}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2 text-primary">
                                <span className="text-white/60 text-xs font-mono uppercase">Sucursal</span>
                                <span className="font-bold uppercase">{selectedLocation?.name || '---'}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Servicio</span>
                                <span className="text-white font-bold uppercase">{service.name}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Fecha</span>
                                <span className="text-primary font-bold uppercase">{selectedDate.label}, {selectedDate.num} {selectedDate.day}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Horario</span>
                                <span className="text-primary font-bold uppercase">{selectedTime || '---'}</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-white text-xl font-display uppercase italic">Total Est.</span>
                                <span className="text-primary text-4xl font-display font-black">${service.price.toFixed(2)}</span>
                            </div>
                            <button
                                disabled={!selectedTime || !selectedLocation}
                                onClick={() => onComplete({ location: selectedLocation.name, date: `${selectedDate.num} ${selectedDate.day}`, time: selectedTime })}
                                className={`w-full h-16 flex items-center justify-between px-8 font-bold uppercase tracking-widest transition-all group ${selectedTime && selectedLocation ? 'bg-primary text-black hover:bg-white shadow-[6px_6px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'}`}
                            >
                                <span>LOCKED IN 🔥</span>
                                <span className="material-symbols-outlined !text-3xl font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Sticky Footer (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] border-t border-white/10 p-4 z-40">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/60">
                        <span>Total a Pagar</span>
                        <span>Impuestos Incluidos</span>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-white font-display text-3xl font-bold">${service.price.toFixed(2)}</span>
                        <span className="text-primary font-mono text-xs uppercase tracking-tight">
                            {selectedTime ? `${selectedDate.label} ${selectedDate.num} @ ${selectedTime}` : 'Selecciona un horario'}
                        </span>
                    </div>
                    <button
                        disabled={!selectedTime || !selectedLocation}
                        onClick={() => onComplete({ location: selectedLocation.name, date: `${selectedDate.num} ${selectedDate.day}`, time: selectedTime })}
                        className={`w-full h-14 flex items-center justify-between px-6 font-bold uppercase tracking-wider transition-all group ${selectedTime && selectedLocation ? 'bg-primary text-black hover:bg-white' : 'bg-surface text-white/20 cursor-not-allowed'
                            }`}
                    >
                        <span>ASEGURAR EL FLOW 🔥</span>
                        <span className="material-symbols-outlined !text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingFlow;

