import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                            pointer-events-auto min-w-[300px] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-in-right
                            ${t.type === 'error' ? 'bg-red-500 text-white border-red-600' :
                                t.type === 'success' ? 'bg-green-500 text-white border-green-600' :
                                    'bg-primary text-black border-primary/20'}
                        `}
                    >
                        <span className="material-symbols-outlined">
                            {t.type === 'error' ? 'cancel' : t.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t.type === 'error' ? 'Error' : t.type === 'success' ? 'Éxito' : 'Notificación'}
                            </span>
                            <p className="text-xs font-bold leading-tight mt-1">{t.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
