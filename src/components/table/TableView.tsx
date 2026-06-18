'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FORMATIONS, CLIENT_STATUSES } from '@/constants/business';
import { Filter, Calendar, AlertCircle, ChevronDown, Check, Clock, CheckCircle2, ChevronRight, Briefcase, User, Search, Trash2 } from 'lucide-react';
import { isToday, isThisWeek, isThisMonth, parseISO, isPast } from 'date-fns';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AddClientModal } from '../AddClientModal';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DateFilter = 'all' | 'today' | 'week' | 'month';

export function TableView() {
  const clients = useAppStore((state) => state.clients);
  const isAddModalOpen = useAppStore((state) => state.isAddModalOpen);
  const setAddModalOpen = useAppStore((state) => state.setAddModalOpen);

  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [formationFilter, setFormationFilter] = useState<string>('all');
  const [showOnlyLate, setShowOnlyLate] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filteredClients = clients.filter((client) => {
    if (dateFilter !== 'all') {
      const date = parseISO(client.appointmentDate);
      if (dateFilter === 'today' && !isToday(date)) return false;
      if (dateFilter === 'week' && !isThisWeek(date)) return false;
      if (dateFilter === 'month' && !isThisMonth(date)) return false;
    }

    if (formationFilter !== 'all' && client.formation !== formationFilter) return false;

    if (showOnlyLate) {
      const hasLate = client.tasks.some(t => !t.isCompleted && new Date(t.dueDate) < new Date() && !isToday(new Date(t.dueDate)));
      if (!hasLate) return false;
    }

    return true;
  });

  // Sort by appointment date descending
  filteredClients.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f4f5f7]">
      {/* Filters Sub-Header */}
      <div className="px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                isFilterMenuOpen ? 'bg-white border-blue-200 text-blue-600 shadow-lg' : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <Filter size={14} className={isFilterMenuOpen ? 'text-blue-600' : 'text-gray-400'} />
              Période : {dateFilter === 'all' ? 'Tout' : dateFilter === 'today' ? "Aujourd'hui" : dateFilter === 'week' ? 'Cette semaine' : 'Ce mois'}
              <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="p-2">
                    {[
                      { id: 'all', label: 'Tout voir' },
                      { id: 'today', label: "Aujourd'hui" },
                      { id: 'week', label: 'Cette semaine' },
                      { id: 'month', label: 'Ce mois-ci' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setDateFilter(f.id as DateFilter);
                          setIsFilterMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                      >
                        {f.label}
                        {dateFilter === f.id && <Check size={14} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => setShowOnlyLate(!showOnlyLate)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              showOnlyLate 
                ? 'bg-red-600 text-white border-red-700 shadow-xl shadow-red-100' 
                : 'bg-white text-gray-400 border-transparent hover:text-red-500 shadow-sm'
            }`}
          >
            Urgences
          </button>
        </div>

        <div className="flex items-center gap-3">
          {FORMATIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFormationFilter(formationFilter === f ? 'all' : f)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                formationFilter === f 
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xl shadow-blue-100' 
                  : 'bg-white text-gray-400 border-transparent hover:text-blue-600 shadow-sm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact & Entreprise</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Profil</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Formation Ciblée</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Échéance</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Statut du Dossier</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Progression</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => {
                const tasks = client.tasks || [];
                const remainingTasks = tasks.filter(t => !t.isCompleted).length;
                const lateTasks = tasks.filter(t => !t.isCompleted && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).length;
                const statusIndex = CLIENT_STATUSES.indexOf(client.status);
                const progress = client.progress || 0;
                const progressColor = progress === 100 ? 'bg-green-500' : 'bg-blue-600';

                return (
                  <Link href={`/client/${client.id}`} key={client.id} legacyBehavior>
                    <tr className="group hover:bg-blue-50/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{client.name}</p>
                        <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                          {client.clientType === 'Professionnel' ? <Briefcase size={12} /> : <User size={12} />}
                          <p className="text-xs font-medium">{client.company || 'Particulier'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider",
                          client.clientType === 'Professionnel' ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                        )}>
                          {client.clientType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold tracking-wider">
                          {client.formation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              {format(new Date(client.appointmentDate), 'dd MMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                              <Clock size={12} className="text-gray-400" />
                              {client.appointmentTime}
                            </p>
                          </div>
                          {lateTasks > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 animate-pulse">
                              <AlertCircle size={12} />
                              <span>En retard</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            client.status === 'Entretien validé' ? "bg-green-500" : "bg-orange-400"
                          )} />
                          <span className="text-xs font-bold text-gray-700">{client.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                            {remainingTasks === 0 ? (
                              <CheckCircle2 size={14} className="text-green-500" />
                            ) : (
                              <span>{client.tasks.length - remainingTasks}/{client.tasks.length} tâches</span>
                            )}
                            <span className="text-blue-600">{client.progress}%</span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                              style={{ width: `${client.progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {client.status === 'Entretien validé' && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (window.confirm('Voulez-vous vraiment supprimer ce dossier validé ?')) {
                                  useAppStore.getState().deleteClient(client.id);
                                }
                              }}
                              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer le dossier"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors inline-block" />
                        </div>
                      </td>
                    </tr>
                  </Link>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Search size={24} className="text-gray-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">Aucun dossier trouvé</p>
                      <p className="text-xs text-gray-400">Modifiez vos filtres ou créez une nouvelle fiche.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
