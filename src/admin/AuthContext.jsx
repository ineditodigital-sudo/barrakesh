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
        // Init state from localStorage for immediate render
        const initUser = () => {
            try {
                const storedUser = localStorage.getItem('barrakesh_user');
                if (storedUser && storedUser !== 'undefined') {
                    const parsed = JSON.parse(storedUser);
                    setUser(parsed);
                }
            } catch (e) {
                console.warn("Auth: Local storage corrupted", e);
                localStorage.removeItem('barrakesh_user');
            }
        };
        initUser();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const userRef = ref(database, `users/${firebaseUser.uid}`);
                    const snapshot = await get(userRef);
                    
                    let userData = null;
                    if (snapshot.exists()) {
                        userData = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...snapshot.val()
                        };
                    } else {
                        // Priority to localStorage if this is a barber bypass session
                        const stored = localStorage.getItem('barrakesh_user');
                        if (stored) {
                            userData = JSON.parse(stored);
                        } else {
                            // Default to a basic profile if we have a Firebase user but no RTDB node yet
                            userData = {
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                role: 'BARBER',
                                name: firebaseUser.email?.split('@')[0] || 'User'
                            };
                        }
                    }
                    
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem('barrakesh_user', JSON.stringify(userData));
                    }
                } else {
                    const stored = localStorage.getItem('barrakesh_user');
                    if (!stored) {
                        setUser(null);
                    }
                    // Else: keeps the emulated barber user if present
                }
            } catch (error) {
                console.error("Auth: sync error", error);
            } finally {
                setLoading(false);
            }
        });

        // Fail-safe to avoid permanent black screen
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const login = async (username, password) => {
        try {
            const lowerUser = username.toLowerCase();
            let email = '';

            // Handle barber bypass first
            if (lowerUser !== 'admin' && lowerUser !== 'developer') {
                try {
                    const barbersRef = ref(database, 'barbers');
                    const snapshot = await get(barbersRef);
                    const barbersData = snapshot.val();
                    
                    if (barbersData) {
                        const matchedBarber = Object.entries(barbersData).find(([_, b]) => {
                            if (!b || !b.name) return false;
                            const normalizedName = b.name.toString().toLowerCase().replace(/\s+/g, '');
                            return normalizedName === lowerUser;
                        });
                        
                        if (matchedBarber) {
                            const [id, barber] = matchedBarber;
                            if (barber.password === password || (!barber.password && password === 'barrakesh')) {
                                const barberData = {
                                    uid: `barber_${id}`,
                                    email: `${lowerUser}@barrakesh.com`,
                                    name: barber.name,
                                    role: 'BARBER',
                                    barberId: id
                                };
                                // Login to Firebase for session management but use emulated data
                                try {
                                    await signInWithEmailAndPassword(auth, barberData.email, password);
                                } catch (e) {
                                    const { createUserWithEmailAndPassword } = await import('firebase/auth');
                                    await createUserWithEmailAndPassword(auth, barberData.email, password).catch(()=>{});
                                }
                                setUser(barberData);
                                localStorage.setItem('barrakesh_user', JSON.stringify(barberData));
                                return { success: true };
                            }
                        }
                    }
                } catch (e) { console.warn("Barber bypass error:", e); }
            }

            // Normal Admin/Final flow
            if (lowerUser === 'admin') email = 'admin@barrakesh.com';
            else if (lowerUser === 'developer') email = 'developer@barrakesh.com';
            else email = `${lowerUser.replace(/\s+/g, '')}@barrakesh.com`;

            const cred = await signInWithEmailAndPassword(auth, email, password);
            const userRef = ref(database, `users/${cred.user.uid}`);
            const snapshot = await get(userRef);
            
            const userData = snapshot.exists() ? {
                uid: cred.user.uid,
                email: cred.user.email,
                ...snapshot.val()
            } : {
                uid: cred.user.uid,
                email: cred.user.email,
                role: 'BARBER',
                name: lowerUser
            };

            setUser(userData);
            localStorage.setItem('barrakesh_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            let message = 'Credenciales inválidas';
            if (error.code === 'auth/network-request-failed') message = 'Problemas de red';
            return { success: false, message };
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('barrakesh_user');
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
                <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black animate-pulse">Iniciando Sistema...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
