import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const INITIAL_BARBERS = [
    { id: 1, name: "Pedro", spec: "Master Barber /// Fade Expert", status: "Activo", phone: "449 123 4567", initials: "PD", workedBranches: [1, 2], image: "https://images.unsplash.com/photo-1503460293676-4d2be411cca0?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Carlos", spec: "Senior /// Classic Cuts", status: "Activo", phone: "449 234 5678", initials: "CR", workedBranches: [1], image: "https://images.unsplash.com/photo-1520338661039-414804804437?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Fabian", spec: "Creative Stylist", status: "Inactivo", phone: "449 345 6789", initials: "FB", workedBranches: [3], image: "https://images.unsplash.com/photo-1533689476487-034f57831a58?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Jose Luis", spec: "Artist /// Beard Sculpting", status: "Activo", phone: "449 456 7890", initials: "JL", workedBranches: [2, 3], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
];

const INITIAL_SERVICES = [
    { id: 's1', category: "Barber Shop", name: "Fade a Navaja", price: 35, desc: "Cero o foil shaver. Degradado de precisión. Acabado a navaja.", tag: "Popular" },
    { id: 's2', category: "Barber Shop", name: "Corte a Tijera", price: 40, desc: "Solo tijera. Textured crop o clásico. Lavado y peinado incluido." },
    { id: 's3', category: "Barber Shop", name: "Corte Rapado", price: 25, desc: "Un solo nivel en toda la cabeza. Delineado incluido. Rápido y limpio." },
    { id: 's4', category: "Music Studio", name: "Sesión de Grabación", price: 50, desc: "Renta de cabina por hora. Incluye ingeniero básico.", tag: "Pro" },
    { id: 's5', category: "Music Studio", name: "Mixing & Mastering", price: 80, desc: "Tratamiento profesional para tus tracks.", tag: "Estelar" },
];

const INITIAL_BRANCHES = [
    { id: 1, name: "CENTRO", addr: "Madero 234", status: "Operativo", capacity: "6 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1599351431247-f10bc93d0187?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "PULGAS PANDAS", addr: "Univ. 1001", status: "Operativo", capacity: "4 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "ALTARIA", addr: "Blvd. Zacatecas", status: "Mantenimiento", capacity: "8 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" },
];

export const useDataService = (key, initialData) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dataRef = ref(database, key);
        const unsubscribe = onValue(dataRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                const normalized = Object.keys(val).map(id => ({
                    ...val[id],
                    id: id
                }));
                setData(normalized);
            } else {
                setData(initialData || []);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [key, initialData]);

    const addItem = async (item) => {
        const dataRef = ref(database, key);
        const newItemRef = push(dataRef);
        await set(newItemRef, { ...item, createdAt: Date.now() });
    };

    const updateItem = async (id, updated) => {
        const itemRef = ref(database, `${key}/${id}`);
        await update(itemRef, updated);
    };

    const deleteItem = async (id) => {
        const itemRef = ref(database, `${key}/${id}`);
        await remove(itemRef);
    };

    return [data, { addItem, updateItem, deleteItem, loading }];
};

export const useBarbers = () => useDataService('barbers', INITIAL_BARBERS);
export const useCustomers = () => useDataService('customers', []);
export const useBranches = () => useDataService('branches', INITIAL_BRANCHES);
export const useAppointments = () => useDataService('appointments', []);
export const useServices = () => useDataService('services', INITIAL_SERVICES);
