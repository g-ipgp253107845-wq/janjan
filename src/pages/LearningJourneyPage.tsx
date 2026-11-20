import React from 'react';
import { ArrowRight, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { EXTERNAL_RESOURCES, PageId } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

export const LearningJourneyPage: React.FC = () => {
  const { navigate, progress, computed } = useGarden();

  const stages: {
    step: number;
    phase: string;
    zone: string;
    title: string;
    resourceName: string;
    resourceLinks: { label: string; url: string }[];
    summary: string;
    checklist: { label: string; done: boolean }[];
    pageId: PageId;
    badgeText: string;
    colorClasses: string;
  }[] = [
    {
      step: 1,
      phase: 'Engage & Explain',
      zone: 'Zone 1',
      title: 'Learn & Discover',
      resourceName: 'Canva – Understanding Perimeter and Area',
      resourceLinks: [{ label: 'Open Canva Lesson', url: EXTERNAL_RESOURCES.canva }],
      summary:
        'Distinguish outer boundary (perimeter in cm/m) from enclosed surface (area in cm²/m²) through visual garden examples and guided Q&A.',
      checklist: [
        { label: 'Explore interactive Boundary vs. Surface demo', done: progress.zone1DemoViewed },
        { label: 'Pass Check My Understanding questions', done: progress.zone1CheckCompleted },
      ],
      pageId: 'zone1',
      badgeText: '🌱 Garden Explorer',
      colorClasses: 'border-emerald-300 bg-emerald-50/40',
    },
    {
      step: 2,
      phase: 'Explore & Investigate',
      zone: 'Zone 2',
      title: 'GeoGebra Shape Lab',
      resourceName: '3 GeoGebra Dynamic Geometry Applets + 4 Lab Stations',
      resourceLinks: [
        { label: 'GeoGebra 1', url: EXTERNAL_RESOURCES.geogebra1 },
        { label: 'GeoGebra 2', url: EXTERNAL_RESOURCES.geogebra2 },
        { label: 'GeoGebra 3', url: EXTERNAL_RESOURCES.geogebra3 },
      ],
      summary:
        'Manipulate polygons up to 8 sides, rectangles, triangles (right-angled, equilateral, isosceles), and discover how shapes with a 20 cm perimeter can have different areas.',
      checklist: [
        { label: 'Station 1: Polygon Perimeter (up to 8 sides)', done: progress.station1Done },
        { label: 'Station 2: Rectangle Area Sliders', done: progress.station2Done },
        { label: 'Station 3: Triangle Base & Height', done: progress.station3Done },
        { label: 'Station 4: Same Perimeter (20 cm), Different Area', done: progress.station4Done },
      ],
      pageId: 'zone2',
      badgeText: '🔍 Shape Investigator',
      colorClasses: 'border-sky-300 bg-sky-50/40',
    },
    {
      step: 3,
      phase: 'Elaborate & Apply',
      zone: 'Zone 3',
      title: 'FloraGeo AR Garden Designer',
      resourceName: 'The FloraGeo AR: Garden Designer + 2D Grid Studio',
      resourceLinks: [{ label: 'Open FloraGeo AR', url: EXTERNAL_RESOURCES.floraGeo }],
      summary:
        'Act as a Junior Garden Designer! Place at least 3 geometric flower beds, calculate accurate perimeters and areas, follow space constraints, and justify your design.',
      checklist: [
        { label: 'Save a valid 3+ section geometric garden with explanation', done: progress.gardenDesignSaved },
      ],
      pageId: 'zone3',
      badgeText: '🌷 Garden Architect',
      colorClasses: 'border-rose-300 bg-rose-50/40',
    },
    {
      step: 4,
      phase: 'Evaluate & Assess',
      zone: 'Zone 4',
      title: 'Quiz Adventure & Final Reflection',
      resourceName: 'ZEP Quiz (Formative) + Wayground (Final Assessment)',
      resourceLinks: [
        { label: 'ZEP Quiz', url: EXTERNAL_RESOURCES.zepQuiz },
        { label: 'Wayground Quiz', url: EXTERNAL_RESOURCES.wayground },
      ],
      summary:
        'Test your mastery through game-based revision on ZEP Quiz, diagnostic practice feedback, and aim for 80%+ on the Wayground individual assessment.',
      checklist: [
        { label: 'Complete ZEP Quiz formative revision', done: progress.zepQuizCompleted },
        {
          label: 'Achieve 80%+ on Wayground assessment',
          done: progress.waygroundScore !== null && progress.waygroundScore >= 80,
        },
        { label: 'Complete Final Learning Reflection', done: progress.reflectionCompleted },
      ],
      pageId: 'zone4',
      badgeText: '🏆 Mathematics Master',
      colorClasses: 'border-purple-300 bg-purple-50/40',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Structured Learning Path
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              Your Geometry Garden Learning Journey
            </h1>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-right">
            <span className="block text-xs font-bold text-emerald-800">Overall Progress</span>
            <span className="font-math text-xl font-bold text-emerald-700">
              {computed.overallPercent}%
            </span>
          </div>
        </div>

        <PipGuideCard
          title="Step-by-step adventure!"
          message="Follow Stages 1 to 4 in order for the clearest mathematical discovery, or jump into any zone to review."
          tone="blue"
        />
      </div>

      <div className="space-y-4">
        {stages.map((s) => {
          const allDone = s.checklist.every((c) => c.done);
          return (
            <div
              key={s.step}
              className={`garden-card bg-white border-2 ${s.colorClasses} rounded-3xl p-6 shadow-sm`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <span className="text-emerald-800">Stage 0{s.step}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-800">{s.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span className={allDone ? 'text-emerald-700' : 'text-amber-800'}>
                      {allDone ? '✓ Completed' : 'In Progress'}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl text-emerald-950">
                    {s.zone}: {s.title}
                  </h2>

                  <p className="text-sm font-semibold text-purple-900">{s.resourceName}</p>
                  <p className="text-sm text-emerald-900 leading-relaxed">{s.summary}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {s.resourceLinks.map((rl) => (
                      <a
                        key={rl.url}
                        href={rl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                      >
                        <span>{rl.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white/90 rounded-2xl border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Zone Checklist</span>
                    <span>Reward: {s.badgeText}</span>
                  </div>

                  <ul className="space-y-2">
                    {s.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-emerald-950">
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className={item.done ? 'font-semibold text-emerald-900' : ''}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => navigate(s.pageId)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center justify-center gap-2"
                  >
                    <span>Go to {s.zone}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ZoneBreadcrumbFooter current="journey" />
    </div>
  );
};
