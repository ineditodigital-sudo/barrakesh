import React, { useState } from 'react';
import { useCustomers } from './data';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import Modal from './Modal';

const CustomerManagement = () => {
    const [customers, { addItem, deleteItem }] = useCustomers();
    const [search, setSearch] = useState('');
    const { isDarkMode } = useTheme();
    const { addToast } = useToast();
    const [deletingId, setDeletingId] = useState(null);
    const [deletingName, setDeletingName] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        loyalty: 'Standard',
        lastVisit: 'N/A'
    });

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.phone) {
            addToast('Nombre y Teléfono son obligatorios', 'info');
            return;
        }
        try {
            await addItem(newCustomer);
            addToast('Miembro agregado correctamente', 'success');
            setIsAddModalOpen(false);
            setNewCustomer({
                name: '',
                phone: '',
                email: '',
                loyalty: 'Standard',
                lastVisit: 'N/A'
            });
        } catch (error) {
            addToast('Error al agregar el miembro', 'error');
        }
    };

    const handleDeleteClick = (id, name) => {
        setDeletingId(id);
        setDeletingName(name);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteItem(deletingId);
            addToast('Miembro eliminado correctamente', 'success');
            setDeletingId(null);
        } catch (error) {
            console.error(error);
            addToast('Error al eliminar el miembro', 'error');
        }
    };

    const filteredCustomers = customers.filter(c =>
        (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || '').includes(search)
    );

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Club Barrakesh</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión de miembros y perfiles de usuario.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/20' : 'text-black/20'} group-focus-within:text-primary transition-colors !text-lg`}>search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o tel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full ios-input pl-10 py-2.5 font-bold text-[10px] uppercase tracking-wider"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="ios-button bg-primary text-black px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg w-full md:w-auto h-full"
                    >
                        <span className="material-symbols-outlined !text-lg mr-2">person_add</span>
                        Nuevo Miembro
                    </button>
                </div>
            </div>

            <div className={`ios-card overflow-hidden border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={isDarkMode ? 'bg-white/5' : 'bg-black/5'}>
                                <th className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Cliente</th>
                                <th className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'} hidden sm:table-cell`}>Contacto</th>
                                <th className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'} hidden md:table-cell`}>Visita</th>
                                <th className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Lealtad</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[120px]">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-[10px] text-primary group-hover:scale-105 transition-transform border border-primary/20">
                                                {(customer.name || '').substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>{customer.phone}</span>
                                            <span className={`text-[9px] ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>{customer.email}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-[10px] font-bold uppercase tracking-tight hidden md:table-cell ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>{customer.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${customer.loyalty === 'Platinum' ? 'bg-primary/20 text-primary border-primary/20' :
                                            customer.loyalty === 'Gold' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10' :
                                                'bg-white/10 text-white/30 border-white/5'
                                            }`}>{customer.loyalty}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(customer.id, customer.name); }}
                                                className={`size-8 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-500/5 text-red-500 hover:bg-red-100'}`}
                                                title="Eliminar Miembro"
                                            >
                                                <span className="material-symbols-outlined !text-lg text-accent-red">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Addition Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <div className={`ios-card p-6 w-full max-w-md animate-scale-in ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold uppercase tracking-tight">Nuevo Miembro del Club</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="size-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                className="w-full ios-input p-3 text-xs"
                                placeholder="..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Teléfono</label>
                                <input
                                    type="text"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    className="w-full ios-input p-3 text-xs"
                                    placeholder="449..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Lealtad</label>
                                <select
                                    value={newCustomer.loyalty}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, loyalty: e.target.value })}
                                    className="w-full ios-input p-3 text-xs appearance-none"
                                >
                                    <option>Standard</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Correo (Opcional)</label>
                            <input
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                className="w-full ios-input p-3 text-xs"
                                placeholder="cliente@ejemplo.com"
                            />
                        </div>

                        <button
                            onClick={handleAddCustomer}
                            className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest rounded-xl text-[10px] mt-4 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Dar de Alta Miembro
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Deletion Confirm Modal */}
            <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)}>
                <div className={`ios-card p-8 border-2 max-w-sm ${isDarkMode ? 'border-red-500/20 bg-[#0a0a0a]' : 'border-red-500/10 bg-white'}`}>
                    <div className="flex flex-col items-center text-center">
                        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                            <span className="material-symbols-outlined !text-4xl">warning</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">¿Eliminar Miembro?</h3>
                        <p className={`text-xs mb-8 ${isDarkMode ? 'text-white/40' : 'text-black/60'}`}>
                            Estás por eliminar a <span className="text-primary font-bold">{deletingName}</span> del Club.
                            Esta acción es permanente.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setDeletingId(null)}
                                className={`flex-1 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 h-12 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerManagement;
