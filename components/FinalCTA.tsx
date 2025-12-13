
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinalCTAProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

const MotionDiv = motion.div as any;

const FinalCTA: React.FC<FinalCTAProps> = ({
  headline = "Ready to Build Faster?",
  subheadline = "Join 10,000+ founders using startupAI to launch, raise capital, and scale effectively.",
  primaryCta = "Create Your Profile",
  secondaryCta = "Build a Deck",
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
        <div className="container mx-auto px-6 text-center relative z-10">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                    {headline}
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    {subheadline}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => navigate('/onboarding')}
                      className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 hover:-translate-y-1"
                    >
                        {primaryCta} <ArrowRight size={20} />
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1">
                        {secondaryCta}
                    </button>
                </div>
            </MotionDiv>
        </div>
    </section>
  );
};

export default FinalCTA;
