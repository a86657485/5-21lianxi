import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { LevelMap } from './components/LevelMap';
import { GameLevel } from './components/GameLevel';
import { FlowchartLevel } from './components/FlowchartLevel';
import { AssumptionLevel } from './components/AssumptionLevel';
import { PythonVerifyLevel } from './components/PythonVerifyLevel';
import { ExtensionLevel } from './components/ExtensionLevel';
import { Tutorial } from './components/Tutorial';
import { Sandbox } from './components/Sandbox';
import { AITutor } from './components/AITutor';
import { AdminPanel } from './components/AdminPanel';
import { loadGameState, saveGameState, GameState } from './store';
import { LEVELS } from './levels';

type AppView = 'menu' | 'map' | 'play' | 'tutorial' | 'sandbox' | 'flowchart' | 'assumption' | 'python_verify' | 'extension';

export default function App() {
  const [view, setView] = useState<AppView>('menu');
  const [gameState, setGameState] = useState<GameState>({ unlockedLevels: [1], stars: {} });
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

  // Load state on mount
  useEffect(() => {
    setGameState(loadGameState());
  }, []);

  const handleWinLevel = (stars: number) => {
    if (!currentLevelId) return;

    setGameState(prev => {
      const next = { 
        unlockedLevels: [...prev.unlockedLevels], 
        stars: { ...prev.stars } 
      };
      
      const currentStars = next.stars[currentLevelId] || 0;
      if (stars > currentStars) {
        next.stars[currentLevelId] = stars;
      }

      const currentLevelIndex = LEVELS.findIndex(l => l.id === currentLevelId);
      if (currentLevelIndex >= 0 && currentLevelIndex < LEVELS.length - 1) {
        const nextId = LEVELS[currentLevelIndex + 1].id;
        if (!next.unlockedLevels.includes(nextId)) {
          next.unlockedLevels.push(nextId);
        }
      }

      saveGameState(next);
      return next;
    });

    setView('map');
  };

  const handleUnlockAll = () => {
    setGameState(prev => {
      const next = { ...prev, unlockedLevels: LEVELS.map(l => l.id) };
      saveGameState(next);
      return next;
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#E0F2FE] font-sans text-[#1E293B] selection:bg-[#BAE6FD] relative">
      {view === 'menu' && (
        <MainMenu 
          onPlay={() => setView('tutorial')} // Force play via tutorial first per instructions
          onTutorial={() => setView('tutorial')}
          onSandbox={() => setView('sandbox')}
        />
      )}
      
      {view === 'map' && (
        <LevelMap 
          state={gameState} 
          onBack={() => setView('menu')} 
          onSelectLevel={(id) => {
             setCurrentLevelId(id);
             const lvl = LEVELS.find(l => l.id === id);
             if (lvl?.type === 'flowchart') setView('flowchart');
             else if (lvl?.type === 'assumption') setView('assumption');
             else if (lvl?.type === 'python_verify') setView('python_verify');
             else if (lvl?.type === 'extension') setView('extension');
             else setView('play');
          }}
        />
      )}

      {view === 'play' && currentLevelId !== null && (
        <GameLevel 
          level={LEVELS.find(l => l.id === currentLevelId)!}
          onBack={() => setView('map')}
          onWin={handleWinLevel}
        />
      )}

      {view === 'flowchart' && currentLevelId !== null && (
        <FlowchartLevel
          onBack={() => setView('map')}
          onWin={handleWinLevel}
        />
      )}

      {view === 'assumption' && currentLevelId !== null && (
        <AssumptionLevel
          level={LEVELS.find(l => l.id === currentLevelId)!}
          onBack={() => setView('map')}
          onWin={handleWinLevel}
        />
      )}

      {view === 'python_verify' && currentLevelId !== null && (
        <PythonVerifyLevel
          level={LEVELS.find(l => l.id === currentLevelId)!}
          onBack={() => setView('map')}
          onWin={handleWinLevel}
        />
      )}

      {view === 'extension' && currentLevelId !== null && (
        <ExtensionLevel
          onBack={() => setView('map')}
          onWin={handleWinLevel}
        />
      )}

      {view === 'tutorial' && (
        <Tutorial onBack={() => {
           // Tutorial complete, map unlocks
           setView('map');
        }} />
      )}

      {view === 'sandbox' && (
        <Sandbox onBack={() => setView('menu')} />
      )}

      {/* Global AI Tutor */}
      <AITutor />

      {/* Global Admin Panel */}
      <AdminPanel 
         onUnlockAll={handleUnlockAll} 
         currentLevelExists={['play', 'flowchart', 'assumption', 'python_verify', 'extension'].includes(view)}
         onAutoWinCurrent={() => handleWinLevel(3)} 
      />
    </div>
  );
}

