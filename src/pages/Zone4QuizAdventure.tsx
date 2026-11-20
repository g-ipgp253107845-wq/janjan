import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { EXTERNAL_RESOURCES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

interface PracticeQuestion {
  id: number;
  topic: 'polygon' | 'perimeter' | 'rectangle-area' | 'triangle-area' | 'units' | 'compare';
  prompt: string;
  options: {
    label: string;
    correct: boolean;
    feedback: string;
  }[];
}

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    topic: 'polygon',
    prompt: '1. A flower bed is shaped like a regular heptagon with 7 sides, each 3 m long. What is its perimeter?',
    options: [
      {
        label: '21 m',
        correct: true,
        feedback: 'Correct! A heptagon has 7 outer sides: 3 + 3 + 3 + 3 + 3 + 3 + 3 = 21 m.',
      },
      {
        label: '24 m',
        correct: false,
        feedback: 'Check the number of sides! A heptagon has 7 sides (an octagon has 8). Add all 7 outer side lengths.',
      },
      {
        label: '21 m²',
        correct: false,
        feedback: 'Careful with units! Perimeter measures the outer boundary length, so use linear metres (m), not m².',
      },
    ],
  },
  {
    id: 2,
    topic: 'rectangle-area',
    prompt: '2. A rectangular vegetable patch is 8 m long and 4 m wide. What is its area?',
    options: [
      {
        label: '24 m²',
        correct: false,
        feedback: '24 is the perimeter (8 + 4 + 8 + 4). For Area, identify length and width and multiply: Area = length × width.',
      },
      {
        label: '32 m²',
        correct: true,
        feedback: 'Spot on! Area = length × width = 8 m × 4 m = 32 m².',
      },
      {
        label: '32 m',
        correct: false,
        feedback: 'Watch the units! Area counts 1 m² squares inside the shape, so it must be written as m², not m.',
      },
    ],
  },
  {
    id: 3,
    topic: 'triangle-area',
    prompt: '3. A right-angled triangular herb garden has a base of 10 cm and a perpendicular height of 6 cm. What is its area?',
    options: [
      {
        label: '60 cm²',
        correct: false,
        feedback: 'Remember a triangle is HALF of a rectangle! Identify the base (10 cm) and perpendicular height (6 cm), then use ½ × base × height.',
      },
      {
        label: '30 cm²',
        correct: true,
        feedback: 'Well done! Area = ½ × 10 cm × 6 cm = 30 cm².',
      },
      {
        label: '16 cm²',
        correct: false,
        feedback: 'Do not add base and height for area. Use Area = ½ × base × perpendicular height.',
      },
    ],
  },
  {
    id: 4,
    topic: 'units',
    prompt: '4. Which unit should you use when measuring the wooden edging placed around the outside of a flower bed?',
    options: [
      {
        label: 'Metres (m) or centimetres (cm)',
        correct: true,
        feedback: 'Correct! Edging goes around the perimeter (a length), so linear units like m or cm are used.',
      },
      {
        label: 'Square metres (m²) or square centimetres (cm²)',
        correct: false,
        feedback: 'Remember: cm² and m² are square units for flat surface AREA, while cm and m are linear units for PERIMETER.',
      },
    ],
  },
  {
    id: 5,
    topic: 'perimeter',
    prompt: '5. An irregular pentagon has outer sides of 4 cm, 5 cm, 6 cm, 5 cm, and 4 cm. What is its perimeter?',
    options: [
      {
        label: '24 cm',
        correct: true,
        feedback: 'Great job! Adding all 5 outer sides: 4 + 5 + 6 + 5 + 4 = 24 cm.',
      },
      {
        label: '20 cm',
        correct: false,
        feedback: 'Remember to add ALL five outer side lengths around the polygon without skipping any side.',
      },
    ],
  },
  {
    id: 6,
    topic: 'triangle-area',
    prompt: '6. An isosceles triangle has a base of 8 cm, slanted sides of 5 cm each, and a perpendicular height of 3 cm. What is its area?',
    options: [
      {
        label: '12 cm²',
        correct: true,
        feedback: 'Excellent! You chose the perpendicular height (3 cm), not the slanted side (5 cm): Area = ½ × 8 × 3 = 12 cm².',
      },
      {
        label: '20 cm²',
        correct: false,
        feedback: 'Look closely at the triangle: 5 cm is the slanted side, not the perpendicular height! Use ½ × base (8) × perpendicular height (3).',
      },
    ],
  },
  {
    id: 7,
    topic: 'compare',
    prompt: '7. Two rectangles both have a perimeter of 20 cm: Rectangle A (8 cm × 2 cm) and Rectangle D (5 cm × 5 cm). Which statement is true?',
    options: [
      {
        label: 'They have the same perimeter (20 cm), but Rectangle D has a larger area (25 cm² vs 16 cm²).',
        correct: true,
        feedback: 'Exactly right! Shapes with the same perimeter can enclose very different areas, and a square encloses the largest area.',
      },
      {
        label: 'Because their perimeters are equal, their areas must also be 20 cm².',
        correct: false,
        feedback: 'Check both areas! 8 × 2 = 16 cm² while 5 × 5 = 25 cm². Same perimeter does NOT guarantee the same area.',
      },
    ],
  },
  {
    id: 8,
    topic: 'polygon',
    prompt: '8. A regular octagon border has sides of 2 m each. How much fencing is needed to enclose it?',
    options: [
      {
        label: '16 m',
        correct: true,
        feedback: 'Correct! An octagon has 8 sides: 8 × 2 m = 16 m.',
      },
      {
        label: '12 m',
        correct: false,
        feedback: 'An octagon has 8 sides (like an octopus has 8 arms!). Add all 8 outer sides of 2 m.',
      },
    ],
  },
  {
    id: 9,
    topic: 'rectangle-area',
    prompt: '9. A square rose bed has a perimeter of 24 m. What is the area of the rose bed?',
    options: [
      {
        label: '36 m²',
        correct: true,
        feedback: 'Brilliant multi-step reasoning! One side = 24 ÷ 4 = 6 m, so Area = 6 m × 6 m = 36 m².',
      },
      {
        label: '24 m²',
        correct: false,
        feedback: '24 m is the perimeter, not the area. First find one side of the square (24 ÷ 4 = 6 m), then calculate side × side!',
      },
    ],
  },
  {
    id: 10,
    topic: 'triangle-area',
    prompt: '10. A triangular flag in the garden has base 12 cm and perpendicular height 5 cm. What is its area?',
    options: [
      {
        label: '30 cm²',
        correct: true,
        feedback: 'Correct! Area = ½ × 12 cm × 5 cm = 30 cm².',
      },
      {
        label: '30 cm',
        correct: false,
        feedback: 'The number 30 is right, but area always uses square units (cm²), whereas cm is for perimeter.',
      },
    ],
  },
];

