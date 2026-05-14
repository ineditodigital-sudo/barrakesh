import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useAppointments } from './data';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [appointments] = useAppointments();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Notification Logic
    useEffect(() => {
        try {
            if (!appointments || !Array.isArray(appointments) || appointments.length === 0 || !user) return;

            const normalize = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const myName = normalize(user.name || user.username || "");

            const relevantApts = appointments.filter(apt => {
                if (['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'].includes(user.role)) return true;
                if (user.role === 'BARBER') {
                    const aptBarberName = normalize(apt.barber?.name || apt.barber || apt.barber_name || "");
                    const aptBarberId = String(apt.barber_id || apt.barber?.id || "").trim();
                    const myId = String(user.barberId || user.id || "").trim();
                    
                    if (aptBarberId && myId && aptBarberId === myId) return true;
                    return aptBarberName !== "" && myName !== "" && aptBarberName === myName;
                }
                return false;
            }).sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || 0);
                const dateB = new Date(b.createdAt || b.date || 0);
                return dateB - dateA;
            });

            const recent = relevantApts.slice(0, 5).map(apt => ({
                id: apt.id || Math.random(),
                title: 'Nueva Cita',
                message: `${apt.customer?.name || apt.client || 'Cliente'} - ${apt.date} @ ${apt.time}`,
                time: apt.createdAt || new Date().toISOString(),
                isNew: !localStorage.getItem(`notif_read_${apt.id}`)
            }));

            setNotifications(recent);
            setUnreadCount(recent.filter(n => n.isNew).length);
        } catch (err) {
            console.error("Notification processing error:", err);
        }
    }, [appointments, user]);

    const markAllRead = () => {
        notifications.forEach(n => {
            localStorage.setItem(`notif_read_${n.id}`, 'true');
        });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    };

    if (!user) return <Navigate to="/admin/login" replace />;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'grid_view', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'Agenda Global', path: '/admin/agenda', icon: 'calendar_today', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'Mi Horario', path: '/admin/my-agenda', icon: 'schedule', roles: ['BARBER'] },
        { name: 'Staff', path: '/admin/barbers', icon: 'badge', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'Sucursales', path: '/admin/branches', icon: 'location_on', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'Mi Perfil', path: '/admin/profile', icon: 'account_circle', roles: ['BARBER'] },
        { name: 'Servicios', path: '/admin/services', icon: 'content_cut', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'Historial', path: '/admin/appointments', icon: 'database', roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'] },
        { name: 'SEO & Config', path: '/admin/seo', icon: 'public', roles: ['SUPER_ADMIN', 'DEVELOPER'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className={`min-h-screen font-sans flex overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#080808] text-white' : 'bg-[#F4F4F7] text-[#1D1D1F]'}`}>
            {/* Soft Ambient Background */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Alternative (Floating iOS style) */}
            <aside className={`
                fixed lg:relative z-40 lg:z-20 flex flex-col m-3 transition-all duration-500 ease-in-out
                ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
                ${isMobile ? 'h-[calc(100vh-24px)] shadow-2xl shadow-black/50' : 'h-[calc(100vh-24px)]'}
            `}>
                <div className={`h-full rounded-2xl flex flex-col p-3 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5 shadow-xl'} border`}>
                    <div className="p-3 mb-6 flex items-center justify-between">
                        {(isSidebarOpen || !isMobile) && (
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="size-8 min-w-8 bg-primary rounded-lg flex items-center justify-center text-black font-black text-lg">B</div>
                                {isSidebarOpen && <span className="font-bold tracking-tighter text-lg uppercase">Barrakesh</span>}
                            </div>
                        )}
                        {isMobile && isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(false)} className="size-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors">
                                <span className="material-symbols-outlined !text-xl">close</span>
                            </button>
                        )}
                    </div>

                    <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto no-scrollbar">
                        {filteredNavItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary text-black shadow-lg shadow-primary/10 scale-[1.01]'
                                        : `${isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/60 hover:text-black'} hover:bg-white/5`
                                    }`
                                }
                            >
                                <span className={`material-symbols-outlined !text-xl ${isSidebarOpen ? '' : 'mx-auto'}`}>{item.icon}</span>
                                {isSidebarOpen && <span className="text-xs font-bold tracking-tight">{item.name}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    <div className={`mt-auto p-2 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} mb-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
                            <div className="size-8 min-w-8 rounded-lg bg-gradient-to-tr from-primary/20 to-primary/80 flex items-center justify-center text-black overflow-hidden font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-bold leading-none truncate">{user?.name || 'Usuario'}</span>
                                    <span className={`text-[9px] mt-1 uppercase tracking-widest ${isDarkMode ? 'text-white/50' : 'text-black/60'}`}>
                                        {(user?.role || 'ADMIN').replace('_', ' ')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className={`w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 px-4 text-xs font-bold ${isSidebarOpen ? '' : 'justify-center'}`}
                        >
                            <span className="material-symbols-outlined !text-lg">logout</span>
                            {isSidebarOpen && <span>Cerrar Sesión</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 m-3 overflow-hidden min-w-0">
                <header className={`h-16 mb-3 px-4 lg:px-6 flex items-center justify-between rounded-2xl transition-colors duration-500 ${isDarkMode ? 'ios-glass border-white/5' : 'bg-white border-black/5 shadow-sm'} border z-50`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 hover:bg-black/5 rounded-lg transition-colors ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}
                        >
                            <span className="material-symbols-outlined text-xl">menu</span>
                        </button>
                        <div className={`h-5 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} hidden sm:block`}></div>
                        <h2 className="text-sm font-bold tracking-tight truncate">
                            {['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'].includes(user.role) ? 'Control de Sistema' : 'Mi Panel de Trabajo'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        {/* Status dot only on desktop/large mobile */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            <span className={`text-[9px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-white/60' : 'text-black/80'}`}>Operativo</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`size-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors ${!isDarkMode ? 'text-blue-600' : 'text-primary'}`}
                        >
                            <span className="material-symbols-outlined !text-xl" translate="no">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) markAllRead();
                                }}
                                className={`size-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors relative ${isDarkMode ? 'text-white/60' : 'text-black/80'}`}
                            >
                                <span className="material-symbols-outlined !text-xl" translate="no">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-[#121212] animate-pulse"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)}></div>
                                    <div className={`absolute right-0 mt-2 w-72 rounded-2xl border p-2 z-[70] shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10'}`}>
                                        <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Notificaciones</span>
                                            {unreadCount > 0 && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase">{unreadCount} nuevas</span>}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto no-scrollbar py-2">
                                            {notifications.length > 0 ? notifications.map((n, i) => (
                                                <div key={i} className={`p-3 rounded-xl mb-1 transition-colors ${n.isNew ? (isDarkMode ? 'bg-primary/5' : 'bg-primary/10') : 'hover:bg-white/5'}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[11px] font-black uppercase tracking-tight">{n.title}</span>
                                                        <span className="text-[8px] opacity-40">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-[10px] opacity-60 leading-tight">{n.message}</p>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center opacity-20">
                                                    <span className="material-symbols-outlined !text-4xl mb-2">notifications_off</span>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">Sin actividad reciente</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-white/5">
                                            <button 
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    navigate(['SUPER_ADMIN', 'ADMIN', 'DEVELOPER'].includes(user.role) ? '/admin/agenda' : '/admin/my-agenda');
                                                }}
                                                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Ver Agenda Completa
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className={`flex-1 overflow-y-auto rounded-2xl p-4 lg:p-6 transition-colors duration-500 border min-w-0 ${isDarkMode ? 'ios-glass border-white/5' : 'bg-white/70 border-black/5'}`}>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </div>

            </main>
        </div>
    );
};

export default AdminLayout;
