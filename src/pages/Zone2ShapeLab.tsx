import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { EXTERNAL_RESOURCES } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

const GEOGEBRA_LINKS = [
  {
    title: 'GeoGebra Exploration 1: Polygon & Perimeter',
    url: EXTERNAL_RESOURCES.geogebra1,
    desc: 'Manipulate vertices and inspect outer side lengths.',
  },
  {
    title: 'GeoGebra Exploration 2: Rectangle & Triangle Area',
    url: EXTERNAL_RESOURCES.geogebra2,
    desc: 'Adjust dimensions and watch square units update dynamically.',
  },
  {
    title: 'GeoGebra Exploration 3: Same Perimeter Investigation',
    url: EXTERNAL_RESOURCES.geogebra3,
    desc: 'Compare shapes sharing the same perimeter to observe changing areas.',
  },
];

type StationId = 1 | 2 | 3 | 4;

export const Zone2ShapeLab: React.FC = () => {
  const { progress, updateProgress, markGeoGebraVisited, navigate, playChime } = useGarden();
  const [station, setStation] = useState<StationId>(1);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  // Station 1 state: Polygon Perimeter (3..8 sides)
  const [polySides, setPolySides] = useState<number>(6);
  const [sideLen, setSideLen] = useState<number>(4);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [s1Answer, setS1Answer] = useState<string>('');
  const [s1Reflection, setS1Reflection] = useState<string>('');

  // Station 2 state: Rectangle Area
  const [rectL, setRectL] = useState<number>(6);
  const [rectW, setRectW] = useState<number>(4);
  const [s2Answer, setS2Answer] = useState<string>('');

  // Station 3 state: Triangle Area
  const [triType, setTriType] = useState<'right' | 'equilateral' | 'isosceles'>('right');
  const [triBase, setTriBase] = useState<number>(6);
  const [triHeight, setTriHeight] = useState<number>(4);
  const [showHalfRect, setShowHalfRect] = useState<boolean>(true);
  const [s3Answer, setS3Answer] = useState<string>('');

  // Station 4 state: Same Perimeter (20 cm), Different Area
  const [p20Len, setP20Len] = useState<number>(6);
  const [s4Answer, setS4Answer] = useState<string>('');
  const [s4Reflection, setS4Reflection] = useState<string>('');

  const polyNames: Record<number, string> = {
    3: 'Triangle (3 sides)',
    4: 'Square / Quadrilateral (4 sides)',
    5: 'Pentagon (5 sides)',
    6: 'Hexagon (6 sides)',
    7: 'Heptagon (7 sides)',
    8: 'Octagon (8 sides)',
  };

  // Build regular polygon SVG points centered at (150, 125)
  const buildPolyPoints = (sides: number, radius: number) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      pts.push({
        x: 150 + Math.cos(a) * radius,
        y: 125 + Math.sin(a) * radius,
      });
    }
    return pts;
  };

  const polyPts = buildPolyPoints(polySides, 74);
  const polyPerimeter = polySides * sideLen;

  const rectArea = rectL * rectW;
  const rectPerim = 2 * (rectL + rectW);

  const triArea = 0.5 * triBase * triHeight;

  const p20Width = 10 - p20Len;
  const p20Area = p20Len * p20Width;

  const canonical20 = [
    { name: 'Rectangle A', l: 8, w: 2, p: 20, a: 16 },
    { name: 'Rectangle B', l: 7, w: 3, p: 20, a: 21 },
    { name: 'Rectangle C', l: 6, w: 4, p: 20, a: 24 },
    { name: 'Rectangle D (Square)', l: 5, w: 5, p: 20, a: 25 },
  ];

  const handleCompleteStation = (st: StationId, isCorrect: boolean) => {
    if (!isCorrect) {
      playChime('hint');
      return;
    }
    playChime('success');
    if (st === 1) updateProgress({ station1Done: true });
    if (st === 2) updateProgress({ station2Done: true });
    if (st === 3) updateProgress({ station3Done: true });
    if (st === 4) updateProgress({ station4Done: true });
  };

  const stationStatus = [
    { id: 1 as StationId, label: 'Station 1: Polygons (3–8)', done: progress.station1Done },
    { id: 2 as StationId, label: 'Station 2: Rectangle Area', done: progress.station2Done },
    { id: 3 as StationId, label: 'Station 3: Triangle Area', done: progress.station3Done },
    { id: 4 as StationId, label: 'Station 4: Same Perimeter (20 cm)', done: progress.station4Done },
  ];

  const allStationsDone = stationStatus.every((s) => s.done);

  return (
    <div className="space-y-6">
      {/* Zone Header */}
      <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700">
              <LayoutGrid className="w-4 h-4" />
              <span>Zone 2 · Explore &amp; Investigate · GeoGebra Shape Lab</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              GeoGebra Shape Lab: Explore, Manipulate &amp; Discover
            </h1>
            <p className="text-sm sm:text-base text-emerald-900 max-w-3xl">
              Use the four interactive investigation stations below and launch your three linked
              GeoGebra geometry applets to test patterns and form conjectures.
            </p>
          </div>

          {allStationsDone && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>All 4 Stations Complete — 🔍 Shape Investigator Unlocked!</span>
            </span>
          )}
        </div>

        {/* Linked GeoGebra Applets Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GEOGEBRA_LINKS.map((g) => {
            const visited = progress.geogebraLinksVisited.includes(g.url);
            return (
              <div
                key={g.url}
                className="rounded-2xl bg-sky-50/70 border border-sky-200 p-3.5 flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-sm text-sky-950">{g.title}</span>
                    {visited && (
                      <span className="text-xs font-bold text-emerald-700 shrink-0">✓ Opened</span>
                    )}
                  </div>
                  <p className="text-xs text-sky-900 mt-1">{g.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markGeoGebraVisited(g.url)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold"
                  >
                    <span>Open GeoGebra</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      markGeoGebraVisited(g.url);
                      setEmbedUrl((cur) => (cur === g.url ? null : g.url));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-950 text-xs font-bold hover:bg-sky-50"
                  >
                    {embedUrl === g.url ? 'Hide Embed' : 'Preview Here'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {embedUrl && (
          <div className="space-y-2">
            <div className="w-full h-[460px] rounded-2xl overflow-hidden border-2 border-sky-300 bg-white">
              <iframe
                src={embedUrl}
                title="GeoGebra Interactive Exploration"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-sky-900">
              If GeoGebra asks to open directly in your browser, use the{' '}
              <strong>Open GeoGebra</strong> button above, then complete the 4 investigation
              stations below!
            </p>
          </div>
        )}
      </section>

      {/* Station Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stationStatus.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              playChime('click');
              setStation(s.id);
            }}
            className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm min-h-[54px] flex items-center justify-between gap-2 transition-colors ${
              station === s.id
                ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                : 'bg-white text-emerald-950 border-sky-200 hover:bg-sky-50'
            }`}
          >
            <span>{s.label}</span>
            <span className="text-xs shrink-0">
              {s.done ? (station === s.id ? '✓ Done' : '✓') : '○'}
            </span>
          </button>
        ))}
      </div>

      {/* STATION 1: POLYGON PERIMETER */}
      {station === 1 && (
        <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Station 1 of 4 · Learning Standard 6.3.1
              </span>
              <h2 className="font-display font-bold text-2xl text-emerald-950">
                Polygon Perimeter (Up to 8 Sides)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setPolySides(6);
                setSideLen(4);
                setCompareMode(false);
                setS1Answer('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Station</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-sky-50/60 border-2 border-sky-200 rounded-2xl p-4 space-y-3">
              {!compareMode ? (
                <svg
                  viewBox="0 0 300 250"
                  className="w-full h-auto bg-white rounded-xl border border-sky-200"
                  role="img"
                  aria-label={`${polyNames[polySides]} with side length ${sideLen} cm`}
                >
                  <polygon
                    points={polyPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                    fill="#dcfce7"
                    stroke="#15803d"
                    strokeWidth="4"
                  />
                  {polyPts.map((p, i) => {
                    const next = polyPts[(i + 1) % polyPts.length];
                    const mx = (p.x + next.x) / 2;
                    const my = (p.y + next.y) / 2;
                    return (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#0284c7" />
                        <text
                          x={mx}
                          y={my}
                          dy="-4"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#be123c"
                          fontFamily="IBM Plex Mono, monospace"
                        >
                          {sideLen}cm
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x="150"
                    y="128"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#14261c"
                    fontFamily="Outfit, sans-serif"
                  >
                    {polySides} Sides
                  </text>
                </svg>
              ) : (
                /* Compare two different shapes with SAME 24 cm perimeter */
                <svg
                  viewBox="0 0 360 220"
                  className="w-full h-auto bg-white rounded-xl border border-sky-200"
                  role="img"
                  aria-label="Comparison of a 6 cm square and an 8 cm by 4 cm rectangle both having 24 cm perimeter"
                >
                  <rect x="25" y="45" width="110" height="110" fill="#dcfce7" stroke="#15803d" strokeWidth="4" />
                  <text x="80" y="105" textAnchor="middle" fontSize="13" fontWeight="700" fill="#14261c">
                    Square: 6×6×6×6
                  </text>
                  <text x="80" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#be123c" fontFamily="IBM Plex Mono, monospace">
                    Perimeter = 24 cm
                  </text>

                  <rect x="180" y="65" width="150" height="75" fill="#e0f2fe" stroke="#0284c7" strokeWidth="4" />
                  <text x="255" y="107" textAnchor="middle" fontSize="13" fontWeight="700" fill="#14261c">
                    Rectangle: 8 + 4 + 8 + 4
                  </text>
                  <text x="255" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#be123c" fontFamily="IBM Plex Mono, monospace">
                    Perimeter = 24 cm
                  </text>
                </svg>
              )}

              <button
                type="button"
                onClick={() => setCompareMode((c) => !c)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-100 border border-amber-400 text-amber-950 font-bold text-xs sm:text-sm hover:bg-amber-200"
              >
                {compareMode
                  ? 'Back to 3–8 Sided Polygon Builder'
                  : 'Compare Different Shapes with Same Perimeter (24 cm)'}
              </button>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4">
                <label className="block space-y-1">
                  <span className="flex justify-between text-sm font-bold text-emerald-950">
                    <span>Number of Sides (3 to 8):</span>
                    <span className="font-math text-sky-800">{polyNames[polySides]}</span>
                  </span>
                  <input
                    type="range"
                    min={3}
                    max={8}
                    step={1}
                    value={polySides}
                    onChange={(e) => {
                      setCompareMode(false);
                      setPolySides(Number(e.target.value));
                    }}
                    className="w-full accent-sky-700"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="flex justify-between text-sm font-bold text-emerald-950">
                    <span>Length of Each Side:</span>
                    <span className="font-math text-rose-700">{sideLen} cm</span>
                  </span>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    step={1}
                    value={sideLen}
                    onChange={(e) => {
                      setCompareMode(false);
                      setSideLen(Number(e.target.value));
                    }}
                    className="w-full accent-rose-600"
                  />
                </label>

                <div className="bg-white rounded-xl border border-emerald-200 p-3 space-y-1">
                  <p className="text-xs font-bold uppercase text-emerald-700">Live Calculation</p>
                  <p className="font-math text-sm text-emerald-950 break-words">
                    Perimeter = {Array(polySides).fill(`${sideLen}`).join(' + ')} ={' '}
                    <strong className="text-rose-700">{polyPerimeter} cm</strong>
                  </p>
                </div>
              </div>

              {/* Investigation Question */}
              <div className="rounded-2xl bg-purple-50/50 border border-purple-200 p-4 space-y-3">
                <p className="font-bold text-sm text-emerald-950">
                  Investigation Question: Do two polygons with the same perimeter always have the
                  same shape?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'yes', label: 'Yes, always the same shape' },
                    { id: 'no', label: 'No, different shapes can share the same perimeter' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setS1Answer(opt.id);
                        handleCompleteStation(1, opt.id === 'no');
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold min-h-[42px] ${
                        s1Answer === opt.id
                          ? opt.id === 'no'
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-emerald-950 border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {s1Answer === 'yes' && (
                  <p className="text-xs text-rose-900 font-semibold">
                    ▲ Try clicking “Compare Different Shapes with Same Perimeter (24 cm)”! Both the
                    6×6 square and 8×4 rectangle have Perimeter = 24 cm.
                  </p>
                )}
                {s1Answer === 'no' && (
                  <p className="text-xs text-emerald-900 font-semibold">
                    ✓ Correct! Different polygons (like a 6×6 square and an 8×4 rectangle) can have
                    the exact same outer perimeter of 24 cm.
                  </p>
                )}
                <label className="block space-y-1">
                  <span className="text-xs font-bold text-purple-900">
                    Reflection Prompt (optional note): What did you notice about an octagon vs a
                    triangle?
                  </span>
                  <input
                    type="text"
                    value={s1Reflection}
                    onChange={(e) => setS1Reflection(e.target.value)}
                    placeholder="e.g., More sides means adding more outer lengths..."
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-sm"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStation(2)}
              className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Next Station: Rectangle Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STATION 2: RECTANGLE AREA */}
      {station === 2 && (
        <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Station 2 of 4 · Learning Standard 6.3.2
              </span>
              <h2 className="font-display font-bold text-2xl text-emerald-950">
                Rectangle Area &amp; Dimension Sliders
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setRectL(6);
                setRectW(4);
                setS2Answer('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Station</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-sky-50/60 border-2 border-sky-200 rounded-2xl p-4">
              <svg
                viewBox="0 0 380 300"
                className="w-full h-auto bg-white rounded-xl border border-sky-200"
                role="img"
                aria-label={`Interactive ${rectL} cm by ${rectW} cm rectangle grid`}
              >
                {Array.from({ length: rectW }).map((_, r) =>
                  Array.from({ length: rectL }).map((__, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={30 + c * 26}
                      y={30 + r * 24}
                      width={26}
                      height={24}
                      fill="#bae6fd"
                      stroke="#0284c7"
                      strokeWidth="1.2"
                    />
                  )),
                )}
                <rect
                  x={30}
                  y={30}
                  width={rectL * 26}
                  height={rectW * 24}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3.5"
                />
                <text
                  x={30 + (rectL * 26) / 2}
                  y={20}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Length = {rectL} cm
                </text>
                <text
                  x={30 + rectL * 26 + 8}
                  y={30 + (rectW * 24) / 2}
                  fontSize="13"
                  fontWeight="700"
                  fill="#be123c"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {rectW} cm
                </text>
              </svg>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-4 space-y-3">
                <label className="block space-y-1">
                  <span className="flex justify-between text-sm font-bold text-emerald-950">
                    <span>Length (cm):</span>
                    <span className="font-math text-sky-800">{rectL} cm</span>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={rectL}
                    onChange={(e) => setRectL(Number(e.target.value))}
                    className="w-full accent-sky-700"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="flex justify-between text-sm font-bold text-emerald-950">
                    <span>Width (cm):</span>
                    <span className="font-math text-sky-800">{rectW} cm</span>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={rectW}
                    onChange={(e) => setRectW(Number(e.target.value))}
                    className="w-full accent-sky-700"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRectL((l) => Math.min(12, l * 2))}
                    className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-xs font-bold text-sky-900 hover:bg-sky-50"
                  >
                    Double Length (Keep Width Same)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRectW((w) => Math.min(10, w + 1))}
                    className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-xs font-bold text-sky-900 hover:bg-sky-50"
                  >
                    +1 cm Width Only
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-sky-200 p-3 space-y-1">
                  <p className="font-math text-sm text-emerald-950">
                    Area = {rectL} × {rectW} ={' '}
                    <strong className="text-sky-700">{rectArea} cm²</strong>
                  </p>
                  <p className="font-math text-sm text-emerald-950">
                    Perimeter = 2 × ({rectL} + {rectW}) ={' '}
                    <strong className="text-rose-700">{rectPerim} cm</strong>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-purple-50/50 border border-purple-200 p-4 space-y-3">
                <p className="font-bold text-sm text-emerald-950">
                  Investigation Question: If you keep Width the same and DOUBLE the Length, what
                  happens to the Area?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'double', label: 'The area doubles (× 2)' },
                    { id: 'same', label: 'The area stays the same' },
                    { id: 'half', label: 'The area becomes half' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setS2Answer(opt.id);
                        handleCompleteStation(2, opt.id === 'double');
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold min-h-[42px] ${
                        s2Answer === opt.id
                          ? opt.id === 'double'
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-emerald-950 border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {s2Answer === 'double' && (
                  <p className="text-xs text-emerald-900 font-semibold">
                    ✓ Correct! Because Area = Length × Width, doubling one dimension doubles the
                    number of 1 cm² squares inside.
                  </p>
                )}
                {s2Answer && s2Answer !== 'double' && (
                  <p className="text-xs text-rose-900 font-semibold">
                    ▲ Try clicking “Double Length (Keep Width Same)” and watch the Area number!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStation(3)}
              className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Next Station: Triangle Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STATION 3: TRIANGLE AREA */}
      {station === 3 && (
        <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Station 3 of 4 · Learning Standard 6.3.2
              </span>
              <h2 className="font-display font-bold text-2xl text-emerald-950">
                Triangle Area (Right-Angled, Equilateral &amp; Isosceles)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setTriType('right');
                setTriBase(6);
                setTriHeight(4);
                setShowHalfRect(true);
                setS3Answer('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Station</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-sky-50/60 border-2 border-sky-200 rounded-2xl p-4 space-y-3">
              {/* Triangle Type Switch */}
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['right', 'Right-Angled'],
                    ['equilateral', 'Equilateral'],
                    ['isosceles', 'Isosceles'],
                  ] as const
                ).map(([t, lbl]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTriType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      triType === t
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-emerald-950 border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {(() => {
                const scale = 24;
                const x0 = 45;
                const yBottom = 250;
                const bPx = triBase * scale;
                const effHeight =
                  triType === 'equilateral'
                    ? Number(((Math.sqrt(3) / 2) * triBase).toFixed(2))
                    : triHeight;
                const hPx = effHeight * scale;
                const apexX = triType === 'right' ? x0 : x0 + bPx / 2;
                const apexY = yBottom - hPx;

                return (
                  <svg
                    viewBox="0 0 380 290"
                    className="w-full h-auto bg-white rounded-xl border border-sky-200"
                    role="img"
                    aria-label={`${triType} triangle with base ${triBase} cm and perpendicular height ${effHeight} cm`}
                  >
                    {/* Faint grid */}
                    {Array.from({ length: 14 }).map((_, i) => (
                      <line
                        key={`gv-${i}`}
                        x1={x0 + i * scale}
                        y1={20}
                        x2={x0 + i * scale}
                        y2={270}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line
                        key={`gh-${i}`}
                        x1={20}
                        y1={yBottom - i * scale}
                        x2={360}
                        y2={yBottom - i * scale}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    ))}

                    {showHalfRect && (
                      <rect
                        x={x0}
                        y={apexY}
                        width={bPx}
                        height={hPx}
                        fill="#e0f2fe"
                        fillOpacity="0.4"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeDasharray="5 4"
                      />
                    )}

                    <polygon
                      points={`${x0},${yBottom} ${x0 + bPx},${yBottom} ${apexX},${apexY}`}
                      fill="#bbf7d0"
                      fillOpacity="0.78"
                      stroke="#15803d"
                      strokeWidth="3.5"
                    />

                    {/* Coral Base highlight */}
                    <line
                      x1={x0}
                      y1={yBottom}
                      x2={x0 + bPx}
                      y2={yBottom}
                      stroke="#e11d48"
                      strokeWidth="5"
                    />

                    {/* Purple Perpendicular Height highlight */}
                    <line
                      x1={apexX}
                      y1={apexY}
                      x2={apexX}
                      y2={yBottom}
                      stroke="#7e22ce"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                    <rect
                      x={apexX}
                      y={yBottom - 12}
                      width={12}
                      height={12}
                      fill="none"
                      stroke="#7e22ce"
                      strokeWidth="2"
                    />

                    <text
                      x={x0 + bPx / 2}
                      y={yBottom + 20}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill="#be123c"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      Base = {triBase} cm
                    </text>
                    <text
                      x={apexX + 10}
                      y={apexY + hPx / 2}
                      fontSize="12"
                      fontWeight="700"
                      fill="#6b21a8"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      Height = {effHeight} cm
                    </text>
                  </svg>
                );
              })()}

              <label className="inline-flex items-center gap-2 text-xs font-bold text-sky-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHalfRect}
                  onChange={(e) => setShowHalfRect(e.target.checked)}
                  className="w-4 h-4 accent-sky-700"
                />
                <span>Show Half-Rectangle Proof Outline</span>
              </label>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-4 space-y-3">
                <label className="block space-y-1">
                  <span className="flex justify-between text-sm font-bold text-emerald-950">
                    <span>Base (coral line):</span>
                    <span className="font-math text-rose-700">{triBase} cm</span>
                  </span>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={1}
                    value={triBase}
                    onChange={(e) => setTriBase(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </label>

                {triType !== 'equilateral' ? (
                  <label className="block space-y-1">
                    <span className="flex justify-between text-sm font-bold text-emerald-950">
                      <span>Perpendicular Height (purple dashed 90° line):</span>
                      <span className="font-math text-purple-800">{triHeight} cm</span>
                    </span>
                    <input
                      type="range"
                      min={2}
                      max={9}
                      step={1}
                      value={triHeight}
                      onChange={(e) => setTriHeight(Number(e.target.value))}
                      className="w-full accent-purple-700"
                    />
                  </label>
                ) : (
                  <p className="text-xs bg-white border border-purple-200 rounded-xl p-2.5 text-purple-950">
                    In an <strong>equilateral triangle</strong>, all three sides equal {triBase} cm,
                    so its perpendicular height is automatically{' '}
                    <span className="font-math font-bold">
                      {((Math.sqrt(3) / 2) * triBase).toFixed(2)} cm
                    </span>
                    .
                  </p>
                )}

                <div className="bg-white rounded-xl border border-sky-200 p-3 space-y-1">
                  <p className="text-xs font-bold uppercase text-sky-700">Triangle Area Formula</p>
                  <p className="font-math text-sm text-emerald-950">
                    Area = ½ × {triBase} ×{' '}
                    {triType === 'equilateral'
                      ? ((Math.sqrt(3) / 2) * triBase).toFixed(2)
                      : triHeight}{' '}
                    ={' '}
                    <strong className="text-emerald-700">
                      {triType === 'equilateral'
                        ? (0.5 * triBase * (Math.sqrt(3) / 2) * triBase).toFixed(2)
                        : triArea}{' '}
                      cm²
                    </strong>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-purple-50/50 border border-purple-200 p-4 space-y-3">
                <p className="font-bold text-sm text-emerald-950">
                  Investigation Question: Which height must we use in Area = ½ × base × height?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'perp', label: 'The perpendicular height (at 90° to the base)' },
                    { id: 'slant', label: 'Any slanted outer side' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setS3Answer(opt.id);
                        handleCompleteStation(3, opt.id === 'perp');
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold min-h-[42px] ${
                        s3Answer === opt.id
                          ? opt.id === 'perp'
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-emerald-950 border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {s3Answer === 'perp' && (
                  <p className="text-xs text-emerald-900 font-semibold">
                    ✓ Correct! Always use the perpendicular height forming a 90° right angle with
                    the base.
                  </p>
                )}
                {s3Answer === 'slant' && (
                  <p className="text-xs text-rose-900 font-semibold">
                    ▲ Look at the purple dashed line with the 90° corner square — slanted sides are
                    longer than the true height!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStation(4)}
              className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Next Station: Same Perimeter, Different Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STATION 4: SAME PERIMETER (20 cm), DIFFERENT AREA */}
      {station === 4 && (
        <section className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Station 4 of 4 · Conjecture Discovery
              </span>
              <h2 className="font-display font-bold text-2xl text-emerald-950">
                Same Perimeter (20 cm), Different Area
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setP20Len(6);
                setS4Answer('');
                setS4Reflection('');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Station</span>
            </button>
          </div>

          <PipGuideCard
            title="Compare all four 20 cm perimeter rectangles!"
            message="Each rectangle below uses exactly 20 cm of fence around the outside, yet the number of 1 cm² flower tiles inside changes!"
            tone="yellow"
          />

          {/* Four canonical comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {canonical20.map((r) => {
              const active = p20Len === r.l;
              return (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setP20Len(r.l)}
                  className={`rounded-2xl border-2 p-4 text-left space-y-3 transition-colors ${
                    active
                      ? 'bg-amber-50 border-amber-500 shadow-sm'
                      : 'bg-white border-sky-200 hover:bg-sky-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-emerald-950">
                      {r.name}
                    </span>
                    <span className="font-math text-xs font-bold text-sky-800">
                      {r.l} × {r.w} cm
                    </span>
                  </div>

                  {/* Mini proportional grid */}
                  <div className="h-24 flex items-center justify-center bg-sky-50/70 rounded-xl border border-sky-100 p-2">
                    <svg viewBox="0 0 110 80" className="h-full w-auto">
                      <rect
                        x={55 - r.l * 5.5}
                        y={40 - r.w * 5.5}
                        width={r.l * 11}
                        height={r.w * 11}
                        fill="#bae6fd"
                        stroke="#e11d48"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>

                  <div className="font-math text-xs space-y-1">
                    <p className="text-rose-800 font-bold">Perimeter: {r.p} cm</p>
                    <p className="text-emerald-800 font-bold">Area: {r.a} cm²</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive slider + bar visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5">
            <div className="lg:col-span-6 space-y-3">
              <label className="block space-y-1">
                <span className="flex justify-between text-sm font-bold text-emerald-950">
                  <span>Adjust Length (Perimeter fixed at 20 cm):</span>
                  <span className="font-math text-sky-800">
                    {p20Len} cm × {p20Width} cm
                  </span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={9}
                  step={1}
                  value={p20Len}
                  onChange={(e) => setP20Len(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </label>

              <div className="bg-white rounded-xl border border-emerald-200 p-3 font-math text-sm space-y-1">
                <p>
                  Perimeter = 2 × ({p20Len} + {p20Width}) ={' '}
                  <strong className="text-rose-700">20 cm</strong>
                </p>
                <p>
                  Area = {p20Len} × {p20Width} ={' '}
                  <strong className="text-emerald-700">{p20Area} cm²</strong>
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <p className="font-bold text-sm text-emerald-950">
                Investigation Question: With a fixed perimeter of 20 cm, which rectangle creates the
                LARGEST area?
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '8x2', label: '8 cm × 2 cm (16 cm²)' },
                  { id: '6x4', label: '6 cm × 4 cm (24 cm²)' },
                  { id: '5x5', label: '5 cm × 5 cm Square (25 cm²)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setS4Answer(opt.id);
                      handleCompleteStation(4, opt.id === '5x5');
                    }}
                    className={`px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold min-h-[42px] ${
                      s4Answer === opt.id
                        ? opt.id === '5x5'
                          ? 'bg-emerald-700 text-white border-emerald-800'
                          : 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white text-emerald-950 border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {s4Answer === '5x5' && (
                <p className="text-xs text-emerald-900 font-semibold">
                  ✓ Brilliant discovery! A square (5 cm × 5 cm) encloses the maximum area (25 cm²)
                  for a 20 cm perimeter.
                </p>
              )}
              {s4Answer && s4Answer !== '5x5' && (
                <p className="text-xs text-rose-900 font-semibold">
                  ▲ Compare the areas in the four cards above: 16 cm², 21 cm², 24 cm², and 25 cm²!
                </p>
              )}

              <label className="block space-y-1">
                <span className="text-xs font-bold text-emerald-900">
                  Reflection Prompt: Why is this discovery useful when designing a garden?
                </span>
                <input
                  type="text"
                  value={s4Reflection}
                  onChange={(e) => setS4Reflection(e.target.value)}
                  placeholder="e.g., A square-shaped bed gives more planting space for the same fence..."
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-sm"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('zone3')}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
            >
              <span>Proceed to FloraGeo Garden Designer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      <ZoneBreadcrumbFooter current="zone2" />
    </div>
  );
};
