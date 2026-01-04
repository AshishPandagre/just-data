import React from 'react';
import { Database, LayoutTemplate, Sheet, Filter, LayoutDashboard, Plus, X } from 'lucide-react';

const ConfiguratorTabs = ({ activeTab, onTabChange, charts = [], onAddChart, onDeleteChart }) => {
    return (
        <div className="h-9 bg-slate-200 border-t border-slate-300 flex items-end px-2 gap-1 shrink-0 overflow-x-auto overflow-y-hidden select-none sticky bottom-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent">
            <button
                onClick={() => onTabChange('metadata')}
                className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all shrink-0 ${activeTab === 'metadata' ? 'bg-white border-slate-300 text-blue-600 border-b-white translate-y-px' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}
            >
                <LayoutTemplate size={14} /> Metadata
            </button>
            <button
                onClick={() => onTabChange('data')}
                className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all shrink-0 ${activeTab === 'data' ? 'bg-white border-slate-300 text-blue-600 border-b-white translate-y-px' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}
            >
                <Database size={14} /> Data Source
            </button>
            {charts.map((chart) => (
                <div
                    key={chart.id}
                    className={`group relative flex items-center rounded-t-sm border-t border-l border-r transition-all shrink-0 ${activeTab === `chart-${chart.id}` ? 'bg-white border-slate-300 text-blue-600 border-b-white translate-y-px z-10' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}
                >
                    <button
                        onClick={() => onTabChange(`chart-${chart.id}`)}
                        className="px-4 py-1.5 text-xs font-semibold flex items-center gap-2"
                    >
                        <Sheet size={14} /> {chart.title}
                    </button>
                    {charts.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChart(chart.id);
                            }}
                            className="pr-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete Chart"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={onAddChart}
                className="w-8 py-1.5 text-xs font-semibold flex items-center justify-center rounded-t-sm border-t border-l border-r transition-all bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 shrink-0"
                title="Add Chart"
            >
                <Plus size={14} />
            </button>
            <button
                onClick={() => onTabChange('filters')}
                className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all shrink-0 ${activeTab === 'filters' ? 'bg-white border-slate-300 text-blue-600 border-b-white translate-y-px' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}
            >
                <Filter size={14} /> Filters
            </button>
            <button
                onClick={() => onTabChange('layout')}
                className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all shrink-0 ${activeTab === 'layout' ? 'bg-white border-slate-300 text-blue-600 border-b-white translate-y-px' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}
            >
                <LayoutDashboard size={14} /> Layout
            </button>
        </div>
    );
};

export default ConfiguratorTabs;
