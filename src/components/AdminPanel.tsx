import React, { useState } from 'react';
import { Settings, Lock, Unlock, Zap, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  onUnlockAll: () => void;
  onAutoWinCurrent: () => void;
  currentLevelExists: boolean;
}

export function AdminPanel({ onUnlockAll, onAutoWinCurrent, currentLevelExists }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (password === '141710') {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-white rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] border-4 border-[#CBD5E1] p-4 flex flex-col gap-3 w-64 mb-2"
          >
            <div className="font-bold text-[#64748B] border-b-2 border-[#E2E8F0] pb-2 flex items-center gap-2">
              <Settings size={18} /> 测试面板
            </div>
            
            {!isUnlocked ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入提取码"
                  className={cn(
                    "bg-[#F1F5F9] rounded-xl px-3 py-2 border-2 outline-none text-sm",
                    error ? "border-red-400" : "border-transparent focus:border-[#CBD5E1]"
                  )}
                />
                <button 
                  onClick={handleLogin}
                  className="bg-[#3B82F6] text-white rounded-xl py-2 font-bold text-sm shadow-[0_4px_0_#2563EB] active:translate-y-1 active:shadow-none transition-all"
                >
                  进入
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { onUnlockAll(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-[#22C55E] text-white rounded-xl py-2 font-bold text-sm shadow-[0_4px_0_#16A34A] active:translate-y-1 active:shadow-none transition-all"
                >
                  <Unlock size={16} /> 解锁所有关卡
                </button>
                {currentLevelExists && (
                  <button 
                    onClick={() => { onAutoWinCurrent(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-[#FDE047] text-[#854D0E] rounded-xl py-2 font-bold text-sm shadow-[0_4px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all border-2 border-[#CA8A04]"
                  >
                    <Zap size={16} /> 一键通关当前关
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-[#94A3B8] rounded-full shadow-[0_4px_0_#64748B] border-none flex items-center justify-center text-white active:translate-y-1 active:shadow-none transition-all"
      >
        <Settings size={24} />
      </motion.button>
    </div>
  );
}
