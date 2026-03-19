import React, { useState } from 'react';
import { useServices } from './data';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import Modal from './Modal';

const ServicesManagement = () => {
    const [services, { addItem, updateItem, deleteItem }] = useServices();
    const { isDarkMode } = useTheme();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Barber Shop',
        price: '',
        desc: '',
        tag: '',
        disabled: false,
        priceIsVariable: false
    });

    const categories = ["Barber Shop", "Music Studio"];

    const handleEdit = (service) => {
        setCurrentService(service);
        setFormData({
            name: service.name,
            category: service.category,
            price: service.price,
            desc: service.desc,
            tag: service.tag || '',
            disabled: service.disabled || false,
            priceIsVariable: service.priceIsVariable || false
        });
        setIsModalOpen(true);
    };

    const sanitize = (text) => {
        if (typeof text !== 'string') return text;
        return text.replace(/<[^>]*>?/gm, '');
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            name: sanitize(formData.name),
            desc: sanitize(formData.desc),
            price: parseFloat(formData.price) || 0
        };

        try {
            if (currentService) {
                updateItem(currentService.id, payload);
                addToast('Servicio actualizado', 'success');
            } else {
                addItem(payload);
                addToast('Servicio creado correctamente', 'success');
            }
            setIsModalOpen(false);
        } catch (e) {
            addToast('Error al guardar el servicio', 'error');
        }
    };

    const confirmDelete = async () => {
        if (deletingId) {
            try {
                await deleteItem(deletingId);
                addToast('Servicio eliminado', 'success');
                setDeletingId(null);
            } catch (e) {
                addToast('Error al eliminar', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Menú de Servicios</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Define el arsenal de Barrakesh y ajusta precios.</p>
                </div>
                <button
                    onClick={() => { setCurrentService(null); setFormData({ name: '', category: 'Barber Shop', price: '', desc: '', tag: '', disabled: false }); setIsModalOpen(true); }}
                    className="ios-button bg-primary text-black px-6 py-3 font-bold text-xs tracking-tight hover:bg-black hover:text-white transition-all shadow-lg w-full md:w-auto"
                >
                    <span className="material-symbols-outlined !text-lg mr-2">add</span>
                    Nuevo Servicio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                    <div key={service.id} className={`ios-card p-5 group flex flex-col transition-all duration-300 ${service.disabled ? 'opacity-50' : 'hover:scale-[1.01]'}`}>
                        {/* Service Card Content */}
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-black/5 border-black/10 text-black/60'}`}>
                                {service.category}
                            </span>
                            <div className="flex gap-2">
                                {service.tag && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary text-black uppercase tracking-widest">
                                        {service.tag}
                                    </span>
                                )}
                                {service.disabled && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500 text-white uppercase tracking-widest">
                                        Inactivo
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-xl font-bold tracking-tighter uppercase">{service.name}</h3>
                            <span className="text-2xl font-display text-primary">{service.priceIsVariable ? 'Desde ' : ''}${service.price}</span>
                        </div>

                        <p className={`text-xs font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                            {service.desc}
                        </p>

                        <div className="mt-auto flex gap-2">
                            <button
                                onClick={() => handleEdit(service)}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${isDarkMode ? 'bg-white/5 hover:bg-primary hover:text-black' : 'bg-black/5 hover:bg-black hover:text-white'}`}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => setDeletingId(service.id)}
                                className="size-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <span className="material-symbols-outlined !text-base">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div
                    className={`relative ios-card p-8 w-full max-w-lg animate-scale-in border-white/10 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'} ${!isDarkMode ? 'shadow-2xl' : ''}`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{currentService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className={`size-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                            <span className={`material-symbols-outlined text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>close</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full ios-input py-2.5 px-3 appearance-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Nombre del Servicio</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Precio ($)</label>
                                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Descripción</label>
                            <textarea
                                rows="3"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                className="w-full ios-input py-2.5 px-3 resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Etiqueta (Opcional)</label>
                                <input type="text" placeholder="Popular, Nuevo, etc." value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="price-variable"
                                        checked={formData.priceIsVariable}
                                        onChange={(e) => setFormData({ ...formData, priceIsVariable: e.target.checked })}
                                        className="size-5 rounded border-white/10 accent-primary"
                                    />
                                    <label htmlFor="price-variable" className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Precio Variable (Desde)</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="serv-disabled"
                                        checked={formData.disabled}
                                        onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                                        className="size-5 rounded border-white/10 accent-primary"
                                    />
                                    <label htmlFor="serv-disabled" className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Desactivar</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full h-12 bg-primary text-black rounded-xl font-bold mt-8 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                        onClick={handleSave}
                    >
                        {currentService ? 'Guardar Cambios' : 'Agregar Servicio'}
                    </button>
                </div>
            </Modal>

            {/* Deletion Confirm */}
            <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)}>
                <div className={`ios-card p-8 border-2 max-w-sm ${isDarkMode ? 'border-red-500/20 bg-[#0a0a0a]' : 'border-red-500/10 bg-white'}`}>
                    <div className="flex flex-col items-center text-center">
                        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                            <span className="material-symbols-outlined !text-4xl">warning</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">¿Eliminar Servicio?</h3>
                        <p className={`text-xs mb-8 ${isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                            Esta acción borrará el servicio del menú permanentemente.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setDeletingId(null)} className={`flex-1 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}>Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 h-12 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20">Eliminar</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ServicesManagement;
