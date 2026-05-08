import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_BASE = '/backend';
const BK_AUTH_KEY = 'BK_SECURE_9921_X';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('barrakesh_user');
            if (storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                if (parsed && typeof parsed === 'object' && parsed.role) {
                    setUser(parsed);
                } else {
                    localStorage.removeItem('barrakesh_user');
                }
            }
        } catch (e) {
            console.error("Auth initialization error:", e);
            localStorage.removeItem('barrakesh_user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await fetch(`${API_BASE}/auth.php?action=login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Barrakesh-Auth': BK_AUTH_KEY
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('barrakesh_user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Error de autenticación' };
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    };

    const logout = () => {
        localStorage.removeItem('barrakesh_user');
        setUser(null);
        navigate('/admin/login');
    };

    const changePassword = async (newPassword) => {
        // Implementar en admin_api.php si es necesario
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, changePassword, loading }}>
            {loading ? (
                <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black animate-pulse">Iniciando Sistema...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
