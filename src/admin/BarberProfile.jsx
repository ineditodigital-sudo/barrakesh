import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useBarbers, useBranches, useAppointments, fileToBase64 } from './data';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';

const BarberProfile = () => {
    const { user, changePassword } = useAuth();
    const { isDarkMode } = useTheme();
    const { addToast } = useToast();
    const [barbers, { updateItem }] = useBarbers();
    const [branches] = useBranches();
    const [appointments] = useAppointments();

    const [newPassword, setNewPassword] = useState('');
    const [updatingPass, setUpdatingPass] = useState(false);

    const handlePassUpdate = async () => {
        if (!newPassword || newPassword.length < 6) {
            addToast('La nueva contraseña debe tener al menos 6 caracteres', 'info');
            return;
        }
        setUpdatingPass(true);
        const result = await changePassword(newPassword);
        if (result.success) {
            addToast('✅ Contraseña actualizada correctamente', 'success');
            setNewPassword('');
        } else {
            addToast(`❌ ${result.message}`, 'error');
        }
        setUpdatingPass(false);
    };


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
            addToast('Perfil actualizado correctamente', 'success');
        }
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

    const myApts = appointments.filter(a => (a.barber?.name || a.barber || "").toString().toLowerCase() === user.name.toLowerCase());

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="size-28 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative group shadow-xl">
                    {formData.image ? (
                        <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">{barberData.initials}</div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                        <span className="material-symbols-outlined text-white">upload</span>
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-black tracking-tighter">Mi Perfil Profesional</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-bold uppercase tracking-[0.2em] mt-2`}>Gestión de presencia y sedes operativas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`ios-card p-6 border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Servicios Realizados</span>
                    <div className="text-3xl font-black mt-2 text-primary">{myApts.length}</div>
                </div>
                <div className={`ios-card p-6 border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Sedes Activas</span>
                    <div className={`text-3xl font-black mt-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{formData.workedBranches.length}</div>
                </div>
                <div className={`ios-card p-6 border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Calificación Promedio</span>
                    <div className={`text-3xl font-black mt-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>4.9 <span className="material-symbols-outlined text-primary !text-2xl">star_rate</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`ios-card p-8 border space-y-6 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <h3 className={`text-lg font-black tracking-tight border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>Información Operativa</h3>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Nombre Público</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full ios-input font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Especialidad</label>
                            <input type="text" value={formData.spec} onChange={(e) => setFormData({ ...formData, spec: e.target.value })} className="w-full ios-input font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Contacto Directo</label>
                            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full ios-input font-bold" />
                        </div>
                    </div>
                </div>

                <div className={`ios-card p-8 border space-y-6 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                    <h3 className={`text-lg font-black tracking-tight border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>Asignación de Sedes</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Sedes que tienes habilitadas para laborar.</p>
                    <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[300px] no-scrollbar pr-1">
                        {branches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => toggleBranch(b.id)}
                                className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${formData.workedBranches.includes(b.id)
                                    ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/5'
                                    : isDarkMode ? 'bg-white/5 border-white/5 text-white/20' : 'bg-black/5 border-black/5 text-black/20'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{b.name}</span>
                                    <span className="text-[9px] font-medium mt-2 opacity-60 italic">{b.addr}</span>
                                </div>
                                {formData.workedBranches.includes(b.id) && <span className="material-symbols-outlined !text-lg">verified</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`ios-card p-8 border space-y-6 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <h3 className={`text-lg font-black tracking-tight border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>Seguridad de la Cuenta</h3>
                <div className="space-y-4">
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="space-y-2 flex-1 w-full">
                                <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full ios-input font-bold"
                                    placeholder="Mínimo 6 caracteres..."
                                />
                            </div>
                            <button
                                onClick={handlePassUpdate}
                                disabled={updatingPass}
                                className={`px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto ${isDarkMode ? 'bg-primary text-black hover:scale-105 active:scale-95' : 'bg-black text-white hover:bg-primary-dark shadow-lg'}`}
                            >
                                {updatingPass ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-end p-4">
                <button
                    onClick={handleSave}
                    className="ios-button bg-primary text-black px-12 py-4 font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] shadow-2xl shadow-primary/20 active:scale-95 transition-all"
                >
                    Actualizar Perfil
                </button>
            </div>
        </div>
    );
};

export default BarberProfile;
