import React, { useState } from 'react';
import { Activity, Eye, Edit3, FileJson, Check, Trash2 } from 'lucide-react';

const DashboardListItem = ({ dashboard, onView, onEdit, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyJson = () => {
        const json = JSON.stringify(dashboard, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden relative group-hover:bg-slate-50 transition-colors">
                {dashboard.thumbnail ? (
                    <img
                        src={dashboard.thumbnail}
                        alt={dashboard.metadata?.title}
                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <Activity className="text-slate-300" size={48} />
                )}
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{dashboard.metadata.title || 'Untitled Dashboard'}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">{dashboard.metadata.description || 'No description provided.'}</p>

                <div className="flex gap-2">
                    <button
                        onClick={() => onView(dashboard)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                        <Eye size={14} /> View
                    </button>
                    <button
                        onClick={() => onEdit(dashboard)}
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                        <Edit3 size={14} /> Edit
                    </button>
                    <button
                        onClick={handleCopyJson}
                        className="w-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                        title="Copy JSON"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <FileJson size={14} />}
                    </button>
                    <button
                        onClick={() => onDelete(dashboard)}
                        className="w-10 flex items-center justify-center border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-md transition-colors cursor-pointer"
                        title="Delete Dashboard"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardListItem;