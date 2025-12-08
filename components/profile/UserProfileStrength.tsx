
import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';

interface UserProfileStrengthProps {
  user: UserProfile;
}

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

export const UserProfileStrength: React.FC<UserProfileStrengthProps> = ({ user }) => {
  const [score, setScore] = useState(0);
  const [nextAction, setNextAction] = useState<string | null>(null);

  useEffect(() => {
    let s = 0;
    const missing: string[] = [];

    // Basic Info (25%)
    if (user.fullName) s += 10;
    if (user.headline) s += 10; else missing.push("Add a Headline");
    if (user.location) s += 5;

    // Visuals (10%)
    if (user.avatarUrl) s += 10; else missing.push("Upload Photo");

    // Bio (15%)
    if (user.bio && user.bio.length > 50) s += 15;
    else if (user.bio) s += 5;
    else missing.push("Expand Bio");

    // Experience (20%)
    if (user.experiences && user.experiences.length > 0) {
        s += 15;
        if (user.experiences.length > 1) s += 5;
    } else {
        missing.push("Add Experience");
    }

    // Education (10%)
    if (user.education && user.education.length > 0) s += 10; 
    
    // Skills (10%)
    if (user.skills && user.skills.length > 0) {
        s += 5;
        if (user.skills.length >= 3) s += 5;
        else missing.push("Add more Skills");
    } else {
        missing.push("Add Skills");
    }

    // Socials (10%)
    if (user.socials?.linkedin) s += 10; else missing.push("Link LinkedIn");

    setScore(Math.min(s, 100));
    setNextAction(missing.length > 0 ? missing[0] : null);
  }, [user]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                    <Trophy size={18} className="text-amber-500" />
                    <h3>Profile Strength</h3>
                </div>
                <span className="text-2xl font-bold text-slate-900">{score}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                <MotionDiv 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full transition-all ${
                        score < 50 ? 'bg-red-500' : score < 80 ? 'bg-amber-500' : 'bg-green-500'
                    }`} 
                />
            </div>

            {nextAction ? (
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-2">
                        <Sparkles size={12} className="text-indigo-500" />
                        Next: <strong>{nextAction}</strong>
                    </span>
                    <ArrowRight size={12} className="text-slate-400" />
                </div>
            ) : (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <Sparkles size={12} /> All Star Profile!
                </p>
            )}
        </div>
    </div>
  );
};
