import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Cpu, Zap, ChevronRight } from 'lucide-react';
import { AgentDefinition } from '../../types';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div as any;

interface AgentCardProps {
  agent: AgentDefinition;
  variant?: 'compact' | 'full';
  onAction?: (agentId: string) => void;
  active?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  variant = 'compact', 
  onAction,
  active = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the detail view as requested
    navigate(`/agents/${agent.id}`);
    if (onAction) onAction(agent.id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MotionDiv
        whileHover={{ x: 4 }}
        onClick={handleClick}
        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
          active || isHovered 
          ? 'bg-slate-50 border-indigo-200 shadow-sm' 
          : 'bg-white border-transparent'
        }`}
      >
        <div className={`p-2 rounded-lg border ${agent.colorClass} shrink-0`}>
          {agent.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#1A1A1A]">{agent.name}</div>
          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{agent.role}</div>
        </div>

        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <ChevronRight size={14} className="text-indigo-400" />
        </div>
      </MotionDiv>

      <AnimatePresence>
        {isHovered && (
          <MotionDiv
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 pointer-events-none"
          >
            <p className="text-xs leading-relaxed text-slate-300 mb-3">
              {agent.description}
            </p>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Engine</span>
              <span className="text-[10px] font-bold text-slate-400">{agent.techStack}</span>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-900 border-l border-t border-slate-800 rotate-45"></div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
