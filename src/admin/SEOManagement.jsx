import React, { useState, useEffect } from 'react';
import { useSettings, fileToBase64 } from './data';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';


const SEOManagement = () => {
    const { user, changePassword } = useAuth();
    const [settings, { updateSettings, loading, error }] = useSettings();
    const { isDarkMode } = useTheme();
    const toast = useToast();

    const [newPass, setNewPass] = useState('');
    const [changingPass, setChangingPass] = useState(false);

    const handlePassUpdate = async () => {
        if (newPass.length < 6) {
            toast.addToast('La clave debe tener al menos 6 caracteres', 'info');
            return;
        }
        setChangingPass(true);
        const res = await changePassword(newPass);
        if (res.success) {
            toast.addToast('Contraseña actualizada correctamente', 'success');
            setNewPass('');
        } else {
            toast.addToast(`${res.message}`, 'error');
        }
        setChangingPass(false);
    };

    const [formData, setFormData] = useState({
        siteName: '',
        siteTitle: '',
        siteDesc: '',
        ogImage: '',
        favicon: '',
        maintenance_mode: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, [name]: base64 }));
        }
    };

    const sanitize = (text) => {
        if (typeof text !== 'string') return text;
        return text.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const sanitizedData = {
                ...formData,
                siteName: sanitize(formData.siteName),
                siteTitle: sanitize(formData.siteTitle),
                siteDesc: sanitize(formData.siteDesc)
            };
            await updateSettings(sanitizedData);
            toast.addToast('Configuración SEO actualizada correctamente.', 'success');
        } catch (error) {
            console.error(error);
            toast.addToast('Error al guardar la configuración.', 'error');
        }

        setSaving(false);
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className={`size-12 border-4 border border-t-transparent animate-spin rounded-full border-primary`}></div>
        </div>
    );

    if (error) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center p-8">
            <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <span className="material-symbols-outlined !text-4xl">
                    {error.type === 'CONNECTION' ? 'wifi_off' : 'warning'}
                </span>
            </div>
            <h2 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {error.type === 'CONNECTION' ? 'Error de Conexión' : 'Error de Configuración'}
            </h2>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest max-w-sm mb-8 leading-relaxed">
                {error.message}
            </p>
            <button
                onClick={() => window.location.reload()}
                className="bg-primary text-black px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
                Reintentar Carga
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
            <div>
                <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>SEO & Configuración</h1>
                <p className={`${isDarkMode ? 'text-white/40' : 'text-black/60'} text-[11px] font-bold mt-1 uppercase tracking-widest`}>Controla cómo se ve Barrakesh en internet.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Meta Information */}
                <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-white/5 bg-[#0a0a0a]' : 'border-black/5 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <span className="material-symbols-outlined !text-xl">public</span>
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Meta Etiquetas</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Nombre del Sitio</label>
                            <input
                                name="siteName"
                                value={formData.siteName}
                                onChange={handleChange}
                                className={`w-full h-12 px-4 rounded-xl border font-bold text-sm outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-primary text-white' : 'bg-black/5 border-black/10 focus:border-black text-black'}`}
                                placeholder="Ej: Barrakesh"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Título de Navegador (Title Tag)</label>
                            <input
                                name="siteTitle"
                                value={formData.siteTitle}
                                onChange={handleChange}
                                className={`w-full h-12 px-4 rounded-xl border font-bold text-sm outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-primary text-white' : 'bg-black/5 border-black/10 focus:border-black text-black'}`}
                                placeholder="Ej: Barrakesh | Barbería & Studio"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Meta Descripción</label>
                            <textarea
                                name="siteDesc"
                                value={formData.siteDesc}
                                onChange={handleChange}
                                className={`w-full h-32 p-4 rounded-xl border font-bold text-sm outline-none transition-all resize-none ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-primary text-white' : 'bg-black/5 border-black/10 focus:border-black text-black'}`}
                                placeholder="Escribe una descripción atractiva para los buscadores..."
                            />
                            <p className="text-[9px] text-white/20 uppercase font-bold text-right">{formData.siteDesc?.length || 0} / 160 caracteres</p>
                        </div>

                        {/* MAINTENANCE MODE TOGGLE */}
                        <div className={`p-4 rounded-2xl border-2 transition-all ${formData.maintenance_mode ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${formData.maintenance_mode ? 'bg-primary text-black' : 'bg-white/5 text-white/20'}`}>
                                        <span className="material-symbols-outlined !text-xl">{formData.maintenance_mode ? 'engineering' : 'public'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-tight">Modo Mantenimiento</h3>
                                        <p className="text-[9px] opacity-40 uppercase font-bold">Activa el banner de "En Construcción"</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.maintenance_mode ? 'bg-primary' : 'bg-white/10'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Password Change for Super Admin */}
                    <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-white/5 bg-[#0a0a0a]' : 'border-black/5 bg-white shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                <span className="material-symbols-outlined !text-xl">lock</span>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Seguridad de Acceso</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Nueva Contraseña</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        className={`w-full h-12 px-4 rounded-xl border font-bold text-sm outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-primary text-white' : 'bg-black/5 border-black/10 focus:border-black text-black'}`}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        disabled={changingPass || !newPass}
                                        onClick={handlePassUpdate}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-black px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                                    >
                                        {changingPass ? '...' : 'Actualizar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OG Image */}
                    <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-white/5 bg-[#0a0a0a]' : 'border-black/5 bg-white shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <span className="material-symbols-outlined !text-xl">share</span>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Imagen Compartida (OG)</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className={`aspect-video w-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                {formData.ogImage ? (
                                    <img src={formData.ogImage} alt="OG" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined !text-4xl opacity-20">image</span>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="bg-primary text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all">
                                        Subir Miniatura
                                        <input type="file" name="ogImage" onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[9px] text-white/30 uppercase font-bold leading-relaxed">
                                    Miniatura para WhatsApp/Facebook. <br />
                                    <span className="text-primary italic animate-pulse">* Sugerencia: Si no sale en WhatsApp, usa una imagen pequeña (menor a 300KB).</span>
                                </p>

                                <input
                                    name="ogImage"
                                    value={formData.ogImage}
                                    onChange={handleChange}
                                    className={`w-full h-10 px-4 rounded-lg border font-mono text-[9px] outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40 focus:text-white' : 'bg-black/5 border-black/10 text-black/40'}`}
                                    placeholder="O pega link directo (https://...)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Favicon */}
                    <div className={`ios-card p-8 border-2 ${isDarkMode ? 'border-white/5 bg-[#0a0a0a]' : 'border-black/5 bg-white shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <span className="material-symbols-outlined !text-xl">tab</span>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Favicon</h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className={`size-16 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group shrink-0 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                {formData.favicon ? (
                                    <img src={formData.favicon} alt="Favicon" className="size-full object-contain p-2" />
                                ) : (
                                    <span className="material-symbols-outlined !text-xl opacity-20">deployed_code</span>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer">
                                        <span className="material-symbols-outlined text-white !text-lg">upload</span>
                                        <input type="file" name="favicon" onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex-1">
                                <input
                                    name="favicon"
                                    value={formData.favicon}
                                    onChange={handleChange}
                                    className={`w-full h-10 px-4 rounded-lg border font-mono text-[9px] outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40 focus:text-white' : 'bg-black/5 border-black/10 text-black/40'}`}
                                    placeholder="Link o base64..."
                                />
                                <p className="text-[9px] text-white/30 uppercase font-bold mt-2">Recomendado: 32x32px</p>
                            </div>
                        </div>
                    </div>

                    {/* Google Search Preview */}
                    <div className={`ios-card p-6 border ${isDarkMode ? 'bg-white/[0.01] border-white/10' : 'bg-[#f8f8f8] border-black/5 shadow-inner'}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-3 block">Vista Previa Google</span>
                        <div className="space-y-1.5 overflow-hidden">
                            <div className="text-[#1a0dab] text-lg font-medium truncate group-hover:underline">{formData.siteTitle || 'Barrakesh'}</div>
                            <div className="text-[#006621] text-xs truncate">{window.location.hostname} › reserva</div>
                            <div className="text-[#545454] text-xs line-clamp-2 leading-relaxed">
                                {formData.siteDesc || 'Barbería y Studio.'}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-black px-12 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                        >
                            {saving ? (
                                <div className="size-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined !text-xl font-bold">save</span>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SEOManagement;
