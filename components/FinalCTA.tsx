
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

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const FinalCTA: React.FC<FinalCTAProps> = ({
  headline = "Ready to Build Faster?",
  subheadline = "Join 10,000+ founders using startupAI to launch, raise capital, and scale effectively.",
  primaryCta = "Create Your Profile",
  secondaryCta = "Build a Deck",
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />

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
                      className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 hover:-translate-y-1"
                    >
                        {primaryCta} <ArrowRight size={20} />
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1">
                        {secondaryCta}
                    </button>
                </div>
            </MotionDiv>
        </div>
    </section>
  );
};

export default FinalCTA;
