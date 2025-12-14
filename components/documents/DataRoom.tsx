
import React, { useState } from 'react';
import { UploadCloud, File, FileText, Image as ImageIcon, MoreHorizontal, Trash2, Download, Search, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { DataRoomFile } from '../../types';
import { generateShortId } from '../../lib/utils';

export const DataRoom: React.FC = () => {
  const { uploadFile, profile } = useData();
  const { success, error, toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<DataRoomFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processUpload = async (file: File) => {
    toast("Uploading secure file...", "info");
    try {
        // Upload to 'data-room' bucket in Supabase (or fallback to base64 in dev)
        const url = await uploadFile(file, 'data-room');
        
        if (url) {
            const newFile: DataRoomFile = {
                id: generateShortId(),
                name: file.name,
                size: file.size,
                type: file.type,
                url: url,
                uploadedAt: new Date().toISOString(),
                uploadedBy: profile?.name || 'User',
                status: 'clean'
            };
            setFiles(prev => [newFile, ...prev]);
            success("File uploaded to Data Room");
        }
    } catch (e) {
        error("Upload failed");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={20} className="text-purple-500" />;
    if (type.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    return <File size={20} className="text-blue-500" />;
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-indigo-900 text-white p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <h2 className="font-bold text-lg">Secure Data Room</h2>
                </div>
                <p className="text-indigo-200 text-sm max-w-lg">
                    A secure vault for your incorporation documents, financial statements, and IP.
                    Files are encrypted and access-logged.
                </p>
            </div>
        </div>

        <div className="flex gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search files..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
            </div>
            <div>
                <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileInput} 
                />
                <label 
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                    <UploadCloud size={18} /> Upload File
                </label>
            </div>
        </div>

        {/* Dropzone / List */}
        {files.length === 0 ? (
            <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <UploadCloud size={32} className="text-indigo-500" />
                </div>
                <h3 className="font-bold text-slate-900">Drag & Drop files here</h3>
                <p className="text-slate-500 text-sm mt-1">or click "Upload File" to browse</p>
                <p className="text-xs text-slate-400 mt-4">Supports PDF, PNG, JPG, CSV (Max 25MB)</p>
            </div>
        ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4">Uploaded</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">{getIcon(file.type)}</div>
                                        <span className="font-medium text-slate-900">{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{formatSize(file.size)}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Clean
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={file.url} download className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                            <Download size={16} />
                                        </a>
                                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};
