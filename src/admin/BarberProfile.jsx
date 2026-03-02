import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useBarbers, useBranches, useAppointments } from './data';

const BarberProfile = () => {
    const { user } = useAuth();
    const [barbers, { updateItem }] = useBarbers();
    const [branches] = useBranches();
    const [appointments] = useAppointments();

    // Find the barber record for this user
    const barberData = barbers.find(b => b.name.toLowerCase() === user.name.toLowerCase()) || {};

    const [formData, setFormData] = useState({
        name: barberData.name || '',
        spec: barberData.spec || '',
        phone: barberData.phone || '',
        image: barberData.image || '',
        workedBranches: barberData.workedBranches || []
    });

    useEffect(() => {
        if (barberData.id) {
            setFormData({
                name: barberData.name,
                spec: barberData.spec,
                phone: barberData.phone,
                image: barberData.image,
                workedBranches: barberData.workedBranches || []
            });
        }
    }, [barberData]);

    const handleSave = () => {
        if (barberData.id) {
            updateItem(barberData.id, formData);
            alert('Perfil actualizado correctamente');
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

    const myApts = appointments.filter(a => a.barber.toLowerCase() === user.name.toLowerCase());

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-6">
                <div className="size-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    {formData.image ? (
                        <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary">{barberData.initials}</div>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
                    <p className="text-white/40 text-sm font-medium mt-1">Configura tu presencia digital en el equipo Barrakesh.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="ios-card p-6 bg-white/[0.02]">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Citas Totales</span>
                    <div className="text-3xl font-bold mt-2 text-primary">{myApts.length}</div>
                </div>
                <div className="ios-card p-6 bg-white/[0.02]">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sucursales</span>
                    <div className="text-3xl font-bold mt-2 text-white">{formData.workedBranches.length}</div>
                </div>
                <div className="ios-card p-6 bg-white/[0.02]">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Rating</span>
                    <div className="text-3xl font-bold mt-2 text-white flex items-center gap-2">4.9 <span className="material-symbols-outlined text-primary !text-xl">star</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="ios-card p-8 bg-white/[0.02] space-y-6">
                    <h3 className="text-lg font-bold tracking-tight border-b border-white/5 pb-4">Información Personal</h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre Público</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Especialidad (Tagline)</label>
                            <input type="text" value={formData.spec} onChange={(e) => setFormData({ ...formData, spec: e.target.value })} className="w-full ios-input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Teléfono Contacto</label>
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full ios-input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Imagen Perfil (URL)</label>
                            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full ios-input text-xs" />
                        </div>
                    </div>
                </div>

                <div className="ios-card p-8 bg-white/[0.02] space-y-6">
                    <h3 className="text-lg font-bold tracking-tight border-b border-white/5 pb-4">Mis Sucursales</h3>
                    <p className="text-xs text-white/40">Selecciona las sedes donde prestas servicios.</p>

                    <div className="grid grid-cols-1 gap-3">
                        {branches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => toggleBranch(b.id)}
                                className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${formData.workedBranches.includes(b.id)
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/5 border-white/5 text-white/20'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest">{b.name}</span>
                                    <span className="text-[10px] opacity-60 mt-1">{b.addr}</span>
                                </div>
                                {formData.workedBranches.includes(b.id) && <span className="material-symbols-outlined">verified</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end p-4">
                <button
                    onClick={handleSave}
                    className="ios-button bg-primary text-black px-10 py-4 font-bold text-sm tracking-tight hover:scale-105 shadow-xl shadow-primary/10"
                >
                    Guardar Perfil
                </button>
            </div>
        </div>
    );
};

export default BarberProfile;
