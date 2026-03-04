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

    if (roles.length > 0 && !roles.includes(user.role)) {
        // If they don't have the role, send them to their "home"
        const defaultPath = user.role === 'BARBER' ? '/admin/my-agenda' : '/admin';
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
