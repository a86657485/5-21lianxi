import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { triggerAITutor } from './AITutor';
import confetti from 'canvas-confetti';
import { Level } from '../levels';
import { GuideModal } from './GuideModal';

export function AssumptionLevel({ level, onBack, onWin }: { level: Level, onBack: () => void, onWin: (stars: number) => void }) {
  const assumeC_legs = level.heads * 2;
  const diff_legs = level.legs - assumeC_legs;
  const rabbit = diff_legs / 2;
  const chicken = level.heads - rabbit;

  const BLOCKS = [
    { id: 's1', text: `假设 ${level.heads} 只全是鸡，共有 ${level.heads} × 2 = ${assumeC_legs} 条腿` },
    { id: 's2', text: `实际有 ${level.legs} 条腿，相差了 ${level.legs} - ${assumeC_legs} = ${diff_legs} 条腿` },
    { id: 's3', text: `每把一只兔当成鸡，会少算 4 - 2 = 2 条腿` },
    { id: 's4', text: `说明里面肯定有兔子： ${diff_legs} ÷ 2 = ${rabbit} 只` },
    { id: 's5', text: `那么剩下的鸡有： ${level.heads} - ${rabbit} = ${chicken} 只` },
  ];

  const CORRECT_ORDER = ['s1', 's2', 's3', 's4', 's5'];

  const [availableBlocks, setAvailableBlocks] = useState([...BLOCKS].sort(() => Math.random() - 0.5));
  const [slots, setSlots] = useState<(string | null)[]>(Array(5).fill(null));
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

    if (fromSlotIndex === null) {
      setSlots(prev => {
        const next = [...prev];
        const existing = next[targetSlotIndex];
        next[targetSlotIndex] = blockId;
        if (existing) {
          setAvailableBlocks(ab => [...ab, BLOCKS.find(b => b.id === existing)!]);
        }
        return next;
      });
      setAvailableBlocks(prev => prev.filter(b => b.id !== blockId));
    } else {
      setSlots(prev => {
        const next = [...prev];
        const existing = next[targetSlotIndex];
        next[targetSlotIndex] = blockId;
        next[fromSlotIndex] = existing;
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
      triggerAITutor("有几个推导步骤还没填上呢！仔细想想假设法的过程哦~");
      return;
    }

    const isCorrect = slots.every((id, idx) => id === CORRECT_ORDER[idx]);
    
    if (isCorrect) {
      setShowWin(true);
      confetti({ particleCount: 150, zIndex: 9999, spread: 80 });
      setTimeout(() => onWin(3), 2000);
    } else {
      triggerAITutor("哎呀，假设法的步骤顺序好像不对。咱们要先【假设】，然后找【总腿数差】，再算【每只相差的腿】，接着除一除得出【兔子的数量】，最后才算出【鸡的数量】呢！试着重新排一排吧！");
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex flex-col relative w-full font-sans text-[#1E293B]">
      {/* Header */}
      <div className="w-full bg-[#FDE047] shadow-[0_4px_0_#EAB308] border-b-4 border-[#CA8A04] p-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="w-[40px] h-[40px] bg-[#FBCFE8] border-b-4 border-[#F472B6] rounded-[10px] flex items-center justify-center text-[#BE185D] hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-[20px] font-black text-[#854D0E] flex-1 text-center truncate px-4">拖动学习：假设法 ({level.heads}头{level.legs}腿)</div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Block Bank */}
        <div className="w-full md:w-80 bg-white border-r-4 border-b-4 md:border-b-0 border-[#BFDBFE] p-4 overflow-y-auto shadow-md z-10 flex flex-col">
          <h3 className="font-bold text-[#0369A1] mb-4 text-center border-b-2 border-dashed border-[#BAE6FD] pb-2">🧩 逻辑碎片</h3>
          <p className="text-xs text-[#64748B] mb-4 text-center">将这里的推导步骤拖到右边的序号里组合起来，梳理假设法的思路！</p>
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
                    className="bg-[#FEF3C7] border-2 border-[#F59E0B] p-3 rounded-xl shadow-sm cursor-grab active:cursor-grabbing font-bold text-sm text-[#92400E] flex items-center gap-2 hover:bg-[#FDE68A]"
                  >
                    <GripVertical size={16} className="text-[#F59E0B] shrink-0" />
                    <span>{block.text}</span>
                  </motion.div>
                ))}
            </AnimatePresence>
            {availableBlocks.length === 0 && (
                <div className="text-center text-[#94A3B8] text-sm py-4 border-2 border-dashed border-[#E2E8F0] rounded-lg">全部放置完毕！</div>
            )}
          </div>
        </div>

        {/* Placement Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F0F9FF] relative flex justify-center pb-32">
           <div className="flex flex-col items-center gap-6 w-full max-w-lg mt-4">
              {[1, 2, 3, 4, 5].map((step, index) => {
                 const blockId = slots[index];
                 const block = BLOCKS.find(b => b.id === blockId);
                 
                 return (
                    <div key={index} className="flex flex-col md:flex-row md:items-stretch gap-3 w-full">
                       <div className="w-12 h-12 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-black text-xl border-4 border-[#BFDBFE] shadow-sm shrink-0 self-center md:self-start mt-2">
                         {step}
                       </div>
                       <div 
                         onDrop={(e) => handleDrop(e, index)}
                         onDragOver={allowDrop}
                         onClick={() => returnToBank(index)}
                         className={cn(
                           "flex-1 min-h-[64px] border-4 rounded-[16px] flex items-center justify-center p-3 transition-all relative cursor-pointer",
                           !block ? "border-dashed border-[#CBD5E1] bg-[#F8FAFC]" : "border-solid border-[#F59E0B] bg-[#FFFBEB] shadow-sm hover:border-[#D97706]"
                         )}
                       >
                          {block && (
                            <div 
                              draggable
                              onDragStart={e => handleDragStart(e, block.id, index)}
                              className="font-bold text-sm md:text-base text-[#92400E] w-full flex items-center gap-2"
                            >
                              <GripVertical size={16} className="text-[#F59E0B] shrink-0" />
                              {block.text}
                            </div>
                          )}
                          {!block && <div className="text-[#94A3B8] text-sm font-bold tracking-widest">拖拽至此</div>}
                       </div>
                    </div>
                 )
              })}
           </div>
        </div>
      </div>

      {/* Footer validation */}
      <div className="fixed bottom-0 md:bottom-4 left-0 md:left-[320px] right-0 p-4 bg-white border-t-4 border-[#E2E8F0] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 flex justify-center">
         <button 
           onClick={handleValidate}
           className="px-12 py-4 bg-[#22C55E] text-white font-bold text-xl rounded-[50px] shadow-[0_6px_0_#16A34A] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 hover:brightness-110"
         >
           验证推导
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
            <p className="text-[#047857] font-medium mb-6">你已经完全掌握了【假设法】的推导逻辑！数学思维+100！</p>
          </motion.div>
        </motion.div>
      )}

      <GuideModal 
        isOpen={showGuide}
        title="学习指南：假设法重组"
        content="听说过数学里的“假设法”吗？左侧是被打乱的推导步骤，里面藏着解开这道题的密码！将它们拖拽放入右侧按序号 1 到 5 排列起来。如果你排错了顺序，AI 导师会出来帮助你哦！"
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
}
