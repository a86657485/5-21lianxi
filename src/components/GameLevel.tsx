import React, { useState, useEffect } from 'react';
import { Level } from '../levels';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lightbulb, CheckCircle, Bird, Rabbit, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { GuideModal } from './GuideModal';

interface GameLevelProps {
  level: Level;
  onBack: () => void;
  onWin: (stars: number) => void;
}

export function GameLevel({ level, onBack, onWin }: GameLevelProps) {
  const [chickenCount, setChickenCount] = useState<number>(0);
  const [rabbitCount, setRabbitCount] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [interactiveState, setInteractiveState] = useState<('none' | 'chicken' | 'rabbit')[]>(
    Array(level.heads).fill('none')
  );
  const [showWin, setShowWin] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // For logic level input
  const [inputC, setInputC] = useState('');
  const [inputR, setInputR] = useState('');

  const currentLegs = level.type === 'interactive' 
    ? interactiveState.reduce((acc, val) => acc + (val === 'chicken' ? 2 : val === 'rabbit' ? 4 : 0), 0)
    : (parseInt(inputC) || 0) * 2 + (parseInt(inputR) || 0) * 4;

  const currentHeads = level.type === 'interactive'
    ? interactiveState.filter(s => s !== 'none').length
    : (parseInt(inputC) || 0) + (parseInt(inputR) || 0);

  // Sync state for logic mode
  useEffect(() => {
    if (level.type === 'logic') {
      setChickenCount(parseInt(inputC) || 0);
      setRabbitCount(parseInt(inputR) || 0);
    } else {
      setChickenCount(interactiveState.filter(s => s === 'chicken').length);
      setRabbitCount(interactiveState.filter(s => s === 'rabbit').length);
    }
  }, [inputC, inputR, interactiveState, level.type]);

  const handleInteractiveTap = (index: number) => {
    setInteractiveState(prev => {
      const next = [...prev];
      if (next[index] === 'none') next[index] = 'chicken';
      else if (next[index] === 'chicken') next[index] = 'rabbit';
      else next[index] = 'none';
      return next;
    });
  };

  const checkWin = () => {
    if (chickenCount === level.targetC && rabbitCount === level.targetR) {
      if (!showWin) {
        setShowWin(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          let stars = 3;
          if (hintsUsed > 0) stars -= 1;
          // Could add time logic here for fewer stars
          onWin(stars);
        }, 2000);
      }
    } else if (level.type === 'interactive') {
      import('./AITutor').then(({ triggerAITutor }) => {
        triggerAITutor(`哎呀，你放了 ${chickenCount} 只小鸡和 ${rabbitCount} 只小兔，总共虽然是 ${currentHeads} 只动物，但它们一共有 ${currentLegs} 条腿。我们要找的是 ${level.legs} 条腿哦。想一想，如果把一只兔子换成小鸡，或者把小鸡换成兔子，腿的总数会怎么变呢？`);
      });
    }
  };

  // Auto-check for interactive mode
  useEffect(() => {
    if (level.type === 'interactive' && currentHeads === level.heads) {
       checkWin();
    }
  }, [currentHeads, currentLegs, level.type]);


  const renderHints = () => {
    const hintMessages = [
      `仔细看：一共有 ${level.heads} 个头，也就是说有 ${level.heads} 只动物。`,
      `假设法：如果 ${level.heads} 只全是鸡，那么应该有 ${level.heads * 2} 条腿。\n但是总共有 ${level.legs} 条腿，少了 ${level.legs - level.heads * 2} 条腿。`,
      `为什么会少？因为把兔子算成了鸡！每只兔子少算了2条腿。\n所以，兔子有：${level.legs - level.heads * 2} ÷ 2 = ${(level.legs - level.heads * 2) / 2}只！`
    ];

    return (
      <div className="mt-6 space-y-4">
        {hintsUsed < 3 && (
          <button 
            onClick={() => setHintsUsed(p => p + 1)}
            className="flex items-center justify-center gap-3 bg-[#DDD6FE] text-[#5B21B6] border-b-[4px] border-[#A78BFA] px-6 py-4 rounded-[50px] font-bold text-[18px] transition-transform active:translate-y-1 active:border-b-0 mx-auto w-full md:w-auto"
          >
            <Lightbulb size={24} />
            查看卡壳提示 ({hintsUsed}/3)
          </button>
        )}
        <div className="flex flex-col gap-2">
          {hintsUsed > 0 && (
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="bg-yellow-100 p-4 rounded-xl border border-yellow-200 text-yellow-800 whitespace-pre-wrap flex gap-2">
               <Lightbulb className="w-5 h-5 shrink-0" /> <div>提示 1: {hintMessages[0]}</div>
             </motion.div>
          )}
          {hintsUsed > 1 && (
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="bg-orange-100 p-4 rounded-xl border border-orange-200 text-orange-800 whitespace-pre-wrap mt-2 flex gap-2">
               <Lightbulb className="w-5 h-5 shrink-0" /> <div>提示 2: {hintMessages[1]}</div>
             </motion.div>
          )}
          {hintsUsed > 2 && (
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="bg-red-100 p-4 rounded-xl border border-red-200 text-red-800 whitespace-pre-wrap mt-2 font-bold !text-lg flex gap-2">
               <Lightbulb className="w-5 h-5 shrink-0" /> <div>提示 3: {hintMessages[2]}</div>
             </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex flex-col items-center relative overflow-y-auto w-full pb-32 pt-4 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl bg-[#FDE047] rounded-[20px] shadow-[0_4px_0_#EAB308] border-4 border-[#CA8A04] p-4 sticky top-0 md:top-4 z-20 flex items-center justify-between mx-auto">
        <button onClick={onBack} className="w-[50px] h-[50px] bg-[#FBCFE8] border-b-4 border-[#F472B6] rounded-[12px] flex items-center justify-center text-[#BE185D] hover:brightness-110 active:translate-y-1 active:border-b-0 active:shadow-none transition-all">
          <ArrowLeft size={24} />
        </button>
        <div className="text-[20px] md:text-[28px] font-black text-[#854D0E] truncate px-4">第 {level.id} 关 : {level.title}</div>
        <div className="text-[#EAB308] whitespace-nowrap hidden sm:flex items-center gap-2">
          <Bird size={28} className="text-[#B45309]" />
          <Rabbit size={28} className="text-[#15803D]" />
        </div>
      </div>

      <div className="w-full max-w-3xl px-4 py-6 flex flex-col items-center flex-grow">
        
        {/* Mission Card */}
        <div className="bg-[#BAE6FD] border-4 border-[#7DD3FC] rounded-[20px] p-6 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6">
          <div className="bg-white border-[3px] border-[#E2E8F0] rounded-[16px] py-3 px-6 text-center min-w-[120px] shadow-sm">
            <div className="text-[28px] font-black text-[#0F172A]">{currentHeads} / {level.heads}</div>
            <div className="text-xs text-[#64748B] uppercase tracking-wider font-bold mt-1">当前头数</div>
          </div>
          <div className="bg-white border-[3px] border-[#E2E8F0] rounded-[16px] py-3 px-6 text-center min-w-[120px] shadow-sm">
            <div className="text-[28px] font-black text-[#0F172A]">{currentLegs} / {level.legs}</div>
            <div className="text-xs text-[#64748B] uppercase tracking-wider font-bold mt-1">当前腿数</div>
          </div>
        </div>

        {/* Interactive Mode */}
        {level.type === 'interactive' && (
          <div className="bg-white rounded-[24px] border-4 border-[#BFDBFE] p-8 w-full shadow-[inset_0_0_20px_rgba(186,230,253,0.3)] mb-6 min-h-[300px] flex flex-col items-center relative">
            <p className="text-center text-[#64748B] font-medium mb-6 text-lg">笼子里一共有 <span className="text-[#EF4444] font-bold">{level.heads}</span> 个头，<span className="text-[#3B82F6] font-bold">{level.legs}</span> 条腿。点击下方的空格，通过切换物种找到正确答案！</p>
            
            <div className="flex flex-wrap gap-[15px] justify-center">
              <AnimatePresence>
                {interactiveState.map((state, idx) => (
                  <motion.button
                    key={idx}
                    layout
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleInteractiveTap(idx)}
                    className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[16px] flex flex-col items-center justify-center transition-transform relative border-[3px]",
                      state === 'none' ? "bg-[#F8FAFC] border-dashed border-[#CBD5E1]" :
                      state === 'chicken' ? "bg-[#FEF3C7] border-solid border-[#F59E0B]" :
                      "bg-[#DCFCE7] border-solid border-[#22C55E]"
                    )}
                  >
                    {state === 'none' && <div className="w-4 h-4 rounded-full bg-[#E2E8F0]"/>}
                    {state === 'chicken' && <Bird size={48} className="text-[#B45309]" />}
                    {state === 'rabbit' && <Rabbit size={48} className="text-[#15803D]" />}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Logic Mode Input */}
        {level.type === 'logic' && (
          <div className="bg-white rounded-[24px] border-4 border-[#BFDBFE] p-8 w-full shadow-[inset_0_0_20px_rgba(186,230,253,0.3)] mb-6">
             <h3 className="text-center font-black text-[24px] mb-2">挑战：<span className="text-[#EF4444]">{level.heads}</span> 个头，<span className="text-[#3B82F6]">{level.legs}</span> 条腿</h3>
             <p className="text-center text-[#64748B] font-medium mb-6">动物太多啦，结合算式填写正确答案。</p>
             <div className="flex flex-col gap-6 max-w-lg mx-auto">
                <div className="flex items-center gap-4 bg-[#FEF3C7] p-4 rounded-[16px] border-[3px] border-[#F59E0B]">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full"><Bird size={36} className="text-[#B45309]" /></div>
                  <div className="flex-grow">
                    <div className="text-[#B45309] font-bold mb-1">鸡的数量：</div>
                    <input 
                      type="number" 
                      value={inputC}
                      onChange={(e) => setInputC(e.target.value)}
                      className="w-full text-[24px] font-black p-3 rounded-[12px] border-2 border-[#D97706] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#DCFCE7] p-4 rounded-[16px] border-[3px] border-[#22C55E]">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full"><Rabbit size={36} className="text-[#15803D]" /></div>
                  <div className="flex-grow">
                    <div className="text-[#15803D] font-bold mb-1">兔子的数量：</div>
                    <input 
                      type="number" 
                      value={inputR}
                      onChange={(e) => setInputR(e.target.value)}
                      className="w-full text-[24px] font-black p-3 rounded-[12px] border-2 border-[#16A34A] focus:outline-none focus:border-[#15803D]"
                    />
                  </div>
                </div>

                <button 
                  onClick={checkWin}
                  className="w-full bg-[#22C55E] text-white text-[20px] font-bold py-4 mt-4 rounded-[50px] shadow-[0_6px_0_#16A34A] border-none active:translate-y-[4px] active:shadow-[0_2px_0_#16A34A] transition-all"
                >
                  提交验证
                </button>
             </div>
          </div>
        )}

        {/* Hints area */}
        <div className="w-full">
           {renderHints()}
        </div>

      </div>

      {/* Win Overlay */}
      {showWin && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-black text-green-800 mb-2">太棒了！</h2>
            <p className="text-green-600 font-medium mb-6">你成功找出了正确的数量！<br/>鸡: {level.targetC} 只，兔: {level.targetR} 只</p>
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i} 
                  initial={{ rotate: -45, opacity: 0 }} 
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Star fill={(hintsUsed === 0 && i === 3) || (hintsUsed <= 1 && i <= 2) || i === 1 ? "#fbbf24" : "transparent"} size={48} className={(hintsUsed === 0 && i === 3) || (hintsUsed <= 1 && i <= 2) || i === 1 ? "text-yellow-400" : "text-gray-300"} />
                </motion.div>
              ))}
            </div>
            {/* The actual navigation back happens in the timeout, but if we want instant skip we can add a button */}
          </motion.div>
        </motion.div>
      )}

      <GuideModal 
        isOpen={showGuide}
        title="新手任务：农场调查员"
        content="欢迎来到农场！点击下面这排灰色的格子，把它们变成小鸡或者是兔子。小鸡只有 2 条腿，小兔有 4 条腿。观察页面上方的要求，你的目标是让【头数】和【腿数】完全匹配！如果错了，AI 导师会跳出来引导你的思考思路哦！"
        onClose={() => setShowGuide(false)}
      />

    </div>
  );
}
