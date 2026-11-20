import React from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';
import { EXTERNAL_RESOURCES, LEARNING_OBJECTIVES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';

export const TeacherPage: React.FC = () => {
  const resources = [
    { name: '1. Canva – Understanding Perimeter & Area', role: 'Engage and Explain', url: EXTERNAL_RESOURCES.canva },
    { name: '2a. GeoGebra – Exploration 1 (Polygons & Perimeter)', role: 'Explore and Investigate', url: EXTERNAL_RESOURCES.geogebra1 },
    { name: '2b. GeoGebra – Exploration 2 (Rectangle & Triangle Area)', role: 'Explore and Investigate', url: EXTERNAL_RESOURCES.geogebra2 },
    { name: '2c. GeoGebra – Exploration 3 (Same Perimeter Comparison)', role: 'Explore and Investigate', url: EXTERNAL_RESOURCES.geogebra3 },
    { name: '3. FloraGeo AR – Garden Designer', role: 'Elaborate and Apply', url: EXTERNAL_RESOURCES.floraGeo },
    { name: '4a. ZEP Quiz – Formative Game Revision', role: 'Evaluate (Formative)', url: EXTERNAL_RESOURCES.zepQuiz },
    { name: '4b. Wayground – 10-Question Final Assessment', role: 'Evaluate (Summative)', url: EXTERNAL_RESOURCES.wayground },
  ];

  return (
    <div className="space-y-6">
      <section className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
          <GraduationCap className="w-4 h-4" />
          <span>Teacher Information Panel</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-emerald-950">
          Pedagogical Guide &amp; Curriculum Alignment
        </h1>
        <p className="text-sm text-emerald-900 max-w-3xl">
          Overview of how the four Task 2 digital resources connect seamlessly across a structured
          5E-aligned Year 5 Mathematics learning sequence.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Curriculum Metadata */}
        <div className="lg:col-span-6 garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-emerald-950">
            Curriculum Alignment
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <dt className="text-xs font-bold uppercase text-emerald-800">Subject &amp; Year Level</dt>
              <dd className="font-semibold text-emerald-950 mt-0.5">
                Mathematics · Year 5 (Ages 10–11)
              </dd>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <dt className="text-xs font-bold uppercase text-emerald-800">Topic &amp; Content Standard</dt>
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
                <strong>4. ZEP Quiz &amp; Wayground – Evaluate &amp; Assess:</strong> Combines low-stakes
                game-based formative revision (ZEP) and diagnostic feedback with an individual
                10-question summative assessment (Wayground, ≥ 80% target).
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
