import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (roles.length > 0 && (!user.role || !roles.includes(user.role))) {
        // ESCUDO CONTRA BUCLES: Solo redirigimos si realmente estamos en la ruta equivocada
        if (user.role === 'BARBER') return <Navigate to="/admin/my-agenda" replace />;
        
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-center p-6">
                <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <span className="material-symbols-outlined text-red-500 text-3xl">lock_open</span>
                </div>
                <h2 className="text-white font-black text-xl mb-2 uppercase tracking-tight">Acceso Restringido</h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                    Tu cuenta ({user.role || 'SIN ROL'}) no tiene permisos para ver esta sección. 
                    Si crees que esto es un error, contacta a soporte.
                </p>
                <button 
                    onClick={() => window.history.back()}
                    className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all"
                >
                    Regresar
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
