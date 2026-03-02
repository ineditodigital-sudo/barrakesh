import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(username, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
                <div className="text-center mb-10">
                    <img
                        src="/LOGO-BARRAKESH-HORIZONTAL-TXT-BLANCO.png"
                        alt="BARRAKESH"
                        className="h-10 w-auto mx-auto mb-8 object-contain"
                    />
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Admin <span className="text-primary">Panel</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium">Gestión Profesional de Barbería</p>
                </div>

                <div className="ios-glass p-10 rounded-[32px] shadow-2xl space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-xs font-semibold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-white/60 text-[11px] font-bold uppercase tracking-widest ml-1">Usuario</label>
                            <input
                                required
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full ios-input bg-white/5 border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Ingresa tu usuario"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-white/60 text-[11px] font-bold uppercase tracking-widest ml-1">Contraseña</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full ios-input bg-white/5 border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 bg-primary text-black font-bold rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                        >
                            <span className="text-sm uppercase tracking-widest">Entrar al Sistema</span>
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </form>
                </div>

                <div className="mt-12 flex justify-center items-center gap-6">
                    <div className="h-[1px] w-8 bg-white/10"></div>
                    <p className="text-white/20 font-medium text-[10px] uppercase tracking-[0.4em]">
                        v2.1.0 /// ESTADO: OPERATIVO
                    </p>
                    <div className="h-[1px] w-8 bg-white/10"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
