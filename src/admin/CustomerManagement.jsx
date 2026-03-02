import React, { useState } from 'react';
import { useCustomers } from './data';

const CustomerManagement = () => {
    const [customers] = useCustomers();
    const [search, setSearch] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-white/40 text-xs font-medium mt-0.5">Base de lealtad y perfiles de usuario.</p>
                </div>
                <div className="relative group w-full md:w-64">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors !text-lg">search</span>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full ios-input pl-10 py-2.5 font-medium text-xs"
                    />
                </div>
            </div>

            <div className="ios-card bg-white/[0.01] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Contacto</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Visita</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">Lealtad</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">Inversión</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] text-primary group-hover:scale-105 transition-transform">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-semibold text-white/60">{customer.phone}</span>
                                            <span className="text-[9px] text-white/20">{customer.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-medium text-white/40">{customer.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest ${customer.loyalty === 'Platinum' ? 'bg-primary/20 text-primary border border-primary/10' :
                                                customer.loyalty === 'Gold' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-white/10 text-white/30'
                                            }`}>{customer.loyalty}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-base font-bold tracking-tighter text-white">{customer.totalSpent}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="size-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all">
                                                <span className="material-symbols-outlined !text-base">visibility</span>
                                            </button>
                                            <button className="size-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all">
                                                <span className="material-symbols-outlined !text-base">edit</span>
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
