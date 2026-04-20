import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Loader2, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export const triggerAITutor = (contextPrompt: string) => {
  window.dispatchEvent(new CustomEvent('ai-tutor-trigger', { detail: contextPrompt }));
};

const API_KEY = 'sk-eb65e011c69a4e1cb667eecdfce990a8';
const BASE_URL = 'https://api.deepseek.com/chat/completions';

export function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = async (e: CustomEvent<string>) => {
      setIsOpen(true);
      const systemPrompt = "你是一个专门教授小学数学的AI伴学导师。语气要亲切可爱，多用表情符号。不要直接告诉学生答案，要一步步启发他们思考。";
      const userPrompt = e.detail;

      setMessages([{ role: 'assistant', content: '让我来看看……' }]);
      setIsLoading(true);

      try {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const reply = data.choices[0].message.content;
        
        setMessages([{ role: 'assistant', content: reply }]);
      } catch (error) {
        console.error("AI Error:", error);
        setMessages([{ role: 'assistant', content: "哎呀，我的网络好像有点问题，再试一次吧！" }]);
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener('ai-tutor-trigger', handleTrigger as EventListener);
    return () => window.removeEventListener('ai-tutor-trigger', handleTrigger as EventListener);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputMsg.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: inputMsg }];
    setMessages(newMessages);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: "你是一个专门教授小学数学的AI伴学导师。语气要亲切可爱，不要直接给答案，启发思考。" },
            ...newMessages
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "哎呀，连不上网络啦！" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Mascot */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#22C55E] rounded-full shadow-[0_6px_0_#16A34A] border-none flex items-center justify-center text-white z-50 overflow-hidden active:translate-y-1 active:shadow-none transition-all"
      >
         <Bot size={32} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 right-6 w-80 md:w-96 bg-white rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] border-4 border-[#7DD3FC] flex flex-col z-50 overflow-hidden h-[500px] max-h-[70vh]"
          >
            {/* Header */}
            <div className="bg-[#BAE6FD] p-4 flex justify-between items-center border-b-4 border-[#7DD3FC]">
              <div className="flex items-center gap-2 text-[#0369A1] font-bold">
                <Bot /> AI 导师
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#0369A1] hover:bg-[#7DD3FC] p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-[#94A3B8] text-sm mt-10">
                  遇到困难了吗？随时呼叫我哦！
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-[16px] p-3 text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-[#22C55E] text-white rounded-br-none" 
                      : "bg-white border-2 border-[#CBD5E1] text-[#1E293B] rounded-bl-none prose prose-p:my-1"
                  )}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-[#CBD5E1] rounded-[16px] rounded-bl-none p-3 shadow-sm">
                    <Loader2 className="animate-spin text-[#94A3B8]" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t-2 border-[#E2E8F0] flex gap-2">
              <input 
                type="text" 
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="跟导师聊天..."
                className="flex-1 bg-[#F1F5F9] rounded-full px-4 py-2 border-2 border-transparent focus:border-[#7DD3FC] outline-none text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputMsg.trim()}
                className="w-10 h-10 bg-[#FB923C] text-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
