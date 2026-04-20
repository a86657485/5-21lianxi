import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';
import { triggerAITutor } from './AITutor';
import confetti from 'canvas-confetti';
import { Level } from '../levels';
import { GuideModal } from './GuideModal';

export function ExtensionLevel({ onBack, onWin }: { onBack: () => void, onWin: (stars: number) => void }) {
  const [testNumber, setTestNumber] = useState(1000);
  const [history, setHistory] = useState<{n: number, r3: number, r5: number, r7: number, match: boolean}[]>([]);
  const [showWin, setShowWin] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const handleVerify = () => {
    const r3 = testNumber % 3;
    const r5 = testNumber % 5;
    const r7 = testNumber % 7;
    const isMatch = r3 === 2 && r5 === 4 && r7 === 6;

    const newRecord = { n: testNumber, r3, r5, r7, match: isMatch };
    
    // Prevent duplicate records locally unless spam clicking shouldn't happen anyway
    if (!history.find(h => h.n === testNumber)) {
      setHistory([newRecord, ...history]);
    }

    if (isMatch) {
      setShowWin(true);
      confetti({ particleCount: 200, zIndex: 9999, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => onWin(3), 2000);
    } else {
       triggerAITutor(`韩信大将军说得没错：“3人排余2，5人排余4，7人排余6”。现在你试的士兵人数是 ${testNumber} 人，算出来的余数分别是 ${r3}、${r5}、${r7}，还不符合条件呢！试着滑动滑块，大胆一点往后找找看！`);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex flex-col relative w-full font-sans text-[#1E293B]">
      {/* Header */}
      <div className="w-full bg-[#FDE047] shadow-[0_4px_0_#EAB308] border-b-4 border-[#CA8A04] p-4 flex items-center justify-between z-20 sticky top-0">
        <button onClick={onBack} className="w-[40px] h-[40px] bg-[#FBCFE8] border-b-4 border-[#F472B6] rounded-[10px] flex items-center justify-center text-[#BE185D] hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-[18px] md:text-[20px] font-black text-[#854D0E] flex-1 text-center truncate px-2">拓展提升：韩信点兵 (剩余定理)</div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-4 gap-4 pb-32 max-w-7xl mx-auto w-full">
        {/* Left Column: Problem & Algo */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 overflow-y-auto">
           {/* Story block */}
           <div className="bg-white border-4 border-[#BFDBFE] rounded-[24px] p-5 shadow-sm relative">
              <div className="text-[18px] font-black text-[#0369A1] mb-2 flex items-center gap-2">📜 韩信点兵，多多益善</div>
              <p className="text-sm font-medium text-[#475569] leading-relaxed">
                 汉军统帅韩信带兵出征。死伤部分后，要求士兵排队清点：<br/><br/>
                 🤺 3人一排，多出 <span className="text-[#EF4444] font-bold">2</span> 人<br/>
                 🤺 5人一排，多出 <span className="text-[#F59E0B] font-bold">4</span> 人<br/>
                 🤺 7人一排，多出 <span className="text-[#10B981] font-bold">6</span> 人<br/>
                 已知士兵总数大于 <span className="text-[#8B5CF6] font-bold">1000</span> 人，请帮他找出具体数字！
              </p>
           </div>

           {/* Python Code */}
           <div className="bg-[#1E293B] border-4 border-[#0F172A] rounded-[24px] p-5 shadow-lg relative flex-1">
              <div className="text-xs text-[#94A3B8] uppercase font-bold mb-3 border-b-2 border-[#334155] pb-2">算法描述 (Python)</div>
              <div className="font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto text-[#E2E8F0]">
                n = 1000<br/>
                <span className="text-[#FBBF24]">while</span> True:<br/>
                {'    '}<span className="text-[#FBBF24]">if</span> n % 3 == 2 \<br/>
                {'       '}<span className="text-[#FBBF24]">and</span> n % 5 == 4 \<br/>
                {'       '}<span className="text-[#FBBF24]">and</span> n % 7 == 6:<br/>
                {'        '}<span className="text-[#34D399]">print</span>(<span className="text-[#A78BFA]">'找到人数:'</span>, n)<br/>
                {'        '}<span className="text-[#FBBF24]">break</span><br/>
                {'    '}<span className="text-[#FBBF24]">else</span>:<br/>
                {'        '}n = n + 1<br/>
              </div>
           </div>
        </div>

        {/* Right Column: Interactive Sandbox & Table */}
        <div className="w-full lg:w-[65%] flex flex-col gap-4">
           {/* Slider and Test Area */}
           <div className="bg-white border-4 border-[#BFDBFE] rounded-[24px] p-4 lg:p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b-2 border-[#E2E8F0] pb-2">
                 <div className="font-bold text-[#1E293B] text-lg">🧮 遍历测试器 (1000 ~ 1050)</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#F8FAFC] p-4 rounded-[16px] border-2 border-[#CBD5E1] mb-4">
                 <div className="flex-1 w-full flex flex-col gap-2">
                   <div className="flex justify-between font-bold text-[#475569]">
                      <span>滑动尝试人数 (当前 `n`)</span>
                      <span className="text-[#0369A1] bg-[#E0F2FE] px-2 rounded">{testNumber}</span>
                   </div>
                   <input 
                     type="range" 
                     min="1000" max="1050" 
                     value={testNumber}
                     onChange={e => setTestNumber(Number(e.target.value))}
                     className="w-full h-4 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0369A1]"
                   />
                 </div>
                 <button 
                    onClick={handleVerify}
                    className="w-full sm:w-auto bg-[#3B82F6] text-white px-8 py-3 rounded-xl font-black shadow-[0_4px_0_#2563EB] active:translate-y-1 active:shadow-none hover:bg-[#2563EB] flex items-center justify-center gap-2 whitespace-nowrap transition-all"
                  >
                    <Calculator size={18} /> 计算余数
                 </button>
              </div>

              {/* Realtime Remainders Visualization */}
              <div className="flex flex-wrap gap-4 justify-around mt-2">
                 <div className="bg-[#FEF2F2] border-2 border-[#FECACA] p-3 rounded-xl flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="text-xs font-bold text-[#EF4444] mb-1">÷ 3 理论余 2</div>
                    <div className="text-2xl font-black text-[#B91C1C]">{testNumber % 3}</div>
                 </div>
                 <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] p-3 rounded-xl flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="text-xs font-bold text-[#F59E0B] mb-1">÷ 5 理论余 4</div>
                    <div className="text-2xl font-black text-[#B45309]">{testNumber % 5}</div>
                 </div>
                 <div className="bg-[#ECFDF5] border-2 border-[#D1FAE5] p-3 rounded-xl flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="text-xs font-bold text-[#10B981] mb-1">÷ 7 理论余 6</div>
                    <div className="text-2xl font-black text-[#047857]">{testNumber % 7}</div>
                 </div>
              </div>
           </div>

           {/* Record Table */}
           <div className="bg-white border-4 border-[#BFDBFE] rounded-[24px] p-4 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[250px]">
              <div className="font-bold text-[#0369A1] mb-2 px-2 flex items-center gap-2">
                <span className="bg-[#E0F2FE] p-1 rounded-lg border border-[#BAE6FD] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </span> 遍历过程记录
              </div>
              <div className="overflow-y-auto flex-1 border-2 border-[#E2E8F0] rounded-xl">
                 <table className="w-full text-center text-sm md:text-base border-collapse">
                    <thead className="bg-[#F1F5F9] sticky top-0 z-10 shadow-sm text-[#475569]">
                       <tr>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">人数 (n)</th>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">余数 (3)</th>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">余数 (5)</th>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">余数 (7)</th>
                         <th className="py-3 px-2 border-b-2 border-[#E2E8F0]">是否满足?</th>
                       </tr>
                    </thead>
                    <tbody>
                       {history.length === 0 && (
                          <tr><td colSpan={5} className="py-8 text-[#94A3B8] font-medium">还没有开始测试喔，移动滑块计算吧！</td></tr>
                       )}
                       {history.map((row, i) => (
                         <motion.tr 
                           initial={{ opacity: 0, backgroundColor: '#E0F2FE' }}
                           animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                           key={i} 
                           className="border-b border-[#F1F5F9] text-[#1E293B] font-medium"
                         >
                            <td className="py-2 px-2 border-r border-[#F1F5F9] text-[#3B82F6] font-bold">{row.n}</td>
                            <td className="py-2 px-2 border-r border-[#F1F5F9]">{row.r3} {row.r3 === 2 ? '✅' : '❌'}</td>
                            <td className="py-2 px-2 border-r border-[#F1F5F9]">{row.r5} {row.r5 === 4 ? '✅' : '❌'}</td>
                            <td className="py-2 px-2 border-r border-[#F1F5F9]">{row.r7} {row.r7 === 6 ? '✅' : '❌'}</td>
                            <td className="py-2 px-2">
                               {row.match ? 
                                 <span className="text-[#16A34A] font-black">找到了！</span> : 
                                 <span className="text-[#94A3B8]">不满足</span>
                               }
                            </td>
                         </motion.tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {showWin && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} 
            className="bg-white rounded-[24px] p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#4ADE80]"
          >
            <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-[32px] font-black text-[#065F46] mb-2">神机妙算！</h2>
            <p className="text-[#047857] font-medium mb-6">韩信将军的士兵一共有 {testNumber} 人！在古代被称为“剩余定理”，而现代的计算机使用枚举遍历也能轻松找出规律！</p>
          </motion.div>
        </motion.div>
      )}

      <GuideModal 
        isOpen={showGuide}
        title="拓展任务：韩信点兵"
        content="遇到除不尽的问题怎么办？大将军韩信的士兵数量大有玄机！滑动进度条，寻找那个能同时满足 除以3余2、除以5余4、除以7余6 的神奇数字吧！点击【计算余数】把记录存进表格！"
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
}
