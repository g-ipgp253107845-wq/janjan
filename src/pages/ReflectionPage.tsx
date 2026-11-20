import React, { useState } from 'react';
import { CheckCircle2, Home, Save } from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { BADGES, ReflectionAnswers } from '../types/garden';
import { ButterflyAccent, PipGuideCard } from '../components/GardenIllustrations';

const REFLECTION_PROMPTS: { key: keyof ReflectionAnswers; question: string; placeholder: string }[] = [
  {
    key: 'q1',
    question: '1. What is the difference between perimeter and area?',
    placeholder: 'Explain boundary vs. surface and their units (cm/m vs. cm²/m²)...',
  },
  {
    key: 'q2',
    question: '2. What did you discover when changing the dimensions of shapes?',
    placeholder: 'Share what happened when you changed length, width, base, or height...',
  },
  {
    key: 'q3',
    question: '3. Can two gardens have the same perimeter but different areas?',
    placeholder: 'Use an example like 20 cm perimeter rectangles (8×2 vs 5×5)...',
  },
  {
    key: 'q4',
    question: '4. Which mathematical skill was most useful when designing your garden?',
    placeholder: 'Tell us which formula or measurement helped you most...',
  },
  {
    key: 'q5',
    question: '5. How did digital tools help you understand Mathematics?',
    placeholder: 'Reflect on Canva, GeoGebra Shape Lab, FloraGeo, ZEP Quiz, or Wayground...',
  },
];

export const ReflectionPage: React.FC = () => {
  const { progress, updateProgress, computed, navigate, playChime } = useGarden();
  const [answers, setAnswers] = useState<ReflectionAnswers>(progress.reflectionAnswers);
  const [savedNotice, setSavedNotice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFilled = Object.values(answers).every((v) => v.trim().length >= 5);
    if (!allFilled) {
      playChime('hint');
      setSavedNotice('Please write a thoughtful answer for all 5 reflection questions.');
      return;
    }
    playChime('success');
    updateProgress({ reflectionAnswers: answers, reflectionCompleted: true });
    setSavedNotice('✓ Reflection saved! Well done, Geometry Garden Explorer!');
  };

  return (
    <div className="space-y-6">
      <section className="garden-card bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Final Learning Reflection
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
              Congratulations, Geometry Garden Explorer!
            </h1>
            <p className="text-sm sm:text-base text-emerald-900">
              Review your completed zones, badges, and assessment progress, then reflect on what
              you discovered.
            </p>
          </div>
          <ButterflyAccent color="#a855f7" />
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-emerald-200 p-3.5">
            <span className="text-xs font-bold text-emerald-800 block">Overall Progress</span>
            <span className="font-math text-2xl font-extrabold text-emerald-700">
              {computed.overallPercent}%
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-sky-200 p-3.5">
            <span className="text-xs font-bold text-sky-800 block">Completed Zones</span>
            <span className="font-math text-2xl font-extrabold text-sky-700">
              {[
                computed.zone1Done,
                computed.zone2Done,
                computed.zone3Done,
                computed.zone4Done,
              ].filter(Boolean).length}
              /4
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-amber-200 p-3.5">
            <span className="text-xs font-bold text-amber-800 block">Badges Earned</span>
            <span className="font-math text-2xl font-extrabold text-amber-700">
              {computed.earnedBadges.length}/{BADGES.length}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-3.5">
            <span className="text-xs font-bold text-purple-800 block">Wayground Assessment</span>
            <span className="font-math text-xl font-extrabold text-purple-700">
              {progress.waygroundScore !== null ? `${progress.waygroundScore}%` : 'Pending'}
            </span>
          </div>
        </div>

        {/* Earned Badges Row */}
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => {
            const has = computed.earnedBadges.includes(b.id);
            return (
              <span
                key={b.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  has
                    ? 'bg-amber-100 border-amber-400 text-emerald-950'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.title}</span>
                {has && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
              </span>
            );
          })}
        </div>
      </section>

      <PipGuideCard
        title="Share your mathematical thinking!"
        message="Explaining concepts in your own words helps lock in what you learned about perimeter, area, and shapes."
        tone="green"
      />

      {/* 5 Reflection Questions */}
      <form
        onSubmit={handleSubmit}
        className="garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-5"
      >
        <h2 className="font-display font-bold text-2xl text-emerald-950">
          Your 5 Garden Reflection Questions
        </h2>

        <div className="space-y-4">
          {REFLECTION_PROMPTS.map((item) => (
            <label key={item.key} className="block space-y-1.5">
              <span className="block font-bold text-sm sm:text-base text-emerald-950">
                {item.question}
              </span>
              <textarea
                rows={2}
                value={answers[item.key]}
                onChange={(e) => {
                  setAnswers((prev) => ({ ...prev, [item.key]: e.target.value }));
                  setSavedNotice('');
                }}
                placeholder={item.placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-200 text-sm"
              />
            </label>
          ))}
        </div>

        {savedNotice && (
          <p className="text-sm font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5">
            {savedNotice}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Final Reflection</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 border-2 border-amber-500 font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Garden</span>
          </button>
        </div>
      </form>
    </div>
  );
};
