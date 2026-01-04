import React from 'react';
import FieldPanel from './FieldPanel';
import { Filter, Trash2, Calendar, Search, ListFilter, TextCursorInput } from 'lucide-react';
import { SelectInput } from './ConfigInputs';

const FILTER_TYPES = [
    { label: 'Dropdown Menu', value: 'dropdown' },
    { label: 'Search Bar', value: 'search' },
    { label: 'Date Picker', value: 'date' },
    { label: 'Date Range Picker', value: 'dateRange' },
    { label: 'Year Selector', value: 'year' },
    { label: 'Month Selector', value: 'month' }
];

const FiltersStep = ({ filters, setFilters, columnTypes }) => {

    const handleAddFilter = (target, field) => {
        // Check if filter already exists for this field
        if (filters.some(f => f.field === field)) {
            return;
        }

        const newFilter = {
            id: Date.now().toString(),
            field: field,
            type: 'dropdown', // Default type
            label: field
        };

        setFilters([...filters, newFilter]);
    };

    const handleRemoveFilter = (id) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    const handleUpdateFilter = (id, updates) => {
        setFilters(filters.map(f =>
            f.id === id ? { ...f, ...updates } : f
        ));
    };

    return (
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex-1">
            {/* Left: Data Fields */}
            <FieldPanel columnTypes={columnTypes} onAddField={handleAddFilter} showMeasures={false} />

            {/* Right: Filter Configuration */}
            <div className="flex-1 bg-slate-50/30 flex flex-col">
                <div className="h-12 border-b border-slate-200 flex items-center px-4 bg-white">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Filters</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filters.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Filter size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">No filters added</p>
                            <p className="text-xs mt-1">Select a dimension from the left to create a filter</p>
                        </div>
                    ) : (
                        filters.map(filter => (
                            <div key={filter.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm group">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    {/* Field Badge */}
                                    <div className="bg-blue-50 text-blue-600 text-xs font-mono px-2 py-1.5 rounded border border-blue-100 truncate text-center" title={filter.field}>
                                        {filter.field}
                                    </div>

                                    {/* Type Selector */}
                                    <SelectInput
                                        value={filter.type}
                                        onChange={(val) => handleUpdateFilter(filter.id, { type: val })}
                                        options={FILTER_TYPES}
                                    />

                                    {/* Label Input */}
                                    <input
                                        type="text"
                                        value={filter.label}
                                        onChange={(e) => handleUpdateFilter(filter.id, { label: e.target.value })}
                                        className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                                        placeholder="Display Label"
                                    />

                                    {/* Delete Action */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleRemoveFilter(filter.id)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors"
                                            title="Remove Filter"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FiltersStep;
