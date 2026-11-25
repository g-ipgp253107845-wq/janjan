import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilitySettings,
  GardenProgressState,
  GardenSectionItem,
  PageId,
} from '../types/garden';
import { GardenMusicPlayer } from '../audio/GardenMusic';

const STORAGE_KEY = 'geometry_garden_v1_state';
const A11Y_KEY = 'geometry_garden_v1_a11y';

const DEFAULT_SECTIONS: GardenSectionItem[] = [
  {
    id: 'sec-1',
    name: 'Rose Garden',
    shape: 'rectangle',
    x: 1,
    y: 1,
    width: 5,
    height: 3,
    color: '#e11d48',
  },
  {
    id: 'sec-2',
    name: 'Butterfly Garden',
    shape: 'right-triangle',
    x: 8,
    y: 1,
    width: 6,
    height: 4,
    color: '#7e22ce',
  },
];

const DEFAULT_PROGRESS: GardenProgressState = {
  zone1DemoViewed: false,
  zone1CanvaOpened: false,
  zone1CheckCompleted: false,
  station1Done: false,
  station2Done: false,
  station3Done: false,
  station4Done: false,
  geogebraLinksVisited: [],
  floraGeoVisited: false,
  gardenDesignSaved: false,
  gardenSections: DEFAULT_SECTIONS,
  gardenExplanation: '',
  zepQuizLaunched: false,
  zepQuizCompleted: false,
  waygroundLaunched: false,
  waygroundScore: null,
  practiceCheckScore: null,
  reflectionCompleted: false,
  reflectionAnswers: {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  },
};

const DEFAULT_A11Y: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  audioEnabled: false,
};

interface GardenContextValue {
  page: PageId;
  navigate: (next: PageId) => void;
  goBack: () => void;
  canGoBack: boolean;
  progress: GardenProgressState;
  updateProgress: (patch: Partial<GardenProgressState>) => void;
  markGeoGebraVisited: (url: string) => void;
  resetAllProgress: () => void;
  a11y: AccessibilitySettings;
  toggleA11y: (key: keyof AccessibilitySettings) => void;
  teacherMode: boolean;
  setTeacherMode: (v: boolean) => void;
  speakText: (text: string) => void;
  playChime: (type?: 'success' | 'click' | 'hint') => void;
  musicPlaying: boolean;
  toggleMusic: () => void;
  computed: {
    zone1Done: boolean;
    zone2Done: boolean;
    zone3Done: boolean;
    zone4Done: boolean;
    overallPercent: number;
    completedCount: number;
    totalMilestones: number;
    earnedBadges: ('explorer' | 'investigator' | 'architect' | 'master')[];
    nextRecommendedZone: PageId;
  };
}

const GardenContext = createContext<GardenContextValue | null>(null);

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<PageId[]>(['home']);
  const page = history[history.length - 1];

  const [teacherMode, setTeacherMode] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicPlayerRef = useRef<GardenMusicPlayer | null>(null);

  useEffect(() => {
    const player = new GardenMusicPlayer();
    musicPlayerRef.current = player;
    return () => {
      player.dispose();
      musicPlayerRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const player = musicPlayerRef.current;
    if (!player) return;
    if (player.isPlaying()) {
      player.stop();
      setMusicPlaying(false);
    } else {
      player.start();
      setMusicPlaying(true);
    }
  };

  const [progress, setProgress] = useState<GardenProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default session state
    }
    return DEFAULT_PROGRESS;
  });

  const [a11y, setA11y] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(A11Y_KEY);
      if (saved) {
        return { ...DEFAULT_A11Y, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_A11Y;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota errors
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(A11Y_KEY, JSON.stringify(a11y));
    } catch {
      // ignore
    }
    const root = document.documentElement;
    root.classList.toggle('hc-mode', a11y.highContrast);
    root.classList.toggle('large-text', a11y.largeText);
    root.classList.toggle('reduce-motion', a11y.reducedMotion);
  }, [a11y]);

  const playChime = (type: 'success' | 'click' | 'hint' = 'click') => {
    if (!a11y.audioEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      } else if (type === 'hint') {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      } else {
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
      window.setTimeout(() => {
        void ctx.close();
      }, 650);
    } catch {
      // ignore audio errors
    }
  };

  const speakText = (text: string) => {
    if (!a11y.audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore speech synthesis errors
    }
  };

  const navigate = (next: PageId) => {
    setHistory((prev) => (prev[prev.length - 1] === next ? prev : [...prev, next]));
    window.scrollTo({ top: 0, behavior: a11y.reducedMotion ? 'auto' : 'smooth' });
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: a11y.reducedMotion ? 'auto' : 'smooth' });
  };

  const updateProgress = (patch: Partial<GardenProgressState>) => {
    setProgress((prev) => ({ ...prev, ...patch }));
  };

  const markGeoGebraVisited = (url: string) => {
    setProgress((prev) =>
      prev.geogebraLinksVisited.includes(url)
        ? prev
        : { ...prev, geogebraLinksVisited: [...prev.geogebraLinksVisited, url] },
    );
  };

  const resetAllProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const toggleA11y = (key: keyof AccessibilitySettings) => {
    setA11y((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const computed = useMemo(() => {
    const zone1Done = progress.zone1DemoViewed && progress.zone1CheckCompleted;
    const zone2Done =
      progress.station1Done &&
      progress.station2Done &&
      progress.station3Done &&
      progress.station4Done;
    const zone3Done = progress.gardenDesignSaved;
    const zone4Done =
      progress.zepQuizCompleted &&
      progress.waygroundScore !== null &&
      progress.waygroundScore >= 80;

    const milestones = [
      progress.zone1DemoViewed,
      progress.zone1CheckCompleted,
      progress.station1Done,
      progress.station2Done,
      progress.station3Done,
      progress.station4Done,
      progress.gardenDesignSaved,
      progress.zepQuizCompleted,
      progress.waygroundScore !== null && progress.waygroundScore >= 80,
      progress.reflectionCompleted,
    ];
    const completedCount = milestones.filter(Boolean).length;
    const totalMilestones = milestones.length;
    const overallPercent = Math.round((completedCount / totalMilestones) * 100);

    const earnedBadges: ('explorer' | 'investigator' | 'architect' | 'master')[] = [];
    if (zone1Done) earnedBadges.push('explorer');
    if (zone2Done) earnedBadges.push('investigator');
    if (zone3Done) earnedBadges.push('architect');
    if (zone4Done) earnedBadges.push('master');

    let nextRecommendedZone: PageId = 'zone1';
    if (zone1Done && !zone2Done) nextRecommendedZone = 'zone2';
    else if (zone1Done && zone2Done && !zone3Done) nextRecommendedZone = 'zone3';
    else if (zone1Done && zone2Done && zone3Done && !zone4Done) nextRecommendedZone = 'zone4';
    else if (zone1Done && zone2Done && zone3Done && zone4Done) nextRecommendedZone = 'reflection';

    return {
      zone1Done,
      zone2Done,
      zone3Done,
      zone4Done,
      overallPercent,
      completedCount,
      totalMilestones,
      earnedBadges,
      nextRecommendedZone,
    };
  }, [progress]);

  return (
    <GardenContext.Provider
      value={{
        page,
        navigate,
        goBack,
        canGoBack: history.length > 1,
        progress,
        updateProgress,
        markGeoGebraVisited,
        resetAllProgress,
        a11y,
        toggleA11y,
        teacherMode,
        setTeacherMode,
        speakText,
        playChime,
        musicPlaying,
        toggleMusic,
        computed,
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error('useGarden must be used inside GardenProvider');
  return ctx;
}
