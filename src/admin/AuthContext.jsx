import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import { ref, get } from 'firebase/database';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user data from RTDB
                const userRef = ref(database, `users/${firebaseUser.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        ...snapshot.val()
                    });
                } else {
                    // Fallback or user doesn't exist in DB
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (username, password) => {
        try {
            const lowerUser = username.toLowerCase();
            let email = '';

            if (lowerUser === 'admin') {
                email = 'admin@barrakesh.com';
            } else if (lowerUser === 'developer') {
                email = 'developer@barrakesh.com';
            } else {
                email = `${lowerUser.replace(/\s+/g, '')}@barrakesh.com`;
            }

            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            let message = 'Error de conexión';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = 'Credenciales inválidas';
            }
            return { success: false, message };
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        navigate('/admin/login');
    };

    const changePassword = async (newPassword) => {
        try {
            const { updatePassword } = await import('firebase/auth');
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                return { success: true };
            }
            return { success: false, message: 'No hay usuario autenticado' };
        } catch (error) {
            console.error("Password Update Error:", error);
            let message = 'Error al actualizar contraseña';
            if (error.code === 'auth/requires-recent-login') {
                message = 'Por seguridad, debes cerrar sesión y volver a entrar antes de cambiar tu contraseña.';
            }
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, changePassword, loading }}>
            {loading ? (
                <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                    <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
