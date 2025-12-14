
import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Sparkles, Loader2, Save, Trash2, PieChart, AlertCircle, Wand2 } from 'lucide-react';
import { EventData, EventBudgetItem } from '../../../types';
import { EventService } from '../../../services/supabase/events';
import { EventAI } from '../../../services/eventAI';
import { API_KEY } from '../../../lib/env';
import { useToast } from '../../../context/ToastContext';
import { generateUUID } from '../../../lib/utils';

interface EventBudgetProps {
  event: EventData;
}

export const EventBudget: React.FC<EventBudgetProps> = ({ event }) => {
  const { toast, success, error } = useToast();
  const [items, setItems] = useState<EventBudgetItem[]>(event.budget_items || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate totals
  const totalBudget = event.budget_total || 10000;
  const totalEstimated = items.reduce((acc, i) => acc + i.estimated, 0);
  const totalActual = items.reduce((acc, i) => acc + i.actual, 0);
  const remaining = totalBudget - totalActual;
  const isOverBudget = totalActual > totalBudget;

  const handleGenerate = async () => {
      if (!API_KEY) return;
      setIsGenerating(true);
      toast("AI is estimating line items...", "info");
      
      try {
          const suggestions = await EventAI.suggestBudgetBreakdown(
              API_KEY, 
              totalBudget, 
              event.type, 
              event.city
          );
          
          if (suggestions) {
              setItems(suggestions);
              success("Budget breakdown generated!");
              saveBudget(suggestions);
          }
      } catch (e) {
          error("Failed to generate budget.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleOptimize = async () => {
      if (!API_KEY) return;
      setIsOptimizing(true);
      toast("AI is analyzing spend patterns to find savings...", "info");

      try {
          const optimized = await EventAI.optimizeBudget(API_KEY, items, totalBudget);
          if (optimized) {
              setItems(optimized);
              success("Budget optimized! Review changes.");
              saveBudget(optimized);
          }
      } catch (e) {
          error("Optimization failed.");
      } finally {
          setIsOptimizing(false);
      }
  };

  const saveBudget = async (newItems: EventBudgetItem[]) => {
      if (event.id) {
          setIsSaving(true);
          await EventService.updateBudget(event.id, newItems);
          setIsSaving(false);
      }
  };

  const addItem = () => {
      const newItem: EventBudgetItem = {
          id: generateUUID(),
          category: 'Other',
          item: 'New Item',
          estimated: 0,
          actual: 0,
          status: 'Planned'
      };
      const updated = [...items, newItem];
      setItems(updated);
      saveBudget(updated);
  };

  const updateItem = (id: string, field: keyof EventBudgetItem, value: any) => {
      const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
      setItems(updated);
  };

  const deleteItem = (id: string) => {
      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      saveBudget(updated);
  };

  const handleBlur = () => {
      saveBudget(items);
  };

  return (
    <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total Budget</div>
                <div className="text-3xl font-bold text-slate-900">${totalBudget.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Actual Spend</div>
                <div className={`text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
                    ${totalActual.toLocaleString()}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Remaining</div>
                <div className={`text-3xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${remaining.toLocaleString()}
                </div>
            </div>
        </div>

        {/* Progress Bar & Optimization Alert */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Budget Utilization</span>
                <span className={isOverBudget ? 'text-red-600 font-bold' : ''}>{Math.round((totalActual / totalBudget) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-6">
                <div 
                    className={`h-full rounded-full transition-all ${
                        isOverBudget ? 'bg-red-500' : 
                        totalActual > totalBudget * 0.8 ? 'bg-amber-500' : 
                        'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((totalActual / totalBudget) * 100, 100)}%` }}
                ></div>
            </div>

            {isOverBudget && (
                <div className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle size={20} />
                        <div>
                            <div className="font-bold text-sm">Budget Overrun Detected</div>
                            <div className="text-xs">You are ${Math.abs(remaining).toLocaleString()} over budget.</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        Fix with AI
                    </button>
                </div>
            )}
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <PieChart size={20} className="text-indigo-600" /> Line Items
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || items.length > 0}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        AI Suggest
                    </button>
                    <button 
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-lg">Category</th>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Estimated</th>
                            <th className="px-6 py-4 text-right">Actual</th>
                            <th className="px-6 py-4 rounded-tr-lg"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">
                                    No budget items yet. Use AI Suggest to start.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-3">
                                        <select 
                                            value={item.category}
                                            onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                            onBlur={handleBlur}
                                            className="bg-transparent border-none focus:ring-0 font-medium text-slate-700 p-0 cursor-pointer"
                                        >
                                            {['Venue', 'Food', 'Marketing', 'Speakers', 'Ops', 'Other'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input 
                                            value={item.item}
                                            onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                            onBlur={handleBlur}
                                            className="bg-transparent border-none focus:ring-0 w-full"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <select 
                                            value={item.status}
                                            onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                                            onBlur={handleBlur}
                                            className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer ${
                                                item.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                item.status === 'Planned' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}
                                        >
                                            <option value="Planned">Planned</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-slate-400">$</span>
                                            <input 
                                                type="number"
                                                value={item.estimated}
                                                onChange={(e) => updateItem(item.id, 'estimated', Number(e.target.value))}
                                                onBlur={handleBlur}
                                                className="bg-transparent border-none focus:ring-0 w-20 text-right text-slate-500"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-slate-400">$</span>
                                            <input 
                                                type="number"
                                                value={item.actual}
                                                onChange={(e) => updateItem(item.id, 'actual', Number(e.target.value))}
                                                onBlur={handleBlur}
                                                className={`bg-transparent border-none focus:ring-0 w-20 text-right font-bold ${
                                                    item.actual > item.estimated ? 'text-red-600' : 'text-slate-900'
                                                }`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            onClick={() => deleteItem(item.id)}
                                            className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};