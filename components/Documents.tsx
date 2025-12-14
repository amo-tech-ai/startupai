
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { DocumentDashboard } from './documents/DocumentDashboard';
import { DocumentEditor } from './documents/DocumentEditor';
import { DataRoom } from './documents/DataRoom';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

const Documents: React.FC = () => {
  const { docs, addDoc, deleteDoc } = useData();
  const { docId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'generated' | 'dataroom'>('generated');

  // Derive active doc from URL param
  const activeDoc = docId ? docs.find(d => d.id === docId) : null;

  const handleStartDoc = async (type: string) => {
    const newTitle = `Untitled ${type}`;
    const id = await addDoc({
        title: newTitle,
        type: type as any,
        status: 'Draft',
        content: { sections: [] }
    });
    
    if (id) {
        navigate(`/documents/${id}`);
    }
  };

  const handleOpenDoc = (id: string) => {
      navigate(`/documents/${id}`);
  }

  const handleBack = () => {
      navigate('/documents');
  }

  const handleDelete = (id: string) => {
      deleteDoc(id);
      if (activeDoc?.id === id) {
          navigate('/documents');
      }
  }

  if (docId && !activeDoc && docs.length > 0) {
      navigate('/documents', { replace: true });
      return null;
  }

  // If viewing a specific doc, show editor immediately
  if (activeDoc) {
      return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            <DocumentEditor 
                key="editor" 
                doc={activeDoc} 
                onBack={handleBack} 
            />
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Header Tabs */}
      <div className="px-6 md:px-12 pt-8 pb-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Documents & Data Room</h1>
          <div className="flex gap-6 border-b border-slate-200">
              <button 
                  onClick={() => setActiveTab('generated')}
                  className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'generated' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                  <FileText size={18} /> Generated Docs
              </button>
              <button 
                  onClick={() => setActiveTab('dataroom')}
                  className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'dataroom' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                  <Shield size={18} /> Data Room
              </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'generated' ? (
                <DocumentDashboard 
                    key="dashboard" 
                    docs={docs}
                    onStartDoc={handleStartDoc} 
                    onOpenDoc={handleOpenDoc}
                    onDeleteDoc={handleDelete}
                />
            ) : (
                <DataRoom key="dataroom" />
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default Documents;
