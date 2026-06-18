'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Phone, Mail, GraduationCap, Briefcase, Calendar, Clock, BarChart3, MessageSquare } from 'lucide-react';
import { FORMATIONS, CLIENT_STATUSES, DEFAULT_TASKS_PRE, DEFAULT_TASKS_POST } from '@/constants/business';
import { useAppStore } from '@/store/useAppStore';
import { Client, FormationType, Task } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const addClient = useAppStore((state) => state.addClient);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    clientType: 'Professionnel' as 'Professionnel' | 'Particulier',
    formation: FORMATIONS[0],
    sector: '',
    appointmentDate: '',
    appointmentTime: '',
    interestLevel: 'Moyen' as const,
    source: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientId = Math.random().toString(36).substr(2, 9);
    
    // Generate tasks
    const tasks: Task[] = [
      ...DEFAULT_TASKS_PRE.map((t, i) => ({
        id: `pre-${clientId}-${i}`,
        title: t.title,
        isCompleted: false,
        dueDate: formData.appointmentDate,
        priority: t.priority as any,
        phase: 'Avant-entretien' as const,
      })),
      ...DEFAULT_TASKS_POST.map((t, i) => ({
        id: `post-${clientId}-${i}`,
        title: t.title,
        isCompleted: false,
        dueDate: formData.appointmentDate, // Simplification for prototype
        priority: t.priority as any,
        phase: 'Après-entretien' as const,
      })),
    ];

    const newClient: Client = {
      ...formData,
      id: clientId,
      status: 'Avant rendez-vous',
      progress: 0,
      tasks,
    };

    addClient(newClient);
    onClose();
    // Reset form
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      clientType: 'Professionnel',
      formation: FORMATIONS[0],
      sector: '',
      appointmentDate: '',
      appointmentTime: '',
      interestLevel: 'Moyen',
      source: '',
      notes: '',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="text-xl font-bold text-gray-800">Ajouter un nouveau client</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Section: Informations générales */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={14} /> Informations générales
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nom du client</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Société</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Formation</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.formation}
                        onChange={(e) => setFormData({ ...formData, formation: e.target.value as FormationType })}
                      >
                        {FORMATIONS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Type de client</label>
                      <div className="flex gap-4 p-1 bg-gray-50 rounded-lg border border-gray-100">
                        {['Professionnel', 'Particulier'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, clientType: type as any })}
                            className={cn(
                              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                              formData.clientType === type 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Secteur d'activité</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Date du rendez-vous</label>
                      <input
                        required
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Heure</label>
                      <input
                        required
                        type="time"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Informations commerciales */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={14} /> Informations commerciales
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Niveau d'intérêt</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.interestLevel}
                        onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value as any })}
                      >
                        <option value="Faible">Faible</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Élevé">Élevé</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Source du prospect</label>
                      <input
                        type="text"
                        placeholder="Ex: LinkedIn, Site Web, Recommandation"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Notes */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Notes
                  </h4>
                  <textarea
                    rows={4}
                    placeholder="Commentaires libres ou informations importantes..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Créer le client
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
