import React, { useState } from 'react';
import { useBranches } from './data';

const BranchesManagement = () => {
    const [branches, { addItem, updateItem, deleteItem }] = useBranches();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        addr: '',
        city: 'Aguascalientes',
        status: 'Operativo',
        capacity: '0 sillas',
        image: ''
    });

    const handleEdit = (branch) => {
        setCurrentBranch(branch);
        setFormData({ ...branch });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (currentBranch) {
            updateItem(currentBranch.id, formData);
        } else {
            addItem(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sucursales</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Gestión de sedes físicas e inmobiliario.</p>
                </div>
                <button
                    onClick={() => { setCurrentBranch(null); setFormData({ name: '', addr: '', city: 'Aguascalientes', status: 'Operativo', capacity: '2 sillas', image: '' }); setIsModalOpen(true); }}
                    className="ios-button bg-primary text-black px-6 py-3 font-bold text-xs tracking-tight hover:bg-white transition-all shadow-lg"
                >
                    <span className="material-symbols-outlined !text-lg mr-2">add_location</span>
                    Nueva Sucursal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map(branch => (
                    <div key={branch.id} className="ios-card bg-white/[0.02] p-4 flex gap-4 hover:bg-white/[0.04] transition-all duration-300 group">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative shrink-0">
                            {branch.image ? (
                                <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/10 !text-3xl">storefront</span>
                                </div>
                            )}
                            <div className="absolute top-1 right-1">
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${branch.status === 'Operativo' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                                    }`}>{branch.status}</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <h3 className="text-base font-bold tracking-tight mb-0.5">{branch.name}</h3>
                                <p className="text-[10px] text-white/40 font-medium mb-3">{branch.addr} — {branch.city}</p>

                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Capacidad</span>
                                        <p className="text-[10px] font-bold text-white/60">{branch.capacity}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">ID Interno</span>
                                        <p className="text-[10px] font-bold text-white/60">BK-{branch.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(branch)}
                                    className="flex-1 h-8 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Configurar
                                </button>
                                <button
                                    onClick={() => { if (window.confirm('¿Eliminar sede?')) deleteItem(branch.id); }}
                                    className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined !text-base">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative ios-card bg-[#121212] p-6 w-full max-w-lg animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight">{currentBranch ? 'Ajustes de Sede' : 'Alta de Sucursal'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input py-2 px-3" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estatus</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full ios-input py-2 px-3 appearance-none">
                                        <option>Operativo</option>
                                        <option>Mantenimiento</option>
                                        <option>Cerrado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Dirección</label>
                                <input type="text" value={formData.addr} onChange={(e) => setFormData({ ...formData, addr: e.target.value })} className="w-full ios-input py-2 px-3" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Capacidad</label>
                                    <input type="text" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full ios-input py-2 px-3" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ciudad</label>
                                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full ios-input py-2 px-3" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Imagen URL</label>
                                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full ios-input py-2 px-3" />
                            </div>
                        </div>

                        <button className="w-full h-12 bg-primary text-black rounded-xl font-bold mt-8 text-xs" onClick={handleSave}>
                            {currentBranch ? 'Guardar Cambios' : 'Registrar Sucursal'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchesManagement;
