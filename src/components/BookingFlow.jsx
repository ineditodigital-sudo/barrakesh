import React, { useState } from 'react';
import { useBranches, useAppointments } from '../admin/data';

const generateDates = () => {
    const days = [];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        
        // Format YYYY-MM-DD in local time
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const fullDate = `${y}-${m}-${dayNum}`;

        days.push({
            day: monthNames[d.getMonth()],
            num: dayNum,
            label: i === 0 ? "Hoy" : dayNames[d.getDay()],
            fullDate: fullDate
        });
    }
    return days;
};

const dynamicDates = generateDates();

const generateTimeSlots = (openTime = "11:00", closeTime = "20:00") => {
    const [openH] = openTime.split(':').map(Number);
    const [closeH] = closeTime.split(':').map(Number);

    const slots = [];
    for (let h = openH; h < closeH; h++) {
        const time = `${h.toString().padStart(2, '0')}:00`;
        const label = h < 12 ? "Mañana" : h < 17 ? "Tarde" : "Noche";
        
        let block = slots.find(b => b.label === label);
        if (!block) {
            block = { label, slots: [] };
            slots.push(block);
        }
        block.slots.push({ time, booked: false });
    }
    return slots;
};

const BookingFlow = ({ onComplete, onBack, booking }) => {
    const [branches, { loading: branchesLoading }] = useBranches();
    const [appointments, { loading: appointmentsLoading }] = useAppointments();
    const [selectedLocation, setSelectedLocation] = useState(booking.branch || null);
    const [selectedDate, setSelectedDate] = useState(dynamicDates[0]);
    const [selectedTime, setSelectedTime] = useState(null);

    const isStudioBooking = booking.services.some(s => s.category === 'Music Studio');
    const themeColor = isStudioBooking ? "#007AFF" : "#FEE101";
    const accentColor = isStudioBooking ? "blue" : "primary";

    const services = booking.services || [];
    const barber = booking.barber || { name: "KASH" };

    const getServicePrice = (s) => {
        if (selectedLocation && s.branchPrices && s.branchPrices[selectedLocation.id]) {
            return parseFloat(s.branchPrices[selectedLocation.id]);
        }
        return parseFloat(s.price || 0);
    };

    const basePrice = services.reduce((acc, s) => acc + getServicePrice(s), 0);
    const totalPrice = isStudioBooking ? basePrice * (booking.studioInfo?.hours || 1) : basePrice;
    const hasVariablePrice = services.some(s => s.priceIsVariable);

    if (branchesLoading || appointmentsLoading) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className={`size-12 border-4 border border-t-transparent animate-spin rounded-full`} style={{ borderColor: themeColor }}></div>
            </div>
        );
    }

    const activeBranches = branches.filter(b => b.status === "Operativo");
    const validBranches = isStudioBooking 
        ? activeBranches 
        : activeBranches.filter(b => {
             const wb = barber.workedBranches || [];
             return wb.includes(b.id) || wb.includes(Number(b.id)) || wb.includes(b.id.toString());
          });

    const checkAvailability = (time) => {
        if (!selectedLocation || !selectedDate) return false;

        // Check active days for the branch
        const activeDays = selectedLocation.activeDays || [1, 2, 3, 4, 5, 6];
        const [year, month, dNum] = selectedDate.fullDate.split('-');
        const currentD = new Date(year, month - 1, dNum).getDay();
        if (!activeDays.includes(currentD)) {
            return true; // Not a working day
        }

        const hoursRequested = isStudioBooking ? (booking.studioInfo?.hours || 1) : 1;

        // Check opening/closing times
        const [h, m] = time.split(':').map(Number);
        const [openH, openM] = (selectedLocation.openTime || "11:00").split(':').map(Number);
        const [closeH, closeM] = (selectedLocation.closeTime || "20:00").split(':').map(Number);
        
        const timeVal = h * 60 + m;
        const openVal = openH * 60 + openM;
        const closeVal = closeH * 60 + closeM;
        const requiredEndVal = timeVal + (hoursRequested * 60);

        if (timeVal < openVal || requiredEndVal > closeVal) {
            return true; // Outside business hours
        }

        // Check if time has already passed for TODAY
        if (selectedDate.label === 'Hoy') {
            const now = new Date();
            const currentH = now.getHours();
            const currentM = now.getMinutes();
            if (h < currentH || (h === currentH && m <= currentM)) {
                return true; // Mark as "booked" (not available)
            }
        }

        const barberName = barber?.name || "KASH";

        // Check if the current slot is taken
        const isTaken = (t) => appointments.some(apt =>
            apt.date === selectedDate.fullDate &&
            apt.time === t &&
            apt.location === selectedLocation.name &&
            (apt.barber?.name === barberName || apt.barber === barberName) &&
            apt.status !== 'Cancelado'
        );

        if (isTaken(time)) return true;

        // For Studio: Check consecutive hours
        if (isStudioBooking && hoursRequested > 1) {
            const [h, m] = time.split(':').map(Number);
            for (let i = 1; i < hoursRequested; i++) {
                const nextH = h + i;
                const nextTime = `${nextH.toString().padStart(2, '0')}:00`;
                if (isTaken(nextTime)) return true;
                if (nextH >= 20) return true;
            }
        }

        return false;
    };


    const timeBlocks = generateTimeSlots(
        selectedLocation?.openTime || "11:00",
        selectedLocation?.closeTime || "20:00"
    ).map(block => ({
        ...block,
        slots: block.slots.map(slot => ({
            ...slot,
            booked: checkAvailability(slot.time)
        }))
    }));

    return (
        <div className="bg-background-dark text-white font-mono antialiased overflow-x-hidden min-h-screen flex flex-col relative">
            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-[0.2]"></div>

            {/* Sticky Header */}
            <header className={`sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b-2 relative`} style={{ borderBottomColor: themeColor }}>
                <div className="flex items-center justify-between p-4 h-16">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center size-10 text-white transition-colors"
                        style={{ '--hover-color': themeColor }}
                    >
                        <span className="material-symbols-outlined !text-3xl">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="font-display font-bold text-2xl tracking-tighter uppercase text-white">ASEGURA EL FLOW</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-primary text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm">03</span>
                            <span className="text-zinc-400 font-mono text-[9px] uppercase tracking-widest">PASO</span>
                        </div>
                    </div>
                    <div className="size-10"></div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-surface">
                    <div className="h-full w-3/4 transition-all duration-500" style={{ backgroundColor: themeColor }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row md:max-w-6xl md:mx-auto md:w-full md:gap-16 pb-44 md:pb-12 relative z-10 p-4">
                {/* Left Side: Selection */}
                <div className="flex-1 flex flex-col md:overflow-y-auto md:max-h-[calc(100vh-160px)] no-scrollbar overflow-x-hidden md:pr-4">

                    {/* Location Selection - Confirmation of what was picked before */}
                    <section className="animate-fade-in-up md:mt-4">
                        <div className="flex items-center gap-3 px-4 mb-4">
                             <span className="bg-primary text-black text-xs font-black px-2 py-1 rounded-sm">1</span>
                             <h2 className="font-display text-4xl font-bold uppercase text-white leading-none">{booking.branch ? 'Sucursal' : 'Seleccionar Sucursal'}</h2>
                        </div>
                        <div className="px-4 pb-4">
                            {selectedLocation ? (
                                <div 
                                    className="p-4 border transition-all text-left bg-[#1a1a1a] border-primary text-white"
                                    style={{ borderColor: themeColor }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-mono text-[8px] uppercase tracking-widest mb-1 opacity-40">UBICACIÓN CONFIRMADA</div>
                                            <div className="font-display text-2xl font-black uppercase leading-none mb-1" style={{ color: themeColor }}>{selectedLocation.name}</div>
                                            <div className="font-mono text-[8px] uppercase opacity-30">{selectedLocation.addr}</div>
                                        </div>
                                        <div className="size-10 border border-white/10 flex items-center justify-center rounded-full">
                                            <span className="material-symbols-outlined !text-xl" style={{ color: themeColor }}>check_circle</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {validBranches.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setSelectedLocation(b)}
                                            className="p-4 border border-white/10 bg-surface text-white text-left hover:border-primary transition-all"
                                        >
                                            <div className="font-display text-xl font-bold uppercase">{b.name}</div>
                                            <div className="font-mono text-[8px] uppercase opacity-40">{b.addr}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mt-8 animate-fade-in-up [animation-delay:100ms]">
                        <div className="px-4 mb-4 flex justify-between items-end">
                            <div className="flex items-center gap-3">
                                <span className="bg-primary text-black text-xs font-black px-2 py-1 rounded-sm">{booking.branch ? '1' : '2'}</span>
                                <h2 className="font-display text-4xl font-bold uppercase text-white leading-none">Seleccionar Fecha</h2>
                            </div>
                            <span className="text-[10px] font-mono animate-pulse uppercase" style={{ color: themeColor }}>ACTUALIZACIONES EN VIVO</span>
                        </div>
                        <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
                            {dynamicDates.map((d, idx) => {
                                const isSelected = selectedDate.num === d.num;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                                        className={`snap-start shrink-0 w-20 h-24 flex flex-col items-center justify-center transition-all ${isSelected ? 'text-black relative' : 'bg-transparent text-white border border-white/20'}`}
                                        style={isSelected ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
                                    >
                                        <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected ? 'font-bold' : 'font-mono text-zinc-400'}`}>{d.day}</span>
                                        <span className="font-display text-4xl font-bold leading-none">{d.num}</span>
                                        <span className={`text-[10px] uppercase mt-1 ${isSelected ? 'font-bold' : 'font-mono text-zinc-400'}`}>{d.label}</span>
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
             /// {isStudioBooking ? 'RECORDING SESSION' : 'ASEGURA EL FLOW'} /// SIN REEMBOLSOS /// CÁELE CON TODO /// {isStudioBooking ? 'RECORDING SESSION' : 'ASEGURA EL FLOW'} ///
                        </div>
                    </div>

                    {/* Time Grid */}
                    <section className="px-4 flex-1 animate-fade-in-up [animation-delay:300ms]">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary text-black text-xs font-black px-2 py-1 rounded-sm">{booking.branch ? '2' : '3'}</span>
                            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-white">Disponibilidad</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                            {timeBlocks.map((block, bIdx) => (
                                <React.Fragment key={bIdx}>
                                    <div className="col-span-3 text-[10px] text-zinc-400 font-mono uppercase tracking-widest mt-6 first:mt-2 mb-1 pl-1">{block.label}</div>
                                    {block.slots.map((slot, sIdx) => {
                                        const isSelected = selectedTime === slot.time;
                                        return (
                                            <button
                                                key={sIdx}
                                                disabled={slot.booked}
                                                onClick={() => setSelectedTime(slot.time)}
                                                className={`relative h-12 md:h-14 w-full flex items-center justify-center border font-mono text-sm font-bold transition-all ${slot.booked ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed' :
                                                    isSelected ? 'text-black z-10' :
                                                        'border-white text-white hover:bg-white hover:text-black'
                                                    }`}
                                                style={isSelected ? { backgroundColor: themeColor, borderColor: themeColor, boxShadow: `0 0 15px ${themeColor}66` } : {}}
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
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase block mb-4" style={{ color: themeColor }}>/// Resumen</span>
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="size-20 overflow-hidden border border-white/20" style={{ borderColor: themeColor }}>
                                    {isStudioBooking ? (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                                            <span className="material-symbols-outlined !text-4xl" style={{ color: themeColor }}>mic</span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl italic">BK</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[10px] uppercase font-mono">{isStudioBooking ? 'Proyecto' : 'Estilista'}</span>
                                    <h3 className="font-display text-2xl font-black uppercase text-white leading-tight">{isStudioBooking ? 'STUDIO RENTAL' : (barber?.name || 'KASH')}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Sucursal</span>
                                <span className="font-bold uppercase" style={{ color: themeColor }}>{selectedLocation?.name || '---'}</span>
                            </div>
                             <div className="flex flex-col border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase mb-1">Servicios</span>
                                 <div className="flex flex-col items-end">
                                     {services.map((s, i) => (
                                         <span key={i} className="text-white text-[10px] font-bold uppercase">{s.priceIsVariable ? 'Desde ' : ''}{s.name} (${getServicePrice(s)})</span>
                                     ))}
                                 </div>
                            </div>
                            {isStudioBooking && (
                                <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                    <span className="text-white/60 text-xs font-mono uppercase">Tiempo Renta</span>
                                    <span className="text-white font-bold uppercase">{booking.studioInfo?.hours} HRS</span>
                                </div>
                            )}
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Fecha</span>
                                <span className="font-bold uppercase" style={{ color: themeColor }}>{selectedDate.label}, {selectedDate.num} {selectedDate.day}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-dashed border-white/20 pb-2">
                                <span className="text-white/60 text-xs font-mono uppercase">Horario</span>
                                <span className="font-bold uppercase" style={{ color: themeColor }}>{selectedTime || '---'}</span>
                            </div>
                        </div>

                        <div className="pt-4">
                             <div className="flex justify-between items-center mb-6">
                                <span className="text-white text-xl font-display uppercase italic">Total Est.</span>
                                <span className="text-4xl font-display font-black" style={{ color: themeColor }}>${totalPrice.toFixed(2)}</span>
                            </div>
                            {(!selectedTime || !selectedLocation) && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in shadow-[4px_4px_0px_rgba(239,68,68,0.1)]">
                                    <p className="text-[10px] text-red-500 font-mono uppercase tracking-widest text-center font-bold">
                                        ↳ Falta: {!selectedLocation ? 'Sucursal' : 'Horario'}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    if (!selectedLocation || !selectedTime) return;
                                    onComplete({ branch: selectedLocation, date: selectedDate.fullDate, dateLabel: `${selectedDate.num} ${selectedDate.day}`, time: selectedTime });
                                }}
                                className={`w-full h-16 flex items-center justify-between px-8 font-bold uppercase tracking-widest transition-all group ${selectedTime && selectedLocation ? 'text-black hover:bg-white shadow-[6px_6px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1' : 'bg-white/5 text-white/20'}`}
                                style={selectedTime && selectedLocation ? { backgroundColor: themeColor } : {}}
                            >
                                <span>LOCKED IN</span>
                                <span className="material-symbols-outlined !text-3xl font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Sticky Footer (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] border-t-2 p-4 z-40 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.8)]" style={{ borderTopColor: themeColor }}>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/60">
                        <span>Total flow</span>
                        <span className="font-bold" style={{ color: themeColor }}>{selectedTime ? 'LISTO PARA AGENDAR' : 'COMPLETA TUS DATOS'}</span>
                    </div>
                     <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10">
                        <div className="flex flex-col">
                            <span className="text-white font-display text-2xl font-bold leading-none mb-1">${totalPrice.toFixed(2)}</span>
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter italic">Servicios e impuestos incl.</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-tight" style={{ color: themeColor }}>
                                {selectedTime ? `${selectedDate.label} ${selectedDate.num} @ ${selectedTime}` : '---'}
                            </span>
                            <span className="text-[9px] font-mono text-white/40 uppercase">{selectedLocation?.name || 'Sin sucursal'}</span>
                        </div>
                    </div>
                    <div className={`p-2 mb-2 text-center bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-widest transition-all ${(!selectedTime || !selectedLocation) ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        {!selectedLocation ? '↳ Elige una sucursal' : !selectedTime ? '↳ Selecciona un horario' : ''}
                    </div>
                    <button
                        onClick={() => {
                            if (!selectedLocation || !selectedTime) return;
                            onComplete({ branch: selectedLocation, date: selectedDate.fullDate, dateLabel: `${selectedDate.num} ${selectedDate.day}`, time: selectedTime });
                        }}
                        className={`w-full h-14 mt-1 flex items-center justify-between px-6 font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${selectedTime && selectedLocation ? 'text-black shadow-lg shadow-primary/20 bg-primary' : 'bg-white/5 text-white/20'}`}
                    >
                        <span className="text-sm">ASEGURAR EL FLOW</span>
                        <span className="material-symbols-outlined !text-2xl group-active:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default BookingFlow;
