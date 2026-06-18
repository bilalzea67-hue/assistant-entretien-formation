'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { CLIENT_STATUSES, INTERVIEW_SCRIPT, OBJECTIONS, FORMATION_ARGUMENTS } from '@/constants/business';
import { 
  ChevronRight, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Lightbulb,
  FileText,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  Trash2,
  Edit
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { ClientStatus } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { EditClientModal } from '@/components/EditClientModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ClientDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const client = useAppStore((state) => state.clients.find(c => c.id === id));
  const updateClient = useAppStore((state) => state.updateClient);
  const deleteClient = useAppStore((state) => state.deleteClient);
  const toggleTask = useAppStore((state) => state.toggleTask);

  const [activeTab, setActiveTab] = useState<'checklist' | 'interview'>('interview');
  const [openObjection, setOpenObjection] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!client) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold">Dossier non trouvé</h2>
        <button onClick={() => router.push('/')} className="text-blue-600 mt-4 font-medium">Retour au tableau</button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ClientStatus) => {
    updateClient(client.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm('Voulez-vous vraiment supprimer ce dossier ? Cette action est irréversible.')) {
      deleteClient(client.id);
      router.push('/');
    }
  };

  const currentPhase = client.status === 'Avant rendez-vous' 
    ? 'Avant-entretien' 
    : 'Après-entretien';

  const phaseTasks = client.tasks.filter(t => t.phase === currentPhase);

  const objections = OBJECTIONS[client.clientType] || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <header className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{client.name}</h2>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  client.clientType === 'Professionnel' ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                )}>
                  {client.clientType}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium">{client.company || 'Particulier'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Edit size={14} /> Modifier
            </button>
            <button 
              onClick={handleDelete}
              className="px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Trash2 size={14} /> Supprimer
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <select
            value={client.status}
            onChange={(e) => handleStatusChange(e.target.value as ClientStatus)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-gray-700 transition-all cursor-pointer hover:bg-white"
          >
            {CLIENT_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Info & Timeline */}
        <aside className="w-80 border-r border-gray-50 bg-white overflow-y-auto p-8 flex flex-col gap-10 no-scrollbar">
          <section>
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-6">Fiche Contact</h4>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Téléphone</p>
                  <p className="font-semibold text-gray-700">{client.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-gray-700 truncate max-w-[160px]">{client.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Rendez-vous</p>
                  <p className="font-semibold text-gray-700">
                    {format(parseISO(client.appointmentDate), 'dd MMMM', { locale: fr })} à {client.appointmentTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Formation ciblée</p>
                  <p className="font-semibold text-blue-600">{client.formation}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-6">Parcours Étape par Étape</h4>
            <div className="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
              {CLIENT_STATUSES.map((status, idx) => {
                const isCompleted = CLIENT_STATUSES.indexOf(client.status) >= idx;
                const isCurrent = client.status === status;

                return (
                  <div key={status} className="relative flex items-center gap-5">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full z-10 -ml-[1px] outline outline-4 outline-white transition-all duration-500",
                      isCompleted ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-gray-200",
                      isCurrent && "bg-blue-600 scale-125 ring-4 ring-blue-50"
                    )} />
                    <span className={cn(
                      "text-[11px] font-bold tracking-tight transition-all duration-300",
                      isCompleted ? "text-gray-900" : "text-gray-300",
                      isCurrent && "text-blue-600 scale-105"
                    )}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden">
          {/* Tabs */}
          <div className="px-8 pt-8 bg-white shrink-0 border-b border-gray-100">
            <div className="flex gap-10">
              <button 
                onClick={() => setActiveTab('interview')}
                className={cn(
                  "pb-5 text-xs font-bold uppercase tracking-widest transition-all relative",
                  activeTab === 'interview' ? "text-blue-600" : "text-gray-300 hover:text-gray-500"
                )}
              >
                Conduite d'entretien
                {activeTab === 'interview' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
              <button 
                onClick={() => setActiveTab('checklist')}
                className={cn(
                  "pb-5 text-xs font-bold uppercase tracking-widest transition-all relative",
                  activeTab === 'checklist' ? "text-blue-600" : "text-gray-300 hover:text-gray-500"
                )}
              >
                Checklist {currentPhase === 'Avant-entretien' ? 'Préparation' : 'Suivi'}
                {activeTab === 'checklist' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
            {activeTab === 'interview' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Script & Notes */}
                <div className="xl:col-span-8 space-y-8">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                      <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        Structure de l'échange commercial
                      </h5>
                    </div>
                    <div className="p-8 space-y-12">
                      {INTERVIEW_SCRIPT.map((section, sIdx) => (
                        <div key={section.title} className="space-y-6">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100 shadow-sm">
                              {sIdx + 1}
                            </span>
                            <h6 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{section.title}</h6>
                          </div>
                          <div className="ml-12 grid grid-cols-1 gap-4">
                            {section.questions.map((q, qIdx) => (
                              <div key={qIdx} className="group p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:border-blue-100 transition-all">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium group-hover:text-gray-900">{q}</p>
                              </div>
                            ))}
                            {section.showAgenda && (
                              <div className="mt-4">
                                <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                                  <Calendar size={18} />
                                  Lien vers Agenda
                                  <ExternalLink size={14} className="opacity-50" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare size={18} className="text-blue-600" />
                      <h5 className="font-bold text-gray-800 text-sm">Synthèse & Notes d'entretien</h5>
                    </div>
                    <textarea 
                      className="w-full h-80 p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-100 transition-all text-sm leading-relaxed text-gray-700 font-medium no-scrollbar"
                      placeholder="Consignez ici les besoins spécifiques, les contraintes et les objectifs validés durant l'échange..."
                      value={client.notes}
                      onChange={(e) => updateClient(client.id, { notes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sales Toolbox */}
                <div className="xl:col-span-4 space-y-8">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-gray-900">
                      <h5 className="font-bold text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle size={14} className="text-orange-400" /> Gestion des Objections
                      </h5>
                    </div>
                    <div className="p-4 space-y-2">
                      {objections.map((obj, idx) => (
                        <div key={idx} className="border border-gray-50 rounded-xl overflow-hidden">
                          <button 
                            onClick={() => setOpenObjection(openObjection === idx ? null : idx)}
                            className={cn(
                              "w-full p-4 text-left flex items-center justify-between transition-all",
                              openObjection === idx ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            <span className="text-xs font-bold leading-tight">{obj.text}</span>
                            <ChevronDown size={16} className={cn("transition-transform duration-300", openObjection === idx && "rotate-180")} />
                          </button>
                          <AnimatePresence>
                            {openObjection === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-white"
                              >
                                <div className="p-4 pt-0 border-t border-blue-100/50 mt-2">
                                  <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                                    "{obj.response}"
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-blue-600">
                      <h5 className="font-bold text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lightbulb size={14} className="text-blue-200" /> Arguments Clés
                      </h5>
                    </div>
                    <div className="p-6 space-y-4">
                      {FORMATION_ARGUMENTS[client.formation].map((arg) => (
                        <div key={arg} className="flex gap-4 items-start group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                          <p className="text-xs font-bold text-gray-600 leading-relaxed">{arg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h5 className="text-sm font-bold text-gray-800 flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-green-500" /> 
                      Plan d'action : {currentPhase}
                    </h5>
                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-500">
                      {phaseTasks.filter(t => t.isCompleted).length} / {phaseTasks.length}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {phaseTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "p-6 flex items-center gap-5 hover:bg-gray-50 transition-all cursor-pointer group",
                          task.isCompleted && "opacity-40"
                        )}
                        onClick={() => toggleTask(client.id, task.id)}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm",
                          task.isCompleted ? "bg-green-500 border-green-500" : "bg-white border-gray-200 group-hover:border-blue-400"
                        )}>
                          {task.isCompleted && <CheckCircle2 size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-bold text-gray-700", task.isCompleted && "line-through")}>{task.title}</p>
                          <span className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest inline-block mt-1",
                            task.priority === 'Haute' ? "text-red-600" : 
                            task.priority === 'Moyenne' ? "text-orange-600" : "text-gray-400"
                          )}>
                            Priorité {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <EditClientModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} client={client} />
    </div>
  );
}
