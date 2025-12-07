
import React, { useEffect, useState } from 'react';
import { Trophy, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StartupProfile } from '../../types';

interface ProfileStrengthProps {
  profile: StartupProfile | null;
}

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

export const ProfileStrength: React.FC<ProfileStrengthProps> = ({ profile }) => {
  const [profileStrength, setProfileStrength] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;

    const calculateStrength = (p: StartupProfile) => {
        let score = 0;
        const missing: string[] = [];

        // Weighting: Core Basics (40%)
        if (p.name) score += 10; else missing.push("Company Name");
        if (p.stage) score += 10; else missing.push("Stage");
        if (p.tagline) score += 10; else missing.push("Tagline");
        if (p.websiteUrl) score += 10; else missing.push("Website URL");

        // Weighting: Strategic Narrative (40%)
        if (p.problemStatement && p.problemStatement.length > 20) score += 15; else missing.push("Problem Statement");
        if (p.solutionStatement && p.solutionStatement.length > 20) score += 15; else missing.push("Solution Statement");
        if (p.targetMarket) score += 10; else missing.push("Target Market");

        // Weighting: Financials & Biz Model (20%)
        if (p.businessModel) score += 10; else missing.push("Business Model");
        if (p.fundingGoal > 0) score += 10; else missing.push("Funding Goal");

        return { score: Math.min(score, 100), missing };
    };

    const result = calculateStrength(profile);
    setProfileStrength(result.score);
    setMissingFields(result.missing);
  }, [profile]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Trophy size={18} className="text-amber-500" />
                    <h3 className="font-bold text-slate-900">Profile Health</h3>
                </div>
                <p className="text-xs text-slate-500">Completeness Score</p>
            </div>
            <div className="text-2xl font-bold text-slate-900">{profileStrength}%</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
            <MotionDiv 
                initial={{ width: 0 }}
                animate={{ width: `${profileStrength}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                    profileStrength < 50 ? 'bg-red-500' : 
                    profileStrength < 80 ? 'bg-amber-500' : 'bg-green-500'
                }`}
            />
        </div>

        {/* Missing Items */}
        <div className="space-y-2">
            {missingFields.length > 0 ? (
                missingFields.slice(0, 2).map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span>Add <strong>{field}</strong> to improve score</span>
                        <ArrowRight size={12} className="ml-auto text-slate-400" />
                    </div>
                ))
            ) : (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
                    <Sparkles size={12} />
                    <span>All Star Profile! You are ready to raise.</span>
                </div>
            )}
        </div>
    </div>
  );
};
