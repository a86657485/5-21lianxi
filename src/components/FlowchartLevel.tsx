import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, GripVertical, Package, ArrowUpLeft, ArrowUp } from 'lucide-react';
import { checkWin } from '../store';
import { cn } from '../lib/utils';
import { triggerAITutor } from './AITutor';
import confetti from 'canvas-confetti';
import { GuideModal } from './GuideModal';

const BLOCKS = [
  { id: 'b1', text: '鸡数量 a=35', type: 'action' },
  { id: 'b2', text: '兔数量 b=0', type: 'action' },
  { id: 'b3', text: '脚数量 c=a*2+b*4', type: 'action' },
  { id: 'b4', text: '脚数量不等于94？', type: 'condition' },
  { id: 'b5', text: '鸡数量 a=a-1', type: 'action' },
  { id: 'b6', text: '兔数量 b=b+1', type: 'action' },
  { id: 'b7', text: '输出 a 的值', type: 'output' },
  { id: 'b8', text: '输出 b 的值', type: 'output' }
];

const CORRECT_ORDER = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'];

export function FlowchartLevel({ onBack, onWin }: { onBack: () => void, onWin: (stars: number) => void }) {
  const [slots, setSlots] = useState<(string | null)[]>(Array(8).fill(null));
  const [availableBlocks, setAvailableBlocks] = useState([...BLOCKS]);
  const [showWin, setShowWin] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [draggedItem, setDraggedItem] = useState<{id: string, fromSlot: number | null} | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string, fromSlot: number | null) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedItem({ id, fromSlot });
  };

  const handleDrop = (e: React.DragEvent, targetSlotIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const blockId = draggedItem.id;
    const fromSlotIndex = draggedItem.fromSlot;

    // Moving from bank to slot
    if (fromSlotIndex === null) {
      setSlots(prev => {
        const next = [...prev];
        const existingInSlot = next[targetSlotIndex];
        next[targetSlotIndex] = blockId;
        
        // If there was something there, return it to bank
        if (existingInSlot) {
           setAvailableBlocks(ab => [...ab, BLOCKS.find(b => b.id === existingInSlot)!]);
        }
        return next;
      });
      setAvailableBlocks(prev => prev.filter(b => b.id !== blockId));
    } 
    // Moving from slot to slot
    else {
      setSlots(prev => {
        const next = [...prev];
        const existingInTarget = next[targetSlotIndex];
        next[targetSlotIndex] = blockId;
        next[fromSlotIndex] = existingInTarget; // Swap
        return next;
      });
    }
    setDraggedItem(null);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const returnToBank = (slotIndex: number) => {
    const blockId = slots[slotIndex];
    if (!blockId) return;

    setSlots(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setAvailableBlocks(prev => [...prev, BLOCKS.find(b => b.id === blockId)!]);
  };

  const handleValidate = () => {
    if (slots.includes(null)) {
      triggerAITutor("学生还没填完所有的流程图代码块呢，去提醒他们要把所有的格子都填上哦！语气要可爱鼓励。");
      return;
    }

    const isCorrect = slots.every((id, idx) => id === CORRECT_ORDER[idx]);
    
    if (isCorrect) {
      setShowWin(true);
      confetti({ particleCount: 150, zIndex: 9999 });
      setTimeout(() => onWin(3), 2000);
    } else {
      triggerAITutor("学生在学习这节课的核心：遍历法流程图。他们拼凑这些代码块的顺序不完全正确。正确的流程是从初始化头数量开始，然后再进入循环，计算脚的总数，随后用一个条件判断是不是等于目标脚数94。如果是，就调整鸡兔数量（循环里面一减一增）继续循环；如果不等于条件（即找到了最终答案），就输出并结束。他们有些地方放错了，请你给他们一些引导，指出枚举法需要进行初始假设、循环判断、更新数值的思想，不要直接给出完全的排列顺序，用可爱的语气鼓励他们继续试。");
    }
  };

  const renderSlot = (index: number, shape: 'rect' | 'diamond' | 'parallelogram') => {
    const blockId = slots[index];
    const block = BLOCKS.find(b => b.id === blockId);
    
    return (
      <div 
        onDrop={(e) => handleDrop(e, index)}
        onDragOver={allowDrop}
        className={cn(
           "w-48 h-16 border-4 flex items-center justify-center transition-all bg-white relative cursor-pointer",
           shape === 'diamond' ? "rotate-45 w-24 h-24 my-6" :
           shape === 'parallelogram' ? "skew-x-[-15deg]" :
           "rounded-xl",
           !block ? "border-dashed border-[#CBD5E1] bg-[#F8FAFC]" : "border-solid border-[#3B82F6] shadow-sm hover:border-[#2563EB]"
        )}
        onClick={() => returnToBank(index)}
      >
        {block && (
           <div 
             draggable
             onDragStart={(e) => handleDragStart(e, block.id, index)}
             className={cn(
                "font-bold text-sm text-[#0F172A] w-full text-center px-2 z-10",
                shape === 'diamond' && "-rotate-45",
                shape === 'parallelogram' && "skew-x-[15deg]"
             )}
           >
             {block.text}
           </div>
        )}
        {!block && <div className={cn("text-[#94A3B8] text-xs font-bold", shape === 'diamond' && "-rotate-45", shape === 'parallelogram' && "skew-x-[15deg]")}>放置区</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex flex-col relative w-full font-sans text-[#1E293B]">
      {/* Header */}
      <div className="w-full bg-[#FDE047] shadow-[0_4px_0_#EAB308] border-b-4 border-[#CA8A04] p-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="w-[40px] h-[40px] bg-[#FBCFE8] border-b-4 border-[#F472B6] rounded-[10px] flex items-center justify-center text-[#BE185D] hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-[20px] font-black text-[#854D0E] flex-1 text-center truncate px-4">制作算法流程图（35头94腿）</div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Block Bank */}
        <div className="w-full md:w-64 bg-white border-r-4 border-b-4 md:border-b-0 border-[#BFDBFE] p-4 overflow-y-auto shadow-md z-10">
           <h3 className="font-bold text-[#0369A1] mb-4 text-center border-b-2 border-dashed border-[#BAE6FD] pb-2 flex items-center justify-center gap-2">
             <Package size={20} className="text-[#0369A1]" /> 代码块仓库
           </h3>
           <p className="text-xs text-[#64748B] mb-4 text-center">把这些块拖到右侧的流程图里，点击放置区可以取下。</p>
           <div className="flex flex-col gap-3">
             <AnimatePresence>
                {availableBlocks.map(block => (
                   <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     key={block.id}
                     draggable
                     onDragStart={(e) => handleDragStart(e, block.id, null)}
                     className="bg-[#BAE6FD] border-2 border-[#38BDF8] p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing font-bold text-sm text-[#0C4A6E] flex items-center gap-2 hover:bg-[#7DD3FC]"
                   >
                     <GripVertical size={16} className="text-[#38BDF8]" />
                     {block.text}
                   </motion.div>
                ))}
             </AnimatePresence>
             {availableBlocks.length === 0 && (
                <div className="text-center text-[#94A3B8] text-sm py-4 border-2 border-dashed border-[#E2E8F0] rounded-lg">全部放置完毕！</div>
             )}
           </div>
        </div>

        {/* Flowchart Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F0F9FF] relative flex justify-center pb-52">
           <div className="flex flex-col items-center relative gap-2">
              <div className="bg-[#22C55E] text-white px-8 py-2 rounded-full border-2 border-[#16A34A] font-bold shadow-sm">开始</div>
              <div className="w-1 h-6 bg-[#CBD5E1]"></div>
              
              {renderSlot(0, 'rect')} {/* 鸡数量 a=35 */}
              <div className="w-1 h-6 bg-[#CBD5E1]"></div>
              
              {renderSlot(1, 'rect')} {/* 兔数量 b=0 */}
              <div className="w-1 h-6 bg-[#CBD5E1]"></div>
              
              {/* Loop point */}
              <div className="relative">
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 flex items-center">
                   <ArrowUpLeft size={16} className="text-[#64748B] font-bold mr-1" />
                   <div className="w-8 h-1 bg-[#CBD5E1]"></div>
                </div>
                {renderSlot(2, 'rect')} {/* 脚数量 c=a*2+b*4 */}
              </div>
              <div className="w-1 h-6 bg-[#CBD5E1]"></div>
              
              {renderSlot(3, 'diamond')} {/*条件：脚数量不等于94？*/}
              
              {/* Branches */}
              <div className="flex w-full min-w-[300px] justify-between relative mt-4">
                 {/* Yes branch */}
                 <div className="flex flex-col items-center relative left-8">
                     <div className="font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 rounded -mt-6 z-10 border border-[#FDE68A]">是 (继续找)</div>
                     <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                     {renderSlot(4, 'rect')} {/* 鸡的数量 a=a-1 */}
                     <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                     {renderSlot(5, 'rect')} {/* 兔的数量 b=b+1 */}
                     
                     {/* Loop back visual indicator */}
                     <div className="flex mt-2 items-center flex-col relative right-8">
                       <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                       <div className="text-xs text-[#0369A1] font-bold bg-[#E0F2FE] px-2 py-1 rounded border border-[#BAE6FD] flex items-center gap-1">
                         (返回上方重新计算脚数 <ArrowUp size={14} />)
                       </div>
                     </div>
                 </div>

                 {/* No branch */}
                 <div className="flex flex-col items-center relative right-8">
                     <div className="font-bold text-[#22C55E] bg-[#DCFCE7] px-2 rounded -mt-6 z-10 border border-[#bbf7d0]">否 (找到了!)</div>
                     <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                     {renderSlot(6, 'parallelogram')} {/* 输出 a 的值 */}
                     <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                     {renderSlot(7, 'parallelogram')} {/* 输出 b 的值 */}
                     <div className="w-1 h-6 bg-[#CBD5E1]"></div>
                     <div className="bg-[#EF4444] text-white px-8 py-2 rounded-full border-2 border-[#B91C1C] font-bold shadow-sm mb-12">结束</div>
                 </div>
              </div>
              
           </div>
        </div>
      </div>

      {/* Footer validation */}
      <div className="fixed bottom-0 md:bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 backdrop-blur-sm border-t-4 border-[#E2E8F0] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20 flex justify-center rounded-none">
         <button 
           onClick={handleValidate}
           className="px-12 py-4 bg-[#22C55E] text-white font-bold text-xl rounded-[50px] shadow-[0_6px_0_#16A34A] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 hover:brightness-110"
         >
           验证流程图
         </button>
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
            <h2 className="text-[32px] font-black text-[#065F46] mb-2">太棒了！</h2>
            <p className="text-[#047857] font-medium mb-6">你已经掌握了计算机思维的最高绝学——枚举遍历法流程图构建！</p>
          </motion.div>
        </motion.div>
      )}

      <GuideModal 
        isOpen={showGuide}
        title="挑战指引：绘制流程图"
        content="在这关中，用到了你在数学课学到的枚举法！请将左侧代码块拖拽右边的算法流程图对应位置。注意循环的开始、结束、条件分支哦！这可是计算机程序的骨架！"
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
}
