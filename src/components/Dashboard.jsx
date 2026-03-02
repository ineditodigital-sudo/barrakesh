import React, { useState } from 'react';

const Dashboard = ({ onExit }) => {
    const [activeTab, setActiveTab] = useState('LOGS');

    const stats = [
        { label: "Ingresos Hoy", value: "$490.00" },
        { label: "Barberos Activos", value: "3" },
        { label: "Carga del Sistema", value: "98.4%" },
    ];

    const appointments = [
        { id: 1, client: "Alex V.", service: "Fade a Navaja", barber: "Kash", time: "10:00", status: "ASEGURADO" },
        { id: 2, client: "Sarah J.", service: "Corte a Tijera", barber: "Jax", time: "11:00", status: "ASEGURADO" },
        { id: 3, client: "Mark K.", service: "Corte Rapado", barber: "Rico", time: "12:30", status: "PENDIENTE" },
        { id: 4, client: "Luna M.", service: "Esculpido de Barba", barber: "Kash", time: "14:00", status: "CANCELADO" },
    ];

    return (
        <div className="min-h-screen bg-void text-white font-mono min-h-screen flex flex-col brutalist-grid relative">
            <div className="fixed inset-0 pointer-events-none bg-noise z-0 opacity-40"></div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-void/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <img
                        src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png"
                        alt="BARRAKESH"
                        className="h-10 w-auto object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="text-primary font-bold tracking-widest text-[10px] uppercase h-max leading-none">CORE_TERMINAL</span>
                        <p className="text-[10px] text-white/40 uppercase mt-1 tracking-widest leading-none">/// Root Access v1.0.9</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {['REGISTROS', 'PERSONAL', 'SUCURSALES', 'CONFIG'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 border font-bold text-[10px] uppercase transition-all ${activeTab === tab ? 'bg-primary text-black border-primary' : 'border-white/20 hover:border-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                    <button
                        onClick={onExit}
                        className="px-4 py-2 border border-accent-red text-accent-red text-[10px] font-bold uppercase hover:bg-accent-red hover:text-white transition-all"
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 p-6 md:p-12 overflow-y-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map(stat => (
                        <div key={stat.label} className="bg-surface border border-white/10 p-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 -rotate-45 translate-x-6 -translate-y-6"></div>
                            <div className="text-[10px] text-white/40 uppercase mb-2 tracking-widest">{stat.label}</div>
                            <div className="text-4xl font-display font-bold text-white group-hover:text-primary transition-colors">{stat.value}</div>
                            <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden">
                                <div className="h-full bg-primary animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="bg-surface border border-white/10 relative">
                    {/* Decorative Corner */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>

                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary animate-pulse"></span>
                            {activeTab} DIRECTORIO
                        </h2>
                        <div className="flex gap-2">
                            <div className="w-1 h-1 bg-white/20"></div>
                            <div className="w-1 h-1 bg-white/20"></div>
                            <div className="w-1 h-1 bg-white/20"></div>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'LOGS' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="pb-4 text-[10px] uppercase font-bold text-white/40">Cliente</th>
                                            <th className="pb-4 text-[10px] uppercase font-bold text-white/40">Servicio</th>
                                            <th className="pb-4 text-[10px] uppercase font-bold text-white/40">Barbero</th>
                                            <th className="pb-4 text-[10px] uppercase font-bold text-white/40">Hora</th>
                                            <th className="pb-4 text-[10px] uppercase font-bold text-white/40 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {appointments.map(apt => (
                                            <tr key={apt.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 font-bold text-sm tracking-tight uppercase group-hover:text-primary">{apt.client}</td>
                                                <td className="py-4 text-xs text-white/60">{apt.service}</td>
                                                <td className="py-4 text-xs text-white/60">{apt.barber}</td>
                                                <td className="py-4 text-xs font-bold font-mono text-primary/80">{apt.time}</td>
                                                <td className="py-4 text-right">
                                                    <span className={`text-[9px] px-2 py-0.5 border font-bold ${apt.status === 'ASEGURADO' ? 'border-green-500 text-green-500' :
                                                        apt.status === 'CANCELADO' ? 'border-accent-red text-accent-red' :
                                                            'border-primary text-primary'
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <span className="material-symbols-outlined text-white/10 !text-9xl mb-4">settings_input_component</span>
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Sección Restringida</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-6 border-t border-white/10 text-center font-mono text-[10px] text-white/20 uppercase tracking-[0.8em]">
                Fin de Transmisión /// Barrakesh OS v1.0.9
            </footer>
        </div>
    );
};

export default Dashboard;

