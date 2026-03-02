import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('barrakesh_admin_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (username, password) => {
        // Super Admin
        if (username === 'Admin' && password === 'Admin123') {
            const userData = { username: 'Admin', role: 'SUPER_ADMIN', name: 'Administrador' };
            setUser(userData);
            localStorage.setItem('barrakesh_admin_user', JSON.stringify(userData));
            return { success: true };
        }

        // Barbers
        const barbers = ['Pedro', 'Carlos', 'Fabian', 'Jose Luis'];
        if (barbers.includes(username) && password === 'Barber123') {
            const userData = { username, role: 'BARBER', name: username };
            setUser(userData);
            localStorage.setItem('barrakesh_admin_user', JSON.stringify(userData));
            return { success: true };
        }

        return { success: false, message: 'Credenciales inválidas' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('barrakesh_admin_user');
        navigate('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
