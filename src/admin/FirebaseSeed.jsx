import React, { useState } from 'react';
import { database, auth } from '../firebase';
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const FirebaseSeed = () => {
    const [status, setStatus] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [isDone, setIsDone] = useState(false);
    const navigate = useNavigate();

    const initialData = {
        barbers: {
            "b1": { name: "Pedro", spec: "Master Barber /// Fade Expert", status: "Activo", phone: "449 123 4567", initials: "PD", workedBranches: [1, 2], image: "https://images.unsplash.com/photo-1503460293676-4d2be411cca0?auto=format&fit=crop&q=80&w=400" },
            "b2": { name: "Carlos", spec: "Senior /// Classic Cuts", status: "Activo", phone: "449 234 5678", initials: "CR", workedBranches: [1], image: "https://images.unsplash.com/photo-1520338661039-414804804437?auto=format&fit=crop&q=80&w=400" },
            "b3": { name: "Fabian", spec: "Creative Stylist", status: "Inactivo", phone: "449 345 6789", initials: "FB", workedBranches: [3], image: "https://images.unsplash.com/photo-1533689476487-034f57831a58?auto=format&fit=crop&q=80&w=400" },
            "b4": { name: "Jose Luis", spec: "Artist /// Beard Sculpting", status: "Activo", phone: "449 456 7890", initials: "JL", workedBranches: [2, 3], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
        },
        branches: {
            "1": { name: "CENTRO", addr: "Madero 234", status: "Operativo", capacity: "6 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1599351431247-f10bc93d0187?auto=format&fit=crop&q=80&w=800" },
            "2": { name: "PULGAS PANDAS", addr: "Univ. 1001", status: "Operativo", capacity: "4 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" },
            "3": { name: "ALTARIA", addr: "Blvd. Zacatecas", status: "Mantenimiento", capacity: "8 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" }
        },
        customers: {
            "c1": { name: "Alejandro Villalobos", phone: "449 123 4567", email: "alex@mail.com", lastVisit: "02 Mar 2026", totalSpent: "$1,200", loyalty: "Gold" },
            "c2": { name: "Sarah Juarez", phone: "449 234 5678", email: "sarah@mail.com", lastVisit: "28 Feb 2026", totalSpent: "$850", loyalty: "Silver" },
            "c3": { name: "Mark Kasarov", phone: "449 345 6789", email: "mark@mail.com", lastVisit: "25 Feb 2026", totalSpent: "$2,400", loyalty: "Platinum" }
        },
        appointments: {
            "a1": { date: "2026-03-02", time: "16:30", client: "Alejandro V.", service: "Fade a Navaja", barber: "Pedro", branch: "Centro", total: "$35.00", status: "Confirmado" }
        }
    };

    const usersToCreate = [
        { email: 'admin@barrakesh.com', pass: 'Admin123', role: 'SUPER_ADMIN', name: 'Administrador' },
        { email: 'pedro@barrakesh.com', pass: 'Barber123', role: 'BARBER', name: 'Pedro' },
        { email: 'carlos@barrakesh.com', pass: 'Barber123', role: 'BARBER', name: 'Carlos' },
        { email: 'fabian@barrakesh.com', pass: 'Barber123', role: 'BARBER', name: 'Fabian' },
        { email: 'joseluis@barrakesh.com', pass: 'Barber123', role: 'BARBER', name: 'Jose Luis' }
    ];

    const handleSeed = async () => {
        setStatus('🚀 Iniciando despliegue de datos...');
        setDebugInfo('');
        try {
            // Test write first
            setStatus('Probando conexión a base de datos...');
            await set(ref(database, 'connection_test'), { time: Date.now(), status: 'ok' });

            // 1. Sync Base Data
            setStatus('Sincronizando Barberos...');
            await set(ref(database, 'barbers/'), initialData.barbers);

            setStatus('Sincronizando Sucursales...');
            await set(ref(database, 'branches/'), initialData.branches);

            setStatus('Sincronizando Clientes...');
            await set(ref(database, 'customers/'), initialData.customers);

            setStatus('Sincronizando Citas...');
            await set(ref(database, 'appointments/'), initialData.appointments);

            setStatus('✅ Estructura base completada. Creando usuarios...');

            // 2. Create Users one by one
            for (const u of usersToCreate) {
                try {
                    setStatus(`Creando acceso para ${u.name}...`);
                    const userCred = await createUserWithEmailAndPassword(auth, u.email, u.pass);
                    // Save role in RTDB
                    await set(ref(database, `users/${userCred.user.uid}`), {
                        name: u.name,
                        role: u.role,
                        email: u.email
                    });
                    await signOut(auth); // Sign out so next creation works
                } catch (e) {
                    if (e.code === 'auth/email-already-in-use') {
                        setStatus(`⚠️ ${u.name} ya existe. Saltando...`);
                    } else {
                        console.error("Auth creation error:", e);
                        setDebugInfo(prev => prev + `\nError en usuario ${u.name}: ${e.message}`);
                    }
                }
            }

            setStatus('✨ ¡Todo listo! Barrakesh Cloud configurado.');
            setIsDone(true);
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (error) {
            console.error("Master Error:", error);
            setStatus('❌ Error detectado');
            setDebugInfo(error.code + ": " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full scale-150"></div>

            <div className="relative ios-glass p-12 rounded-[48px] max-w-lg w-full text-center space-y-8 border-primary/20 shadow-2xl">
                <div className="size-24 bg-primary/20 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-primary/30">
                    <span className="material-symbols-outlined !text-5xl text-primary font-bold">cloud_sync</span>
                </div>

                <h1 className="text-4xl font-black tracking-tighter leading-none">Configuración <br /><span className="text-primary italic">Barrakesh Cloud</span></h1>

                <p className="text-white/40 text-sm leading-relaxed px-4">
                    Estamos por conectar tu aplicación local con la nube de Firebase. <br />
                    <strong>Se crearán las cuentas de Pedro, Carlos, Fabian y el Administrador.</strong>
                </p>

                <button
                    disabled={status.includes('🚀') || isDone}
                    onClick={handleSeed}
                    className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                >
                    {isDone ? 'Configuración Exitosa' : 'Activar Backend Ahora'}
                </button>

                {status && (
                    <div className="py-4 px-6 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">{status}</p>
                        {debugInfo && (
                            <p className="text-[9px] text-red-500 font-mono mt-2 break-all">{debugInfo}</p>
                        )}
                    </div>
                )}

                <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-bold">Protocolo Seguro Barrakesh v3.1</p>
                </div>
            </div>
        </div>
    );
};

export default FirebaseSeed;
