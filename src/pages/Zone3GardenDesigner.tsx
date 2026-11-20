import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { EXTERNAL_RESOURCES, GardenSectionItem } from '../types/garden';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

const SECTION_PRESETS: {
  name: GardenSectionItem['name'];
  color: string;
}[] = [
  { name: 'Rose Garden', color: '#e11d48' },
  { name: 'Vegetable Garden', color: '#15803d' },
  { name: 'Butterfly Garden', color: '#7e22ce' },
  { name: 'Flower Bed', color: '#d97706' },
  { name: 'Open Activity Area', color: '#0284c7' },
];

const SHAPE_LABELS: Record<GardenSectionItem['shape'], string> = {
  square: 'Square',
  rectangle: 'Rectangle',
  'right-triangle': 'Right-Angled Triangle',
  'isosceles-triangle': 'Isosceles Triangle',
};

function computeSectionMetrics(s: GardenSectionItem): {
  perimeter: number;
  area: number;
  formulaArea: string;
  formulaPerim: string;
} {
  const w = s.width;
  const h = s.shape === 'square' ? s.width : s.height;

  if (s.shape === 'square') {
    return {
      perimeter: 4 * w,
      area: w * w,
      formulaPerim: `${w} + ${w} + ${w} + ${w} = ${4 * w} m`,
      formulaArea: `${w} × ${w} = ${w * w} m²`,
    };
  }
  if (s.shape === 'rectangle') {
    const p = 2 * (w + h);
    const a = w * h;
    return {
      perimeter: p,
      area: a,
      formulaPerim: `${w} + ${h} + ${w} + ${h} = ${p} m`,
      formulaArea: `${w} × ${h} = ${a} m²`,
    };
  }
  if (s.shape === 'right-triangle') {
    const hyp = Math.sqrt(w * w + h * h);
    const p = Number((w + h + hyp).toFixed(2));
    const a = Number((0.5 * w * h).toFixed(2));
    return {
      perimeter: p,
      area: a,
      formulaPerim: `${w} + ${h} + ${hyp.toFixed(2)} = ${p} m`,
      formulaArea: `½ × ${w} × ${h} = ${a} m²`,
    };
  }
  // isosceles-triangle
  const slant = Math.sqrt((w / 2) * (w / 2) + h * h);
  const p = Number((w + 2 * slant).toFixed(2));
  const a = Number((0.5 * w * h).toFixed(2));
  return {
    perimeter: p,
    area: a,
    formulaPerim: `${w} + ${slant.toFixed(2)} + ${slant.toFixed(2)} = ${p} m`,
    formulaArea: `½ × ${w} × ${h} = ${a} m²`,
  };
}

function sectionsOverlap(a: GardenSectionItem, b: GardenSectionItem): boolean {
  const aw = a.width;
  const ah = a.shape === 'square' ? a.width : a.height;
  const bw = b.width;
  const bh = b.shape === 'square' ? b.width : b.height;
  return a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;
}

