import React, { useState } from 'react';

const dates = [
    { day: "SEP", num: "12", label: "Mon" },
    { day: "SEP", num: "13", label: "Tue" },
    { day: "SEP", num: "14", label: "Wed" },
    { day: "SEP", num: "15", label: "Thu" },
    { day: "SEP", num: "16", label: "Fri" },
    { day: "SEP", num: "17", label: "Sat" },
];

const timeBlocks = [
    {
        label: "Morning",
        slots: [
            { time: "10:00", booked: true },
            { time: "10:45", booked: true },
            { time: "11:30", booked: false },
        ]
    },
    {
        label: "Afternoon",
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
        label: "Evening",
        slots: [
            { time: "18:00", booked: true },
            { time: "18:45", booked: true },
            { time: "19:30", booked: true },
        ]
    }
];

const BookingFlow = ({ onComplete, booking }) => {
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [selectedTime, setSelectedTime] = useState(null);

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
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center size-10 text-white hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <h1 className="font-display font-bold text-2xl tracking-tighter uppercase text-white">SECURE THE BAG</h1>
                    <div className="size-10"></div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-surface">
                    <div className="h-full w-3/4 bg-primary transition-all duration-500"></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col pb-24 relative z-10">
                {/* Barber Info Strip */}
                <div className="px-4 py-6 border-b border-white/10 bg-surface/50">
                    <div className="flex items-center gap-4">
                        <div className="relative size-14 overflow-hidden border border-white/20">
                            <img
                                src={barber.image}
                                alt={barber.name}
                                className="object-cover w-full h-full grayscale contrast-125"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-primary font-bold tracking-widest uppercase mb-1">Barber</span>
                            <span className="font-display text-3xl font-bold uppercase leading-none tracking-tight">{barber.name}</span>
                        </div>
                        <div className="ml-auto flex flex-col items-end">
                            <span className="text-[10px] text-white/60 font-mono mb-1 uppercase">Service</span>
                            <span className="font-bold text-white uppercase text-sm border-b border-primary pb-0.5">{service.name}</span>
                        </div>
                    </div>
                </div>

                {/* Date Selection */}
                <section className="mt-8">
                    <div className="px-4 mb-4 flex justify-between items-end">
                        <h2 className="font-display text-4xl font-bold uppercase text-white leading-none">Select Date</h2>
                        <span className="text-[10px] font-mono text-primary animate-pulse uppercase">LIVE UPDATES</span>
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
                <div className="my-6 border-y border-white/10 bg-surface py-2 overflow-hidden whitespace-nowrap">
                    <div className="inline-block animate-marquee font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">
            /// Select Time Slot /// Zone: EST /// No Refunds /// Select Time Slot /// Zone: EST /// No Refunds /// Select Time Slot /// Zone: EST /// No Refunds /// Select Time Slot /// Zone: EST /// No Refunds ///
                    </div>
                </div>

                {/* Time Grid */}
                <section className="px-4 flex-1">
                    <h2 className="font-display text-4xl font-bold uppercase text-white mb-6">Availability</h2>
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
            </main>

            {/* Sticky Footer Action */}
            <div className="fixed bottom-0 left-0 w-full bg-[#050505] border-t border-white/10 p-4 z-40">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/60">
                        <span>Total Due</span>
                        <span>Includes Tax</span>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-white font-display text-3xl font-bold">${service.price.toFixed(2)}</span>
                        <span className="text-primary font-mono text-xs uppercase tracking-tight">
                            {selectedTime ? `${selectedDate.label} ${selectedDate.num} @ ${selectedTime}` : 'Select a slot'}
                        </span>
                    </div>
                    <button
                        disabled={!selectedTime}
                        onClick={() => onComplete({ date: `${selectedDate.num} ${selectedDate.day}`, time: selectedTime })}
                        className={`w-full h-14 flex items-center justify-between px-6 font-bold uppercase tracking-wider transition-all group ${selectedTime ? 'bg-primary text-black hover:bg-white' : 'bg-surface text-white/20 cursor-not-allowed'
                            }`}
                    >
                        <span>CONFIRM BOOKING</span>
                        <span className="material-symbols-outlined !text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingFlow;

