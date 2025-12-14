
import React from 'react';
import { Download, Copy } from 'lucide-react';
import { EventAsset } from '../../../types';
import { useToast } from '../../../context/ToastContext';

interface MarketingGalleryProps {
  assets: EventAsset[];
}

export const MarketingGallery: React.FC<MarketingGalleryProps> = ({ assets }) => {
  const { success } = useToast();

  const copyText = (text: string) => {
      navigator.clipboard.writeText(text);
      success("Copied to clipboard");
  };

  if (assets.length === 0) {
    return (
        <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            No assets generated yet. Start creating!
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                {asset.type === 'image' ? (
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                        <img src={asset.content} alt={asset.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a href={asset.content} download={`event-asset-${asset.id}.png`} className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-100">
                                <Download size={18} />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-slate-50 h-48 overflow-y-auto text-sm text-slate-700 leading-relaxed font-medium">
                        "{asset.content}"
                    </div>
                )}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="font-bold text-sm text-slate-900">{asset.title}</div>
                        <div className="text-xs text-slate-500 capitalize">{asset.type} • {new Date(asset.createdAt).toLocaleDateString()}</div>
                    </div>
                    {asset.type === 'copy' && (
                        <button onClick={() => copyText(asset.content)} className="text-slate-400 hover:text-indigo-600">
                            <Copy size={16} />
                        </button>
                    )}
                </div>
            </div>
        ))}
    </div>
  );
};
