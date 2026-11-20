import React from 'react';
import { GardenProvider, useGarden } from './context/GardenContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LearningJourneyPage } from './pages/LearningJourneyPage';
import { Zone1LearnDiscover } from './pages/Zone1LearnDiscover';
import { Zone2ShapeLab } from './pages/Zone2ShapeLab';
import { Zone3GardenDesigner } from './pages/Zone3GardenDesigner';
import { Zone4QuizAdventure } from './pages/Zone4QuizAdventure';
import { ProgressPage } from './pages/ProgressPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { TeacherPage } from './pages/TeacherPage';
import { HelpPage } from './pages/HelpPage';

const ActiveView: React.FC = () => {
  const { page, navigate } = useGarden();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {page === 'home' && <HomePage />}
        {page === 'journey' && <LearningJourneyPage />}
        {page === 'zone1' && <Zone1LearnDiscover />}
        {page === 'zone2' && <Zone2ShapeLab />}
        {page === 'zone3' && <Zone3GardenDesigner />}
        {page === 'zone4' && <Zone4QuizAdventure />}
        {page === 'progress' && <ProgressPage />}
        {page === 'reflection' && <ReflectionPage />}
        {page === 'teacher' && <TeacherPage />}
        {page === 'help' && <HelpPage />}
      </main>

      <footer className="border-t-2 border-emerald-200 bg-white/90 py-5 px-4 sm:px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900">
          <p className="font-semibold">
            Geometry Garden · Year 5 Mathematics (Topic: Space · 6.3 Perimeter &amp; Area)
          </p>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            <button type="button" onClick={() => navigate('home')} className="hover:underline">
              Home
            </button>
            <button type="button" onClick={() => navigate('progress')} className="hover:underline">
              My Progress
            </button>
            <button type="button" onClick={() => navigate('teacher')} className="hover:underline">
              Teacher Info
            </button>
            <button type="button" onClick={() => navigate('help')} className="hover:underline">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GardenProvider>
      <ActiveView />
    </GardenProvider>
  );
}
