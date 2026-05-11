import { useState, useEffect } from 'react';

const API_BASE = '/backend';
const BK_AUTH_KEY = 'BK_SECURE_9921_X';

const getHeaders = (isJson = true) => {
    const headers = { 'X-Barrakesh-Auth': BK_AUTH_KEY };
    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
};

export const useDataService = (key) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Añadimos timestamp para evitar caché agresiva del navegador
            const res = await fetch(`${API_BASE}/api.php?action=get_initial_data&auth=${BK_AUTH_KEY}&t=${Date.now()}`, {
                headers: getHeaders(false)
            });
            
            if (!res.ok) throw new Error(`Servidor respondió con status ${res.status}`);
            
            const json = await res.json();
            
            // ESCUDO: Si la base de datos devuelve null o algo que no sea un array, evitamos el crash
            if (json && Array.isArray(json[key])) {
                setData(json[key]);
            } else if (json && json[key] && typeof json[key] === 'object') {
                // Si es un objeto (como settings), lo convertimos o lo manejamos
                setData(json[key]);
            } else {
                console.warn(`Dato no esperado para ${key}:`, json ? json[key] : 'null');
                setData([]);
            }
        } catch (err) {
            console.error(`Error cargando ${key}:`, err);
            setError(err);
            setData([]); // Evitamos que el componente explote por falta de array
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [key]);

    const addItem = async (item) => {
        const singular = key === 'branches' ? 'branch' : (key === 'barbers' ? 'barber' : (key === 'appointments' ? 'appointment' : (key === 'customers' ? 'customer' : 'service')));
        const action = `add_${singular}`;
        
        const res = await fetch(`${API_BASE}/admin_api.php?action=${action}&auth=${BK_AUTH_KEY}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(item)
        });
        
        if (!res.ok) {
            const errJson = await res.json();
            const errMsg = errJson.mensaje || errJson.error || 'Error desconocido';
            alert(`Error al guardar: ${errMsg}`);
            throw new Error(errMsg);
        }
        fetchData();
    };

    const updateItem = async (id, updated) => {
        const singular = key === 'branches' ? 'branch' : (key === 'barbers' ? 'barber' : (key === 'appointments' ? 'appointment' : (key === 'customers' ? 'customer' : 'service')));
        const action = `update_${singular}`;
        
        const res = await fetch(`${API_BASE}/admin_api.php?action=${action}&auth=${BK_AUTH_KEY}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ ...updated, id })
        });
        
        if (!res.ok) {
            const errJson = await res.json();
            alert(`Error al actualizar: ${errJson.mensaje || errJson.error}`);
            return;
        }
        fetchData();
    };

    const deleteItem = async (id) => {
        const singular = key === 'branches' ? 'branch' : (key === 'barbers' ? 'barber' : (key === 'appointments' ? 'appointment' : (key === 'customers' ? 'customer' : 'service')));
        const action = `delete_${singular}`;
        
        const res = await fetch(`${API_BASE}/admin_api.php?action=${action}&id=${id}&auth=${BK_AUTH_KEY}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ id })
        });
        
        if (!res.ok) {
            const errJson = await res.json();
            alert(`Error al eliminar: ${errJson.mensaje || errJson.error}`);
            return;
        }
        fetchData();
    };

    return [data, { addItem, updateItem, deleteItem, loading, error, refresh: fetchData }];
};

export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api.php?action=get_initial_data&auth=${BK_AUTH_KEY}&t=${Date.now()}`);
            const json = await res.json();
            if (json && json.settings) {
                setSettings(json.settings);
            } else {
                setSettings({ siteTitle: 'Barrakesh', siteName: 'Barrakesh' });
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateSettings = async (newSettings) => {
        await fetch(`${API_BASE}/admin_api.php?action=update_settings&auth=${BK_AUTH_KEY}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(newSettings)
        });
        fetchData();
    };

    return [settings, { updateSettings, loading, error, refresh: fetchData }];
};

export const useServices = () => useDataService('services');
export const useBranches = () => useDataService('branches');
export const useBarbers = () => useDataService('barbers');
export const useAppointments = () => useDataService('appointments');

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
