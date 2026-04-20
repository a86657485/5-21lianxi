import React from 'react';
import { LEVELS } from '../levels';
import { GameState } from '../store';
import { motion } from 'motion/react';
import { ArrowLeft, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface LevelMapProps {
  state: GameState;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export function LevelMap({ state, onSelectLevel, onBack }: LevelMapProps) {
  return (
    <div className="min-h-screen bg-[#E0F2FE] p-4 md:p-8 relative overflow-y-auto">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-3 bg-[#FBCFE8] border-b-[4px] border-[#F472B6] rounded-[12px] shadow-[0_4px_0_#F472B6] text-[#BE185D] hover:brightness-110 z-10 transition-all active:translate-y-1 active:border-b-0 active:shadow-none"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-4xl mx-auto mt-16 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#0369A1] mb-4">关卡地图</h2>
          <p className="text-[#0284C7] text-lg font-bold">完成关卡，收集星星，成为农场最强神探！</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {LEVELS.map((level, idx) => {
            const isUnlocked = state.unlockedLevels.includes(level.id);
            const stars = state.stars[level.id] || 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={cn(
                  "relative aspect-square rounded-[16px] flex flex-col items-center justify-center p-4 transition-all border-4 border-transparent",
                  isUnlocked 
                    ? "bg-[#FB923C] text-white cursor-pointer shadow-[0_6px_0_#EA580C] hover:brightness-110 active:shadow-[0_2px_0_#EA580C] active:translate-y-1" 
                    : "bg-[#F1F5F9] text-[#64748B] cursor-not-allowed shadow-[0_4px_0_#CBD5E1]"
                )}
              >
                <div className={cn("absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-[8px]", isUnlocked ? "bg-white/30 text-white" : "bg-[#E2E8F0] text-[#94A3B8]")}>
                  {level.type === 'interactive' ? '手指' : '逻辑'}
                </div>
                
                <div className={cn(
                  "text-[40px] font-black mb-2",
                  isUnlocked ? "text-white" : "text-[#94A3B8]"
                )}>
                  {level.id}
                </div>
                
                <div className={cn(
                  "text-sm font-bold text-center line-clamp-1 w-full",
                  isUnlocked ? "text-orange-100" : "text-[#94A3B8]"
                )}>
                  {level.title}
                </div>

                {isUnlocked && (
                  <div className="flex gap-1 mt-3 absolute bottom-3">
                    {[1, 2, 3].map(star => (
                      <Star 
                        key={star} 
                        size={16} 
                        fill={star <= stars ? "#fbbf24" : "transparent"} 
                        className={star <= stars ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                )}
                
                {!isUnlocked && (
                  <div className="text-3xl mt-2 opacity-50">🔒</div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
