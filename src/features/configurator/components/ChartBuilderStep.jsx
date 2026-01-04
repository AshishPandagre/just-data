import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Database, Plus, X, Palette, Trash2, Copy, Check } from 'lucide-react';

import { CHART_METADATA } from '../constants';
import { aggregateData, createInitialOption, injectData } from '../utils/chartUtils';
import FieldPanel from './FieldPanel';

import BarSettings from '../charts/settings/BarSettings';
import LineSettings from '../charts/settings/LineSettings';
import PieSettings from '../charts/settings/PieSettings';
import ScatterSettings from '../charts/settings/ScatterSettings';
import RadarSettings from '../charts/settings/RadarSettings';
import TableSettings from '../charts/settings/TableSettings';

const SETTINGS_COMPONENTS = {
    bar: BarSettings,
    line: LineSettings,
    pie: PieSettings,
    scatter: ScatterSettings,
    radar: RadarSettings,
    table: TableSettings
};

// --- Helper Components ---

const Pill = ({ text, type, onRemove }) => (
    <span className={`
    inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium shadow-sm border transition-all
    ${type === 'measure'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : type === 'dimension'
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'} 
  `}>
        {text}
        {onRemove && (
            <button onClick={onRemove} className="hover:text-red-600 ml-1 rounded-full p-0.5 hover:bg-black/5">
                <X size={12} />
            </button>
        )}
    </span>
);

