import React, { useState } from 'react';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { GameLevel } from './GameLevel';
import { Level } from '../levels';
import { motion } from 'motion/react';

export function Sandbox({ onBack }: { onBack: () => void }) {
  const [heads, setHeads] = useState<string>('');
  const [legs, setLegs] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [customLevel, setCustomLevel] = useState<Level | null>(null);

  const handleGenerate = () => {
    setError('');
    const h = parseInt(heads);
    const l = parseInt(legs);

    if (isNaN(h) || isNaN(l)) {
      setError('请输入有效的数字哦');
      return;
    }
    if (h <= 0 || l <= 0) {
      setError('头和腿的数量必须大于 0');
      return;
    }
    if (l % 2 !== 0) {
      setError('腿的总数必须是偶数！（因为鸡和兔子都没有单条腿的）');
      return;
    }
    if (l < h * 2) {
      setError(`每个动物至少有2条腿，${h}个头最少需要 ${h * 2} 条腿！`);
      return;
    }
    if (l > h * 4) {
      setError(`就算全是兔子，${h}个头最多也只有 ${h * 4} 条腿！`);
      return;
    }

    // Calculate solutions to verify
    const rabbits = (l - 2 * h) / 2;
    const chickens = h - rabbits;

    if (rabbits < 0 || chickens < 0 || !Number.isInteger(rabbits) || !Number.isInteger(chickens)) {
      setError('这个题目没有正整数解，请检查一下数字是不是出错了。');
      return;
    }

    // Generate Level
    setCustomLevel({
      id: 999,
      title: '自由挑战',
      type: h <= 15 ? 'interactive' : 'logic',
      heads: h,
      legs: l,
      targetC: chickens,
      targetR: rabbits
    });
  };

  if (customLevel) {
    return <GameLevel level={customLevel} onBack={() => setCustomLevel(null)} onWin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="bg-[#FDE047] border-4 border-[#CA8A04] rounded-[20px] shadow-[0_4px_0_#EAB308] p-4 mb-8 flex items-center justify-between w-full">
          <button onClick={onBack} className="w-[50px] h-[50px] flex items-center justify-center bg-[#DDD6FE] border-b-[4px] border-[#A78BFA] rounded-[12px] shadow-[0_4px_0_#A78BFA] text-[#5B21B6] hover:brightness-110 transition-all active:translate-y-1 active:border-b-0 active:shadow-none">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[24px] md:text-[28px] font-black text-[#854D0E] pr-2 md:pr-12 md:text-center w-full">
            自己出题
          </h2>
        </div>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-white rounded-[24px] p-8 shadow-[inset_0_0_20px_rgba(186,230,253,0.3)] border-4 border-[#BFDBFE]"
        >
           <p className="text-[#0369A1] font-medium text-center mb-8 text-[16px]">
             在这里可以输入你自己的作业题目，或者给朋友出一个难题！然后自己来解开它。
           </p>

           <div className="space-y-6">
              <div>
                 <label className="block text-gray-700 font-bold mb-2">一共有多少个头？</label>
                 <input 
                   type="number" 
                   value={heads} 
                   onChange={e => setHeads(e.target.value)}
                   className="w-full text-2xl p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 outline-none transition-all"
                   placeholder="例如：35"
                 />
              </div>
              
              <div>
                 <label className="block text-gray-700 font-bold mb-2">一共有多少条腿？</label>
                 <input 
                   type="number" 
                   value={legs} 
                   onChange={e => setLegs(e.target.value)}
                   className="w-full text-2xl p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 outline-none transition-all"
                   placeholder="例如：94"
                 />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                  {error}
                </div>
              )}

              <button 
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 bg-[#FB923C] hover:brightness-110 text-white text-[20px] font-bold py-5 rounded-[50px] shadow-[0_6px_0_#EA580C] border-none active:translate-y-1 active:shadow-none transition-all mt-4"
              >
                <Wand2 />
                生成关卡并开始！
              </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
