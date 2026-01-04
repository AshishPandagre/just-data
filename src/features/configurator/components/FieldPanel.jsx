import React from 'react';
import { Database, Plus } from 'lucide-react';

const FieldPanel = ({ columnTypes, onAddField, showMeasures = true }) => {
    // Helpers to derive available fields
    const dimensions = Object.keys(columnTypes).filter(k => columnTypes[k] === 'dimension' || columnTypes[k] === 'date');
    const measures = Object.keys(columnTypes).filter(k => columnTypes[k] === 'measure');

    return (
        <div className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2 bg-slate-50">
                <Database className="w-4 h-4" /> Data
            </div>

            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
                <div className="mb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Dimensions</div>
                    {dimensions.map(d => (
                        <div
                            key={d}
                            onClick={() => onAddField('x', d)}
                            className="px-2 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer text-sm flex items-center gap-2 group transition-colors"
                        >
                            {columnTypes[d] === 'date' ? (
                                <span className="text-purple-500 opacity-70 text-xs font-mono">Cal</span>
                            ) : (
                                <span className="text-blue-500 opacity-70 text-xs font-mono">Abc</span>
                            )}
                            {d}
                            <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
                        </div>
                    ))}
                </div>

                {showMeasures && (
                    <>
                        <div className="my-2 border-t border-slate-200 mx-2"></div>

                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Measures</div>
                            {measures.map(m => (
                                <div
                                    key={m}
                                    onClick={() => onAddField('y', m)}
                                    className="px-2 py-1.5 hover:bg-emerald-50 text-slate-700 rounded cursor-pointer text-sm flex items-center gap-2 group transition-colors"
                                >
                                    <span className="text-emerald-500 opacity-70 text-xs font-mono">#</span> {m}
                                    <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FieldPanel;
