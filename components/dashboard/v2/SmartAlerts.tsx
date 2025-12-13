
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ArrowDown, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useData } from '../../../context/DataContext';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

export const SmartAlerts: React.FC = () => {
  const { metrics, profile, decks } = useData();
  const [alerts, setAlerts] = useState<Array<{ id: number, type: 'critical' | 'warning' | 'info', msg: string, icon: React.ReactNode }>>([]);

  useEffect(() => {
    const newAlerts = [];
    let idCounter = 1;

    // 1. Runway Check
    const latestMetric = metrics[metrics.length - 1];
    if (latestMetric) {
        const burnRate = latestMetric.burnRate || 0;
        const cash = latestMetric.cashBalance || 0;
        
        if (burnRate > 0 && cash > 0) {
            const runway = cash / burnRate;
            if (runway < 4) {
                newAlerts.push({
                    id: idCounter++,
                    type: 'critical' as const,
                    msg: `Critical: Runway is ${runway.toFixed(1)} months. Initiate fundraising immediately.`,
                    icon: <AlertTriangle size={16} />
                });
            } else if (runway < 6) {
                newAlerts.push({
                    id: idCounter++,
                    type: 'warning' as const,
                    msg: `Runway is under 6 months (${runway.toFixed(1)}mo). Prepare deck.`,
                    icon: <AlertTriangle size={16} />
                });
            }
        }
    }

    // 2. Profile Completeness
    if (profile) {
        if (decks.length === 0) {
             newAlerts.push({
                id: idCounter++,
                type: 'info' as const,
                msg: 'No Pitch Deck found. Generate one to be investor-ready.',
                icon: <Info size={16} />
            });
        }
        if (!profile.competitors || profile.competitors.length === 0) {
             newAlerts.push({
                id: idCounter++,
                type: 'warning' as const,
                msg: 'Missing competitor analysis. Run the AI Wizard.',
                icon: <ArrowDown size={16} />
            });
        }
    }

    setAlerts(newAlerts);
  }, [metrics, profile, decks]);

  const dismiss = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence>
        {alerts.map(alert => (
            <MotionDiv
                key={alert.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-xl p-3 flex items-center justify-between border ${
                    alert.type === 'critical' ? 'bg-[#FEE2E2] border-[#fecaca] text-[#991B1B]' : 
                    alert.type === 'warning' ? 'bg-[#FEF3C7] border-[#fde68a] text-[#92400E]' :
                    'bg-blue-50 border-blue-100 text-blue-800'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className="shrink-0">
                        {alert.icon}
                    </div>
                    <span className="text-sm font-medium">{alert.msg}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => dismiss(alert.id)} className="p-1 hover:bg-black/5 rounded">
                        <X size={14} />
                    </button>
                </div>
            </MotionDiv>
        ))}
      </AnimatePresence>
    </div>
  );
};
