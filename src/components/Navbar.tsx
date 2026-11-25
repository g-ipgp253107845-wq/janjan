import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Eye,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutGrid,
  Menu,
  Music,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { PageId } from '../types/garden';

const NAV_ITEMS: { id: PageId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: <Home className="w-4 h-4" /> },
  {
    id: 'journey',
    label: 'Learning Journey',
    shortLabel: 'Journey',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'zone1',
    label: 'Learn & Discover',
    shortLabel: 'Learn',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 'zone2',
    label: 'Shape Lab',
    shortLabel: 'Shape Lab',
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    id: 'zone3',
    label: 'Garden Designer',
    shortLabel: 'Designer',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'zone4',
    label: 'Quiz Adventure',
    shortLabel: 'Quiz',
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: 'progress',
    label: 'My Progress',
    shortLabel: 'Progress',
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: 'help',
    label: 'Help',
    shortLabel: 'Help',
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

interface PageOrientationInfo {
  where: string;
  learning: string;
  todo: string;
  nextLabel: string;
  nextPage: PageId;
}

const PAGE_GUIDE: Partial<Record<PageId, PageOrientationInfo>> = {
  zone1: {
    where: 'Zone 1 · Learn & Discover (Canva)',
    learning: 'Perimeter (outer boundary) vs. Area (enclosed surface) in cm and cm²',
    todo: 'Explore the animated lesson, check the Canva slides, and pass Check My Understanding.',
    nextLabel: 'Next: GeoGebra Shape Lab',
    nextPage: 'zone2',
  },
  zone2: {
    where: 'Zone 2 · GeoGebra Shape Lab',
    learning: 'Investigating polygons (up to 8 sides), rectangles, triangles, and equal-perimeter shapes',
    todo: 'Complete all 4 interactive investigation stations and answer each discovery prompt.',
    nextLabel: 'Next: FloraGeo Garden Designer',
    nextPage: 'zone3',
  },
  zone3: {
    where: 'Zone 3 · FloraGeo AR Garden Designer',
    learning: 'Applying perimeter & area to design a multi-section school garden within space limits',
    todo: 'Place at least 3 sections, verify all calculations, write your explanation, and save.',
    nextLabel: 'Next: Quiz Adventure',
    nextPage: 'zone4',
  },
  zone4: {
    where: 'Zone 4 · Quiz Adventure (ZEP & Wayground)',
    learning: 'Consolidating perimeter, area, polygon identification, and mathematical reasoning',
    todo: 'Practise with instant feedback, play ZEP Quiz, and aim for 80%+ on Wayground.',
    nextLabel: 'Next: Final Reflection',
    nextPage: 'reflection',
  },
  reflection: {
    where: 'Final Reflection · Garden Summit',
    learning: 'Explaining and justifying your mathematical discoveries',
    todo: 'Answer the 5 reflection questions and review your badges and progress.',
    nextLabel: 'View My Progress',
    nextPage: 'progress',
  },
};

export const Navbar: React.FC = () => {
  const { page, navigate, a11y, toggleA11y, computed, musicPlaying, toggleMusic } = useGarden();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b-2 border-emerald-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          type="button"
          onClick={() => {
            navigate('home');
            setMobileOpen(false);
          }}
          className="flex items-center gap-2.5 text-left shrink-0 rounded-xl px-2 py-1 hover:bg-emerald-50 transition-colors"
        >
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm"
          >
            🌿
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-base sm:text-lg text-emerald-950 whitespace-nowrap">
              Geometry Garden
            </span>
            <span className="hidden sm:block text-[11px] font-semibold text-emerald-700 tracking-wide">
              Year 3 Math · 6.3 Perimeter & Area
            </span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-950 hover:bg-emerald-50'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Progress indicator pill */}
          <button
            type="button"
            onClick={() => navigate('progress')}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold hover:bg-amber-100 transition-colors whitespace-nowrap"
            title="View learning progress and badges"
          >
            <span className="font-math">{computed.overallPercent}%</span>
            <span>Progress</span>
          </button>

          {/* Background Music Toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            className={`px-3 py-2 rounded-xl border transition-colors min-h-[42px] flex items-center gap-1.5 text-xs font-bold whitespace-nowrap ${
              musicPlaying
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
            }`}
            aria-pressed={musicPlaying}
            aria-label={musicPlaying ? 'Turn background music off' : 'Turn background music on'}
            title={musicPlaying ? 'Garden Music: ON' : 'Garden Music: OFF'}
          >
            <Music className="w-4 h-4" />
            <span className="hidden md:inline">{musicPlaying ? 'Music On' : 'Music'}</span>
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={() => toggleA11y('audioEnabled')}
            className={`p-2.5 rounded-xl border transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center ${
              a11y.audioEnabled
                ? 'bg-sky-600 text-white border-sky-700'
                : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
            }`}
            aria-pressed={a11y.audioEnabled}
            aria-label={a11y.audioEnabled ? 'Disable audio narration' : 'Enable audio narration'}
            title={a11y.audioEnabled ? 'Audio Read-Aloud: ON' : 'Audio Read-Aloud: OFF'}
          >
            {a11y.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Accessibility Quick Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setA11yOpen((o) => !o)}
              className="p-2.5 rounded-xl border border-emerald-200 bg-white text-emerald-950 hover:bg-emerald-50 min-h-[42px] flex items-center gap-1.5 text-xs font-bold"
              aria-expanded={a11yOpen}
              aria-label="Accessibility settings"
              title="Accessibility settings"
            >
              <Eye className="w-4 h-4 text-sky-700" />
              <span className="hidden md:inline">Access</span>
            </button>

            {a11yOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white border-2 border-emerald-300 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                role="dialog"
                aria-label="Accessibility settings"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-emerald-950">Accessibility</span>
                  <button
                    type="button"
                    onClick={() => setA11yOpen(false)}
                    className="p-1 rounded-lg hover:bg-emerald-50"
                    aria-label="Close accessibility menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/70 cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-950">High Contrast</span>
                  <input
                    type="checkbox"
                    checked={a11y.highContrast}
                    onChange={() => toggleA11y('highContrast')}
                    className="w-5 h-5 accent-emerald-700"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/70 cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-950">Large Text</span>
                  <input
                    type="checkbox"
                    checked={a11y.largeText}
                    onChange={() => toggleA11y('largeText')}
                    className="w-5 h-5 accent-emerald-700"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/70 cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-950">Reduced Motion</span>
                  <input
                    type="checkbox"
                    checked={a11y.reducedMotion}
                    onChange={() => toggleA11y('reducedMotion')}
                    className="w-5 h-5 accent-emerald-700"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/70 cursor-pointer">
                  <span className="text-sm font-semibold text-emerald-950">Audio Read-Aloud</span>
                  <input
                    type="checkbox"
                    checked={a11y.audioEnabled}
                    onChange={() => toggleA11y('audioEnabled')}
                    className="w-5 h-5 accent-emerald-700"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Teacher Mode Button */}
          <button
            type="button"
            onClick={() => navigate(page === 'teacher' ? 'home' : 'teacher')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold min-h-[42px] flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              page === 'teacher'
                ? 'bg-purple-700 text-white border-purple-800'
                : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Teacher Info</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="xl:hidden p-2.5 rounded-xl border border-emerald-200 bg-white text-emerald-950 min-h-[42px] min-w-[42px] flex items-center justify-center"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="xl:hidden border-t border-emerald-200 bg-white px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  navigate(item.id);
                  setMobileOpen(false);
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-[44px] ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                }`}
              >
                {item.icon}
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export const ZoneBreadcrumbFooter: React.FC<{ current: PageId }> = ({ current }) => {
  const { goBack, canGoBack, navigate } = useGarden();
  const guide = PAGE_GUIDE[current];

  if (!guide && current === 'home') return null;

  return (
    <div className="space-y-4">
      {guide && (
        <div className="garden-card bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
              Where You Are
            </span>
            <span className="font-semibold text-emerald-950">{guide.where}</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block">
              What You Are Learning
            </span>
            <span className="text-emerald-950">{guide.learning}</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
              What To Do
            </span>
            <span className="text-emerald-950">{guide.todo}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-300 text-emerald-950 font-semibold text-sm hover:bg-emerald-50 min-h-[44px] inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="px-4 py-2.5 rounded-xl bg-white border-2 border-sky-300 text-sky-950 font-semibold text-sm hover:bg-sky-50 min-h-[44px] inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('help')}
            className="px-4 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-semibold text-sm hover:bg-amber-100 min-h-[44px] inline-flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>

        {guide && (
          <button
            type="button"
            onClick={() => navigate(guide.nextPage)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 shadow-sm min-h-[44px] inline-flex items-center gap-2"
          >
            <span>{guide.nextLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
