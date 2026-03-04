import React, { useState } from 'react';
import { useBarbers, useBranches, fileToBase64 } from './data';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import Modal from './Modal';

const BarberManagement = () => {
    const [barbers, { addItem, updateItem, deleteItem }] = useBarbers();
    const [branches] = useBranches();
    const { isDarkMode } = useTheme();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBarber, setCurrentBarber] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        spec: '',
        status: 'Activo',
        phone: '',
        workedBranches: [],
        image: ''
    });

    const handleEdit = (barber) => {
        setCurrentBarber(barber);
        setFormData({
            name: barber.name,
            spec: barber.spec,
            status: barber.status,
            phone: barber.phone,
            workedBranches: barber.workedBranches || [],
            image: barber.image || ''
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
            spec: sanitize(formData.spec),
            initials: formData.name.substring(0, 2).toUpperCase()
        };

        try {
            if (currentBarber) {
                updateItem(currentBarber.id, payload);
                addToast('✅ Registro de barbero actualizado', 'success');
            } else {
                addItem(payload);
                addToast('✅ Nuevo barbero dado de alta', 'success');
            }
            setIsModalOpen(false);
        } catch (e) {
            addToast('❌ Error al guardar el registro', 'error');
        }
    };

    const confirmDelete = async () => {
        if (deletingId) {
            try {
                await deleteItem(deletingId);
                addToast('✅ Registro eliminado correctamente', 'success');
                setDeletingId(null);
            } catch (e) {
                addToast('❌ Error al eliminar el registro', 'error');
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setFormData({ ...formData, image: base64 });
        }
    };

    const toggleBranch = (id) => {
        setFormData(prev => ({
            ...prev,
            workedBranches: prev.workedBranches.includes(id)
                ? prev.workedBranches.filter(bid => bid !== id)
                : [...prev.workedBranches, id]
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Staff de Barberos</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Control de especialistas, sedes y disponibilidad.</p>
                </div>
                <button
                    onClick={() => { setCurrentBarber(null); setFormData({ name: '', spec: '', status: 'Activo', phone: '', workedBranches: [], image: '' }); setIsModalOpen(true); }}
                    className="ios-button bg-primary text-black px-6 py-3 font-bold text-xs tracking-tight hover:bg-black hover:text-white transition-all shadow-lg w-full md:w-auto"
                >
                    <span className="material-symbols-outlined !text-lg mr-2">person_add</span>
                    Nuevo Miembro
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className={`ios-card p-5 group flex flex-col transition-all duration-300 hover:scale-[1.01] ${barber.status === 'Inactivo' ? 'opacity-50' : ''}`}>
                        {/* Barber Card Content */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="size-16 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shrink-0">
                                {barber.image ? (
                                    <img src={barber.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-xl text-primary">{barber.initials}</div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-bold tracking-tight truncate uppercase leading-tight mb-1">{barber.name}</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDarkMode ? 'text-white/40' : 'text-black/60'}`}>{barber.spec}</p>
                                <span className={`inline-block mt-2 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${barber.status === 'Activo' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {barber.status}
                                </span>
                            </div>
                        </div>

                        <div className={`p-3 rounded-xl mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/40'}`}>Sucursales</span>
                                <span className="text-[10px] font-bold">{barber.workedBranches?.length || 0} sedes</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {barber.workedBranches?.map(bid => (
                                    <div key={bid} className="size-5 rounded bg-primary/20 flex items-center justify-center text-[9px] font-black text-primary">
                                        {bid}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex gap-2">
                            <button
                                onClick={() => handleEdit(barber)}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${isDarkMode ? 'bg-white/5 hover:bg-primary hover:text-black' : 'bg-black/5 hover:bg-black hover:text-white'}`}
                            >
                                Gestionar
                            </button>
                            <button
                                onClick={() => setDeletingId(barber.id)}
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
                    className={`relative ios-card p-6 w-full max-w-lg animate-scale-in border-white/10 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'} ${!isDarkMode ? 'shadow-2xl' : ''}`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{currentBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className={`size-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                            <span className={`material-symbols-outlined text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>close</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Image Choice */}
                        <div className="flex flex-col items-center gap-4 py-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="size-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group shadow-inner">
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/10">?</div>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                    <span className="material-symbols-outlined text-white">upload</span>
                                    <span className="text-[8px] font-bold uppercase mt-1 text-white">Subir Foto</span>
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                </label>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Avatar del Especialista</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Nombre</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Estatus</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full ios-input py-2.5 px-3 appearance-none">
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Especialidad</label>
                            <input type="text" value={formData.spec} onChange={(e) => setFormData({ ...formData, spec: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Teléfono</label>
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-primary' : 'text-black/60'}`}>Credenciales de Acceso</h4>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-tight">Login ID</span>
                                        <span className="text-[10px] opacity-40 italic">{formData.name.toLowerCase().replace(/\s+/g, '')}@barrakesh.com</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addToast(`📧 Solicitud enviada. Firebase enviará un correo de recuperación a la cuenta del barbero.`, 'info')}
                                        className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                                    >
                                        Solicitar Cambio
                                    </button>
                                </div>
                                <p className="text-[9px] font-bold text-white/20 italic">Acceso restringido a rol: BARBERO</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Sedes Asignadas</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {branches.map(b => (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => toggleBranch(b.id)}
                                        className={`p-3 rounded-xl border text-[10px] font-bold transition-all text-left flex justify-between items-center ${formData.workedBranches.includes(b.id)
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : isDarkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-black/5 border-black/5 text-black/40'
                                            }`}
                                    >
                                        {b.name}
                                        {formData.workedBranches.includes(b.id) && <span className="material-symbols-outlined !text-sm">check_circle</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full h-12 bg-primary text-black rounded-xl font-bold mt-8 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                        onClick={handleSave}
                    >
                        {currentBarber ? 'Actualizar Registro' : 'Dar de Alta'}
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
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">¿Eliminar Staff?</h3>
                        <p className={`text-xs mb-8 ${isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                            Esta acción borrará el registro del barbero permanentemente. No se pueden deshacer los cambios.
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

export default BarberManagement;
