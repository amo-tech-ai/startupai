
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { DocumentDashboard } from './documents/DocumentDashboard';
import { DocumentEditor } from './documents/DocumentEditor';
import { useParams, useNavigate } from 'react-router-dom';

const Documents: React.FC = () => {
  const { docs, addDoc, deleteDoc } = useData();
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!activeDoc ? (
          <DocumentDashboard 
            key="dashboard" 
            docs={docs}
            onStartDoc={handleStartDoc} 
            onOpenDoc={handleOpenDoc}
            onDeleteDoc={handleDelete}
          />
        ) : (
            <DocumentEditor 
                key="editor" 
                doc={activeDoc} 
                onBack={handleBack} 
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
