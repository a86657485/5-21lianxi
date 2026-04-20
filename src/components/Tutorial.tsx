import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BrainCircuit, PawPrint, EyeOff, Bird, Rabbit } from 'lucide-react';
import { cn } from '../lib/utils';

export function Tutorial({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "问题来了！",
      content: "农场里有个笼子，里面关着鸡和兔子。\n我们只能看到上面有 5 个头，下面有 14 条腿。\n怎么知道有几只鸡，几只兔子呢？",
      visual: (
        <div className="flex justify-center gap-2 text-6xl my-8">
          <div className="relative flex">
            {Array.from({length: 5}).map((_, i) => <div key={i} className="text-gray-400 w-12 h-12 rounded-full border-4 border-gray-400 bg-gray-100 flex items-center justify-center -ml-2 text-2xl font-bold">?</div>)}
            <div className="absolute -bottom-10 left-0 w-full text-center text-blue-600 font-bold text-lg">5 个头</div>
          </div>
        </div>
      )
    },
    {
      title: "神奇的“吹哨法”（抬腿法）",
      content: "农夫吹了一口响哨：“所有动物，抬起两条腿！”\n每只鸡抬起两条腿（坐到了地上）。\n每只兔子也抬起两条腿（用后腿站立）。",
      visual: (
        <div className="flex justify-center gap-8 text-5xl my-8">
          <div className="flex gap-2 relative">
             <Bird size={64} className="text-[#B45309]" />
             <motion.div animate={{y: [-10, 0]}} transition={{yoyo: Infinity, duration: 0.5}} className="flex gap-1 absolute -right-6 -bottom-2 text-[#B45309]">
               <PawPrint size={24} /> <PawPrint size={24} />
             </motion.div>
          </div>
          <div className="flex gap-2 relative ml-12">
             <Rabbit size={64} className="text-[#15803D]" />
             <motion.div animate={{y: [-10, 0]}} transition={{yoyo: Infinity, duration: 0.5}} className="flex gap-1 absolute -right-6 -bottom-2 text-[#15803D]">
               <PawPrint size={24} /> <PawPrint size={24} />
             </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "算一算地上的腿",
      content: "一共5个动物，每个动物抬起 2 条腿。\n空中一共抬起了：5 × 2 = 10 条腿。\n原来有14条腿，现在地上还剩：\n14 - 10 = 4 条腿！",
      visual: (
         <div className="text-center font-mono font-bold text-3xl text-orange-600 my-8">
           14 - (5 × 2) = 4
         </div>
      )
    },
    {
      title: "剩下的腿是谁的？",
      content: "现在鸡的2条腿都在空中，地上没有鸡的腿了！\n兔子有4条腿，抬起2条，还有2条腿在地上。\n所以，地上的4条腿全部都是兔子的！",
      visual: (
         <div className="flex justify-center gap-12 my-8 text-4xl">
            <div className="flex flex-col items-center opacity-50">
               <Bird size={48} className="text-[#B45309]" />
               <span className="text-sm font-bold mt-2">地上0腿</span>
            </div>
            <div className="flex flex-col items-center">
               <Rabbit size={48} className="text-[#15803D]" />
               <span className="text-sm text-red-500 font-bold mt-2">地上2腿</span>
            </div>
         </div>
      )
    },
    {
      title: "大功告成！",
      content: "地上一共有 4 条腿，每只站立的兔子有 2 条腿。\n那么兔子有：4 ÷ 2 = 2 只！\n一共有5个头，减去2只兔子...\n鸡有：5 - 2 = 3 只！",
      visual: (
        <div className="flex flex-col items-center font-bold text-[20px] md:text-2xl gap-4 my-8 bg-green-100 p-6 rounded-xl border-4 border-green-200">
           <div className="text-blue-700 flex items-center gap-2">
             <Rabbit size={32} className="text-blue-700" />
             兔 = 4 ÷ 2 = 2 只
           </div>
           <div className="text-amber-600 flex items-center gap-2">
             <Bird size={32} className="text-amber-600" />
             鸡 = 5 - 2 = 3 只
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#E0F2FE] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="bg-[#FDE047] border-4 border-[#CA8A04] rounded-[20px] shadow-[0_4px_0_#EAB308] p-4 mb-8 flex items-center justify-between">
          <button onClick={onBack} className="w-[50px] h-[50px] flex items-center justify-center bg-[#FBCFE8] border-b-[4px] border-[#F472B6] rounded-[12px] shadow-[0_4px_0_#F472B6] text-[#BE185D] hover:brightness-110 transition-all active:translate-y-1 active:border-b-0 active:shadow-none">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[24px] md:text-[28px] font-black text-[#854D0E] pr-2 md:pr-12 md:text-center w-full">
            学习秘籍
          </h2>
        </div>

        <motion.div 
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-[24px] p-8 shadow-[inset_0_0_20px_rgba(186,230,253,0.3)] border-4 border-[#BFDBFE]"
        >
           <h3 className="text-[24px] font-black text-[#0369A1] mb-4">{steps[step].title}</h3>
           <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
             {steps[step].content}
           </p>

           <div className="min-h-[150px] flex items-center justify-center">
             {steps[step].visual}
           </div>

           <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-indigo-50">
             <div className="flex gap-2">
               {steps.map((_, i) => (
                 <div key={i} className={cn("h-3 rounded-full transition-all duration-300", i === step ? "w-8 bg-[#FB923C]" : "w-3 bg-[#E2E8F0]")} />
               ))}
             </div>
             
             <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-[50px] font-bold text-[#64748B] bg-[#F1F5F9] border-b-[4px] border-[#CBD5E1] hover:brightness-110 active:translate-y-1 active:border-b-0">
                    上一步
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)} className="px-6 py-3 rounded-[50px] font-bold text-white bg-[#22C55E] shadow-[0_4px_0_#16A34A] border-none hover:brightness-110 active:translate-y-1 active:shadow-none">
                    下一步
                  </button>
                ) : (
                  <button onClick={onBack} className="px-6 py-3 rounded-[50px] font-bold text-white bg-[#FB923C] shadow-[0_4px_0_#EA580C] border-none hover:brightness-110 active:translate-y-1 active:shadow-none">
                    我学会了！
                  </button>
                )}
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