const Shelf = ({ label, items, onRemoveItem, placeholder, icon }) => {
    return (
        <div className="flex items-center gap-3 min-h-[44px] border-b border-slate-200 px-3 bg-white">
            <div className="w-24 text-xs font-bold text-slate-400 uppercase tracking-wider text-right flex items-center justify-end gap-2 shrink-0">
                {icon && <span className="text-slate-300">{icon}</span>}
                {label}
            </div>
            <div className="flex-1 h-full flex flex-wrap items-center gap-2 py-1 pl-2">
                {items && items.length > 0 ? (
                    items.map((item, idx) => (
                        <Pill
                            key={`${item.name}-${idx}`}
                            text={item.name}
                            type={item.type}
                            onRemove={() => onRemoveItem(idx)}
                        />
                    ))
                ) : (
                    <div className="text-slate-300 italic text-sm select-none">{placeholder}</div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

const ChartBuilderStep = ({ activeChart, onUpdateChart, data = [], columnTypes = {} }) => {
    // 1. Field Configuration State
    const [fieldConfig, setFieldConfig] = useState(activeChart?.config || {
        type: 'bar',
        x: null,
        y: null,
        breakdown: null
    });

    // 2. Chart Option State
    const [chartOption, setChartOption] = useState(() => {
        if (activeChart?.config?.option) return activeChart.config.option;
        return createInitialOption(activeChart?.config?.type || 'bar');
    });

    const [jsonText, setJsonText] = useState(JSON.stringify(chartOption, null, 2));
    const [copySuccess, setCopySuccess] = useState(false);
    const [includeData, setIncludeData] = useState(false);
    const [prevChartId, setPrevChartId] = useState(activeChart?.id);

    // Sync state when switching charts
    if (activeChart?.id !== prevChartId) {
        setPrevChartId(activeChart?.id);
        const newFieldConfig = activeChart?.config || { type: 'bar', x: null, y: null };
        setFieldConfig(newFieldConfig);
        const newOption = activeChart?.config?.option || createInitialOption(newFieldConfig.type);
        setChartOption(newOption);
        setJsonText(JSON.stringify(newOption, null, 2));
    }

    const SettingsComponent = SETTINGS_COMPONENTS[fieldConfig.type];

    // Ref: Stable callback to prevent effect loops
    const onUpdateChartRef = useRef(onUpdateChart);
    useEffect(() => {
        onUpdateChartRef.current = onUpdateChart;
    }, [onUpdateChart]);

    // Effect: Inject Data
    useEffect(() => {
        if (!data || data.length === 0) return;
        const parsedData = aggregateData(data, fieldConfig);

        // eslint-disable-next-line
        setChartOption(prevOption => {
            const newOption = injectData(prevOption, parsedData, fieldConfig);
            // Optimization: Only update if option actually changed
            if (JSON.stringify(newOption) === JSON.stringify(prevOption)) {
                return prevOption;
            }
            return newOption;
        });
    }, [data, fieldConfig]);

    // Effect: Sync JSON Text and Parent
    useEffect(() => {
        const jsonString = JSON.stringify(chartOption, null, 2);
        // eslint-disable-next-line
        setJsonText(jsonString);
        // Use ref to avoid re-triggering when parent re-renders
        onUpdateChartRef.current({ config: { ...fieldConfig, option: chartOption } });
    }, [chartOption, fieldConfig]);

    const handleJsonChange = (e) => {
        const text = e.target.value;
        setJsonText(text);
        try {
            const parsed = JSON.parse(text);
            setChartOption(parsed);
        } catch { /* invalid */ }
    };

    const updateFieldConfig = (updates) => {
        const newConfig = { ...fieldConfig, ...updates };
        if (updates.type && updates.type !== fieldConfig.type) {
            const newOption = createInitialOption(updates.type);
            setChartOption(newOption);
        }
        setFieldConfig(newConfig);
    };

    const handleSettingChange = (path, value) => {
        const newOption = JSON.parse(JSON.stringify(chartOption));
        const keys = path.split('.');
        let current = newOption;

        // Handle array indexes in path like 'series.0.stack'
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            // Auto-create arrays or objects if missing
            if (current[key] === undefined) {
                // If next key is number, make array. Else object.
                const nextKey = keys[i + 1];
                const isNum = !isNaN(parseInt(nextKey));
                current[key] = isNum ? [] : {};
            }

            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
        setChartOption(newOption);
        setJsonText(JSON.stringify(newOption, null, 2));
        onUpdateChart({ config: { ...fieldConfig, option: newOption } });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleAddField = (target, field) => {
        if (target === 'x') {
            updateFieldConfig({ x: field });
        } else if (target === 'y') {
            const currentY = Array.isArray(fieldConfig.y) ? fieldConfig.y : (fieldConfig.y ? [fieldConfig.y] : []);
            if (!currentY.includes(field)) {
                updateFieldConfig({ y: [...currentY, field] });
            }
        }
    };

    // Prepare shelf items for UI
    const yItems = Array.isArray(fieldConfig.y)
        ? fieldConfig.y.map(name => ({ name, type: 'measure' }))
        : (fieldConfig.y ? [{ name: fieldConfig.y, type: 'measure' }] : []);

    // optionToRender is just chartOption
    const optionToRender = chartOption;


    return (
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex-1">
            {/* 1. Left Panel: Data Fields */}
            <FieldPanel columnTypes={columnTypes} onAddField={(target, field) => handleAddField(target, field)} />

            {/* 2. Middle Panel: Builder & Chart */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
                {/* Shelves */}
                <div className="bg-white border-b border-slate-200 shadow-sm z-10">
                    <div className="flex gap-4 px-3 py-2">
                        <div className="flex-1">
                            <Shelf
                                label="Columns"
                                items={fieldConfig.x ? [{ name: fieldConfig.x, type: 'dimension' }] : []}
                                placeholder="Drop Dimension"
                                onRemoveItem={() => updateFieldConfig({ x: null })}
                            />
                        </div>
                        <div className="flex-1">
                            <Shelf
                                label="Rows"
                                items={yItems}
                                placeholder="Drop Measure"
                                onRemoveItem={(idx) => {
                                    const newY = [...yItems];
                                    newY.splice(idx, 1);
                                    updateFieldConfig({ y: newY.map(i => i.name) });
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="h-12 border-b border-slate-200 flex items-center px-4 gap-4 bg-white sticky top-0 z-20 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marks</span>
                            <div className="flex bg-slate-100 rounded-md p-0.5 border border-slate-200">
                                {Object.entries(CHART_METADATA).map(([type, meta]) => {
                                    const Icon = meta.icon;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => updateFieldConfig({ type })}
                                            className={`p-1.5 rounded-sm transition-all ${fieldConfig.type === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                            title={meta.label}
                                        >
                                            <Icon size={16} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aggregation</span>
                            <select
                                value={fieldConfig.aggregation || 'sum'}
                                onChange={(e) => updateFieldConfig({ aggregation: e.target.value })}
                                className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-700 font-medium"
                            >
                                <option value="sum">Sum</option>
                                <option value="average">Average</option>
                                <option value="min">Min</option>
                                <option value="max">Max</option>
                                <option value="count">Count</option>
                            </select>
                        </div>

                        {columnTypes[fieldConfig.x] === 'date' && (
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Group By</span>
                                <select
                                    value={fieldConfig.timeGrouping || 'none'}
                                    onChange={(e) => updateFieldConfig({ timeGrouping: e.target.value })}
                                    className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-700 font-medium"
                                >
                                    <option value="none">None</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Split View: Chart & JSON Editor */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top: Chart Preview */}
                    <div className="flex-1 p-4 relative min-h-[50%] border-b border-slate-200">
                        {(!fieldConfig.x || !fieldConfig.y) ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                                <p>Add fields to Columns and Rows to visualize</p>
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                <ReactECharts
                                    option={optionToRender}
                                    style={{ height: '100%', width: '100%' }}
                                    opts={{ renderer: 'svg' }}
                                    notMerge={true}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bottom: JSON Editor Panel */}
                    <div className="h-[40%] flex flex-col bg-slate-900 border-t border-slate-800">
                        <div className="h-10 px-4 bg-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ECharts Option</span>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-0 focus:ring-offset-0"
                                        checked={includeData}
                                        onChange={(e) => setIncludeData(e.target.checked)}
                                    />
                                    Include Data
                                </label>
                                <button
                                    onClick={handleCopy}
                                    className="text-slate-300 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700 transition-colors text-xs font-medium"
                                >
                                    {copySuccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    {copySuccess ? "Copied!" : "Copy JSON"}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={jsonText}
                                onChange={handleJsonChange}
                                className="w-full h-full bg-slate-900 text-slate-300 font-mono text-xs p-4 focus:outline-none resize-none"
                                spellCheck="false"
                            />

                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Right Panel: Settings */}
            <div className="w-72 bg-white border-l border-slate-200 overflow-y-auto p-4 flex flex-col shrink-0">
                <div className="mb-6 space-y-4 border-b border-slate-100 pb-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                            Chart Name
                        </label>
                        <input
                            type="text"
                            value={activeChart?.title || ''}
                            onChange={(e) => onUpdateChart({ title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="e.g. Sales by Region"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={activeChart?.description || ''}
                            onChange={(e) => onUpdateChart({ description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none h-20"
                            placeholder="Optional description..."
                        />
                    </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Chart Settings
                </h3>
                {SettingsComponent ? (
                    <SettingsComponent
                        option={chartOption}
                        onChange={handleSettingChange}
                    />
                ) : (
                    <div className="text-sm text-slate-400 italic">No settings available.</div>
                )}
            </div>
        </div>
    );
};

export default ChartBuilderStep;
