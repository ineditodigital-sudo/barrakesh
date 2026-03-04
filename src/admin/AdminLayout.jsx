import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
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

    // Close sidebar on navigation on mobile
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [location.pathname, isMobile]);

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'grid_view', roles: ['SUPER_ADMIN'] },
        { name: 'Agenda Global', path: '/admin/agenda', icon: 'calendar_today', roles: ['SUPER_ADMIN'] },
        { name: 'Mi Horario', path: '/admin/my-agenda', icon: 'schedule', roles: ['BARBER'] },
        { name: 'Staff', path: '/admin/barbers', icon: 'badge', roles: ['SUPER_ADMIN'] },
        { name: 'Sucursales', path: '/admin/branches', icon: 'location_on', roles: ['SUPER_ADMIN'] },
        { name: 'Clientes', path: '/admin/customers', icon: 'person_search', roles: ['SUPER_ADMIN', 'BARBER'] },
        { name: 'Mi Perfil', path: '/admin/profile', icon: 'account_circle', roles: ['BARBER'] },
        { name: 'Servicios', path: '/admin/services', icon: 'content_cut', roles: ['SUPER_ADMIN'] },
        { name: 'Historial', path: '/admin/appointments', icon: 'database', roles: ['SUPER_ADMIN'] },
        { name: 'SEO & Config', path: '/admin/seo', icon: 'public', roles: ['SUPER_ADMIN'] },
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
                                {user.name.charAt(0)}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-bold leading-none truncate">{user.name}</span>
                                    <span className={`text-[9px] mt-1 uppercase tracking-widest ${isDarkMode ? 'text-white/50' : 'text-black/60'}`}>
                                        {user.role.replace('_', ' ')}
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
            <main className="flex-1 flex flex-col relative z-10 m-3 overflow-hidden">
                <header className={`h-16 mb-3 px-4 lg:px-6 flex items-center justify-between rounded-2xl transition-colors duration-500 ${isDarkMode ? 'ios-glass border-white/5' : 'bg-white border-black/5 shadow-sm'} border`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 hover:bg-black/5 rounded-lg transition-colors ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}
                        >
                            <span className="material-symbols-outlined text-xl">menu</span>
                        </button>
                        <div className={`h-5 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} hidden sm:block`}></div>
                        <h2 className="text-sm font-bold tracking-tight truncate">
                            {user.role === 'SUPER_ADMIN' ? 'Control de Sistema' : 'Mi Panel de Trabajo'}
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
                            <span className="material-symbols-outlined !text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <div className={`size-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors ${isDarkMode ? 'text-white/60' : 'text-black/80'}`}>
                            <span className="material-symbols-outlined !text-xl">notifications</span>
                        </div>
                    </div>
                </header>

                <div className={`flex-1 overflow-y-auto no-scrollbar rounded-2xl p-4 lg:p-6 transition-colors duration-500 border ${isDarkMode ? 'ios-glass border-white/5' : 'bg-white/70 border-black/5'}`}>
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
