import React from 'react';
import { Volume2 } from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { PageId } from '../types/garden';

export const ButterflyAccent: React.FC<{ color?: string; className?: string }> = ({
  color = '#f59e0b',
  className = '',
}) => (
  <svg
    viewBox="0 0 64 48"
    className={`w-10 h-8 animate-flutter pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="20" cy="18" rx="14" ry="11" fill={color} opacity="0.9" />
    <ellipse cx="44" cy="18" rx="14" ry="11" fill={color} opacity="0.9" />
    <ellipse cx="22" cy="31" rx="10" ry="8" fill="#fb7185" opacity="0.85" />
    <ellipse cx="42" cy="31" rx="10" ry="8" fill="#fb7185" opacity="0.85" />
    <rect x="30" y="13" width="4" height="22" rx="2" fill="#3b2f2f" />
    <path d="M31 13 Q25 5 20 6" stroke="#3b2f2f" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M33 13 Q39 5 44 6" stroke="#3b2f2f" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const PipGuideCard: React.FC<{
  title: string;
  message: string;
  tone?: 'green' | 'blue' | 'yellow' | 'purple';
}> = ({ title, message, tone = 'green' }) => {
  const { speakText, a11y } = useGarden();

  const toneStyles = {
    green: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    blue: 'bg-sky-50 border-sky-300 text-sky-950',
    yellow: 'bg-amber-50 border-amber-300 text-amber-950',
    purple: 'bg-purple-50 border-purple-300 text-purple-950',
  }[tone];

  return (
    <div className={`garden-card border-2 rounded-2xl p-4 flex items-start gap-3.5 ${toneStyles}`}>
      {/* Friendly Cartoon Sprout Guide */}
      <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0" aria-hidden="true">
        <circle cx="32" cy="34" r="24" fill="#bbf7d0" stroke="#15803d" strokeWidth="2.5" />
        <path d="M32 14 C32 6, 44 4, 46 12 C42 16, 35 16, 32 14 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        <path d="M32 14 C32 6, 20 4, 18 12 C22 16, 29 16, 32 14 Z" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
        <circle cx="24" cy="33" r="3" fill="#14261c" />
        <circle cx="40" cy="33" r="3" fill="#14261c" />
        <path d="M26 42 Q32 47 38 42" stroke="#14261c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="20" cy="38" r="3" fill="#fda4af" opacity="0.7" />
        <circle cx="44" cy="38" r="3" fill="#fda4af" opacity="0.7" />
      </svg>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="font-display font-bold text-sm sm:text-base">{title}</p>
          <button
            type="button"
            onClick={() => {
              if (!a11y.audioEnabled) {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const u = new SpeechSynthesisUtterance(`${title}. ${message}`);
                  u.rate = 0.95;
                  window.speechSynthesis.speak(u);
                }
              } else {
                speakText(`${title}. ${message}`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-current/20 text-xs font-semibold hover:bg-white"
            aria-label={`Read aloud: ${title}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Aloud</span>
          </button>
        </div>
        <p className="text-sm leading-relaxed mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
};

/**
 * Illustrated Interactive Garden Map connecting all four learning zones
 * plus the Final Reflection summit along a winding storybook garden path
 * with a white picket fence, ponds, golden wooden bridge, topiary animals,
 * rainbow-rock flower patch, butterfly, and 5 glossy stepping-stone nodes.
 */
export const IllustratedGardenMap: React.FC = () => {
  const { navigate, computed, progress, playChime } = useGarden();

  const stops: {
    id: PageId;
    num: number;
    shortTitle: string;
    subtitle: string;
    done: boolean;
    x: number;
    y: number;
    labelPos: 'top' | 'bottom';
  }[] = [
    {
      id: 'zone1',
      num: 1,
      shortTitle: 'Learn & Discover',
      subtitle: 'Canva Lesson',
      done: computed.zone1Done,
      x: 265,
      y: 200,
      labelPos: 'top',
    },
    {
      id: 'zone2',
      num: 2,
      shortTitle: 'Shape Lab',
      subtitle: 'GeoGebra',
      done: computed.zone2Done,
      x: 515,
      y: 196,
      labelPos: 'top',
    },
    {
      id: 'zone3',
      num: 3,
      shortTitle: 'Garden Designer',
      subtitle: 'FloraGeo AR',
      done: computed.zone3Done,
      x: 685,
      y: 276,
      labelPos: 'top',
    },
    {
      id: 'zone4',
      num: 4,
      shortTitle: 'Quiz Adventure',
      subtitle: 'ZEP & Wayground',
      done: computed.zone4Done,
      x: 345,
      y: 388,
      labelPos: 'bottom',
    },
    {
      id: 'reflection',
      num: 5,
      shortTitle: 'Garden Summit',
      subtitle: 'Final Reflection',
      done: progress.reflectionCompleted,
      x: 585,
      y: 462,
      labelPos: 'bottom',
    },
  ];

  // Position Pip cheerful guide beside the pupil's next recommended stop
  const activeStop =
    stops.find((s) => s.id === computed.nextRecommendedZone) ?? stops[0];

  return (
    <div className="garden-card bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-emerald-950">
            Interactive Geometry Garden Map
          </h2>
          <p className="text-sm text-emerald-800">
            Follow the winding garden path across the bridge — click stepping stones 1 to 5 to enter each zone!
          </p>
        </div>
        <ButterflyAccent color="#a855f7" />
      </div>

      {/* Storybook Garden Map SVG */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 1000 540"
          className="w-full min-w-[680px] h-auto rounded-2xl border-2 border-emerald-300 shadow-inner"
          role="img"
          aria-label="Illustrated Geometry Garden map with winding path, picket fence, ponds, wooden bridge, topiary animals, and numbered stepping stones 1 to 5"
        >
          <defs>
            <linearGradient id="ggSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="ggLawn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#74db45" />
              <stop offset="100%" stopColor="#58c732" />
            </linearGradient>
            <linearGradient id="ggBridge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="ggTabGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <pattern id="ggGrassStripes" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <rect width="40" height="80" fill="#84e855" fillOpacity="0.32" />
              <rect x="40" width="40" height="80" fill="#4cbb2a" fillOpacity="0.12" />
            </pattern>
            <filter id="ggShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#14532d" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Sky backdrop */}
          <rect x="0" y="0" width="1000" height="175" fill="url(#ggSky)" />

          {/* Rolling green meadow + mowed lawn stripes */}
          <path d="M0 115 Q340 80 680 108 T1000 95 L1000 540 L0 540 Z" fill="url(#ggLawn)" />
          <path d="M0 115 Q340 80 680 108 T1000 95 L1000 540 L0 540 Z" fill="url(#ggGrassStripes)" />

          {/* Upper-right warm tree trunk & red polka-dot mushrooms */}
          <path d="M825 0 L925 0 C915 70 935 125 970 155 L805 155 C835 110 835 55 825 0 Z" fill="#f59e0b" />
          <path d="M852 0 L880 0 C875 65 880 115 895 155 L842 155 C854 110 855 55 852 0 Z" fill="#d97706" opacity="0.45" />
          {/* Red Mushrooms */}
          <g transform="translate(705, 118)">
            <rect x="-5" y="4" width="10" height="14" rx="3" fill="#fef3c7" />
            <path d="M-16 6 C-16 -10 16 -10 16 6 Z" fill="#dc2626" />
            <circle cx="-6" cy="-1" r="2.5" fill="#ffffff" />
            <circle cx="5" cy="-2" r="2" fill="#ffffff" />
            <circle cx="1" cy="3" r="1.8" fill="#ffffff" />
          </g>
          <g transform="translate(740, 102) scale(1.25)">
            <rect x="-5" y="4" width="10" height="14" rx="3" fill="#fef3c7" />
            <path d="M-16 6 C-16 -10 16 -10 16 6 Z" fill="#dc2626" />
            <circle cx="-6" cy="-1" r="2.5" fill="#ffffff" />
            <circle cx="6" cy="0" r="2.2" fill="#ffffff" />
            <circle cx="0" cy="-4" r="2" fill="#ffffff" />
          </g>

          {/* Soil border & colorful lollipop flowers behind picket fence */}
          <path d="M0 140 Q360 105 760 135 L760 162 Q360 132 0 165 Z" fill="#78350f" />
          {[110, 165, 290, 345, 445, 515, 585, 650].map((fx, idx) => {
            const colors = ['#2563eb', '#ef4444', '#facc15', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#38bdf8'];
            const c = colors[idx % colors.length];
            const fy = 112 + (idx % 3) * 8;
            return (
              <g key={fx} transform={`translate(${fx}, ${fy})`}>
                <line x1="0" y1="0" x2="0" y2="34" stroke="#15803d" strokeWidth="3.5" />
                <circle cx="0" cy="0" r="11" fill={c} />
                <circle cx="0" cy="0" r="5" fill="#fef9c3" opacity="0.85" />
              </g>
            );
          })}

          {/* Curved white wooden picket fence */}
          <path d="M0 118 Q360 88 730 112" fill="none" stroke="#f8fafc" strokeWidth="7" />
          <path d="M0 142 Q360 112 730 136" fill="none" stroke="#e2e8f0" strokeWidth="7" />
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 14 + i * 33;
            const curveY = 92 + Math.pow((x - 360) / 360, 2) * 20;
            return (
              <g key={i} transform={`translate(${x}, ${curveY})`}>
                <path d="M0 10 L9 0 L18 10 L18 58 L0 58 Z" fill="#fffbeb" stroke="#cbd5e1" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Left round leafy tree */}
          <g transform="translate(65, 138)">
            <rect x="-7" y="25" width="14" height="42" rx="4" fill="#92400e" />
            <circle cx="0" cy="4" r="34" fill="#22c55e" />
            <circle cx="-20" cy="14" r="22" fill="#4ade80" />
            <circle cx="20" cy="14" r="22" fill="#16a34a" />
            <circle cx="-8" cy="-10" r="14" fill="#86efac" opacity="0.5" />
          </g>

          {/* Upper-left oval lily pond */}
          <g transform="translate(360, 290)">
            <ellipse cx="0" cy="0" rx="115" ry="38" fill="#0284c7" opacity="0.85" />
            <ellipse cx="0" cy="-2" rx="102" ry="30" fill="#38bdf8" opacity="0.7" />
            {/* White blooming water lily */}
            <g transform="translate(-18, -8)">
              <ellipse cx="0" cy="12" rx="26" ry="7" fill="#15803d" opacity="0.55" />
              <polygon points="0,-16 -7,8 7,8" fill="#ffffff" />
              <polygon points="-14,-10 -4,8 3,6" fill="#f8fafc" />
              <polygon points="14,-10 4,8 -3,6" fill="#f8fafc" />
              <polygon points="-22,-2 -5,9 0,5" fill="#e2e8f0" />
              <polygon points="22,-2 5,9 0,5" fill="#e2e8f0" />
            </g>
            {/* Smaller blue lotus tufts */}
            <path d="M-74 6 L-78 -6 L-71 2 L-68 -9 L-65 2 L-59 -6 L-63 6 Z" fill="#1d4ed8" opacity="0.75" />
            <path d="M48 6 L44 -6 L51 2 L54 -9 L57 2 L63 -6 L59 6 Z" fill="#1d4ed8" opacity="0.75" />
          </g>

          {/* Lower-right stream pond with lily pads & reeds */}
          <g transform="translate(650, 385)">
            <path
              d="M-135 20 C-100 -35, 30 -45, 115 -15 C175 8, 175 58, 95 66 C15 72, -105 60, -135 20 Z"
              fill="#0284c7"
              opacity="0.82"
            />
            <path
              d="M-118 18 C-85 -22, 25 -32, 95 -8 C142 10, 142 46, 80 52 C15 58, -88 46, -118 18 Z"
              fill="#38bdf8"
              opacity="0.6"
            />
            {/* Lily pads */}
            <ellipse cx="32" cy="18" rx="18" ry="7" fill="#4ade80" />
            <ellipse cx="82" cy="12" rx="15" ry="6" fill="#22c55e" />
            <ellipse cx="64" cy="36" rx="14" ry="5" fill="#4ade80" />
            {/* Reeds */}
            <path d="M12 -18 L8 -44 M18 -18 L20 -48 M24 -16 L30 -42" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            <path d="M98 -10 L95 -34 M104 -10 L108 -38 M110 -8 L116 -32" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Winding tan/sandstone S-curve Garden Path with crisp white center ribbon */}
          <path
            d="M-20 260 C110 215, 255 190, 495 195 C650 198, 745 252, 650 286 C540 325, 345 340, 345 392 C345 452, 560 472, 1020 482"
            fill="none"
            stroke="#c29b45"
            strokeWidth="62"
            strokeLinecap="round"
          />
          <path
            d="M-20 260 C110 215, 255 190, 495 195 C650 198, 745 252, 650 286 C540 325, 345 340, 345 392 C345 452, 560 472, 1020 482"
            fill="none"
            stroke="#ebd484"
            strokeWidth="52"
            strokeLinecap="round"
          />
          <path
            d="M-20 260 C110 215, 255 190, 495 195 C650 198, 745 252, 650 286 C540 325, 345 340, 345 392 C345 452, 560 472, 1020 482"
            fill="none"
            stroke="#fffdf2"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Golden Arched Wooden Bridge crossing the pond */}
          <g transform="translate(505, 326)" filter="url(#ggShadow)">
            {/* Back handrail */}
            <path d="M-112 -22 Q0 -74 112 -22" fill="none" stroke="#eab308" strokeWidth="8" strokeLinecap="round" />
            {/* Bridge deck arch */}
            <path
              d="M-118 8 Q0 -58 118 8 L100 32 Q0 -26 -100 32 Z"
              fill="url(#ggBridge)"
              stroke="#a16207"
              strokeWidth="2.5"
            />
            {/* Plank lines */}
            {[-78, -46, -14, 18, 50, 82].map((px) => (
              <line
                key={px}
                x1={px}
                y1={-22 + Math.abs(px) * 0.24}
                x2={px - 6}
                y2={12 + Math.abs(px) * 0.16}
                stroke="#a16207"
                strokeWidth="2"
                opacity="0.7"
              />
            ))}
            {/* Front handrail */}
            <path d="M-104 20 Q0 -34 104 20" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
          </g>

          {/* Topiary Animals: Hippo (bottom-left) & Giraffe (right) */}
          <g transform="translate(68, 378)" opacity="0.92">
            <ellipse cx="0" cy="18" rx="44" ry="26" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <circle cx="38" cy="12" r="20" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <circle cx="48" cy="4" r="4" fill="#14532d" />
            <circle cx="28" cy="-4" r="6" fill="#22c55e" />
            <rect x="-28" y="34" width="14" height="16" rx="5" fill="#16a34a" />
            <rect x="8" y="34" width="14" height="16" rx="5" fill="#16a34a" />
          </g>

          <g transform="translate(900, 260)" opacity="0.94">
            {/* Giraffe body & tall neck */}
            <ellipse cx="26" cy="70" rx="46" ry="24" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <path d="M-4 68 L-34 -72 L-16 -76 L16 58 Z" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <ellipse cx="-32" cy="-76" rx="22" ry="12" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <line x1="-26" y1="-86" x2="-24" y2="-98" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-18" y1="-85" x2="-14" y2="-96" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="-36" cy="-78" r="2.5" fill="#14532d" />
            <rect x="-6" y="84" width="12" height="62" rx="4" fill="#16a34a" />
            <rect x="44" y="84" width="12" height="62" rx="4" fill="#16a34a" />
          </g>

          {/* Bottom-left rainbow rock-ringed flower bed, daisies & butterfly */}
          <g transform="translate(175, 452)">
            <ellipse cx="0" cy="0" rx="88" ry="30" fill="#166534" />
            {/* Rainbow river stones */}
            {[
              { x: -78, y: 2, c: '#38bdf8' },
              { x: -55, y: 18, c: '#2563eb' },
              { x: -24, y: 26, c: '#eab308' },
              { x: 10, y: 27, c: '#f97316' },
              { x: 44, y: 22, c: '#ef4444' },
              { x: 74, y: 12, c: '#ec4899' },
              { x: 84, y: -4, c: '#a855f7' },
            ].map((st, idx) => (
              <ellipse
                key={idx}
                cx={st.x}
                cy={st.y}
                rx="14"
                ry="8"
                fill={st.c}
                stroke="#ffffff"
                strokeWidth="1"
              />
            ))}
            {/* Grass blades */}
            {[-35, -20, -6, 8, 22, 36].map((gx) => (
              <path
                key={gx}
                d={`M${gx} 10 Q${gx - 6} -24 ${gx + 4} -44`}
                stroke="#22c55e"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            ))}
            {/* White daisy stems & petals */}
            <line x1="-10" y1="6" x2="-34" y2="-66" stroke="#15803d" strokeWidth="3" />
            <line x1="14" y1="6" x2="26" y2="-48" stroke="#15803d" strokeWidth="3" />
            {[
              { cx: -34, cy: -66, r: 16 },
              { cx: 26, cy: -48, r: 13 },
            ].map((fl, i) => (
              <g key={i} transform={`translate(${fl.cx}, ${fl.cy})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <ellipse
                    key={ang}
                    cx="0"
                    cy={-fl.r * 0.72}
                    rx={fl.r * 0.28}
                    ry={fl.r * 0.55}
                    fill="#ffffff"
                    transform={`rotate(${ang})`}
                  />
                ))}
                <circle cx="0" cy="0" r={fl.r * 0.35} fill="#facc15" />
              </g>
            ))}
            {/* Colorful butterfly perched by daisy */}
            <g transform="translate(22, -74) rotate(-14)">
              <ellipse cx="14" cy="10" rx="14" ry="20" fill="#a855f7" stroke="#1e1b4b" strokeWidth="2" />
              <ellipse cx="10" cy="24" rx="10" ry="11" fill="#f97316" stroke="#1e1b4b" strokeWidth="1.5" />
              <ellipse cx="16" cy="10" rx="7" ry="11" fill="#f472b6" />
              <rect x="-2" y="8" width="4" height="22" rx="2" fill="#1e1b4b" />
            </g>
          </g>

          {/* Scalloped dark-green bushes along bottom foreground */}
          {[320, 380, 445, 515, 760, 825, 890, 955].map((bx, idx) => (
            <circle
              key={bx}
              cx={bx}
              cy={528 + (idx % 2) * 8}
              r={36 + (idx % 3) * 6}
              fill={idx % 2 === 0 ? '#16a34a' : '#22c55e'}
              opacity="0.92"
            />
          ))}

          {/* Top Map Banner Pill ("Geometry Garden" + "Adventure Map") */}
          <g transform="translate(500, 22)" filter="url(#ggShadow)">
            <rect x="-126" y="-14" width="155" height="44" rx="14" fill="url(#ggTabGreen)" stroke="#14532d" strokeWidth="2" />
            <text
              x="-48"
              y="14"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="17"
              fontWeight="800"
              fontFamily="Outfit, sans-serif"
            >
              Garden Map
            </text>
            <rect x="36" y="-4" width="112" height="30" rx="10" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <text
              x="92"
              y="16"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="13"
              fontWeight="800"
              fontFamily="Outfit, sans-serif"
            >
              Year 3 Space
            </text>
          </g>

          {/* Cute Garden Signpost near Node 5 */}
          <g transform="translate(658, 438)">
            <rect x="-3" y="-20" width="6" height="58" fill="#92400e" />
            <polygon points="-24,-34 24,-34 32,-22 24,-10 -24,-10" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="2" y="-18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#92400e">
              SUMMIT
            </text>
          </g>

          {/* 5 Interactive Glossy Blue-and-White Stepping-Stone Nodes */}
          {stops.map((st) => {
            const isNext = st.id === activeStop.id;
            const labelY = st.labelPos === 'top' ? -44 : 42;
            return (
              <g
                key={st.id}
                transform={`translate(${st.x}, ${st.y})`}
                onClick={() => {
                  playChime('click');
                  navigate(st.id);
                }}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Step ${st.num}: ${st.shortTitle} (${st.done ? 'Completed' : 'Open zone'})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playChime('click');
                    navigate(st.id);
                  }
                }}
              >
                {/* 3D stepping-stone shadow + blue rim + white glossy center */}
                <ellipse cx="0" cy="7" rx="41" ry="23" fill="#0369a1" />
                <ellipse
                  cx="0"
                  cy="2"
                  rx="41"
                  ry="23"
                  fill={st.done ? '#16a34a' : isNext ? '#0284c7' : '#38bdf8'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <ellipse cx="0" cy="0" rx="31" ry="17" fill="#ffffff" />

                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  fill={st.done ? '#15803d' : '#0284c7'}
                  fontSize="24"
                  fontWeight="800"
                  fontFamily="Outfit, sans-serif"
                >
                  {st.num}
                </text>

                {/* Green completion check badge */}
                {st.done && (
                  <g transform="translate(29, -14)">
                    <circle cx="0" cy="0" r="10" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                    <path d="M-4 0 L-1 3 L5 -3" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}

                {/* Readable Zone Label Pill */}
                <g transform={`translate(0, ${labelY})`} filter="url(#ggShadow)">
                  <rect
                    x="-72"
                    y="-14"
                    width="144"
                    height="28"
                    rx="12"
                    fill="#ffffff"
                    stroke={st.done ? '#16a34a' : '#0284c7'}
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#14261c"
                    fontSize="12"
                    fontWeight="800"
                    fontFamily="Outfit, sans-serif"
                  >
                    {st.shortTitle}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Pip the Friendly Garden Guide Character standing beside active stepping stone */}
          <g transform={`translate(${activeStop.x - 62}, ${activeStop.y - 24})`} pointerEvents="none">
            {/* Legs */}
            <path d="M-7 22 L-10 34 M7 22 L10 34" stroke="#1d4ed8" strokeWidth="4.5" strokeLinecap="round" />
            {/* Arms */}
            <path d="M-16 8 L-26 16 M16 8 L26 2" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
            {/* Sprout/Acorn cheerful body */}
            <ellipse cx="0" cy="8" rx="19" ry="18" fill="#fb923c" stroke="#9a3412" strokeWidth="2" />
            {/* Leafy green cap */}
            <path d="M-21 0 C-21 -18 21 -18 21 0 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
            <path d="M0 -14 C2 -22 10 -24 14 -18 C10 -13 4 -12 0 -14 Z" fill="#4ade80" stroke="#14532d" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="-6" cy="5" r="3" fill="#ffffff" />
            <circle cx="6" cy="5" r="3" fill="#ffffff" />
            <circle cx="-6" cy="5" r="1.6" fill="#0f172a" />
            <circle cx="6" cy="5" r="1.6" fill="#0f172a" />
            <path d="M-6 13 Q0 18 6 13" fill="none" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};
