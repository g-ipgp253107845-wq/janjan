import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { BADGES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';

export const ProgressPage: React.FC = () => {
  const { progress, computed, navigate, resetAllProgress } = useGarden();
  const [confirmReset, setConfirmReset] = useState(false);

  const milestones = [
    { label: 'Zone 1: Explored Boundary vs. Surface demo', done: progress.zone1DemoViewed, page: 'zone1' as const },
    { label: 'Zone 1: Passed Check My Understanding Q&A', done: progress.zone1CheckCompleted, page: 'zone1' as const },
    { label: 'Zone 2: Station 1 — Polygon Perimeter (up to 8 sides)', done: progress.station1Done, page: 'zone2' as const },
    { label: 'Zone 2: Station 2 — Rectangle Area Sliders', done: progress.station2Done, page: 'zone2' as const },
    { label: 'Zone 2: Station 3 — Triangle Area (Base & Height)', done: progress.station3Done, page: 'zone2' as const },
    { label: 'Zone 2: Station 4 — Same Perimeter (20 cm), Different Area', done: progress.station4Done, page: 'zone2' as const },
    { label: 'Zone 3: Saved 3+ Section Geometric Garden Design', done: progress.gardenDesignSaved, page: 'zone3' as const },
    { label: 'Zone 4: Completed ZEP Quiz Formative Revision', done: progress.zepQuizCompleted, page: 'zone4' as const },
    {
      label: 'Zone 4: Achieved 80%+ on Wayground Assessment',
      done: progress.waygroundScore !== null && progress.waygroundScore >= 80,
      page: 'zone4' as const,
    },
    { label: 'Summit: Completed Final Learning Reflection', done: progress.reflectionCompleted, page: 'reflection' as const },
  ];

  return (
    <div className="space-y-6">
      <section className="garden-card bg-white border-2 border-emerald-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              My Learning Progress
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              Progress Tracker &amp; Achievement Badges
            </h1>
          </div>
          <div className="text-right">
            <span className="font-math text-3xl font-extrabold text-emerald-700">
              {computed.overallPercent}%
            </span>
            <span className="block text-xs font-bold text-emerald-900">
              {computed.completedCount} of {computed.totalMilestones} activities completed
            </span>
          </div>
        </div>

        <div
          className="w-full h-4 bg-emerald-100 rounded-full overflow-hidden border border-emerald-200"
          role="progressbar"
          aria-valuenow={computed.overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${computed.overallPercent}%` }}
          />
        </div>

        <p className="text-xs text-emerald-900 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
          <strong>Session Storage Notice:</strong> Your progress is saved locally in this browser
          session and updates only from your real interactions. Clearing browser data or switching
          devices will reset progress.
        </p>
      </section>

      {/* Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BADGES.map((b) => {
          const unlocked = computed.earnedBadges.includes(b.id);
          return (
            <div
              key={b.id}
              className={`garden-card rounded-2xl border-2 p-5 space-y-2 ${
                unlocked ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200 opacity-75'
              }`}
            >
              <div className="text-3xl" aria-hidden="true">
                {b.icon}
              </div>
              <h2 className="font-display font-bold text-lg text-emerald-950">{b.title}</h2>
              <p className="text-xs font-bold text-emerald-800">
                {unlocked ? '✓ Badge Earned' : `Locked · ${b.zoneLabel}`}
              </p>
              <p className="text-xs text-emerald-900 leading-relaxed">{b.requirement}</p>
            </div>
          );
        })}
      </section>

      {/* Activity Checklist + Quiz / Garden Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 garden-card bg-white border-2 border-sky-200 rounded-3xl p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-emerald-950">
            Activity Completion Breakdown
          </h2>
          <ul className="space-y-2">
            {milestones.map((m, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  {m.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={m.done ? 'font-semibold text-emerald-950' : 'text-slate-700'}>
                    {m.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(m.page)}
                  className="text-xs font-bold text-sky-700 hover:underline shrink-0"
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="garden-card bg-white border-2 border-purple-200 rounded-3xl p-6 space-y-3">
            <h2 className="font-display font-bold text-xl text-emerald-950">
              Assessment &amp; Garden Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                <span>ZEP Quiz Revision</span>
                <strong className="font-math">
                  {progress.zepQuizCompleted ? 'Confirmed ✓' : 'Not yet confirmed'}
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                <span>Wayground Final Score</span>
                <strong className="font-math">
                  {progress.waygroundScore !== null ? `${progress.waygroundScore}%` : 'Not recorded'}
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                <span>In-App Practice Check</span>
                <strong className="font-math">
                  {progress.practiceCheckScore !== null
                    ? `${progress.practiceCheckScore}/10`
                    : 'Not taken'}
                </strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <span>Saved Garden Sections</span>
                <strong className="font-math">
                  {progress.gardenDesignSaved
                    ? `${progress.gardenSections.length} sections ✓`
                    : 'Not saved yet'}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('reflection')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center justify-center gap-2"
            >
              <span>Go to Final Reflection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="garden-card bg-white border-2 border-rose-200 rounded-2xl p-4 space-y-2">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Session Progress</span>
              </button>
            ) : (
              <div className="space-y-2 text-center">
                <p className="text-xs font-bold text-rose-950">
                  Reset all zone progress and badges for this session?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetAllProgress();
                      setConfirmReset(false);
                    }}
                    className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-900 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ZoneBreadcrumbFooter current="progress" />
    </div>
  );
};
