import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'grid_view', roles: ['SUPER_ADMIN'] },
        { name: 'Agenda Global', path: '/admin/agenda', icon: 'calendar_today', roles: ['SUPER_ADMIN'] },
        { name: 'Mi Horario', path: '/admin/my-agenda', icon: 'schedule', roles: ['BARBER'] },
        { name: 'Staff', path: '/admin/barbers', icon: 'badge', roles: ['SUPER_ADMIN'] },
        { name: 'Sucursales', path: '/admin/branches', icon: 'location_on', roles: ['SUPER_ADMIN'] },
        { name: 'Clientes', path: '/admin/customers', icon: 'person_search', roles: ['SUPER_ADMIN', 'BARBER'] },
        { name: 'Mi Perfil', path: '/admin/profile', icon: 'account_circle', roles: ['BARBER'] },
        { name: 'Historial', path: '/admin/appointments', icon: 'database', roles: ['SUPER_ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans flex overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Sidebar Alternative (Floating iOS style) */}
            <aside className={`relative z-20 flex flex-col m-3 mr-0 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-full ios-glass rounded-2xl flex flex-col p-3">
                    <div className="p-3 mb-6 flex items-center justify-between">
                        {isSidebarOpen ? (
                            <img src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png" alt="Logo" className="h-5 w-auto object-contain" />
                        ) : (
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-lg">B</div>
                        )}
                    </div>

                    <nav className="flex-1 space-y-1 px-1">
                        {filteredNavItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary text-black shadow-lg shadow-primary/10 scale-[1.01]'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <span className={`material-symbols-outlined !text-xl ${isSidebarOpen ? '' : 'mx-auto'}`}>{item.icon}</span>
                                {isSidebarOpen && <span className="text-xs font-bold tracking-tight">{item.name}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto p-2 pt-4 border-t border-white/5">
                        <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
                            <div className="size-8 rounded-lg bg-gradient-to-tr from-primary/20 to-primary/80 flex items-center justify-center text-black group overflow-hidden">
                                <span className="material-symbols-outlined !text-lg">person</span>
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-bold leading-none truncate">{user.name}</span>
                                    <span className="text-[9px] text-white/40 mt-1 uppercase tracking-widest">{user.role.replace('_', ' ')}</span>
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
                <header className="h-16 mb-3 px-6 flex items-center justify-between ios-glass rounded-2xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60">
                            <span className="material-symbols-outlined text-xl">menu_open</span>
                        </button>
                        <div className="h-5 w-[1px] bg-white/10 hidden md:block"></div>
                        <h2 className="text-sm font-bold tracking-tight">
                            {user.role === 'SUPER_ADMIN' ? 'Control de Sistema' : 'Mi Panel de Trabajo'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase">Operativo</span>
                        </div>
                        <div className="size-8 rounded-lg ios-glass flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined !text-lg">notifications</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar rounded-2xl ios-glass p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
