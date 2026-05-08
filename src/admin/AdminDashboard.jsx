import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useBarbers, useAppointments } from './data';
import Skeleton from './Skeleton';
import { useToast } from './ToastContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    
    const [barbersData, { loading: barbersLoading }] = useBarbers();
    const [appointmentsData, { loading: appointmentsLoading }] = useAppointments();
    
    const barbers = Array.isArray(barbersData) ? barbersData : [];
    const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];

    const isLoading = barbersLoading || appointmentsLoading;
    const [timeRange, setTimeRange] = useState('TODO');

    useEffect(() => {
        if (user && !['ADMIN', 'SUPER_ADMIN', 'DEVELOPER'].includes(user.role)) {
            navigate('/admin/my-agenda');
        }
    }, [user, navigate]);

    if (!user) return null;

    // FILTRADO CON PROTECCIÓN TOTAL
    const getSafeFilteredData = () => {
        try {
            return appointments.filter(apt => {
                if (!apt || typeof apt !== 'object') return false;
                const dateStr = String(apt.date || '');
                if (!dateStr) return false;
                
                if (apt.status === 'Cancelada' || apt.status === 'Cancelled') return false;
                if (timeRange === 'TODO') return true;
                
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const month = today.substring(0, 7);
                
                if (timeRange === 'HOY') return dateStr.startsWith(today);
                if (timeRange === 'MES') return dateStr.startsWith(month);
                return true;
            });
        } catch (e) {
            console.error("Error en filtrado:", e);
            return [];
        }
    };

    const safeData = getSafeFilteredData();
    const totalRevenue = safeData.reduce((acc, apt) => {
        const val = String(apt.total || '0').replace(/[^0-9.]/g, '');
        return acc + (parseFloat(val) || 0);
    }, 0);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <header className="flex justify-between items-center">
                <h1 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Escritorio</h1>
                <div className="flex bg-white/5 p-1 rounded-xl">
                    {['HOY', 'MES', 'TODO'].map(r => (
                        <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${timeRange === r ? 'bg-primary text-black' : 'text-white/40'}`}>{r}</button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Ventas", val: `$${totalRevenue.toLocaleString()}` },
                    { label: "Citas", val: safeData.length },
                    { label: "Barberos", val: barbers.length }
                ].map(s => (
                    <div key={s.label} className="ios-card p-6 bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-white">{isLoading ? '...' : s.val}</p>
                    </div>
                ))}
            </div>

            <div className="ios-card bg-white/[0.01] border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 text-[10px] font-black uppercase text-white/40">Actividad Reciente</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-white/5">
                            {appointments.slice(0, 10).map((apt, i) => (
                                <tr key={i} className="hover:bg-white/[0.01]">
                                    <td className="p-4">
                                        <div className="text-xs font-bold text-white">{String(apt?.customer?.name || apt?.client || 'Cliente')}</div>
                                        <div className="text-[10px] text-white/20">{String(apt?.date || 'Sin fecha')}</div>
                                    </td>
                                    <td className="p-4 text-right font-black text-primary">${apt?.total || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && !isLoading && <div className="p-10 text-center text-[10px] font-bold text-white/10 uppercase">No hay citas registradas</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
