import React, { useState } from 'react';

const ContactInfo = ({ onComplete, onBack, booking }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const isStudioBooking = booking?.services?.some(s => s.category === 'Music Studio');
    const themeColor = isStudioBooking ? "#007AFF" : "#FEE101";

    const handlePhoneChange = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 10) {
            setPhone(cleaned);
            setIsPhoneValid(cleaned.length === 10);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isPhoneValid && name.trim()) {
            onComplete({ name, phone });
        }
    };

    return (
        <div className="min-h-screen bg-background-dark font-display selection:bg-primary selection:text-black flex flex-col items-center justify-center p-6 relative">
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <button
                    onClick={onBack}
                    className="text-white transition-colors flex items-center gap-2 font-mono text-xs uppercase tracking-widest group"
                    style={{ '--hover-color': themeColor }}
                >
                    <span className="material-symbols-outlined !text-4xl group-hover:-translate-x-1 transition-transform" style={{ color: themeColor }}>arrow_back</span>
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-5 blur-[150px] rounded-full" style={{ backgroundColor: themeColor }}></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 blur-[100px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 block" style={{ color: themeColor }}>/// PASO FINAL</span>
                    <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                        TUS <span style={{ color: themeColor }}>DATOS</span>
                    </h1>
                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                        Dinos quién eres para<br />asegurar tu {isStudioBooking ? 'sesión' : 'flow'} 🔥
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col group">
                            <label className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-2 transition-colors group-focus-within:text-white" style={{ '--tw-group-focus-within-text': themeColor }}>Nombre</label>
                            <input
                                required
                                type="text"
                                placeholder="Tu nombre aquí"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-surface border-2 border-white/10 p-4 text-white font-display text-xl uppercase tracking-tighter focus:outline-none transition-all placeholder:text-white/10"
                                style={{ '--tw-focus-border': themeColor }}
                                onFocus={(e) => e.target.style.borderColor = themeColor}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <div className="flex flex-col group">
                            <label className={`font-mono text-[10px] uppercase tracking-widest mb-2 transition-colors ${isPhoneValid ? 'text-green-500' : 'text-white/20'}`}>Teléfono (WhatsApp)</label>
                            <input
                                required
                                type="tel"
                                placeholder="10 dígitos obligatorios"
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className={`bg-surface border-2 p-4 text-white font-display text-xl uppercase tracking-tighter focus:outline-none transition-all placeholder:text-white/10 ${isPhoneValid ? 'border-green-500/50' : 'border-white/10'}`}
                                onFocus={(e) => e.target.style.borderColor = themeColor}
                                onBlur={(e) => e.target.style.borderColor = isPhoneValid ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255,255,255,0.1)'}
                            />
                            {!isPhoneValid && phone.length > 0 && (
                                <span className="text-[8px] text-red-500 font-mono uppercase mt-1">Faltan {10 - phone.length} dígitos</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isPhoneValid || !name.trim()}
                        className={`w-full h-16 text-black font-display text-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 mt-8 flex items-center justify-between px-8 ${(!isPhoneValid || !name.trim()) ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                        style={{ backgroundColor: themeColor }}
                    >
                        <span>{isStudioBooking ? 'LISTO PA\' GRABAR' : 'LISTO PA\'L FLOW'}</span>
                        <span className="material-symbols-outlined font-black !text-3xl">done_all</span>
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                        <span className="material-symbols-outlined text-[10px]">lock</span>
                        <span className="font-mono text-[8px] uppercase tracking-widest">Tus datos están seguros en Barrakesh OST</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactInfo;
