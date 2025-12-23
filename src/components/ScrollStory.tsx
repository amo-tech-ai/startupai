
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Target, Presentation, ShieldCheck } from 'lucide-react';

const MotionDiv = motion.div as any;

const ScrollStory: React.FC = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const brainScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const brainRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const brainColor = useTransform(scrollYProgress, [0, 0.5, 1], ["#FF6A3D", "#6366F1", "#10B981"]);

  const storySteps = [
    { icon: <Zap />, title: "The Intake", desc: "We scrape your digital footprint with URL Context Tools.", pos: "left" },
    { icon: <Target />, title: "The Grounding", desc: "Gemini 3 Pro validates your claims against real-world search results.", pos: "right" },
    { icon: <Presentation />, title: "The Synthesis", desc: "A Sequoia-grade deck is architected using High Thinking Level reasoning.", pos: "left" },
    { icon: <ShieldCheck />, title: "The Result", desc: "Investor-ready assets, verified and defensible.", pos: "right" }
  ];

  return (
    <section ref={containerRef} className="py-40 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-40">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">From Vision to Verified</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Watch your idea transform as the StartupExamine agent performs deep forensics.</p>
        </div>

        <div className="relative min-h-[120vh]">
          {/* Sticky Brain */}
          <div className="sticky top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <MotionDiv 
              style={{ scale: brainScale, rotate: brainRotate, borderColor: brainColor }}
              className="w-48 h-48 rounded-[3rem] border-8 flex items-center justify-center shadow-2xl bg-white"
            >
              <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Zap size={40} fill="currentColor" />
              </div>
            </MotionDiv>
          </div>

          <div className="space-y-[40vh] relative z-10">
            {storySteps.map((step, idx) => (
              <div key={idx} className={`flex ${step.pos === 'left' ? 'justify-start' : 'justify-end'}`}>
                <MotionDiv
                  initial={{ opacity: 0, x: step.pos === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-20%" }}
                  className="max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
                >
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                </MotionDiv>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
