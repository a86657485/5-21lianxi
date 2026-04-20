import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { triggerAITutor } from './AITutor';
import confetti from 'canvas-confetti';
import { Level } from '../levels';
import { GuideModal } from './GuideModal';

export function PythonVerifyLevel({ level, onBack, onWin }: { level: Level, onBack: () => void, onWin: (stars: number) => void }) {
  const [rabbitGuess, setRabbitGuess] = useState(0);
  const [history, setHistory] = useState<{a: number, b: number, c: number, match: boolean}[]>([]);
  const [showWin, setShowWin] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const chickenGuess = level.heads - rabbitGuess;
  const currentLegs = chickenGuess * 2 + rabbitGuess * 4;

  const handleVerify = () => {
    const isMatch = currentLegs === level.legs;
    const newRecord = { a: chickenGuess, b: rabbitGuess, c: currentLegs, match: isMatch };
    
    // Prevent duplicate history rows
    if (!history.find(h => h.b === rabbitGuess)) {
       setHistory([newRecord, ...history]);
    }

    if (isMatch) {
      setShowWin(true);
      confetti({ particleCount: 150, zIndex: 9999, spread: 80 });
      setTimeout(() => onWin(3), 2000);
    } else {
      if (currentLegs < level.legs) {
        triggerAITutor(`现在的脚数算出来是 ${currentLegs} 条，比规定的 ${level.legs} 条少哦！你看代码里写着 \`b = b + 1\`，说明这个时候应该继续增加兔子的数量！往右拖动滑块试试。`);
      } else {
        triggerAITutor(`哎呀，现在的脚数 ${currentLegs} 超过 ${level.legs} 啦！是不是兔子放太多了？把滑块往左移动，减少一点兔子试试看~`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex flex-col relative w-full font-sans text-[#1E293B]">
      {/* Header */}
      <div className="w-full bg-[#FDE047] shadow-[0_4px_0_#EAB308] border-b-4 border-[#CA8A04] p-4 flex items-center justify-between z-20 sticky top-0">
        <button onClick={onBack} className="w-[40px] h-[40px] bg-[#FBCFE8] border-b-4 border-[#F472B6] rounded-[10px] flex items-center justify-center text-[#BE185D] hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-[18px] md:text-[20px] font-black text-[#854D0E] flex-1 text-center truncate px-2">编程验证：Python枚举遍历法</div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-4 gap-4 pb-32 max-w-7xl mx-auto w-full">
        {/* Left Column: Code & Flowchart */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 overflow-y-auto">
           <div className="bg-[#1E293B] border-4 border-[#0F172A] rounded-[24px] p-5 shadow-lg relative">
              <div className="text-xs text-[#94A3B8] uppercase font-bold mb-3 border-b-2 border-[#334155] pb-2">Python 程序</div>
              <div className="font-mono text-sm sm:text-base leading-relaxed whitespace-pre overflow-x-auto text-[#E2E8F0]">
                <span className="text-[#38BDF8]">a</span> = 35 <span className="text-[#64748B]"># 鸡的初始值</span><br/>
                <span className="text-[#38BDF8]">b</span> = 0  <span className="text-[#64748B]"># 兔的初始值</span><br/>
                <br/>
                <span className="text-[#FBBF24]">while</span> True:<br/>
                {'    '}<span className="text-[#F472B6]">c</span> = a*2 + b*4<br/>
                {'    '}<span className="text-[#FBBF24]">if</span> c == 94:<br/>
                {'        '}<span className="text-[#34D399]">print</span>(<span className="text-[#A78BFA]">'鸡有:'</span>, a)<br/>
                {'        '}<span className="text-[#34D399]">print</span>(<span className="text-[#A78BFA]">'兔有:'</span>, b)<br/>
                {'        '}<span className="text-[#FBBF24]">break</span> <span className="text-[#64748B]"># 结束循环</span><br/>
                {'    '}<span className="text-[#FBBF24]">else</span>:<br/>
                {'        '}a = a - 1<br/>
                {'        '}b = b + 1<br/>
              </div>
           </div>

           <div className="bg-white border-4 border-[#BAE6FD] rounded-[24px] p-5 shadow-sm flex-1 flex flex-col items-center">
              <div className="text-[#0369A1] font-bold mb-4 bg-[#E0F2FE] px-4 py-1 rounded-full border-2 border-[#7DD3FC]">遍历法流程图</div>
              <div className="flex flex-col items-center flex-1 w-full text-sm font-bold text-[#475569] gap-2">
                 <div className="bg-[#D1FAE5] px-4 py-2 rounded-xl border-2 border-[#34D399]">1. 初始化: a=35, b=0</div>
                 <div className="text-[#94A3B8]">⬇</div>
                 <div className="bg-[#FEF3C7] px-4 py-2 rounded-xl border-2 border-[#FBBF24]">2. 脚 c = a*2 + b*4</div>
                 <div className="text-[#94A3B8]">⬇</div>
                 <div className="bg-[#E0E7FF] w-20 h-20 rotate-45 border-2 border-[#818CF8] flex items-center justify-center my-2 shadow-[2px_2px_0_#A5B4FC]">
                    <span className="-rotate-45 text-center leading-tight">c == 94?</span>
                 </div>
                 <div className="text-[#94A3B8]">⬇</div>
                 
                 <div className="flex w-full justify-center gap-6 mt-1">
                    <div className="flex flex-col items-center w-24">
                      <span className="bg-[#10B981] text-white rounded px-2 py-0.5 text-xs mb-2">是</span>
                      <div className="bg-[#FFEDD5] w-full text-center py-2 rounded-xl border-2 border-[#FB923C] text-xs">输出，<br/>结束循环</div>
                    </div>
                    <div className="flex flex-col items-center w-24">
                      <span className="bg-[#EF4444] text-white rounded px-2 py-0.5 text-xs mb-2">否</span>
                      <div className="bg-[#FCE7F3] w-full text-center py-2 rounded-xl border-2 border-[#F472B6] text-xs">a减少1<br/>b增加1<br/>(返回计算)</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Interactive Sandbox & Table */}
        <div className="w-full lg:w-[65%] flex flex-col gap-4">
           {/* Slider and Animation */}
           <div className="bg-white border-4 border-[#BFDBFE] rounded-[24px] p-4 lg:p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b-2 border-[#E2E8F0] pb-2">
                 <div className="font-bold text-[#1E293B] text-lg">🏃 模拟执行程序循环</div>
              </div>

              <div className="bg-[#F8FAFC] rounded-[16px] border-2 border-[#CBD5E1] p-4 flex flex-wrap gap-2 justify-center min-h-[120px] mb-6 items-center">
                 <AnimatePresence>
                   <div className="flex flex-wrap justify-center gap-1">
                     {Array.from({length: chickenGuess}).map((_, i) => (
                       <motion.div key={`c-${i}`} layout className="text-2xl sm:text-3xl" initial={{scale:0}} animate={{scale:1}}>🐥</motion.div>
                     ))}
                   </div>
                   <div className="flex flex-wrap justify-center gap-1 mt-2 lg:mt-0 lg:ml-4 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-[#CBD5E1] pt-2 lg:pt-0 lg:pl-4">
                     {Array.from({length: rabbitGuess}).map((_, i) => (
                       <motion.div key={`r-${i}`} layout className="text-2xl sm:text-3xl" initial={{scale:0}} animate={{scale:1}}>🐰</motion.div>
                     ))}
                   </div>
                 </AnimatePresence>
              </div>

              <div className="flex flex-col gap-4 bg-[#FEF3C7] p-4 sm:p-6 rounded-[16px] border-2 border-[#F59E0B]">
                 <div className="flex justify-between font-bold text-[#92400E]">
                    <span>拖动滑块模拟循环次数 (兔子数)：{rabbitGuess}</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max={level.heads} 
                   value={rabbitGuess}
                   onChange={e => setRabbitGuess(Number(e.target.value))}
                   className="w-full h-4 bg-[#FDE68A] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
                 />
                 <div className="flex justify-between items-center mt-2">
                    <div className="text-sm sm:text-base font-bold text-[#B45309]">
                      当前逻辑： a={chickenGuess}, b={rabbitGuess} <br/> 
                      👉 算出的腿数 c = <span className="text-[20px] sm:text-[24px] text-[#EF4444]">{currentLegs}</span>
                    </div>
                    <button 
                      onClick={handleVerify}
                      className="bg-[#22C55E] text-white px-4 sm:px-8 py-3 rounded-full font-black shadow-[0_4px_0_#16A34A] active:translate-y-1 active:shadow-none hover:bg-[#16A34A] flex items-center gap-2 whitespace-nowrap transition-all"
                    >
                      <Play size={18} /> 执行这步
                    </button>
                 </div>
              </div>
           </div>

           {/* Record Table */}
           <div className="bg-white border-4 border-[#BFDBFE] rounded-[24px] p-4 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[250px]">
              <div className="font-bold text-[#0369A1] mb-2 px-2">📋 操作记录表 (变量监控)</div>
              <div className="overflow-y-auto flex-1 border-2 border-[#E2E8F0] rounded-xl">
                 <table className="w-full text-center text-sm md:text-base border-collapse">
                    <thead className="bg-[#F1F5F9] sticky top-0 z-10 shadow-sm text-[#475569]">
                       <tr>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">鸡(a)</th>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">兔(b)</th>
                         <th className="py-3 px-2 border-b-2 border-r-2 border-[#E2E8F0]">脚总数(c)</th>
                         <th className="py-3 px-2 border-b-2 border-[#E2E8F0]">如果 c == 94?</th>
                       </tr>
                    </thead>
                    <tbody>
                       {history.length === 0 && (
                          <tr><td colSpan={4} className="py-8 text-[#94A3B8] font-medium">点击“执行这步”记录程序运行状态</td></tr>
                       )}
                       {history.map((row, i) => (
                         <motion.tr 
                           initial={{ opacity: 0, backgroundColor: '#FEF3C7' }}
                           animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                           key={i} 
                           className="border-b border-[#F1F5F9] text-[#1E293B] font-medium"
                         >
                            <td className="py-2 px-2 border-r border-[#F1F5F9]">{row.a}</td>
                            <td className="py-2 px-2 border-r border-[#F1F5F9]">{row.b}</td>
                            <td className="py-2 px-2 border-r border-[#F1F5F9] text-[#0369A1] font-bold">{row.c}</td>
                            <td className="py-2 px-2">
                               {row.match ? 
                                 <span className="text-[#16A34A] font-black flex items-center justify-center gap-1"><CheckCircle size={16}/> 成立！循环退出</span> : 
                                 <span className="text-[#EF4444]">否 (继续循环)</span>
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
            <h2 className="text-[32px] font-black text-[#065F46] mb-2">程序运行完毕！</h2>
            <p className="text-[#047857] font-medium mb-6">计算机通过 {rabbitGuess} 次快速的循环尝试，帮你找出了正确答案！这就是遍历算法的威力！</p>
          </motion.div>
        </motion.div>
      )}

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide}
        title="操作指引"
        content="这可是真正的计算机算法哦！左侧是Python代码，滑动右侧的滑块来模拟计算机循环寻找答案的过程。选定数量后，点击【执行这步】，看看下方的表格是如何一步步逼近最终结果的！"
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
}
