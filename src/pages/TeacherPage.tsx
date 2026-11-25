import React from 'react';
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Download,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { BADGES, EXTERNAL_RESOURCES, LEARNING_OBJECTIVES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';

export const TeacherPage: React.FC = () => {
  const { progress, computed } = useGarden();

  const resources = [
    {
      name: '1. Canva – Understanding Perimeter & Area',
      role: 'Engage and Explain',
      url: EXTERNAL_RESOURCES.canva,
    },
    {
      name: '2a. GeoGebra – Exploration 1 (Polygons & Perimeter)',
      role: 'Explore and Investigate',
      url: EXTERNAL_RESOURCES.geogebra1,
    },
    {
      name: '2b. GeoGebra – Exploration 2 (Rectangle & Triangle Area)',
      role: 'Explore and Investigate',
      url: EXTERNAL_RESOURCES.geogebra2,
    },
    {
      name: '2c. GeoGebra – Exploration 3 (Same Perimeter Comparison)',
      role: 'Explore and Investigate',
      url: EXTERNAL_RESOURCES.geogebra3,
    },
    {
      name: '3. FloraGeo AR – Garden Designer',
      role: 'Elaborate and Apply',
      url: EXTERNAL_RESOURCES.floraGeo,
    },
    {
      name: '4a. ZEP Quiz – Formative Game Revision',
      role: 'Evaluate (Formative)',
      url: EXTERNAL_RESOURCES.zepQuiz,
    },
    {
      name: '4b. Wayground – 10-Question Final Assessment',
      role: 'Evaluate (Summative)',
      url: EXTERNAL_RESOURCES.wayground,
    },
  ];

  const zone2StationsDone = [
    progress.station1Done,
    progress.station2Done,
    progress.station3Done,
    progress.station4Done,
  ].filter(Boolean).length;

  const handleDownloadStudentReport = () => {
    const lines = [
      'GEOMETRY GARDEN — TEACHER STUDENT PROGRESS REPORT',
      '=================================================',
      `Generated: ${new Date().toLocaleString()}`,
      `Overall Progress: ${computed.overallPercent}% (${computed.completedCount}/${computed.totalMilestones} milestones)`,
      `Earned Badges (${computed.earnedBadges.length}/${BADGES.length}): ${
        computed.earnedBadges.length > 0
          ? BADGES.filter((b) => computed.earnedBadges.includes(b.id))
              .map((b) => `${b.icon} ${b.title}`)
              .join(', ')
          : 'None yet'
      }`,
      '',
      'ZONE BREAKDOWN:',
      `- Zone 1 (Learn & Discover): Demo Viewed=${progress.zone1DemoViewed ? 'Yes' : 'No'}, Canva Opened=${progress.zone1CanvaOpened ? 'Yes' : 'No'}, Check My Understanding=${progress.zone1CheckCompleted ? 'Completed' : 'Pending'}`,
      `- Zone 2 (Shape Lab): ${zone2StationsDone}/4 stations completed (S1:${progress.station1Done ? '✓' : '○'}, S2:${progress.station2Done ? '✓' : '○'}, S3:${progress.station3Done ? '✓' : '○'}, S4:${progress.station4Done ? '✓' : '○'}), GeoGebra Links Opened=${progress.geogebraLinksVisited.length}/3`,
      `- Zone 3 (Garden Designer): FloraGeo Opened=${progress.floraGeoVisited ? 'Yes' : 'No'}, Design Saved=${progress.gardenDesignSaved ? 'Yes' : 'No'}, Sections=${progress.gardenSections.length}`,
      `  Student Garden Justification: ${progress.gardenExplanation || '(Not written yet)'}`,
      `- Zone 4 (Quiz Adventure): ZEP Quiz=${progress.zepQuizCompleted ? 'Confirmed' : 'Pending'}, In-App Practice=${progress.practiceCheckScore !== null ? `${progress.practiceCheckScore}/10` : 'Not taken'}, Wayground=${progress.waygroundScore !== null ? `${progress.waygroundScore}%` : 'Not recorded'}`,
      `- Final Reflection: ${progress.reflectionCompleted ? 'Completed' : 'Pending'}`,
      '',
      'STUDENT REFLECTION RESPONSES:',
      `1. Difference between perimeter & area: ${progress.reflectionAnswers.q1 || '(Not answered)'}`,
      `2. Changing dimensions discovery: ${progress.reflectionAnswers.q2 || '(Not answered)'}`,
      `3. Same perimeter, different areas: ${progress.reflectionAnswers.q3 || '(Not answered)'}`,
      `4. Most useful skill for garden design: ${progress.reflectionAnswers.q4 || '(Not answered)'}`,
      `5. How digital tools helped: ${progress.reflectionAnswers.q5 || '(Not answered)'}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geometry-garden-student-progress.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
          <GraduationCap className="w-4 h-4" />
          <span>Teacher Information Panel</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-emerald-950">
          Pedagogical Guide, Curriculum &amp; Student Progress
        </h1>
        <p className="text-sm text-emerald-900 max-w-3xl">
          Monitor your pupil’s live session progress across all four zones, review their saved
          garden justification and reflection answers, and view curriculum alignment for Year 5
          Mathematics (6.3 Perimeter &amp; Area).
        </p>
      </section>

      {/* STUDENT PROGRESS MONITOR SECTION */}
      <section
        aria-labelledby="student-progress-heading"
        className="garden-card bg-white border-2 border-emerald-300 rounded-3xl p-6 space-y-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <ClipboardList className="w-4 h-4" />
              <span>Live Session Monitor</span>
            </span>
            <h2
              id="student-progress-heading"
              className="font-display font-bold text-2xl text-emerald-950"
            >
              Student Progress Overview
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDownloadStudentReport}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Student Report</span>
          </button>
        </div>

        {/* Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <span className="text-xs font-bold text-emerald-800 block">Overall Completion</span>
            <span className="font-math text-2xl font-extrabold text-emerald-700">
              {computed.overallPercent}%
            </span>
            <span className="block text-xs text-emerald-900 mt-0.5">
              {computed.completedCount} / {computed.totalMilestones} milestones
            </span>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <span className="text-xs font-bold text-amber-900 block">Badges Earned</span>
            <span className="font-math text-2xl font-extrabold text-amber-700">
              {computed.earnedBadges.length} / {BADGES.length}
            </span>
            <span className="block text-xs text-amber-950 mt-0.5">
              {computed.earnedBadges.length === 0
                ? 'None unlocked yet'
                : BADGES.filter((b) => computed.earnedBadges.includes(b.id))
                    .map((b) => b.icon)
                    .join(' ')}
            </span>
          </div>

          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
            <span className="text-xs font-bold text-sky-900 block">In-App Practice Check</span>
            <span className="font-math text-2xl font-extrabold text-sky-700">
              {progress.practiceCheckScore !== null
                ? `${progress.practiceCheckScore}/10`
                : '—'}
            </span>
            <span className="block text-xs text-sky-950 mt-0.5">
              {progress.practiceCheckScore !== null
                ? `${progress.practiceCheckScore * 10}% warm-up`
                : 'Not yet completed'}
            </span>
          </div>

          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4">
            <span className="text-xs font-bold text-purple-900 block">Wayground Assessment</span>
            <span className="font-math text-2xl font-extrabold text-purple-700">
              {progress.waygroundScore !== null ? `${progress.waygroundScore}%` : '—'}
            </span>
            <span className="block text-xs text-purple-950 mt-0.5">
              {progress.waygroundScore === null
                ? 'Not recorded yet'
                : progress.waygroundScore >= 80
                  ? '✓ Target achieved (≥ 80%)'
                  : 'Below 80% target'}
            </span>
          </div>
        </div>

        {/* Zone-by-Zone Student Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Zone 1 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-emerald-950">
                Zone 1: Learn &amp; Discover
              </h3>
              <span className="text-xs font-bold text-emerald-800">
                {computed.zone1Done ? '✓ Completed' : 'In Progress'}
              </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-emerald-950">
              <li className="flex items-center gap-2">
                {progress.zone1DemoViewed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Interactive Boundary vs. Surface demo viewed</span>
              </li>
              <li className="flex items-center gap-2">
                {progress.zone1CanvaOpened ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Canva slides opened/interacted</span>
              </li>
              <li className="flex items-center gap-2">
                {progress.zone1CheckCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Check My Understanding passed (3/3)</span>
              </li>
            </ul>
          </div>

          {/* Zone 2 */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-emerald-950">
                Zone 2: GeoGebra Shape Lab
              </h3>
              <span className="text-xs font-bold text-sky-800">
                {zone2StationsDone}/4 Stations
              </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-emerald-950">
              <li className="flex items-center gap-2">
                {progress.station1Done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Station 1: Polygon Perimeter (up to 8 sides)</span>
              </li>
              <li className="flex items-center gap-2">
                {progress.station2Done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Station 2: Rectangle Area Sliders</span>
              </li>
              <li className="flex items-center gap-2">
                {progress.station3Done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Station 3: Triangle Area (Base &amp; Height)</span>
              </li>
              <li className="flex items-center gap-2">
                {progress.station4Done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>
                  Station 4: Same Perimeter (20 cm) · GeoGebra opened:{' '}
                  {progress.geogebraLinksVisited.length}/3
                </span>
              </li>
            </ul>
          </div>

          {/* Zone 3 */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-emerald-950">
                Zone 3: FloraGeo Garden Designer
              </h3>
              <span className="text-xs font-bold text-rose-800">
                {progress.gardenDesignSaved ? '✓ Saved' : 'Not saved yet'}
              </span>
            </div>
            <p className="text-xs text-emerald-900">
              FloraGeo AR visited: <strong>{progress.floraGeoVisited ? 'Yes' : 'No'}</strong> ·
              Garden sections placed: <strong>{progress.gardenSections.length}</strong>
            </p>
            <div className="bg-white rounded-xl border border-rose-200 p-2.5 text-xs text-emerald-950">
              <span className="font-bold block text-rose-900 mb-0.5">
                Student’s Mathematical Justification:
              </span>
              {progress.gardenExplanation ? (
                <p className="italic">“{progress.gardenExplanation}”</p>
              ) : (
                <p className="text-slate-500">No justification saved yet.</p>
              )}
            </div>
          </div>

          {/* Zone 4 & Reflection */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-emerald-950">
                Zone 4 &amp; Final Reflection
              </h3>
              <span className="text-xs font-bold text-purple-800">
                {computed.zone4Done && progress.reflectionCompleted
                  ? '✓ Complete'
                  : 'In Progress'}
              </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-emerald-950">
              <li className="flex items-center gap-2">
                {progress.zepQuizCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>
                  ZEP Quiz: {progress.zepQuizCompleted ? 'Confirmed' : progress.zepQuizLaunched ? 'Launched (awaiting confirmation)' : 'Not started'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                {progress.waygroundScore !== null && progress.waygroundScore >= 80 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>
                  Wayground Score:{' '}
                  {progress.waygroundScore !== null
                    ? `${progress.waygroundScore}%`
                    : progress.waygroundLaunched
                      ? 'Launched (score not entered)'
                      : 'Not started'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                {progress.reflectionCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>
                  Final Reflection:{' '}
                  {progress.reflectionCompleted ? 'All 5 answers submitted' : 'Pending'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reflection Answers Preview (if student has written any) */}
        {Object.values(progress.reflectionAnswers).some((a) => a.trim().length > 0) && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
            <h3 className="font-display font-bold text-sm text-emerald-950">
              Student Reflection Responses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-950">
              {Object.entries(progress.reflectionAnswers).map(([k, val], idx) =>
                val.trim() ? (
                  <div key={k} className="bg-white rounded-xl border border-amber-200 p-2.5">
                    <span className="font-bold text-amber-900">Q{idx + 1}:</span> {val}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Curriculum Metadata */}
        <div className="lg:col-span-6 garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-emerald-950">
            Curriculum Alignment
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <dt className="text-xs font-bold uppercase text-emerald-800">
                Subject &amp; Year Level
              </dt>
              <dd className="font-semibold text-emerald-950 mt-0.5">
                Mathematics · Year 5 (Ages 10–11)
              </dd>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <dt className="text-xs font-bold uppercase text-emerald-800">
                Topic &amp; Content Standard
              </dt>
              <dd className="font-semibold text-emerald-950 mt-0.5">
                Space · 6.3 Perimeter and Area
              </dd>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5">
              <dt className="text-xs font-bold uppercase text-sky-800">Learning Standards</dt>
              <dd className="text-emerald-950">
                <strong>6.3.1</strong> Determine the perimeter of polygons up to eight sides.
              </dd>
              <dd className="text-emerald-950">
                <strong>6.3.2</strong> Determine the area of squares, rectangles, right-angled
                triangles, equilateral triangles and isosceles triangles using 1-unit-square grids
                and formulae.
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="font-display font-bold text-base text-emerald-950 mb-2">
              8 Target Learning Objectives
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-emerald-900">
              {LEARNING_OBJECTIVES.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Pedagogical Sequence & Resources */}
        <div className="lg:col-span-6 space-y-5">
          <div className="garden-card bg-white border-2 border-sky-200 rounded-3xl p-6 space-y-3">
            <h2 className="font-display font-bold text-xl text-emerald-950">
              4-Stage Connected Learning Sequence
            </h2>
            <ol className="space-y-2.5 text-sm text-emerald-950">
              <li className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <strong>1. Canva – Engage &amp; Explain:</strong> Establishes conceptual distinction
                between linear boundary (perimeter) and enclosed surface (area) with visual garden
                models before introducing symbols.
              </li>
              <li className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                <strong>2. GeoGebra – Explore &amp; Investigate:</strong> Moves pupils from passive
                viewing to active manipulation—testing 3–8 sided polygons, perpendicular triangle
                heights, and discovering that equal perimeter (20 cm) yields varying areas.
              </li>
              <li className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <strong>3. FloraGeo AR Garden Designer – Elaborate &amp; Apply:</strong> Transfers
                abstract calculations to an authentic school courtyard design challenge with spatial
                constraints, non-AR 2D accessibility, and written justification.
              </li>
              <li className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <strong>4. ZEP Quiz &amp; Wayground – Evaluate &amp; Assess:</strong> Combines
                low-stakes game-based formative revision (ZEP) and diagnostic feedback with an
                individual 10-question summative assessment (Wayground, ≥ 80% target).
              </li>
            </ol>
          </div>

          <div className="garden-card bg-white border-2 border-amber-200 rounded-3xl p-6 space-y-3">
            <h2 className="font-display font-bold text-xl text-emerald-950">
              Direct Resource Links &amp; Teaching Suggestions
            </h2>
            <div className="space-y-2">
              {resources.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100 text-xs sm:text-sm font-semibold text-emerald-950"
                >
                  <div>
                    <span className="block">{r.name}</span>
                    <span className="text-[11px] text-amber-900">{r.role}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0 text-amber-900" />
                </a>
              ))}
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed pt-1">
              <strong>Classroom Facilitation Tip:</strong> Encourage pupils to pair-discuss Station
              4 (20 cm perimeter) and export their Zone 3 Garden Design summary before attempting the
              Wayground assessment. For pupils without AR-capable tablets, direct them to the
              built-in 2D Courtyard Grid Workspace in Zone 3.
            </p>
          </div>
        </div>
      </div>

      <ZoneBreadcrumbFooter current="teacher" />
    </div>
  );
};
