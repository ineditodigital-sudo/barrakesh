import React, { useState } from 'react';
import { useBarbers, useBranches, fileToBase64 } from './data';
import { useTheme } from './ThemeContext';

const BarberManagement = () => {
    const [barbers, { addItem, updateItem, deleteItem }] = useBarbers();
    const [branches] = useBranches();
    const { isDarkMode } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBarber, setCurrentBarber] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        spec: '',
        phone: '',
        status: 'Activo',
        image: '',
        workedBranches: []
    });

    const handleEdit = (barber) => {
        setCurrentBarber(barber);
        setFormData({
            name: barber.name,
            spec: barber.spec,
            phone: barber.phone,
            status: barber.status,
            image: barber.image || '',
            workedBranches: barber.workedBranches || []
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            initials: formData.name.substring(0, 2).toUpperCase()
        };

        if (currentBarber) {
            updateItem(currentBarber.id, payload);
        } else {
            addItem(payload);
        }
        setIsModalOpen(false);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setFormData(prev => ({ ...prev, image: base64 }));
            } catch (err) {
                console.error("Error converting image:", err);
            }
        }
    };

    const toggleBranch = (branchId) => {
        setFormData(prev => ({
            ...prev,
            workedBranches: prev.workedBranches.includes(branchId)
                ? prev.workedBranches.filter(id => id !== branchId)
                : [...prev.workedBranches, branchId]
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión de profesionales y asignación de sedes.</p>
                </div>
                <button
                    onClick={() => { setCurrentBarber(null); setFormData({ name: '', spec: '', phone: '', status: 'Activo', image: '', workedBranches: [] }); setIsModalOpen(true); }}
                    className="ios-button bg-primary text-black px-6 py-3 font-bold text-xs tracking-tight hover:bg-black hover:text-white transition-all shadow-lg w-full md:w-auto"
                >
                    <span className="material-symbols-outlined !text-lg mr-2">add</span>
                    Nuevo Especialista
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className="ios-card p-4 hover:scale-[1.01] transition-all duration-300 group flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="size-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center">
                                {barber.image ? (
                                    <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">{barber.initials}</div>
                                )}
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${barber.status === 'Activo'
                                ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                : 'bg-red-500/10 text-red-500 border-red-500/10'
                                }`}>
                                {barber.status}
                            </span>
                        </div>

                        <h3 className="text-base font-bold tracking-tight mb-0.5">{barber.name}</h3>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[10px] font-bold uppercase tracking-tight mb-4`}>{barber.spec}</p>

                        <div className={`space-y-2 py-3 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'} mb-4`}>
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/20' : 'text-black/20'} !text-sm`}>call</span>
                                <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>{barber.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/20' : 'text-black/20'} !text-sm`}>location_on</span>
                                <div className="flex flex-wrap gap-1">
                                    {barber.workedBranches?.map(bid => {
                                        const b = branches.find(x => x.id === bid);
                                        return b ? <span key={bid} className="text-[9px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-white/40">{b.name}</span> : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-2">
                            <button
                                onClick={() => handleEdit(barber)}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${isDarkMode ? 'bg-white/5 hover:bg-primary hover:text-black' : 'bg-black/5 hover:bg-black hover:text-white'
                                    }`}
                            >
                                Perfil
                            </button>
                            <button
                                onClick={() => { if (window.confirm('¿Eliminar?')) deleteItem(barber.id); }}
                                className="size-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <span className="material-symbols-outlined !text-base">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className={`relative ios-card p-6 w-full max-w-lg animate-scale-in border-white/10 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight">{currentBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className={`size-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
                            {/* Image Choice */}
                            <div className="flex flex-col items-center gap-4 py-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="size-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group shadow-inner">
                                    {formData.image ? (
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/10">?</div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                        <span className="material-symbols-outlined">upload</span>
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

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Sedes Asignadas</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {branches.map(b => (
                                        <button
                                            key={b.id}
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
                </div>
            )}
        </div>
    );
};

export default BarberManagement;
