import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { EXTERNAL_RESOURCES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

const WALKTHROUGH_STEPS = [
  {
    title: '1. What is Perimeter? (The Garden Fence)',
    caption:
      'Perimeter is the total distance around the OUTSIDE of a closed shape. Imagine walking all the way along a garden fence! We measure perimeter in linear units like cm or m.',
    mode: 'perimeter' as const,
  },
  {
    title: '2. What is Area? (The Grass & Soil Inside)',
    caption:
      'Area is the amount of flat surface ENCLOSED inside a shape. Imagine covering a flower bed with 1-unit-square tiles! We measure area in square units like cm² or m².',
    mode: 'area' as const,
  },
  {
    title: '3. Worked Example: 5 cm × 3 cm Rectangle',
    caption:
      'For a 5 cm by 3 cm rectangle: Perimeter = 5 + 3 + 5 + 3 = 16 cm. Area = 5 × 3 = 15 squares of 1 cm², written as 15 cm².',
    mode: 'both' as const,
  },
  {
    title: '4. Worked Example: Triangle (Base 6 cm, Height 4 cm)',
    caption:
      'A triangle is exactly half of a rectangle with the same base and perpendicular height! So Area = ½ × 6 × 4 = 12 cm².',
    mode: 'triangle' as const,
  },
];

interface QItem {
  id: string;
  question: string;
  options: { label: string; correct: boolean; feedback: string }[];
  hint: string;
}

const CHECK_QUESTIONS: QItem[] = [
  {
    id: 'q1',
    question:
      '1. You want to put a wooden border around the outside of a rectangular flower bed (5 cm × 3 cm). Which measurement and unit do you need?',
    hint: 'A wooden border goes along the outer edges — add all four sides!',
    options: [
      {
        label: '16 cm (Perimeter)',
        correct: true,
        feedback:
          'Spot on! Adding all outer sides gives 5 + 3 + 5 + 3 = 16 cm, measured in linear units (cm).',
      },
      {
        label: '15 cm² (Area)',
        correct: false,
        feedback:
          'Careful! 15 cm² measures the surface inside the flower bed (area), not the fence around the outside.',
      },
      {
        label: '16 cm² (Perimeter)',
        correct: false,
        feedback:
          'Close number, wrong unit! Perimeter is a length around the outside, so it uses linear units (cm), not square units (cm²).',
      },
    ],
  },
  {
    id: 'q2',
    question: '2. What is the area of a square garden bed whose sides are each 4 m long?',
    hint: 'For a square, multiply side × side and use square metres (m²).',
    options: [
      {
        label: '16 m',
        correct: false,
        feedback:
          '16 m is the perimeter (4 + 4 + 4 + 4). For area, we count 1 m² squares and write m²!',
      },
      {
        label: '16 m²',
        correct: true,
        feedback: 'Correct! Area of a square = side × side = 4 m × 4 m = 16 m².',
      },
      {
        label: '8 m²',
        correct: false,
        feedback: 'Remember: Area multiplies length × width (4 × 4), rather than adding 4 + 4.',
      },
    ],
  },
  {
    id: 'q3',
    question:
      '3. A triangular herb bed has a base of 6 cm and a perpendicular height of 4 cm. What is its area?',
    hint: 'Use the triangle formula: Area = ½ × base × perpendicular height.',
    options: [
      {
        label: '24 cm²',
        correct: false,
        feedback:
          '24 cm² is the area of the full 6 × 4 rectangle! A triangle is half of that rectangle: ½ × 6 × 4.',
      },
      {
        label: '12 cm²',
        correct: true,
        feedback: 'Excellent! Area = ½ × 6 cm × 4 cm = 12 cm².',
      },
      {
        label: '10 cm',
        correct: false,
        feedback:
          'Remember to use the triangle area formula (½ × base × height) and square units (cm²).',
      },
    ],
  },
];

export const Zone1LearnDiscover: React.FC = () => {
  const { progress, updateProgress, navigate, playChime, speakText } = useGarden();

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualMode, setVisualMode] = useState<'perimeter' | 'area' | 'both' | 'triangle'>('both');
  const [showCanvaEmbed, setShowCanvaEmbed] = useState(false);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({});

  const currentStep = WALKTHROUGH_STEPS[stepIdx];

  useEffect(() => {
    setVisualMode(currentStep.mode);
  }, [currentStep]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= WALKTHROUGH_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleStartLearning = () => {
    playChime('click');
    setIsPlaying(true);
    setStepIdx(0);
    updateProgress({ zone1DemoViewed: true });
    speakText(WALKTHROUGH_STEPS[0].title + '. ' + WALKTHROUGH_STEPS[0].caption);
  };

  const handleSelectStep = (idx: number) => {
    setStepIdx(idx);
    updateProgress({ zone1DemoViewed: true });
  };

  const handleAnswer = (q: QItem, optIdx: number) => {
    const next = { ...answers, [q.id]: optIdx };
    setAnswers(next);
    const chosen = q.options[optIdx];
    if (chosen.correct) {
      playChime('success');
    } else {
      playChime('hint');
    }

    // Check if all 3 questions are answered correctly
    const allCorrect = CHECK_QUESTIONS.every((item) => {
      const idx = next[item.id];
      return idx !== undefined && item.options[idx].correct;
    });

    if (allCorrect) {
      updateProgress({ zone1DemoViewed: true, zone1CheckCompleted: true });
    }
  };

  const allCheckedCorrect = CHECK_QUESTIONS.every((item) => {
    const idx = answers[item.id];
    return idx !== undefined && item.options[idx].correct;
  });

  return (
    <div className="space-y-6">
      {/* Zone Header */}
      <section className="garden-card bg-white border-2 border-emerald-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <BookOpen className="w-4 h-4" />
              <span>Zone 1 · Engage &amp; Explain · Canva Integration</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              Learn &amp; Discover: Understanding Perimeter and Area
            </h1>
            <p className="text-sm sm:text-base text-emerald-900 max-w-3xl">
              Learn the difference between the distance around a shape (<strong>Perimeter</strong>)
              and the flat space inside it (<strong>Area</strong>) using visual garden beds and
              step-by-step worked examples.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleStartLearning}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Learning</span>
            </button>
            <a
              href="#check-understanding"
              onClick={() => updateProgress({ zone1DemoViewed: true })}
              className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm border-2 border-amber-500 min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Check My Understanding</span>
            </a>
          </div>
        </div>

        <PipGuideCard
          title="Pip’s Concept Tip: Fence vs. Grass!"
          message="Think of PERIMETER as building a wooden fence around the outside (measured in cm or m), and AREA as planting square grass tiles inside (measured in cm² or m²)."
          tone="green"
        />
      </section>

      {/* Canva Resource Integration Card */}
      <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Integrated Resource 1 · Canva Presentation
            </span>
            <h2 className="font-display font-bold text-xl text-emerald-950">
              Canva: Understanding Perimeter and Area
            </h2>
            <p className="text-sm text-emerald-900">
              Open the visual Canva slides in a new tab or toggle the inline preview frame below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={EXTERNAL_RESOURCES.canva}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => updateProgress({ zone1CanvaOpened: true, zone1DemoViewed: true })}
              className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Open Canva Lesson</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => {
                setShowCanvaEmbed((v) => !v);
                updateProgress({ zone1CanvaOpened: true, zone1DemoViewed: true });
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border-2 border-sky-300 font-bold text-sm min-h-[44px]"
            >
              {showCanvaEmbed ? 'Hide Embedded Preview' : 'Try Embedded View'}
            </button>
          </div>
        </div>

        {showCanvaEmbed && (
          <div className="space-y-2">
            <div className="w-full h-[420px] rounded-2xl overflow-hidden border-2 border-sky-200 bg-sky-50">
              <iframe
                src={EXTERNAL_RESOURCES.canva}
                title="Canva Understanding Perimeter and Area Lesson"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-sky-900">
              Note: Some browsers or school networks block Canva iframes. If the frame stays blank,
              click <strong>Open Canva Lesson</strong> above to view it directly.
            </p>
          </div>
        )}
      </section>

      {/* Interactive Instructional Video-Style Walkthrough + Animated Visual Demonstration */}
      <section className="garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Interactive Visual Lesson &amp; Captioned Walkthrough
            </span>
            <h2 className="font-display font-bold text-2xl text-emerald-950">
              Boundary vs. Surface Explorer
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPlaying((p) => !p);
                updateProgress({ zone1DemoViewed: true });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Walkthrough' : 'Play Walkthrough'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-sm min-h-[44px] inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Step selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {WALKTHROUGH_STEPS.map((st, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectStep(idx)}
              className={`p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-bold transition-colors min-h-[48px] ${
                stepIdx === idx
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>

        {/* Two-column Stage + Concept Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual SVG Stage */}
          <div className="lg:col-span-7 bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-4 sm:p-6">
            {/* Mode switches */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  ['perimeter', 'Show Boundary (Perimeter)'],
                  ['area', 'Show 1 cm² Tiles (Area)'],
                  ['both', 'Compare Both (5 × 3 cm)'],
                  ['triangle', 'Triangle (6 × 4 cm)'],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setVisualMode(m);
                    updateProgress({ zone1DemoViewed: true });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    visualMode === m
                      ? 'bg-sky-700 text-white border-sky-800'
                      : 'bg-white text-emerald-950 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {visualMode !== 'triangle' ? (
              <svg
                viewBox="0 0 420 260"
                className="w-full h-auto bg-white rounded-xl border border-emerald-200"
                role="img"
                aria-label="5 cm by 3 cm rectangular garden bed showing perimeter and 1 cm squared unit tiles"
              >
                {/* Background faint grid */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 40 + 10}
                    y1={10}
                    x2={i * 40 + 10}
                    y2={250}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={10}
                    y1={i * 40 + 10}
                    x2={410}
                    y2={i * 40 + 10}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}

                {/* 5x3 unit squares inside (each 48px -> 240x144 centered at x=90, y=58) */}
                {(visualMode === 'area' || visualMode === 'both') &&
                  Array.from({ length: 3 }).map((_, row) =>
                    Array.from({ length: 5 }).map((__, col) => (
                      <g key={`${row}-${col}`}>
                        <rect
                          x={90 + col * 48}
                          y={58 + row * 48}
                          width={48}
                          height={48}
                          fill="#bae6fd"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                        <text
                          x={90 + col * 48 + 24}
                          y={58 + row * 48 + 28}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#0c4a6e"
                          fontFamily="IBM Plex Mono, monospace"
                        >
                          1cm²
                        </text>
                      </g>
                    )),
                  )}

                {/* Outer perimeter border */}
                <rect
                  x={90}
                  y={58}
                  width={240}
                  height={144}
                  fill={visualMode === 'perimeter' ? '#dcfce7' : 'none'}
                  fillOpacity={visualMode === 'perimeter' ? 0.35 : 0}
                  stroke={visualMode === 'area' ? '#64748b' : '#e11d48'}
                  strokeWidth={visualMode === 'area' ? 2 : 5}
                  strokeDasharray={visualMode === 'perimeter' ? '10 4' : undefined}
                />

                {/* Dimension labels */}
                <text
                  x={210}
                  y={44}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Length = 5 cm
                </text>
                <text
                  x={210}
                  y={222}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  5 cm
                </text>
                <text
                  x={64}
                  y={135}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  3 cm
                </text>
                <text
                  x={364}
                  y={135}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Width = 3 cm
                </text>
              </svg>
            ) : (
              <svg
                viewBox="0 0 420 260"
                className="w-full h-auto bg-white rounded-xl border border-emerald-200"
                role="img"
                aria-label="Triangle with base 6 cm and perpendicular height 4 cm inside half-rectangle reference"
              >
                {/* Reference full 6x4 rectangle (each cm = 40px -> 240x160 at x=90, y=45) */}
                <rect
                  x={90}
                  y={45}
                  width={240}
                  height={160}
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                {/* Shaded Triangle */}
                <polygon
                  points="90,205 330,205 210,45"
                  fill="#bbf7d0"
                  fillOpacity="0.8"
                  stroke="#15803d"
                  strokeWidth="3.5"
                />
                {/* Perpendicular height line */}
                <line
                  x1={210}
                  y1={45}
                  x2={210}
                  y2={205}
                  stroke="#7e22ce"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                {/* Right-angle marker */}
                <rect x={210} y={191} width={14} height={14} fill="none" stroke="#7e22ce" strokeWidth="2" />
                {/* Coral base highlight */}
                <line x1={90} y1={205} x2={330} y2={205} stroke="#e11d48" strokeWidth="5" />
                <text
                  x={210}
                  y={230}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Base = 6 cm
                </text>
                <text
                  x={258}
                  y={130}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#6b21a8"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Height = 4 cm
                </text>
              </svg>
            )}
          </div>

          {/* Captioned Concept & Formulas Deck */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Step Caption ({stepIdx + 1} of {WALKTHROUGH_STEPS.length})
                </span>
                <button
                  type="button"
                  onClick={() => speakText(currentStep.title + '. ' + currentStep.caption)}
                  className="text-xs font-bold text-amber-900 underline"
                >
                  Read Caption
                </button>
              </div>
              <h3 className="font-display font-bold text-lg text-emerald-950">
                {currentStep.title}
              </h3>
              <p className="text-sm text-emerald-950 leading-relaxed">{currentStep.caption}</p>
            </div>

            {/* Key Definitions & Formulas */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5">
                <h4 className="font-display font-bold text-sm text-rose-950">
                  PERIMETER (Linear units: cm, m)
                </h4>
                <p className="text-xs text-rose-900 mt-0.5">
                  Total distance around the outside of a closed shape.
                </p>
                <p className="font-math text-xs sm:text-sm font-bold text-rose-950 mt-1.5">
                  Rectangle (5 cm × 3 cm): 5 + 3 + 5 + 3 = 16 cm
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
                <h4 className="font-display font-bold text-sm text-sky-950">
                  AREA (Square units: cm², m²)
                </h4>
                <p className="text-xs text-sky-900 mt-0.5">
                  Amount of surface enclosed inside a shape.
                </p>
                <p className="font-math text-xs sm:text-sm font-bold text-sky-950 mt-1.5">
                  Rectangle: L × W = 5 × 3 = 15 cm²
                  <br />
                  Square (4 m): side × side = 4 × 4 = 16 m²
                  <br />
                  Triangle: ½ × base × height = ½ × 6 × 4 = 12 cm²
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Check My Understanding */}
      <section
        id="check-understanding"
        className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Guided Formative Q&amp;A
            </span>
            <h2 className="font-display font-bold text-2xl text-emerald-950">
              Check My Understanding
            </h2>
          </div>
          {allCheckedCorrect && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zone 1 Complete — 🌱 Garden Explorer Badge Unlocked!</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          {CHECK_QUESTIONS.map((q) => {
            const chosenIdx = answers[q.id];
            const showHint = hintsShown[q.id];
            return (
              <div
                key={q.id}
                className="rounded-2xl bg-purple-50/40 border border-purple-200 p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-base text-emerald-950">{q.question}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setHintsShown((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 bg-white border border-purple-300 px-2.5 py-1.5 rounded-lg hover:bg-purple-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                </div>

                {showHint && (
                  <p className="text-xs sm:text-sm bg-amber-50 border border-amber-300 text-amber-950 rounded-xl px-3 py-2">
                    <strong>Hint:</strong> {q.hint}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {q.options.map((opt, idx) => {
                    const selected = chosenIdx === idx;
                    let cls =
                      'bg-white border-emerald-200 text-emerald-950 hover:bg-emerald-50';
                    if (selected && opt.correct) {
                      cls = 'bg-emerald-700 border-emerald-800 text-white';
                    } else if (selected && !opt.correct) {
                      cls = 'bg-rose-600 border-rose-700 text-white';
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswer(q, idx)}
                        className={`px-4 py-3 rounded-xl border-2 font-bold text-sm min-h-[46px] text-left transition-colors ${cls}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {chosenIdx !== undefined && (
                  <p
                    className={`text-sm font-medium rounded-xl px-3.5 py-2.5 border ${
                      q.options[chosenIdx].correct
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <strong>
                      {q.options[chosenIdx].correct ? '✓ Well done: ' : '▲ Let’s check: '}
                    </strong>
                    {q.options[chosenIdx].feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-emerald-800">
            Answer all three questions correctly to earn your <strong>🌱 Garden Explorer</strong>{' '}
            badge!
          </p>
          <button
            type="button"
            onClick={() => navigate('zone2')}
            className="px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continue to Shape Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <ZoneBreadcrumbFooter current="zone1" />
    </div>
  );
};
