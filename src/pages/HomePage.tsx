import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { BADGES, LEARNING_OBJECTIVES, PageId } from '../types/garden';
import { ButterflyAccent, IllustratedGardenMap, PipGuideCard } from '../components/GardenIllustrations';

export const HomePage: React.FC = () => {
  const { navigate, computed, a11y, toggleA11y, playChime } = useGarden();

  const zoneCards: {
    id: PageId;
    zoneNum: string;
    title: string;
    resource: string;
    desc: string;
    done: boolean;
    border: string;
    accentBg: string;
    accentText: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'zone1',
      zoneNum: 'Zone 1',
      title: 'Learn & Discover',
      resource: 'Canva Interactive Lesson',
      desc: 'Explore perimeter vs. area with animated fences, unit squares, worked examples and guided Q&A.',
      done: computed.zone1Done,
      border: 'border-emerald-300',
      accentBg: 'bg-emerald-100',
      accentText: 'text-emerald-900',
      icon: <BookOpen className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'zone2',
      zoneNum: 'Zone 2',
      title: 'GeoGebra Shape Lab',
      resource: 'GeoGebra Dynamic Geometry',
      desc: 'Investigate 3-to-8-sided polygons, rectangles, triangles, and shapes with equal perimeter.',
      done: computed.zone2Done,
      border: 'border-sky-300',
      accentBg: 'bg-sky-100',
      accentText: 'text-sky-900',
      icon: <LayoutGrid className="w-5 h-5 text-sky-700" />,
    },
    {
      id: 'zone3',
      zoneNum: 'Zone 3',
      title: 'FloraGeo Garden Designer',
      resource: 'FloraGeo AR & 2D Studio',
      desc: 'Design the school educational garden using geometric flower beds, measurements and constraints.',
      done: computed.zone3Done,
      border: 'border-rose-300',
      accentBg: 'bg-rose-100',
      accentText: 'text-rose-900',
      icon: <Sparkles className="w-5 h-5 text-rose-700" />,
    },
    {
      id: 'zone4',
      zoneNum: 'Zone 4',
      title: 'Quiz Adventure',
      resource: 'ZEP Quiz & Wayground',
      desc: 'Practise with instant mathematical feedback, play ZEP Quiz, and aim for 80%+ on Wayground.',
      done: computed.zone4Done,
      border: 'border-purple-300',
      accentBg: 'bg-purple-100',
      accentText: 'text-purple-900',
      icon: <Trophy className="w-5 h-5 text-purple-700" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="garden-card relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800">
              <span>Year 5 Mathematics</span>
              <span aria-hidden="true">·</span>
              <span>Topic: Space</span>
              <span aria-hidden="true">·</span>
              <span>6.3 Perimeter &amp; Area</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-emerald-950 tracking-tight leading-tight">
              GEOMETRY GARDEN
              <span className="block text-xl sm:text-3xl font-bold text-emerald-700 mt-1">
                The Perimeter &amp; Area Adventure
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-900 leading-relaxed max-w-2xl">
              Explore shapes, discover mathematical patterns and design your dream garden!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  playChime('click');
                  navigate('zone1');
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-sm min-h-[48px] inline-flex items-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Adventure</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playChime('click');
                  navigate(computed.nextRecommendedZone);
                }}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-base border-2 border-amber-500 min-h-[48px] inline-flex items-center gap-2 transition-colors"
              >
                <Compass className="w-5 h-5" />
                <span>
                  {computed.completedCount > 0 ? 'Continue Learning' : 'View Learning Journey'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate('journey')}
                className="px-4 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 font-semibold text-sm border-2 border-sky-300 min-h-[48px] inline-flex items-center gap-2 transition-colors"
              >
                <span>Learning Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress & Guide Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-end">
              <ButterflyAccent color="#facc15" />
            </div>
            <PipGuideCard
              title="Welcome to Geometry Garden! I’m Pip."
              message="Start at Zone 1 to learn perimeter and area, test shapes in the GeoGebra Shape Lab, design a real school garden, and conquer the Quiz Adventure!"
              tone="green"
            />
            <div className="garden-card bg-white border-2 border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm font-bold text-emerald-950">
                <span>Your Adventure Progress</span>
                <span className="font-math text-emerald-700">
                  {computed.completedCount}/{computed.totalMilestones} steps ({computed.overallPercent}%)
                </span>
              </div>
              <div
                className="w-full h-3.5 bg-emerald-100 rounded-full overflow-hidden border border-emerald-200"
                role="progressbar"
                aria-valuenow={computed.overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall learning adventure progress"
              >
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${computed.overallPercent}%` }}
                />
              </div>
              <p className="text-xs text-emerald-800">
                Progress updates only when you complete real activities in each zone and is saved
                in this browser session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrated Garden Map */}
      <IllustratedGardenMap />

      {/* Four Garden Zones Cards */}
      <section aria-labelledby="zones-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="zones-heading" className="font-display font-bold text-2xl text-emerald-950">
            Four Garden Learning Zones
          </h2>
          <button
            type="button"
            onClick={() => navigate('journey')}
            className="text-sm font-bold text-sky-700 hover:underline inline-flex items-center gap-1"
          >
            <span>See 4-step learning sequence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {zoneCards.map((z) => (
            <div
              key={z.id}
              className={`garden-card bg-white border-2 ${z.border} rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${z.accentBg} ${z.accentText}`}
                  >
                    {z.icon}
                    <span>{z.zoneNum}</span>
                  </span>
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-1 ${
                      z.done ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {z.done ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <span>Ready to explore</span>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-emerald-950">{z.title}</h3>
                  <p className="text-xs font-semibold text-sky-800 mt-0.5">{z.resource}</p>
                </div>

                <p className="text-sm text-emerald-900 leading-relaxed">{z.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playChime('click');
                  navigate(z.id);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>{z.done ? `Revisit ${z.zoneNum}` : `Enter ${z.zoneNum}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Achievement Badges + Learning Objectives */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges */}
        <div className="lg:col-span-5 garden-card bg-white border-2 border-amber-300 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-bold text-xl text-emerald-950">Achievement Badges</h2>
            <span className="font-math text-sm font-bold text-amber-800">
              {computed.earnedBadges.length}/{BADGES.length} Earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {BADGES.map((b) => {
              const unlocked = computed.earnedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border-2 p-3.5 flex items-start gap-3 transition-colors ${
                    unlocked
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {b.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-sm text-emerald-950">
                        {b.title}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          unlocked ? 'text-emerald-700' : 'text-slate-600'
                        }`}
                      >
                        {unlocked ? '✓ Unlocked' : `Locked (${b.zoneLabel})`}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                      {b.requirement}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="lg:col-span-7 garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-emerald-950">
              What You Will Master (Learning Objectives)
            </h2>
            <p className="text-sm text-sky-900 mt-0.5">
              Year 5 Space · Content Standard 6.3 Perimeter and Area (6.3.1 &amp; 6.3.2)
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEARNING_OBJECTIVES.map((obj, idx) => (
              <li
                key={idx}
                className="rounded-xl bg-sky-50/70 border border-sky-200 p-3 flex items-start gap-2.5 text-sm text-emerald-950"
              >
                <span className="font-math font-bold text-sky-800 shrink-0">0{idx + 1}.</span>
                <span className="leading-snug">{obj}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Instructions, Accessibility & Teacher Info Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* How to Navigate */}
        <div className="garden-card bg-white border-2 border-emerald-200 rounded-2xl p-5 space-y-3">
          <h2 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>How to Navigate</span>
          </h2>
          <ol className="space-y-2 text-sm text-emerald-900 list-decimal pl-5">
            <li>Click any zone on the Garden Map or top menu.</li>
            <li>Read, watch, or slide dimensions to see perimeter and area update live.</li>
            <li>External tools (Canva, GeoGebra, FloraGeo, ZEP, Wayground) open safely without losing your place.</li>
            <li>Complete tasks honestly to unlock all 4 badges!</li>
          </ol>
          <button
            type="button"
            onClick={() => navigate('help')}
            className="text-sm font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Open full Help Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Accessibility Quick Settings */}
        <div className="garden-card bg-white border-2 border-sky-200 rounded-2xl p-5 space-y-3">
          <h2 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
            <Eye className="w-5 h-5 text-sky-700" />
            <span>Accessibility Settings</span>
          </h2>
          <p className="text-xs text-emerald-800">
            Personalise text size, contrast, motion, and audio read-aloud for comfortable learning.
          </p>
          <div className="space-y-2">
            {(
              [
                ['highContrast', 'High-Contrast Colours'],
                ['largeText', 'Larger Readable Text'],
                ['reducedMotion', 'Reduce Butterfly Motion'],
                ['audioEnabled', 'Audio Read-Aloud & Chimes'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 cursor-pointer text-sm font-semibold text-emerald-950"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={a11y[key]}
                  onChange={() => toggleA11y(key)}
                  className="w-5 h-5 accent-sky-700"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Teacher Information Section */}
        <div className="garden-card bg-white border-2 border-purple-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-700" />
              <span>For Teachers</span>
            </h2>
            <p className="text-sm text-emerald-900 leading-relaxed">
              View full curriculum alignment (6.3.1 &amp; 6.3.2), the 4-stage pedagogical sequence
              (Canva → GeoGebra → FloraGeo AR → ZEP &amp; Wayground), teaching tips, and direct
              resource links.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('teacher')}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center justify-center gap-2"
          >
            <span>Open Teacher Information Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
