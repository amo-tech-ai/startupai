
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { DocumentDashboard } from './documents/DocumentDashboard';
import { DocumentEditor } from './documents/DocumentEditor';

type ViewState = 'dashboard' | 'editor';

const Documents: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const { docs, addDoc, deleteDoc } = useData();
  const { toast } = useToast();

  const handleStartDoc = async (type: string) => {
    const newTitle = `Untitled ${type}`;
    const id = await addDoc({
        title: newTitle,
        type: type as any,
        status: 'Draft',
        content: { sections: [] }
    });
    
    if (id) {
        setActiveDocId(id);
        setView('editor');
    }
  };

  const handleOpenDoc = (id: string) => {
      setActiveDocId(id);
      setView('editor');
  }

  // Find the active document object
  const activeDoc = docs.find(d => d.id === activeDocId);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <DocumentDashboard 
            key="dashboard" 
            docs={docs}
            onStartDoc={handleStartDoc} 
            onOpenDoc={handleOpenDoc}
            onDeleteDoc={deleteDoc}
          />
        ) : (
          activeDoc ? (
            <DocumentEditor 
                key="editor" 
                doc={activeDoc} 
                onBack={() => setView('dashboard')} 
            />
          ) : (
            <div className="flex items-center justify-center h-full">Document not found.</div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
