export type PageId =
  | 'home'
  | 'journey'
  | 'zone1'
  | 'zone2'
  | 'zone3'
  | 'zone4'
  | 'progress'
  | 'reflection'
  | 'teacher'
  | 'help';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
}

export interface GardenSectionItem {
  id: string;
  name: 'Rose Garden' | 'Vegetable Garden' | 'Butterfly Garden' | 'Flower Bed' | 'Open Activity Area';
  shape: 'square' | 'rectangle' | 'right-triangle' | 'isosceles-triangle';
  x: number; // grid col (0..15)
  y: number; // grid row (0..11)
  width: number; // metres (1..8)
  height: number; // metres (1..8)
  color: string;
}

export interface ReflectionAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

export interface GardenProgressState {
  // Zone 1: Learn & Discover
  zone1DemoViewed: boolean;
  zone1CanvaOpened: boolean;
  zone1CheckCompleted: boolean;

  // Zone 2: GeoGebra Shape Lab
  station1Done: boolean;
  station2Done: boolean;
  station3Done: boolean;
  station4Done: boolean;
  geogebraLinksVisited: string[];

  // Zone 3: FloraGeo AR Garden Designer
  floraGeoVisited: boolean;
  gardenDesignSaved: boolean;
  gardenSections: GardenSectionItem[];
  gardenExplanation: string;

  // Zone 4: Quiz Adventure
  zepQuizLaunched: boolean;
  zepQuizCompleted: boolean;
  waygroundLaunched: boolean;
  waygroundScore: number | null; // 0..100 reported honestly by pupil
  practiceCheckScore: number | null; // 0..10 from built-in diagnostic check

  // Reflection
  reflectionCompleted: boolean;
  reflectionAnswers: ReflectionAnswers;
}

export const EXTERNAL_RESOURCES = {
  canva: 'https://www.canva.com/design/DAHaTdgdrdo/m0Nrj7UG4KKFqxL4Q0qEFw/view',
  canvaEmbed: 'https://www.canva.com/design/DAHaTdgdrdo/m0Nrj7UG4KKFqxL4Q0qEFw/view?embed',
  geogebra1: 'https://www.geogebra.org/m/rkha3m67',
  geogebra1Embed: 'https://www.geogebra.org/classic/rkha3m67?embed',
  geogebra2: 'https://www.geogebra.org/m/mqqqrpcs',
  geogebra2Embed: 'https://www.geogebra.org/calculator/mqqqrpcs?embed',
  geogebra3: 'https://www.geogebra.org/m/pwug3qcq',
  geogebra3Embed: 'https://www.geogebra.org/classic/pwug3qcq?embed',
  floraGeo: 'https://carrieylen-injan-anak-steward-ipg-p.vercel.app/',
  zepQuiz: 'https://quiz.zep.us/en/play/nzWpvK',
  wayground: 'https://wayground.com/join/quiz/6af43352e47b2dd1b34caa2f/start?studentShare=true',
} as const;

export const LEARNING_OBJECTIVES = [
  'Identify polygons with up to eight sides.',
  'Determine perimeter by adding the lengths of the outer sides.',
  'Calculate the area of squares and rectangles using grids and formulas.',
  'Determine the area of right-angled, equilateral and isosceles triangles.',
  'Investigate how changing dimensions affects perimeter and area.',
  'Apply perimeter and area in designing a geometric garden.',
  'Explain and justify mathematical decisions.',
  'Achieve at least 80% in the final digital assessment.',
];

export interface BadgeInfo {
  id: 'explorer' | 'investigator' | 'architect' | 'master';
  icon: string;
  title: string;
  requirement: string;
  zoneLabel: string;
}

export const BADGES: BadgeInfo[] = [
  {
    id: 'explorer',
    icon: '🌱',
    title: 'Garden Explorer',
    requirement: 'Complete Zone 1: Learn & Discover (visual lesson + Check My Understanding)',
    zoneLabel: 'Zone 1',
  },
  {
    id: 'investigator',
    icon: '🔍',
    title: 'Shape Investigator',
    requirement: 'Complete all 4 GeoGebra Shape Lab investigation stations',
    zoneLabel: 'Zone 2',
  },
  {
    id: 'architect',
    icon: '🌷',
    title: 'Garden Architect',
    requirement: 'Save a valid 3+ section garden design with mathematical justification in Zone 3',
    zoneLabel: 'Zone 3',
  },
  {
    id: 'master',
    icon: '🏆',
    title: 'Mathematics Master',
    requirement: 'Complete the Wayground final assessment with at least 80%',
    zoneLabel: 'Zone 4',
  },
];
