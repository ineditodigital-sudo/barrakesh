import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBarbers, useAppointments, useCustomers } from './data';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [barbers] = useBarbers();
    const [appointments] = useAppointments();
    const [customers] = useCustomers();

    React.useEffect(() => {
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
        <div className="space-y-6 animate-fade-in-up">
            {/* Page Title Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Métricas de Negocio</h1>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Visión global del rendimiento de Barrakesh.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    <button className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-bold">Hoy</button>
                    <button className="px-4 py-1.5 rounded-lg text-white/40 text-[10px] font-bold hover:text-white transition-colors">Mes</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={stat.label} className="ios-card bg-white/[0.01] p-5 hover:bg-white/[0.03] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined !text-xl">{stat.icon}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white/40'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">{stat.label}</h3>
                        <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 ios-card bg-white/[0.01] overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-base font-bold tracking-tight">Citas Recientes</h3>
                        <button className="text-[10px] font-bold text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">Ver Todo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Cliente</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Barbero</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {appointments.slice(0, 5).map((apt, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">{apt.client}</span>
                                                <span className="text-[9px] text-white/40 mt-0.5">{apt.service}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-medium text-white/60">{apt.barber}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-bold text-primary">{apt.time}</span>
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
                    <div className="ios-card bg-white/[0.01] p-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-white/20">Ocupación Sedes</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Centro", value: 85 },
                                { name: "Altaria", value: 62 },
                                { name: "Las Pulgas", value: 45 },
                            ].map(branch => (
                                <div key={branch.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                        <span>{branch.name}</span>
                                        <span className="text-white/20">{branch.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(254,225,1,0.2)] transition-all duration-1000" style={{ width: `${branch.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Action Card (Apple-style Notification) */}
                    <div className="ios-card bg-primary p-6 text-black relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer shadow-lg shadow-primary/5">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="material-symbols-outlined !text-4xl">bolt</span>
                        </div>
                        <h3 className="text-base font-bold tracking-tight mb-1">Resumen</h3>
                        <p className="text-black/60 text-[11px] font-medium mb-4">Reporte semanal listo.</p>
                        <button className="bg-black text-white px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
