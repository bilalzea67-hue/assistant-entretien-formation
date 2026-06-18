import { ClientStatus, FormationType } from "../types";

export const CLIENT_STATUSES: ClientStatus[] = [
  'Avant rendez-vous',
  'Entretien validé'
];

export const FORMATIONS: FormationType[] = [
  'SST',
  'Création de Site Web',
  'Réseaux Sociaux'
];

export const OBJECTIONS: Record<'Professionnel' | 'Particulier', { text: string; response: string }[]> = {
  'Professionnel': [
    { text: "Le budget est trop élevé pour notre structure", response: "C'est un investissement avec un ROI mesurable. De plus, nous pouvons optimiser le reste à charge via votre budget OPCO." },
    { text: "Nous n'avons pas le temps d'immobiliser nos salariés", response: "Nos formats sont flexibles (demi-journées ou intra-entreprise) pour minimiser l'impact sur votre production." },
    { text: "L'expertise du formateur est-elle garantie ?", response: "Nos formateurs sont des experts de terrain certifiés Qualiopi avec plus de 10 ans d'expérience opérationnelle." },
    { text: "Quid du suivi après la formation ?", response: "Nous incluons un coaching post-formation de 3 mois pour garantir la mise en pratique réelle des acquis." },
    { text: "C'est trop complexe administrativement", response: "Notre service administratif prend en charge l'intégralité du montage de votre dossier de financement." },
    { text: "Est-ce vraiment adapté à notre secteur spécifique ?", response: "Chaque programme est personnalisé avec des cas pratiques issus directement de votre branche d'activité." },
    { text: "Nous travaillons déjà avec un autre organisme", response: "C'est parfait, cela prouve votre intérêt pour la montée en compétences. Laissez-moi vous montrer notre approche différenciante." }
  ],
  'Particulier': [
    { text: "Je n'ai pas les fonds disponibles immédiatement", response: "Nous proposons des paiements en plusieurs fois sans frais ou une mobilisation de votre compte CPF." },
    { text: "Est-ce que je vais vraiment réussir à trouver un emploi après ?", response: "La formation est axée sur les compétences les plus demandées par le marché actuel, avec un module d'aide à l'insertion." },
    { text: "J'ai peur que le niveau soit trop difficile", response: "Le programme est progressif et nous effectuons un test de positionnement pour adapter l'accompagnement." },
    { text: "Quels sont les pré-requis réels ?", response: "Une motivation solide est le principal pré-requis. Nous vous accompagnons sur les bases techniques au démarrage." },
    { text: "Peut-on suivre la formation à distance ?", response: "Oui, nous disposons d'une plateforme d'apprentissage moderne accessible 24h/24 avec des classes virtuelles." },
    { text: "Est-ce que le diplôme est reconnu ?", response: "Toutes nos formations débouchent sur des certifications d'État ou des titres enregistrés au RNCP." },
    { text: "Pourquoi vous choisir plutôt qu'un autre ?", response: "Pour notre taux de réussite de 98% et notre suivi personnalisé : vous n'êtes jamais seul face à votre écran." }
  ]
};

export const INTERVIEW_SCRIPT = [
  {
    title: '1. Exploration & Immersion',
    questions: [
      "Quelles sont les spécificités majeures de votre activité aujourd'hui ?",
      "Quels sont les 2 ou 3 enjeux prioritaires que vous souhaitez adresser ?",
      "Qu'attendez-vous concrètement d'un accompagnement externe ?"
    ]
  },
  {
    title: '2. Diagnostic & Corrélation',
    questions: [
      "Si je reformule, votre besoin principal est [Besoin] pour pallier à [Difficulté] ?",
      "En quoi le statu quo actuel freine-t-il votre développement ?",
      "Faisons le lien entre ces blocages et les modules de notre formation."
    ]
  },
  {
    title: '3. Solution & Valeur Ajoutée',
    questions: [
      "Voici comment notre programme répond point par point à vos problématiques.",
      "Focus sur les bénéfices concrets : gain de temps, sécurité, ou visibilité accrue.",
      "Pourquoi cette approche est la plus pertinente pour votre situation ?"
    ]
  },
  {
    title: '4. Ingénierie & Logistique',
    questions: [
      "Processus de prise en charge (OPCO/CPF) et montage du dossier.",
      "Détails des tarifs et conditions de groupe (nombre de participants).",
      "Validation des aspects pratiques (Lieu, matériel, pré-requis)."
    ]
  },
  {
    title: '5. Engagement & Planification',
    questions: [
      "Au vu de nos échanges, quelle période serait la plus opportune pour démarrer ?",
      "Validation de la date cible et des prochaines étapes administratives.",
      "Finalisation de l'accord de principe."
    ],
    showAgenda: true
  }
];

export const FORMATION_ARGUMENTS: Record<FormationType, string[]> = {
  'SST': [
    'Conformité réglementaire absolue (Code du Travail)',
    'Capacité d\'intervention immédiate en cas d\'accident',
    'Amélioration de la marque employeur et de la sécurité'
  ],
  'Création de Site Web': [
    'Transformation digitale complète de votre image',
    'Autonomie totale sur la mise à jour de vos contenus',
    'Optimisation pour le référencement naturel (SEO)'
  ],
  'Réseaux Sociaux': [
    'Maîtrise des algorithmes pour booster votre portée',
    'Stratégie de contenu performante et différenciante',
    'Conversion directe des abonnés en clients fidèles'
  ]
};

export const DEFAULT_TASKS_PRE = [
  { title: 'Confirmer le rendez-vous (J-1)', priority: 'Haute' },
  { title: "Rechercher des informations sur l'entreprise", priority: 'Moyenne' },
  { title: 'Préparer le support de présentation', priority: 'Moyenne' },
  { title: "Vérifier l'éligibilité au financement", priority: 'Haute' }
];

export const DEFAULT_TASKS_POST = [
  { title: "Envoyer le compte-rendu d'entretien", priority: 'Haute' },
  { title: 'Établir et envoyer le devis', priority: 'Haute' },
  { title: 'Envoyer la convention de formation', priority: 'Moyenne' },
  { title: 'Relancer le client (J+3)', priority: 'Basse' },
  { title: 'Relancer le client (J+7)', priority: 'Basse' }
];
