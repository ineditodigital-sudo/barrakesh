// Shared mock data for Barrakesh Admin Panel
import { useState, useEffect } from 'react';

const INITIAL_BARBERS = [
    {
        id: 1,
        name: "Pedro",
        spec: "Master Barber /// Fade Expert",
        status: "Activo",
        phone: "449 123 4567",
        initials: "PD",
        image: "https://images.unsplash.com/photo-1503460293676-4d2be411cca0?auto=format&fit=crop&q=80&w=400",
        workedBranches: [1, 2]
    },
    {
        id: 2,
        name: "Carlos",
        spec: "Senior /// Classic Cuts",
        status: "Activo",
        phone: "449 234 5678",
        initials: "CR",
        image: "https://images.unsplash.com/photo-1520338661039-414804804437?auto=format&fit=crop&q=80&w=400",
        workedBranches: [1]
    },
    {
        id: 3,
        name: "Fabian",
        spec: "Creative Stylist",
        status: "Inactivo",
        phone: "449 345 6789",
        initials: "FB",
        image: "https://images.unsplash.com/photo-1533689476487-034f57831a58?auto=format&fit=crop&q=80&w=400",
        workedBranches: [3]
    },
    {
        id: 4,
        name: "Jose Luis",
        spec: "Artist /// Beard Sculpting",
        status: "Activo",
        phone: "449 456 7890",
        initials: "JL",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        workedBranches: [2, 3]
    },
];

const INITIAL_CUSTOMERS = [
    { id: 1, name: "Alejandro Villalobos", phone: "449 123 4567", email: "alex@mail.com", lastVisit: "02 Mar 2026", totalSpent: "$1,200", loyalty: "Gold" },
    { id: 2, name: "Sarah Juarez", phone: "449 234 5678", email: "sarah@mail.com", lastVisit: "28 Feb 2026", totalSpent: "$850", loyalty: "Silver" },
    { id: 3, name: "Mark Kasarov", phone: "449 345 6789", email: "mark@mail.com", lastVisit: "25 Feb 2026", totalSpent: "$2,400", loyalty: "Platinum" },
];

const INITIAL_BRANCHES = [
    { id: 1, name: "CENTRO", addr: "Madero 234", status: "Operativo", capacity: "6 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1599351431247-f10bc93d0187?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "PULGAS PANDAS", addr: "Univ. 1001", status: "Operativo", capacity: "4 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "ALTARIA", addr: "Blvd. Zacatecas", status: "Mantenimiento", capacity: "8 sillas", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" },
];

const INITIAL_APPOINTMENTS = [
    { id: "BK-8821", date: "2026-03-02", time: "16:30", client: "Alejandro V.", service: "Fade a Navaja", barber: "Pedro", branch: "Centro", total: "$35.00", status: "Confirmado" },
    { id: "BK-8820", date: "2026-03-02", time: "14:00", client: "Luna M.", service: "Completo", barber: "Jax", branch: "Altaria", total: "$60.00", status: "Finalizado" },
];

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const useDataService = (key, initialData) => {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(`barrakesh_${key}`);
        return saved ? JSON.parse(saved) : initialData;
    });

    useEffect(() => {
        localStorage.setItem(`barrakesh_${key}`, JSON.stringify(data));
    }, [data, key]);

    const addItem = (item) => setData(prev => [...prev, { ...item, id: Date.now() }]);
    const updateItem = (id, updated) => setData(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
    const deleteItem = (id) => setData(prev => prev.filter(item => item.id !== id));

    return [data, { addItem, updateItem, deleteItem }];
};

export const useBarbers = () => useDataService('barbers', INITIAL_BARBERS);
export const useCustomers = () => useDataService('customers', INITIAL_CUSTOMERS);
export const useBranches = () => useDataService('branches', INITIAL_BRANCHES);
export const useAppointments = () => useDataService('appointments', INITIAL_APPOINTMENTS);
