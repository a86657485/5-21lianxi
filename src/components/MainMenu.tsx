import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Map, Play, Lightbulb, Bird, Rabbit, Cloud } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onTutorial: () => void;
  onSandbox: () => void;
}

export function MainMenu({ onPlay, onTutorial, onSandbox }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E0F2FE] overflow-hidden relative p-4">
      {/* Background decorations */}
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-10 opacity-50 select-none text-[#15803D]"
      >
        <Rabbit size={64} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 opacity-50 select-none text-[#B45309]"
      >
        <Bird size={64} />
      </motion.div>
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-20 right-20 opacity-50 select-none text-[#7DD3FC]"
      >
        <Cloud size={64} fill="currentColor" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border-4 border-[#7DD3FC] text-center z-10 max-w-md w-full"
      >
        <div className="flex justify-center flex-row gap-4 mb-4">
          <div className="bg-[#FEFCE8] p-4 rounded-full border-4 border-[#FDE047]"><Bird size={48} className="text-[#A16207]"/></div>
          <div className="bg-[#F1F5F9] p-4 rounded-full border-4 border-[#CBD5E1]"><Rabbit size={48} className="text-[#475569]"/></div>
        </div>
        <h1 className="text-4xl md:text-[40px] font-black text-[#854D0E] mb-2">
          鸡兔同笼
        </h1>
        <p className="text-xl text-[#0369A1] font-medium mb-8">农场神探挑战赛</p>

        <div className="flex flex-col gap-4">
          <MenuButton onClick={onPlay} icon={<Play />} label="开始探险" variant="primary" />
          <MenuButton onClick={onTutorial} icon={<BookOpen />} label="怎么玩？(教程)" variant="secondary" />
          <MenuButton onClick={onSandbox} icon={<Lightbulb />} label="自由出题" variant="outline" />
        </div>
      </motion.div>
    </div>
  );
}

function MenuButton({ onClick, icon, label, variant }: { onClick: () => void, icon: React.ReactNode, label: string, variant: 'primary' | 'secondary' | 'outline' }) {
  const baseClasses = "flex items-center justify-center gap-3 px-6 py-4 rounded-[50px] text-[20px] font-bold transition-transform active:translate-y-[4px] active:shadow-none border-none";
  const variants = {
    primary: "bg-[#22C55E] text-white shadow-[0_6px_0_#16A34A]",
    secondary: "bg-[#FDE047] text-[#854D0E] shadow-[0_6px_0_#CA8A04]",
    outline: "bg-white text-[#0369A1] border-4 border-[#7DD3FC] shadow-[0_4px_0_#38BDF8]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </motion.button>
  );
}
