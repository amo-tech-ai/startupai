
import React, { useState } from 'react';
import { Bell, X, AlertTriangle, ArrowDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Workaround for strict type checking
const MotionDiv = motion.div as any;

export const SmartAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', msg: 'Runway below 6 months—prepare fundraising.', icon: <AlertTriangle size={16} /> },
    { id: 2, type: 'warning', msg: 'MRR dropped 8% this week.', icon: <ArrowDown size={16} /> }
  ]);

  const dismiss = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
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
                    alert.type === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${
                        alert.type === 'critical' ? 'bg-rose-200 text-rose-700' : 'bg-amber-200 text-amber-700'
                    }`}>
                        {alert.icon}
                    </div>
                    <span className="text-sm font-medium">{alert.msg}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-xs font-bold underline decoration-dotted hover:no-underline">Fix</button>
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