export const Zone4QuizAdventure: React.FC = () => {
  const { progress, updateProgress, navigate, playChime } = useGarden();

  // In-App Diagnostic Practice Check state
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [practiceFinished, setPracticeFinished] = useState(false);

  // Honest Wayground score input
  const [waygroundInput, setWaygroundInput] = useState<string>(
    progress.waygroundScore !== null ? String(progress.waygroundScore) : '',
  );
  const [scoreNotice, setScoreNotice] = useState<string>('');

  const currentQ = PRACTICE_QUESTIONS[practiceIdx];
  const chosenOption = selectedAnswers[currentQ.id];

  const practiceCorrectCount = PRACTICE_QUESTIONS.filter((q) => {
    const idx = selectedAnswers[q.id];
    return idx !== undefined && q.options[idx].correct;
  }).length;

  const handleSelectPractice = (optIdx: number) => {
    const next = { ...selectedAnswers, [currentQ.id]: optIdx };
    setSelectedAnswers(next);
    if (currentQ.options[optIdx].correct) {
      playChime('success');
    } else {
      playChime('hint');
    }
  };

  const handleFinishPractice = () => {
    setPracticeFinished(true);
    updateProgress({ practiceCheckScore: practiceCorrectCount });
  };

  const handleSaveWaygroundScore = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(waygroundInput);
    if (Number.isNaN(num) || num < 0 || num > 100) {
      setScoreNotice('Please enter a valid percentage score between 0 and 100.');
      return;
    }
    const rounded = Math.round(num);
    updateProgress({ waygroundScore: rounded });
    if (rounded >= 80) {
      playChime('success');
      setScoreNotice(
        `✓ Score ${rounded}% recorded! Congratulations — you unlocked the 🏆 Mathematics Master badge!`,
      );
    } else {
      playChime('hint');
      setScoreNotice(
        `Score ${rounded}% recorded. Review the feedback in our Practice Check or Zone 1–2 and try Wayground again to reach 80%+!`,
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700">
              <Trophy className="w-4 h-4" />
              <span>Zone 4 · Evaluate &amp; Assess · Digital Assessments</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              Geometry Garden Challenge: Quiz Adventure
            </h1>
            <p className="text-sm sm:text-base text-emerald-900 max-w-3xl">
              Warm up with instant mathematical feedback below, play the{' '}
              <strong>ZEP Quiz</strong> game-based revision, and complete the{' '}
              <strong>Wayground</strong> individual assessment (target: 80% or above!).
            </p>
          </div>
        </div>

        <PipGuideCard
          title="Honest Assessment Tracking"
          message="ZEP Quiz and Wayground open in their real platforms. After you finish each quiz, return here to confirm completion and record your actual Wayground percentage!"
          tone="purple"
        />
      </section>

      {/* STAGE 1 & STAGE 2: External Assessment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STAGE 1: ZEP QUIZ */}
        <section className="garden-card bg-white border-2 border-emerald-300 rounded-3xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                Stage 1 · Game-Based Formative Revision
              </span>
              {progress.zepQuizCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <h2 className="font-display font-bold text-2xl text-emerald-950">ZEP Quiz</h2>
            <p className="text-sm text-emerald-900 leading-relaxed">
              Play the interactive Geometry Garden ZEP adventure to revise identifying polygons,
              calculating perimeter and area, comparing shapes, and reading diagrams.
            </p>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-950 space-y-1">
              <p className="font-bold">Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Click <strong>Start ZEP Quiz</strong> to open ZEP in a new tab.</li>
                <li>Complete the game-based revision questions.</li>
                <li>Return to this tab and click <strong>I Completed ZEP Quiz</strong>.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-2.5">
            <a
              href={EXTERNAL_RESOURCES.zepQuiz}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => updateProgress({ zepQuizLaunched: true })}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[46px] inline-flex items-center justify-center gap-2"
            >
              <span>Start ZEP Quiz</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                playChime('success');
                updateProgress({ zepQuizLaunched: true, zepQuizCompleted: true });
              }}
              disabled={!progress.zepQuizLaunched && !progress.zepQuizCompleted}
              className={`w-full py-2.5 px-4 rounded-xl border-2 font-bold text-sm min-h-[44px] transition-colors ${
                progress.zepQuizCompleted
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                  : progress.zepQuizLaunched
                    ? 'bg-white border-emerald-500 text-emerald-900 hover:bg-emerald-50'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {progress.zepQuizCompleted
                ? '✓ ZEP Quiz Completion Confirmed'
                : progress.zepQuizLaunched
                  ? 'I Completed ZEP Quiz (Confirm)'
                  : 'Launch ZEP Quiz First to Confirm'}
            </button>
          </div>
        </section>

        {/* STAGE 2: WAYGROUND */}
        <section className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold">
                Stage 2 · Individual Final Assessment
              </span>
              {progress.waygroundScore !== null && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                    progress.waygroundScore >= 80 ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Score: {progress.waygroundScore}%</span>
                </span>
              )}
            </div>

            <h2 className="font-display font-bold text-2xl text-emerald-950">
              Wayground Final Assessment
            </h2>
            <p className="text-sm text-emerald-900 leading-relaxed">
              10 individual questions covering perimeter, area, polygons up to 8 sides, geometric
              diagrams, and reasoning. Target achievement: <strong>80% or above</strong>.
            </p>

            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5 text-xs text-purple-950 space-y-1">
              <p className="font-bold">Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Click <strong>Start Wayground Assessment</strong> to open the real quiz.</li>
                <li>Take your time reading each question and unit carefully.</li>
                <li>Enter your real percentage score below to update your badge progress.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={EXTERNAL_RESOURCES.wayground}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => updateProgress({ waygroundLaunched: true })}
              className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm min-h-[46px] inline-flex items-center justify-center gap-2"
            >
              <span>Start Wayground Assessment</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <form onSubmit={handleSaveWaygroundScore} className="flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="wayground-score-input">
                Your Wayground Score Percentage
              </label>
              <input
                id="wayground-score-input"
                type="number"
                min={0}
                max={100}
                value={waygroundInput}
                onChange={(e) => setWaygroundInput(e.target.value)}
                placeholder="Enter Wayground % (0–100)"
                className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border-2 border-purple-200 text-sm font-math"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm border-2 border-amber-500 min-h-[44px]"
              >
                Save Score
              </button>
            </form>

            {scoreNotice && (
              <p className="text-xs font-bold text-purple-950 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2">
                {scoreNotice}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* IN-APP 10-QUESTION PRACTICE CHECK (WITH TARGETED MATHEMATICAL FEEDBACK) */}
      <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              In-App Practice Check (Separate from External ZEP/Wayground)
            </span>
            <h2 className="font-display font-bold text-2xl text-emerald-950">
              10-Question Instant Mathematical Feedback Warm-Up
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-math text-sm font-bold text-sky-900 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl">
              Question {practiceIdx + 1} / {PRACTICE_QUESTIONS.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setPracticeIdx(0);
                setSelectedAnswers({});
                setPracticeFinished(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold inline-flex items-center gap-1 min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Question progress dots */}
        <div className="flex flex-wrap gap-1.5">
          {PRACTICE_QUESTIONS.map((q, idx) => {
            const ans = selectedAnswers[q.id];
            const isRight = ans !== undefined && q.options[ans].correct;
            const isWrong = ans !== undefined && !q.options[ans].correct;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setPracticeFinished(false);
                  setPracticeIdx(idx);
                }}
                className={`w-9 h-9 rounded-xl font-math text-xs font-bold border-2 ${
                  practiceIdx === idx
                    ? 'bg-sky-700 text-white border-sky-800'
                    : isRight
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : isWrong
                        ? 'bg-rose-100 text-rose-900 border-rose-400'
                        : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {!practiceFinished ? (
          <div className="rounded-2xl bg-sky-50/50 border border-sky-200 p-5 space-y-4">
            <p className="font-bold text-base sm:text-lg text-emerald-950">{currentQ.prompt}</p>

            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = chosenOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPractice(idx)}
                    className={`p-3.5 rounded-xl border-2 text-left font-semibold text-sm min-h-[46px] transition-colors ${
                      isSelected
                        ? opt.correct
                          ? 'bg-emerald-700 border-emerald-800 text-white'
                          : 'bg-rose-600 border-rose-700 text-white'
                        : 'bg-white border-sky-200 text-emerald-950 hover:bg-sky-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {chosenOption !== undefined && (
              <div
                className={`rounded-xl p-3.5 border text-sm font-medium ${
                  currentQ.options[chosenOption].correct
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <strong>
                  {currentQ.options[chosenOption].correct ? '✓ Concept Reinforced: ' : '▲ Hint & Feedback: '}
                </strong>
                {currentQ.options[chosenOption].feedback}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={practiceIdx === 0}
                onClick={() => setPracticeIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl bg-white border border-sky-300 text-sm font-bold disabled:opacity-40"
              >
                Previous Question
              </button>

              {practiceIdx < PRACTICE_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setPracticeIdx((i) => i + 1)}
                  className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-sm font-bold inline-flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishPractice}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold"
                >
                  See Practice Check Summary
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-6 space-y-3">
            <h3 className="font-display font-bold text-xl text-emerald-950">
              Practice Check Result: {practiceCorrectCount} / {PRACTICE_QUESTIONS.length} (
              {practiceCorrectCount * 10}%)
            </h3>
            <p className="text-sm text-emerald-900">
              {practiceCorrectCount >= 8
                ? 'Awesome readiness! You are ready to score 80%+ on the Wayground assessment above.'
                : 'Keep practising! Click any numbered box above to review questions you missed before trying Wayground.'}
            </p>
            <button
              type="button"
              onClick={() => setPracticeFinished(false)}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-sm font-bold text-emerald-950"
            >
              Review Questions
            </button>
          </div>
        )}
      </section>

      {/* Final Reflection Callout */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('reflection')}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 border-2 border-amber-500 font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
        >
          <span>Continue to Final Learning Reflection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <ZoneBreadcrumbFooter current="zone4" />
    </div>
  );
};
