import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Search, Calendar, ChevronDown, Filter } from 'lucide-react';
import { aggregateData, injectData } from '../utils/chartUtils';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useRef, useEffect } from 'react';

// Custom hook to measure width (replacing WidthProvider)
const useWidth = () => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(1200);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return { containerRef, width };
};

const StyledInputContainer = ({ label, icon: Icon, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                    <Icon size={16} />
                </div>
            )}
            {children}
            {/* Helper for potential focus ring animation could go here */}
        </div>
    </div>
);

const FilterRenderer = ({ filter, data = [], value, onChange }) => {
    const { type, label, field } = filter;

    // Get unique values for dropdown
    const options = useMemo(() => {
        if (type === 'dropdown' && data.length > 0) {
            const unique = [...new Set(data.map(row => row[field]))].filter(Boolean).sort();
            return [
                { label: 'All', value: 'all' },
                ...unique.map(val => ({ label: String(val), value: String(val) }))
            ];
        }
        return [{ label: 'All', value: 'all' }];
    }, [data, field, type]);

    const inputBaseClass = "w-full h-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400";
    const handleChange = (val) => onChange(filter.id, val);

    switch (type) {
        case 'search':
            return (
                <div className="min-w-[240px]">
                    <StyledInputContainer label={label} icon={Search}>
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder="Search..."
                            className={`${inputBaseClass} pl-10 pr-3`}
                        />
                    </StyledInputContainer>
                </div>
            );
        case 'date':
            return (
                <div className="min-w-[160px]">
                    <StyledInputContainer label={label}>
                        <input
                            type="date"
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            className={`${inputBaseClass} px-3`}
                        />
                    </StyledInputContainer>
                </div>
            );
        case 'dateRange': {
            const [start, end] = Array.isArray(value) ? value : ['', ''];
            const handleRangeChange = (idx, val) => {
                const newRange = Array.isArray(value) ? [...value] : ['', ''];
                newRange[idx] = val;
                handleChange(newRange);
            };

            return (
                <div className="min-w-[300px]">
                    <StyledInputContainer label={label}>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={start}
                                onChange={(e) => handleRangeChange(0, e.target.value)}
                                className={`${inputBaseClass} px-3`}
                            />
                            <span className="text-slate-300 font-medium">–</span>
                            <input
                                type="date"
                                value={end}
                                onChange={(e) => handleRangeChange(1, e.target.value)}
                                className={`${inputBaseClass} px-3`}
                            />
                        </div>
                    </StyledInputContainer>
                </div>
            );
        }
        case 'year':
            return (
                <div className="min-w-[140px]">
                    <StyledInputContainer label={label}>
                        <input
                            type="number"
                            min="2000"
                            max="2099"
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            className={`${inputBaseClass} px-3`}
                        />
                    </StyledInputContainer>
                </div>
            );
        case 'month':
            return (
                <div className="min-w-[180px]">
                    <StyledInputContainer label={label}>
                        <input
                            type="month"
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            className={`${inputBaseClass} px-3`}
                        />
                    </StyledInputContainer>
                </div>
            );
        case 'dropdown':
        default:
            return (
                <div className="min-w-[200px]">
                    <StyledInputContainer label={label}>
                        <div className="relative">
                            <select
                                value={value || 'all'}
                                onChange={(e) => handleChange(e.target.value)}
                                className={`${inputBaseClass} appearance-none px-3 pr-8 cursor-pointer`}
                            >
                                <option value="all">All</option>
                                {options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </StyledInputContainer>
                </div>
            );
    }
};

const LayoutStep = ({ filters = [], charts = [], data = [], onLayoutChange, readOnly = false }) => {
    // 1. State for filter values: { [filterId]: value }
    const [filterValues, setFilterValues] = useState({});

    // 2. Filter data logic
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (Object.keys(filterValues).length === 0) return data;

        return data.filter(row => {
            return filters.every(filter => {
                const val = filterValues[filter.id];
                if (val === undefined || val === '' || val === 'all') return true;

                const rowVal = row[filter.field];
                const strRowVal = String(rowVal).toLowerCase();

                switch (filter.type) {
                    case 'search':
                        return strRowVal.includes(String(val).toLowerCase());
                    case 'dropdown':
                        return String(rowVal) === String(val);
                    case 'date':
                        return String(rowVal).startsWith(val);
                    case 'dateRange': {
                        const [start, end] = Array.isArray(val) ? val : ['', ''];
                        if (!start && !end) return true;
                        const rowDate = new Date(rowVal);
                        if (start && new Date(start) > rowDate) return false;
                        if (end && new Date(end) < rowDate) return false;
                        return true;
                    }
                    case 'year':
                        return new Date(rowVal).getFullYear() === Number(val);
                    case 'month':
                        return String(rowVal).startsWith(val);
                    default:
                        return true;
                }
            });
        });
    }, [data, filterValues, filters]);

    const handleFilterChange = (id, value) => {
        setFilterValues(prev => ({ ...prev, [id]: value }));
    };

    // Calculate layouts
    const layouts = useMemo(() => {
        return {
            lg: charts.map((chart, index) => {
                // If chart has saved layout, use it. Otherwise default.
                const saved = chart.layout || {};
                return {
                    i: chart.id,
                    x: saved.x !== undefined ? saved.x : (index % 2) * 6,
                    y: saved.y !== undefined ? saved.y : Math.floor(index / 2) * 4,
                    w: saved.w !== undefined ? saved.w : 6,
                    h: saved.h !== undefined ? saved.h : 4,
                    // If readOnly, lock all items
                    static: readOnly
                };
            })
        };
    }, [charts, readOnly]);

    const handleLayoutChangeCallback = (currentLayout) => {
        if (onLayoutChange && !readOnly) {
            onLayoutChange(currentLayout);
        }
    };

    const { containerRef, width } = useWidth();

    return (
        <div id="dashboard-layout-capture" className="flex flex-col h-full bg-slate-50/50">

            {/* Filters Bar */}
            {filters.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 py-5 shadow-sm shrink-0">
                    <div className="flex flex-wrap gap-6 items-end">
                        {filters.map(filter => (
                            <FilterRenderer
                                key={filter.id}
                                filter={filter}
                                data={data}
                                value={filterValues[filter.id]}
                                onChange={handleFilterChange}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Canvas Area with Draggable Grid */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative"
            >
                {charts.length === 0 ? (
                    <div className="h-96 flex items-center justify-center text-slate-400 bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-200">
                        No charts added yet.
                    </div>
                ) : (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={80}
                        width={width} // Pass the measured width manually
                        onLayoutChange={handleLayoutChangeCallback}
                        draggableHandle={!readOnly ? ".drag-handle" : undefined}
                        isDraggable={!readOnly}
                        isResizable={!readOnly}
                        margin={[24, 24]}
                    >
                        {charts.map(chart => {
                            if (!chart.config) return <div key={chart.id} />;

                            const chartData = aggregateData(filteredData, chart.config);
                            const baseOption = chart.config.option || {};
                            const option = chartData ? injectData(baseOption, chartData, chart.config) : baseOption;
                            const isValidOption = option && option.series && option.series.length > 0;

                            return (
                                <div key={chart.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm ${!readOnly ? 'hover:shadow-md transition-shadow duration-200 group' : ''} overflow-hidden flex flex-col`}>
                                    <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/30 ${!readOnly ? 'drag-handle cursor-move active:cursor-grabbing' : ''}`}>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-base tracking-tight leading-tight select-none">
                                                {chart.title || 'Untitled Chart'}
                                            </h3>
                                            {chart.description && (
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed select-none">
                                                    {chart.description}
                                                </p>
                                            )}
                                        </div>
                                        {!isValidOption && !readOnly && (
                                            <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border border-red-100 ml-2 shrink-0">
                                                Incomplete
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-h-0 relative p-4" onMouseDown={(e) => !readOnly && e.stopPropagation()}>
                                        {isValidOption ? (
                                            <ReactECharts
                                                option={option}
                                                style={{ height: '100%', width: '100%' }}
                                                opts={{ renderer: 'canvas' }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-sm p-4 text-center bg-slate-50/50">
                                                {!readOnly ? (
                                                    <>
                                                        <div className="bg-slate-100 p-3 rounded-full mb-3">
                                                            <Filter size={24} className="text-slate-300" />
                                                        </div>
                                                        <span className="font-medium">Configuration Required</span>
                                                        <span className="text-xs text-slate-400 mt-1 shadow-none">Go to chart settings to configure data.</span>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400 italic">No Data Available</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </ResponsiveGridLayout>
                )}
            </div>
        </div>
    );
};

export default LayoutStep;
