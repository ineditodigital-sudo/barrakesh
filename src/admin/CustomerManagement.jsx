import React, { useState } from 'react';
import { useCustomers } from './data';
import { useTheme } from './ThemeContext';

const CustomerManagement = () => {
    const [customers] = useCustomers();
    const [search, setSearch] = useState('');
    const { isDarkMode } = useTheme();

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Base de Clientes</h2>
                    <p className={`${isDarkMode ? 'text-white/40' : 'text-black/40'} text-xs font-medium mt-0.5 uppercase tracking-widest`}>Gestión de lealtad y perfiles de usuario.</p>
                </div>
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
                                <th className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-right ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Inversión</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[120px]">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-[10px] text-primary group-hover:scale-105 transition-transform border border-primary/20">
                                                {customer.name.substring(0, 2).toUpperCase()}
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
                                    <td className={`px-6 py-4 text-right text-base font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{customer.totalSpent}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className={`size-8 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/20' : 'bg-black/5 hover:bg-black/20'}`}>
                                                <span className="material-symbols-outlined !text-lg">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
