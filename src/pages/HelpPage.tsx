import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useGarden } from '../context/GardenContext';
import { ZoneBreadcrumbFooter } from '../components/Navbar';
import { PipGuideCard } from '../components/GardenIllustrations';

export const HelpPage: React.FC = () => {
  const { a11y, toggleA11y } = useGarden();

  return (
    <div className="space-y-6">
      <section className="garden-card bg-white border-2 border-amber-300 rounded-3xl p-6 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <HelpCircle className="w-4 h-4" />
          <span>Pupil Help &amp; Accessibility Guide</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-emerald-950">
          How to Use Geometry Garden
        </h1>
        <PipGuideCard
          title="Need a hand? Pip is here!"
          message="There is no timer on any learning zone. Take your time, use the Read Aloud button whenever you want, and check the formulas below."
          tone="yellow"
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="garden-card bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-emerald-950">Quick Formula Guide</h2>
          <div className="space-y-2.5 text-sm">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <strong className="text-rose-950">Perimeter (Distance around the outside):</strong>
              <p className="font-math text-xs sm:text-sm mt-1">
                Add every outer side length. Units: cm or m.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <strong className="text-sky-950">Rectangle &amp; Square Area (Space inside):</strong>
              <p className="font-math text-xs sm:text-sm mt-1">
                Rectangle: length × width · Square: side × side · Units: cm² or m².
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <strong className="text-purple-950">Triangle Area:</strong>
              <p className="font-math text-xs sm:text-sm mt-1">
                ½ × base × perpendicular height · Units: cm² or m².
              </p>
            </div>
          </div>
        </div>

        <div className="garden-card bg-white border-2 border-sky-200 rounded-3xl p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-emerald-950">
            Accessibility &amp; Troubleshooting
          </h2>
          <ul className="space-y-2 text-sm text-emerald-900 list-disc pl-5">
            <li>
              <strong>External websites (Canva, GeoGebra, FloraGeo, ZEP, Wayground):</strong> If an
              embedded preview box is blocked by your school Wi-Fi, click the main{' '}
              <strong>Open / Start</strong> button to launch it in a new browser tab.
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">Tab</kbd> to move between buttons and sliders, and{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">Enter</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded">Space</kbd> to activate.
            </li>
            <li>
              <strong>No AR device?</strong> Use the 2D Courtyard Grid Designer in Zone 3 on any
              laptop, Chromebook, or tablet.
            </li>
          </ul>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toggleA11y('largeText')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                a11y.largeText
                  ? 'bg-sky-700 text-white border-sky-800'
                  : 'bg-sky-50 text-sky-950 border-sky-200'
              }`}
            >
              Large Text: {a11y.largeText ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => toggleA11y('highContrast')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                a11y.highContrast
                  ? 'bg-sky-700 text-white border-sky-800'
                  : 'bg-sky-50 text-sky-950 border-sky-200'
              }`}
            >
              High Contrast: {a11y.highContrast ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      <ZoneBreadcrumbFooter current="help" />
    </div>
  );
};
