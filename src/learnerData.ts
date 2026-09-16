export interface LearnerChild {
  id: string;
  label: string;
  count: number;
}

export interface Learner {
  id: string;
  name: string;
  /** Courses + Learning Plans — what the learner's own row counts */
  count: number;
  children: LearnerChild[];
}

/**
 * Every learner is a first-level row with the same two second-level rows, so
 * the roster carries the two figures and the tree shape is derived from them
 * rather than repeated seventeen times.
 */
const ROSTER: { id: string; name: string; courses: number; plans: number }[] = [
  { id: 'amos-gentry', name: 'Amos Gentry', courses: 15, plans: 4 },
  { id: 'alivia-newmann', name: 'Alivia Newmann', courses: 1, plans: 1 },
  { id: 'alvaro-quest', name: 'Alvaro Quest', courses: 4, plans: 1 },
  { id: 'alexandria-sosa', name: 'Alexandria Sosa', courses: 9, plans: 3 },
  { id: 'alanis-fairweather', name: 'Alanis Fairweather', courses: 5, plans: 1 },
  { id: 'alberto-rosario', name: 'Alberto Rosario', courses: 5, plans: 2 },
  { id: 'adrianna-bloom', name: 'Adrianna Bloom', courses: 6, plans: 2 },
  { id: 'angelica-macias', name: 'Angelica Macias', courses: 7, plans: 2 },
  { id: 'alicea-knoll', name: 'Alicea Knoll', courses: 3, plans: 1 },
  { id: 'allyson-roberson', name: 'Allyson Roberson', courses: 3, plans: 1 },
  { id: 'arlo-zacharias', name: 'Arlo Zacharias', courses: 1, plans: 0 },
  { id: 'antoine-rush', name: 'Antoine Rush', courses: 13, plans: 4 },
  { id: 'amelia-klaus', name: 'Amelia Klaus', courses: 10, plans: 3 },
  { id: 'amari-calhoun', name: 'Amari Calhoun', courses: 19, plans: 5 },
  { id: 'anders-solberg', name: 'Anders Solberg', courses: 15, plans: 4 },
  { id: 'adrian-chavez', name: 'Adrian Chavez', courses: 12, plans: 4 },
  { id: 'alfredo-dominquez', name: 'Alfredo Dominquez', courses: 9, plans: 2 },
];

export const LEARNERS: Learner[] = ROSTER.map(l => ({
  id: l.id,
  name: l.name,
  count: l.courses + l.plans,
  children: [
    { id: `${l.id}/courses`, label: 'Courses', count: l.courses },
    { id: `${l.id}/learning-plans`, label: 'Learning Plans', count: l.plans },
  ],
}));

export const DEFAULT_EXPANDED = ['amos-gentry'];
export const DEFAULT_SELECTED = 'amos-gentry/courses';

export const VIEW_TABS = ['Site', 'Role', 'Learner'] as const;
export type ViewTab = (typeof VIEW_TABS)[number];
export const DEFAULT_VIEW_TAB: ViewTab = 'Learner';
