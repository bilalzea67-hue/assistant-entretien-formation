import { create } from 'zustand';
import { AppState, Client, Task } from '../types';
import { supabase } from '@/lib/supabase';

interface SupabaseStore extends AppState {
  fetchClients: () => Promise<void>;
}

export const useAppStore = create<SupabaseStore>((set, get) => ({
  clients: [],
  isAddModalOpen: false,

  setAddModalOpen: (open) => set({ isAddModalOpen: open }),

  fetchClients: async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      console.error('Error fetching clients:', error);
    } else if (data) {
      set({ clients: data as Client[] });
    }
  },

  addClient: async (client) => {
    // Optimistic UI update
    set((state) => ({
      clients: [client, ...state.clients],
    }));

    const { error } = await supabase.from('clients').insert([client]);
    if (error) {
      console.error('Error adding client:', error);
      // Revert optimistic update on error (simplified)
      get().fetchClients();
    }
  },

  updateClient: async (id, updates) => {
    // Optimistic UI update
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating client:', error);
      get().fetchClients();
    }
  },

  deleteClient: async (id) => {
    // Optimistic UI update
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));

    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Error deleting client:', error);
      get().fetchClients();
    }
  },

  toggleTask: async (clientId, taskId) => {
    const state = get();
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) return;

    const updatedTasks = client.tasks.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );

    const currentPhase = client.status === 'Avant rendez-vous' ? 'Avant-entretien' : 'Après-entretien';
    const phaseTasks = updatedTasks.filter((t) => t.phase === currentPhase);
    const completedPhaseTasks = phaseTasks.filter((t) => t.isCompleted);
    const progress = phaseTasks.length > 0 ? Math.round((completedPhaseTasks.length / phaseTasks.length) * 100) : 0;

    const updates = { tasks: updatedTasks, progress };

    // Use updateClient to handle both Optimistic UI and Supabase sync
    get().updateClient(clientId, updates);
  },
}));
