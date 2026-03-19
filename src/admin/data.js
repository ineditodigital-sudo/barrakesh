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
    { id: 'b1', name: "Torny", spec: "Master Barber", status: "Activo", phone: "", initials: "TR", workedBranches: [1], image: "https://images.unsplash.com/photo-1503460293676-4d2be411cca0?auto=format&fit=crop&q=80&w=400" },
    { id: 'b2', name: "Ricardo", spec: "Master Barber", status: "Activo", phone: "", initials: "RC", workedBranches: [1], image: "https://images.unsplash.com/photo-1520338661039-414804804437?auto=format&fit=crop&q=80&w=400" }
];

const INITIAL_SERVICES = [
    { id: 's1', category: "Barber Shop", name: "Paquete Pro", price: 250, desc: "Cabello + Barba", tag: "Pack" },
    { id: 's2', category: "Barber Shop", name: "Paquete Élite", price: 300, desc: "Cabello + Barba + Ceja", tag: "Estelar" },
    { id: 's3', category: "Barber Shop", name: "Corte de cabello", price: 180, desc: "Corte clásico o moderno." },
    { id: 's4', category: "Barber Shop", name: "Corte de barba", price: 100, desc: "Afeitado clásico y delineado." },
    { id: 's5', category: "Barber Shop", name: "Diseño de ceja", price: 80, desc: "Delineado con navaja." },
    { id: 's6', category: "Barber Shop", name: "Diseño de grecas", price: 80, desc: "Líneas o figuras personalizadas." },
    { id: 's7', category: "Barber Shop", name: "Corte infantil", price: 150, desc: "Hasta 12 años." },
    { id: 's8', category: "Music Studio", name: "Grabación (2 horas)", price: 450, desc: "Renta de cabina por 2 horas.", tag: "Pro" },
    { id: 's9', category: "Music Studio", name: "Instrumentales personalizadas", price: 450, desc: "Beat único a tu medida." },
    { id: 's10', category: "Music Studio", name: "Mezcla", price: 350, desc: "Balance y ecualización de tus tracks." },
    { id: 's11', category: "Music Studio", name: "Mastering", price: 350, desc: "Volumen comercial y calidad listos." },
    { id: 's12', category: "Music Studio", name: "Video", price: 1000, desc: "Producción de video musical o sesión." }
];

const INITIAL_BRANCHES = [
    { id: 1, name: "MATRIZ", addr: "C. Parras 72-local 4, Bosques del Prado Oriente, 20159 Aguascalientes, Ags.", status: "Operativo", capacity: "Matriz + Music Studio", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1599351431247-f10bc93d0187?auto=format&fit=crop&q=80&w=800", hours: "Lunes a Sábado de 11:00 am a 8:00 pm", note: "En esta ubicación se encuentra nuestro Barrakesh Music Studio", activeDays: [1, 2, 3, 4, 5, 6], openTime: "11:00", closeTime: "20:00" },
    { id: 2, name: "PLAZA SANTA FE", addr: "Dentro del gimnasio LVDVS (Av. Universidad 811, Bosques del Prado Sur, 20130 Aguascalientes, Ags.)", status: "Próxima Apertura", capacity: "Próximamente", city: "Aguascalientes", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800", activeDays: [1, 2, 3, 4, 5, 6], openTime: "11:00", closeTime: "20:00" },
];

const EMPTY_ARRAY = [];

export const useDataService = (key, initialData) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const dataRef = ref(database, key);
        const unsubscribe = onValue(dataRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                try {
                    const normalized = Object.keys(val).reduce((acc, id) => {
                        if (val[id]) {
                            acc.push({
                                ...(typeof val[id] === 'object' ? val[id] : { value: val[id] }),
                                id: id
                            });
                        }
                        return acc;
                    }, []);
                    setData(normalized);
                    setError(null);
                } catch (e) {
                    console.error("Normalization error:", e);
                    setError({ type: 'CRITICAL', message: "Error al procesar los datos del servidor." });
                }
            } else {
                setData(EMPTY_ARRAY);
                setError({ type: 'NOT_FOUND', message: `No se encontraron datos en '${key}'. Por favor, verifica tu base de datos.` });
            }
            setLoading(false);
        }, (err) => {
            console.error(`Firebase error on ${key}:`, err);
            setError({ type: 'CONNECTION', message: "No se pudo conectar con el servidor. Revisa tu conexión." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [key]);

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

    return [data, { addItem, updateItem, deleteItem, loading, error }];
};

export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const DEFAULT_SETTINGS = {
        siteName: 'Barrakesh',
        siteTitle: 'Barrakesh | Barbería & Studio',
        siteDesc: 'Asegura tu flow en la mejor barbería y estudio de grabación. Digital Brutalism meets DIY Zine.',
        ogImage: '/LOGO-BARRAKESH-CUADRADO-TXT-BLANCO.png',
        favicon: '/favicon.ico'
    };

    useEffect(() => {
        const settingsRef = ref(database, 'settings');
        const unsubscribe = onValue(settingsRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                setSettings(val);
                setError(null);
            } else {
                setSettings(DEFAULT_SETTINGS);
                setError(null); // No error, just defaults
            }
            setLoading(false);
        }, (err) => {
            console.error("Firebase settings error:", err);
            setError({ type: 'CONNECTION', message: "Error de conexión al obtener la configuración." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateSettings = async (newSettings) => {
        const settingsRef = ref(database, 'settings');
        await set(settingsRef, newSettings);
    };

    return [settings, { updateSettings, loading, error }];
};




export const useBarbers = () => useDataService('barbers', INITIAL_BARBERS);
export const useCustomers = () => useDataService('customers', EMPTY_ARRAY);
export const useBranches = () => useDataService('branches', INITIAL_BRANCHES);
export const useAppointments = () => useDataService('appointments', EMPTY_ARRAY);
export const useServices = () => useDataService('services', INITIAL_SERVICES);