export const Zone3GardenDesigner: React.FC = () => {
  const { progress, updateProgress, navigate, playChime } = useGarden();

  const [sections, setSections] = useState<GardenSectionItem[]>(progress.gardenSections);
  const [selectedId, setSelectedId] = useState<string>(progress.gardenSections[0]?.id ?? '');
  const [explanation, setExplanation] = useState<string>(progress.gardenExplanation);

  const [newName, setNewName] = useState<GardenSectionItem['name']>('Vegetable Garden');
  const [newShape, setNewShape] = useState<GardenSectionItem['shape']>('square');
  const [showFloraEmbed, setShowFloraEmbed] = useState(false);

  const [snapshotA, setSnapshotA] = useState<{
    count: number;
    totalArea: number;
    totalPerimeter: number;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const GRID_W = 16; // 16 m
  const GRID_H = 12; // 12 m
  const COURTYARD_AREA = GRID_W * GRID_H; // 192 m²
  const MAX_BED_AREA = 140;

  const selected = sections.find((s) => s.id === selectedId) ?? sections[0] ?? null;

  const totals = useMemo(() => {
    let totalArea = 0;
    let totalPerimeter = 0;
    for (const s of sections) {
      const m = computeSectionMetrics(s);
      totalArea += m.area;
      totalPerimeter += m.perimeter;
    }
    return {
      totalArea: Number(totalArea.toFixed(2)),
      totalPerimeter: Number(totalPerimeter.toFixed(2)),
      pathwayArea: Number((COURTYARD_AREA - totalArea).toFixed(2)),
    };
  }, [sections]);

  const hasOverlap = useMemo(() => {
    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        if (sectionsOverlap(sections[i], sections[j])) return true;
      }
    }
    return false;
  }, [sections]);

  const hasTriangle = sections.some(
    (s) => s.shape === 'right-triangle' || s.shape === 'isosceles-triangle',
  );
  const hasQuad = sections.some((s) => s.shape === 'square' || s.shape === 'rectangle');

  const constraints = [
    { label: 'At least 3 geometric garden sections placed', met: sections.length >= 3 },
    { label: 'Includes at least 1 Square/Rectangle AND 1 Triangle', met: hasQuad && hasTriangle },
    {
      label: `Total section area ≤ ${MAX_BED_AREA} m² (leaving ≥ 52 m² for walkways)`,
      met: totals.totalArea <= MAX_BED_AREA && totals.totalArea > 0,
    },
    { label: 'No overlapping garden beds on the 16 m × 12 m courtyard grid', met: !hasOverlap },
    {
      label: 'Written mathematical justification (at least 20 characters)',
      met: explanation.trim().length >= 20,
    },
  ];

  const allConstraintsMet = constraints.every((c) => c.met);

  const handleAddSection = () => {
    const preset = SECTION_PRESETS.find((p) => p.name === newName) ?? SECTION_PRESETS[0];
    const w = 4;
    const h = newShape === 'square' ? 4 : 3;
    // Pick an available spot
    const offset = sections.length % 4;
    const nextItem: GardenSectionItem = {
      id: `sec-${Date.now()}`,
      name: newName,
      shape: newShape,
      x: Math.min(GRID_W - w, 1 + offset * 3),
      y: Math.min(GRID_H - h, 6),
      width: w,
      height: h,
      color: preset.color,
    };
    const next = [...sections, nextItem];
    setSections(next);
    setSelectedId(nextItem.id);
    setSaveMessage('');
    playChime('click');
  };

  const updateSelected = (patch: Partial<GardenSectionItem>) => {
    if (!selected) return;
    setSections((prev) =>
      prev.map((item) => {
        if (item.id !== selected.id) return item;
        const merged = { ...item, ...patch };
        if (merged.shape === 'square') merged.height = merged.width;
        merged.x = Math.max(0, Math.min(GRID_W - merged.width, merged.x));
        merged.y = Math.max(0, Math.min(GRID_H - merged.height, merged.y));
        return merged;
      }),
    );
    setSaveMessage('');
  };

  const handleDeleteSelected = () => {
    if (!selected) return;
    const next = sections.filter((s) => s.id !== selected.id);
    setSections(next);
    setSelectedId(next[0]?.id ?? '');
    setSaveMessage('');
  };

  const handleSaveDesign = () => {
    if (!allConstraintsMet) {
      playChime('hint');
      setSaveMessage(
        'Please complete every item on the Design Checklist (including 3+ sections, no overlaps, and your explanation) before saving.',
      );
      return;
    }
    playChime('success');
    updateProgress({
      gardenSections: sections,
      gardenExplanation: explanation,
      gardenDesignSaved: true,
    });
    setSaveMessage('✓ Garden design saved! You earned the 🌷 Garden Architect badge!');
  };

  const handleDownloadSummary = () => {
    const lines = [
      'GEOMETRY GARDEN — SCHOOL GARDEN DESIGN REPORT',
      '==============================================',
      `Courtyard Size: ${GRID_W} m × ${GRID_H} m (${COURTYARD_AREA} m²)`,
      `Sections Placed: ${sections.length}`,
      `Total Garden Bed Area: ${totals.totalArea} m²`,
      `Remaining Walkway Area: ${totals.pathwayArea} m²`,
      `Combined Section Perimeters: ${totals.totalPerimeter} m`,
      '',
      'SECTION DETAILS:',
      ...sections.map((s, idx) => {
        const m = computeSectionMetrics(s);
        return `${idx + 1}. ${s.name} (${SHAPE_LABELS[s.shape]}) — ${s.width} m × ${
          s.shape === 'square' ? s.width : s.height
        } m | Perimeter: ${m.formulaPerim} | Area: ${m.formulaArea}`;
      }),
      '',
      'MATHEMATICAL JUSTIFICATION:',
      explanation || '(None entered yet)',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geometry-garden-design.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Scenario */}
      <section className="garden-card bg-white border-2 border-rose-300 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
              <Sparkles className="w-4 h-4" />
              <span>Zone 3 · Elaborate &amp; Apply · FloraGeo AR Garden Designer</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl text-emerald-950">
              The FloraGeo AR: School Garden Design Challenge
            </h1>
            <p className="text-sm sm:text-base text-emerald-900 max-w-3xl">
              “The school is planning a new educational garden. You have been selected as a{' '}
              <strong>Junior Garden Designer</strong>. Design a garden using geometric shapes while
              considering dimensions, perimeter, area and available space.”
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={EXTERNAL_RESOURCES.floraGeo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => updateProgress({ floraGeoVisited: true })}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm min-h-[44px] inline-flex items-center gap-2"
            >
              <span>Launch FloraGeo AR</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => {
                setShowFloraEmbed((v) => !v);
                updateProgress({ floraGeoVisited: true });
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 border-2 border-rose-300 font-bold text-sm min-h-[44px]"
            >
              {showFloraEmbed ? 'Hide FloraGeo Frame' : 'Preview FloraGeo'}
            </button>
          </div>
        </div>

        {showFloraEmbed && (
          <div className="space-y-2">
            <div className="w-full h-[440px] rounded-2xl overflow-hidden border-2 border-rose-200 bg-white">
              <iframe
                src={EXTERNAL_RESOURCES.floraGeo}
                title="FloraGeo AR Garden Designer"
                className="w-full h-full border-0"
                allow="camera; xr-spatial-tracking"
              />
            </div>
            <p className="text-xs text-rose-900">
              If your device does not support WebAR or camera permissions, use our{' '}
              <strong>Accessible 2D Grid Garden Workspace</strong> right below!
            </p>
          </div>
        )}

        <PipGuideCard
          title="No AR Camera? Use the 2D Courtyard Grid Studio Below!"
          message="Select shapes, adjust dimensions in metres, move sections with click or arrow buttons, compare layouts, and check every teacher constraint."
          tone="purple"
        />
      </section>

      {/* Main 2D Garden Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Courtyard Grid Canvas */}
        <div className="xl:col-span-7 garden-card bg-white border-2 border-emerald-300 rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-emerald-950">
                2D Garden Layout (16 m × 12 m Courtyard = 192 m²)
              </h2>
              <p className="text-xs text-emerald-800">
                Each grid square = 1 m × 1 m (1 m²). Click any garden bed to edit or move it.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSections([
                  {
                    id: 'sec-1',
                    name: 'Rose Garden',
                    shape: 'rectangle',
                    x: 1,
                    y: 1,
                    width: 5,
                    height: 3,
                    color: '#e11d48',
                  },
                  {
                    id: 'sec-2',
                    name: 'Butterfly Garden',
                    shape: 'right-triangle',
                    x: 8,
                    y: 1,
                    width: 6,
                    height: 4,
                    color: '#7e22ce',
                  },
                ]);
                setSelectedId('sec-1');
                setSaveMessage('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Layout</span>
            </button>
          </div>

          <svg
            viewBox="0 0 640 480"
            className="w-full h-auto rounded-2xl border-2 border-emerald-400 bg-emerald-50"
            role="img"
            aria-label="16 metre by 12 metre interactive 2D school garden courtyard grid"
          >
            {/* 1m x 1m Grid (each metre = 40px) */}
            {Array.from({ length: GRID_W + 1 }).map((_, c) => (
              <line
                key={`gx-${c}`}
                x1={c * 40}
                y1={0}
                x2={c * 40}
                y2={480}
                stroke="#bbf7d0"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: GRID_H + 1 }).map((_, r) => (
              <line
                key={`gy-${r}`}
                x1={0}
                y1={r * 40}
                x2={640}
                y2={r * 40}
                stroke="#bbf7d0"
                strokeWidth="1"
              />
            ))}

            {/* Garden Sections */}
            {sections.map((s) => {
              const px = s.x * 40;
              const py = s.y * 40;
              const pw = s.width * 40;
              const ph = (s.shape === 'square' ? s.width : s.height) * 40;
              const isSelected = selected?.id === s.id;
              const m = computeSectionMetrics(s);

              return (
                <g
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.name}, ${SHAPE_LABELS[s.shape]}, ${s.width} by ${
                    s.shape === 'square' ? s.width : s.height
                  } metres`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(s.id);
                    }
                  }}
                >
                  {(s.shape === 'square' || s.shape === 'rectangle') && (
                    <rect
                      x={px}
                      y={py}
                      width={pw}
                      height={ph}
                      rx="4"
                      fill={s.color}
                      fillOpacity="0.24"
                      stroke={isSelected ? '#0f172a' : s.color}
                      strokeWidth={isSelected ? 4 : 2.5}
                    />
                  )}
                  {s.shape === 'right-triangle' && (
                    <polygon
                      points={`${px},${py + ph} ${px + pw},${py + ph} ${px},${py}`}
                      fill={s.color}
                      fillOpacity="0.24"
                      stroke={isSelected ? '#0f172a' : s.color}
                      strokeWidth={isSelected ? 4 : 2.5}
                    />
                  )}
                  {s.shape === 'isosceles-triangle' && (
                    <polygon
                      points={`${px},${py + ph} ${px + pw},${py + ph} ${px + pw / 2},${py}`}
                      fill={s.color}
                      fillOpacity="0.24"
                      stroke={isSelected ? '#0f172a' : s.color}
                      strokeWidth={isSelected ? 4 : 2.5}
                    />
                  )}

                  <text
                    x={px + pw / 2}
                    y={py + ph / 2 - 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#14261c"
                    fontFamily="Outfit, sans-serif"
                  >
                    {s.name}
                  </text>
                  <text
                    x={px + pw / 2}
                    y={py + ph / 2 + 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#14261c"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {m.area} m²
                  </text>
                </g>
              );
            })}
          </svg>

          {hasOverlap && (
            <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-xl px-3 py-2">
              ▲ Two garden sections overlap! Select one and move it with the arrow buttons.
            </p>
          )}

          {/* Add New Section Bar */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-end gap-3">
            <label className="flex-1 min-w-[160px] space-y-1">
              <span className="text-xs font-bold text-emerald-950">Section Type</span>
              <select
                value={newName}
                onChange={(e) => setNewName(e.target.value as GardenSectionItem['name'])}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-sm font-semibold min-h-[42px]"
              >
                {SECTION_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex-1 min-w-[160px] space-y-1">
              <span className="text-xs font-bold text-emerald-950">Geometric Shape</span>
              <select
                value={newShape}
                onChange={(e) => setNewShape(e.target.value as GardenSectionItem['shape'])}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-sm font-semibold min-h-[42px]"
              >
                {Object.entries(SHAPE_LABELS).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {lbl}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleAddSection}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[42px] inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>
        </div>

        {/* Right: Controls, Calculation Panel, Design Comparison, Checklist */}
        <div className="xl:col-span-5 space-y-5">
          {/* Selected Section Controls */}
          <div className="garden-card bg-white border-2 border-sky-300 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-bold text-lg text-emerald-950">
                {selected ? `Edit: ${selected.name}` : 'Select a Garden Section'}
              </h2>
              {selected && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold inline-flex items-center gap-1 hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {selected && (
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="flex justify-between text-xs font-bold text-emerald-950">
                    <span>
                      {selected.shape === 'square'
                        ? 'Side Length (m):'
                        : selected.shape.includes('triangle')
                          ? 'Base (m):'
                          : 'Length (m):'}
                    </span>
                    <span className="font-math text-sky-800">{selected.width} m</span>
                  </span>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={selected.width}
                    onChange={(e) => updateSelected({ width: Number(e.target.value) })}
                    className="w-full accent-sky-700"
                  />
                </label>

                {selected.shape !== 'square' && (
                  <label className="block space-y-1">
                    <span className="flex justify-between text-xs font-bold text-emerald-950">
                      <span>
                        {selected.shape.includes('triangle')
                          ? 'Perpendicular Height (m):'
                          : 'Width (m):'}
                      </span>
                      <span className="font-math text-sky-800">{selected.height} m</span>
                    </span>
                    <input
                      type="range"
                      min={2}
                      max={7}
                      step={1}
                      value={selected.height}
                      onChange={(e) => updateSelected({ height: Number(e.target.value) })}
                      className="w-full accent-sky-700"
                    />
                  </label>
                )}

                {/* Keyboard-accessible move pad */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-bold text-emerald-900">
                    Move Section (Position: {selected.x}m, {selected.y}m)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateSelected({ x: selected.x - 1 })}
                      aria-label="Move section left"
                      className="p-2 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSelected({ y: selected.y - 1 })}
                      aria-label="Move section up"
                      className="p-2 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSelected({ y: selected.y + 1 })}
                      aria-label="Move section down"
                      className="p-2 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSelected({ x: selected.x + 1 })}
                      aria-label="Move section right"
                      className="p-2 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculation Panel */}
          <div className="garden-card bg-white border-2 border-amber-300 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-bold text-lg text-emerald-950">
                Live Calculation Panel
              </h2>
              <button
                type="button"
                onClick={() =>
                  setSnapshotA({
                    count: sections.length,
                    totalArea: totals.totalArea,
                    totalPerimeter: totals.totalPerimeter,
                  })
                }
                className="px-2.5 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 hover:bg-amber-200"
              >
                Save Snapshot to Compare
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sections.map((s) => {
                const m = computeSectionMetrics(s);
                return (
                  <div
                    key={s.id}
                    className="rounded-xl bg-amber-50/50 border border-amber-200 p-2.5 text-xs space-y-0.5"
                  >
                    <div className="flex justify-between font-bold text-emerald-950">
                      <span>
                        {s.name} ({SHAPE_LABELS[s.shape]})
                      </span>
                      <span className="font-math">
                        {s.width}×{s.shape === 'square' ? s.width : s.height} m
                      </span>
                    </div>
                    <p className="font-math text-rose-800">Perimeter: {m.formulaPerim}</p>
                    <p className="font-math text-emerald-800">Area: {m.formulaArea}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-2">
                <span className="block text-[11px] font-bold text-rose-800">Total Perimeter</span>
                <span className="font-math text-sm font-bold text-rose-950">
                  {totals.totalPerimeter} m
                </span>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2">
                <span className="block text-[11px] font-bold text-emerald-800">Garden Area</span>
                <span className="font-math text-sm font-bold text-emerald-950">
                  {totals.totalArea} m²
                </span>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-2">
                <span className="block text-[11px] font-bold text-sky-800">Walkway Space</span>
                <span className="font-math text-sm font-bold text-sky-950">
                  {totals.pathwayArea} m²
                </span>
              </div>
            </div>

            {snapshotA && (
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-2.5 text-xs text-sky-950">
                <strong>Design Comparison:</strong> Snapshot A ({snapshotA.count} beds,{' '}
                {snapshotA.totalArea} m², {snapshotA.totalPerimeter} m fence) vs Current (
                {sections.length} beds, {totals.totalArea} m², {totals.totalPerimeter} m fence).
              </div>
            )}
          </div>

          {/* Design Checklist + Justification */}
          <div className="garden-card bg-white border-2 border-purple-300 rounded-3xl p-5 space-y-4">
            <h2 className="font-display font-bold text-lg text-emerald-950">
              Teacher Design Checklist &amp; Explanation
            </h2>

            <ul className="space-y-2">
              {constraints.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  {c.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className={c.met ? 'font-semibold text-emerald-900' : 'text-slate-700'}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>

            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-purple-950">
                Explain &amp; Justify Your Mathematical Decisions:
              </span>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => {
                  setExplanation(e.target.value);
                  setSaveMessage('');
                }}
                placeholder="Explain why you chose these shapes and dimensions (mention perimeter, area, and walking space in m and m²)..."
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 text-sm"
              />
            </label>

            {saveMessage && (
              <p
                className={`text-xs font-bold rounded-xl px-3 py-2 border ${
                  progress.gardenDesignSaved && allConstraintsMet
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {saveMessage}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveDesign}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm min-h-[44px] inline-flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Garden Design</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSummary}
                className="py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border-2 border-sky-300 font-bold text-sm min-h-[44px] inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('zone4')}
          className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm min-h-[46px] inline-flex items-center gap-2"
        >
          <span>Continue to Zone 4: Quiz Adventure</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <ZoneBreadcrumbFooter current="zone3" />
    </div>
  );
};
