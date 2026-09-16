export type SiteStatus = 'pending' | 'ready' | 'active';

export interface SiteRow {
  id: number;
  /** "0982 - Miles, H" — the site number and its PI, as one label */
  name: string;
  status: string;
  statusTone: SiteStatus;
  /** A named coordinator, or a count when the site has several */
  coordinator?: string;
  coordinatorCount?: number;
  personnel: number;
  /** Percent complete; a site with nothing assigned has no bar at all */
  trainingProgress?: number;
  courses: number;
  learningPlans?: number;
}

export const SITES: SiteRow[] = [
  { id: 1, name: '0982 - Miles, H', status: 'Active', statusTone: 'active', coordinator: 'Jacob Jones', personnel: 14, trainingProgress: 100, courses: 22, learningPlans: 3 },
  { id: 2, name: '1643 - Hwang, S', status: 'Active', statusTone: 'active', coordinatorCount: 3, personnel: 23, trainingProgress: 78, courses: 9, learningPlans: 2 },
  { id: 3, name: '2208 - Rivera, C', status: 'Active', statusTone: 'active', coordinator: 'Annette Black', personnel: 12, trainingProgress: 64, courses: 11, learningPlans: 3 },
  { id: 4, name: '2567 - Milevich, K', status: 'Active', statusTone: 'active', coordinator: 'Ricardo Nolan', personnel: 23, trainingProgress: 45, courses: 27 },
  { id: 5, name: '3390 - Chen, W', status: 'Ready for Training', statusTone: 'ready', coordinator: 'Naomi Watts', personnel: 12, trainingProgress: 12, courses: 29 },
  { id: 6, name: '3784 - Nabokov, K', status: 'Ready for Training', statusTone: 'ready', coordinator: 'David Guetta', personnel: 2, trainingProgress: 0, courses: 2 },
  { id: 7, name: '4821 - Donovan, M', status: 'Ready for Training', statusTone: 'ready', coordinator: 'Cecilia Banks', personnel: 12, trainingProgress: 0, courses: 18 },
  { id: 8, name: '5510 - Bauer, T', status: 'Active', statusTone: 'active', coordinator: 'Byron Scott', personnel: 23, trainingProgress: 100, courses: 16, learningPlans: 2 },
  { id: 9, name: '6302 - Okafor, N', status: 'Pending', statusTone: 'pending', coordinator: 'Madelyn Cline', personnel: 12, courses: 5, learningPlans: 5 },
  { id: 10, name: '7145 - Serrano, L', status: 'Pending', statusTone: 'pending', coordinator: 'Iris Whitfield', personnel: 9, courses: 7, learningPlans: 1 },
];

export const SITE_COUNT = 45;
export const TOTAL_ITEMS = 45;
export const PAGE_SIZE = 10;
export const TOTAL_PAGES = 5;
