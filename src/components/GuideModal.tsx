import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Play } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export function GuideModal({ isOpen, title, content, onClose }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-[#38BDF8] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-[#BAE6FD]"></div>
            <div className="w-20 h-20 bg-[#E0F2FE] rounded-full mx-auto flex items-center justify-center mb-4 mt-4 border-4 border-[#7DD3FC]">
               <Info size={40} className="text-[#0284C7]" />
            </div>
            <h2 className="text-[24px] md:text-[28px] font-black text-[#0369A1] mb-4">{title}</h2>
            <p className="text-[#334155] font-medium mb-8 text-[16px] md:text-[18px] leading-relaxed">
              {content}
            </p>
            <button
              onClick={onClose}
              className="bg-[#22C55E] text-white px-8 py-4 rounded-full font-black text-[20px] shadow-[0_6px_0_#16A34A] active:translate-y-[6px] active:shadow-none hover:brightness-110 transition-all w-full flex items-center justify-center gap-2"
            >
               <Play size={24} fill="currentColor" /> 我知道了，开始吧！
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
