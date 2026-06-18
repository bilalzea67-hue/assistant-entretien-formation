export type FormationType = 'SST' | 'Création de Site Web' | 'Réseaux Sociaux';

export type ClientStatus = 'Avant rendez-vous' | 'Entretien validé';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string;
  priority: 'Basse' | 'Moyenne' | 'Haute';
  phase: 'Avant-entretien' | 'Après-entretien';
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  clientType: 'Professionnel' | 'Particulier';
  formation: FormationType;
  sector: string;
  appointmentDate: string;
  appointmentTime: string;
  status: ClientStatus;
  interestLevel: 'Faible' | 'Moyen' | 'Élevé';
  source: string;
  notes: string;
  progress: number;
  tasks: Task[];
  interviewNotes?: {
    needs?: string;
    constraints?: string;
    objectives?: string;
    realObjections?: string;
    decisionMaker?: string;
    budget?: string;
    deadline?: string;
  };
}

export interface AppState {
  clients: Client[];
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  toggleTask: (clientId: string, taskId: string) => void;
}
