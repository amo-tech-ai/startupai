
import { analyzeStrategy } from './ai/event/strategy';
import { checkLogistics } from './ai/event/logistics';
import { generateActionPlan } from './ai/event/planning';
import { generateMarketingAssets } from './ai/event/marketing';
import { suggestBudgetBreakdown, optimizeBudget, generateROI } from './ai/event/finance';

/**
 * EventAI Service Facade
 * Aggregates specialized AI modules for Strategy, Logistics, Planning, Marketing, and Finance.
 */
export const EventAI = {
  analyzeStrategy,
  checkLogistics,
  generateActionPlan,
  generateMarketingAssets,
  suggestBudgetBreakdown,
  optimizeBudget,
  generateROI
};
