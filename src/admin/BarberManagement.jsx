import React, { useState } from 'react';
import { useBarbers, useBranches } from './data';

const BarberManagement = () => {
    const [barbers, { addItem, updateItem, deleteItem }] = useBarbers();
    const [branches] = useBranches();
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

    const toggleBranch = (branchId) => {
        setFormData(prev => ({
            ...prev,
            workedBranches: prev.workedBranches.includes(branchId)
                ? prev.workedBranches.filter(id => id !== branchId)
                : [...prev.workedBranches, branchId]
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Gestión de profesionales y asignación de sedes.</p>
                </div>
                <button
                    onClick={() => { setCurrentBarber(null); setFormData({ name: '', spec: '', phone: '', status: 'Activo', image: '', workedBranches: [] }); setIsModalOpen(true); }}
                    className="ios-button bg-primary text-black px-6 py-3 font-bold text-xs tracking-tight hover:bg-white transition-all shadow-lg shadow-primary/5"
                >
                    <span className="material-symbols-outlined !text-lg mr-2">add</span>
                    Nuevo Especialista
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className="ios-card bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="size-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                                {barber.image ? (
                                    <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">{barber.initials}</div>
                                )}
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${barber.status === 'Activo' ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white/40'}`}>
                                {barber.status}
                            </span>
                        </div>

                        <h3 className="text-base font-bold tracking-tight mb-0.5">{barber.name}</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight mb-4">{barber.spec}</p>

                        <div className="space-y-2 py-3 border-t border-white/5 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/20 !text-sm">call</span>
                                <span className="text-[11px] font-semibold text-white/60">{barber.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/20 !text-sm">location_on</span>
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
                                className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-white/10 transition-all uppercase tracking-widest"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative ios-card bg-[#121212] p-6 w-full max-w-lg animate-scale-in shadow-2xl border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight">{currentBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estatus</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full ios-input py-2.5 px-3 appearance-none">
                                        <option>Activo</option>
                                        <option>Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Especialidad</label>
                                <input type="text" value={formData.spec} onChange={(e) => setFormData({ ...formData, spec: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Imagen URL</label>
                                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full ios-input py-2.5 px-3" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Teléfono</label>
                                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full ios-input py-2.5 px-3" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sedes Asignadas</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {branches.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => toggleBranch(b.id)}
                                            className={`p-3 rounded-xl border text-[10px] font-bold transition-all text-left flex justify-between items-center ${formData.workedBranches.includes(b.id)
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-white/5 border-white/5 text-white/40'
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
                            className="w-full h-12 bg-primary text-black rounded-xl font-bold mt-8 hover:scale-[1.02] active:scale-95 transition-all text-xs"
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
