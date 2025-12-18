
import React from 'react';
// Import useParams to handle dynamic routing from URL parameters
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArchitectureView } from './ArchitectureView';
import { WorkflowView } from './WorkflowView';
import { AIFlowchartView } from './AIFlowchartView';
import { JourneyView } from './JourneyView';

interface BlueprintPageProps {
  // Made view optional to allow it to be picked up from URL params automatically
  view?: 'architecture' | 'workflow' | 'ai-flowchart' | 'journey';
}

const BlueprintPage: React.FC<BlueprintPageProps> = ({ view: propView }) => {
  // Extract view from URL params if it exists
  const { view: paramView } = useParams();
  // Resolve view: priority to explicit prop, then URL param, then default to architecture
  const view = propView || (paramView as any) || 'architecture';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {view === 'architecture' && <ArchitectureView />}
          {view === 'workflow' && <WorkflowView />}
          {view === 'ai-flowchart' && <AIFlowchartView />}
          {view === 'journey' && <JourneyView />}
        </motion.div>
      </div>

      {/* Persistent How It All Works Together Section */}
      <section className="container mx-auto px-6 mt-20 pt-20 border-t border-slate-200 max-w-4xl">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">How It All Works Together</h2>
          <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">Routing Prevents Dead Ends</h4>
                  <p className="text-slate-600 leading-relaxed">
                      Every route is part of a unidirectional flow from Discovery to Operation. If a user lands on /pitch-decks without context, the system detects missing data and routes them back to the /onboarding agent. This ensures no founder is left with a "blank page."
                  </p>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">AI Reduces Friction</h4>
                  <p className="text-slate-600 leading-relaxed">
                      By utilizing Gemini 3 Pro with URL Context, we eliminate high-effort tasks. Instead of asking a founder to write their mission, the AI scrapes their site and drafts it for approval. Friction is replaced by "Confirm" buttons.
                  </p>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">Automation vs. Manual Work</h4>
                  <p className="text-slate-600 leading-relaxed">
                      Transitions between screens are transactional. Clicks in the "AI Brief Wizard" don't just update local state; they trigger Edge Functions that populate the CRM and generate Document templates in the background before the user even lands on the dashboard.
                  </p>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">Inference-Led Conversion</h4>
                  <p className="text-slate-600 leading-relaxed">
                      The "Proposal Preview" serves as a high-value "Aha!" moment before the paywall. By demonstrating the AI's research capabilities (via Search Grounding), the user perceives immediate value, making the transaction at /pricing a logical next step in their journey.
                  </p>
              </div>
          </div>
      </section>
    </div>
  );
};

export default BlueprintPage;
