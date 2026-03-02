import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useBarbers, useAppointments, useCustomers } from './data';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [barbers] = useBarbers();
    const [appointments] = useAppointments();
    const [customers] = useCustomers();

    useEffect(() => {
        if (user && user.role !== 'SUPER_ADMIN') {
            navigate('/admin/my-agenda');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'SUPER_ADMIN') return null;

    const stats = [
        { label: "Ventas Totales", value: "$12,450.00", icon: "payments", trend: "+12%", color: "primary" },
        { label: "Citas Hoy", value: appointments.length, icon: "calendar_today", trend: `+${appointments.length}`, color: "white" },
        { label: "Clientes", value: customers.length, icon: "person_add", trend: "Activos", color: "white" },
        { label: "Staff", value: barbers.length, icon: "monitoring", trend: "Barberos", color: "white" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Page Title Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Métricas de Negocio</h1>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[11px] font-bold mt-1 uppercase tracking-widest`}>Visión global del rendimiento de Barrakesh.</p>
                </div>
                <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-black'}`}>Hoy</button>
                    <button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}>Mes</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={stat.label} className={`ios-card p-5 hover:bg-white/[0.03] transition-all duration-300 group ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform border border-primary/20">
                                <span className="material-symbols-outlined !text-xl">{stat.icon}</span>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/20 text-green-500 border border-green-500/20' : isDarkMode ? 'bg-white/10 text-white/40' : 'bg-black/5 text-black/40'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className={`${isDarkMode ? 'text-white/40' : 'text-black/50'} text-[9px] font-black uppercase tracking-widest mb-1`}>{stat.label}</h3>
                        <div className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Table */}
                <div className={`lg:col-span-2 ios-card overflow-hidden flex flex-col min-h-[400px] ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10 shadow-sm'}`}>
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <h3 className={`text-base font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Citas Recientes</h3>
                        <button onClick={() => navigate('/admin/appointments')} className="text-[10px] font-black text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">Ver Todo</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={isDarkMode ? 'bg-white/5' : 'bg-black/5'}>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Cliente</th>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Barbero</th>
                                    <th className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Hora</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
                                {appointments.slice(0, 7).map((apt, idx) => (
                                    <tr key={idx} className={`hover:bg-primary/5 transition-colors cursor-pointer group ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black tracking-tight uppercase leading-none">{apt.client}</span>
                                                <span className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[9px] mt-2 font-bold`}>{apt.service}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-[11px] font-bold ${isDarkMode ? 'text-white/60' : 'text-black/80'}`}>{apt.barber}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{apt.time}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="space-y-4">
                    {/* Performance Card */}
                    <div className={`ios-card p-6 ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white border-black/10 shadow-sm'}`}>
                        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-8 ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>Ocupación de Sedes</h3>
                        <div className="space-y-8">
                            {[
                                { name: "BK Centro", value: 85 },
                                { name: "BK Altaria", value: 62 },
                                { name: "BK Pulgas", value: 45 },
                            ].map(branch => (
                                <div key={branch.name} className="space-y-3">
                                    <div className={`flex justify-between text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                        <span>{branch.name}</span>
                                        <span className={isDarkMode ? 'text-white/20' : 'text-black/40'}>{branch.value}%</span>
                                    </div>
                                    <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(254,225,1,0.3)] transition-all duration-1000" style={{ width: `${branch.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Action Card (Apple-style Notification) - THE PROBLEM CARD */}
                    <div className={`p-8 relative overflow-hidden rounded-2xl group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl border ${isDarkMode ? '!bg-primary !border-primary shadow-primary/20' : '!bg-black !border-black shadow-black/30'}`}>
                        <div className={`absolute top-[-10px] right-[-10px] p-3 ${isDarkMode ? 'text-black/10' : 'text-white/10'}`}>
                            <span className="material-symbols-outlined !text-7xl rotate-12">receipt_long</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className={`text-lg font-black tracking-tighter mb-1 select-none ${isDarkMode ? '!text-black' : '!text-white'}`}>Resumen</h3>
                            <p className={`text-[11px] font-bold mb-6 select-none leading-tight ${isDarkMode ? '!text-black/80' : '!text-white'}`}>Reporte semanal listo.</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); navigate('/admin/appointments'); }}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isDarkMode
                                    ? '!bg-black !text-white hover:!bg-white hover:!text-black shadow-black/20'
                                    : '!bg-primary !text-black hover:!bg-white hover:!text-black shadow-primary/40'
                                    }`}
                            >
                                Consultar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
