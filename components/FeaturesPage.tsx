import React from 'react';
import { PenTool, BrainCircuit, BarChart2, Workflow } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Features</h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Explore the powerful tools that make StartupAI the operating system for modern founders.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Simple Placeholders for specific feature deep dives */}
            {[
                { icon: <PenTool className="text-indigo-600"/>, title: "Pitch Deck Generator" },
                { icon: <BrainCircuit className="text-purple-600"/>, title: "AI Intelligence" },
                { icon: <BarChart2 className="text-teal-600"/>, title: "Financial Modeling" },
                { icon: <Workflow className="text-rose-600"/>, title: "CRM & Automation" },
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 mt-2">Detailed feature breakdown coming soon.</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;