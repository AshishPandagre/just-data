import React, { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
    Layout,
    BarChart2 as BarChartIcon,
    LineChart as LineChartIcon,
    Database,
    Settings,
    Plus,
    Trash2,
    Grid,
    X,
    Activity,
    Maximize2,
    Minimize2,
    Sliders,
    Check,
    FileCode,
    Copy,
    Eye,
    Edit3,
    Filter,
    Move,
    ArrowLeft,
    ArrowRight,
    Save,
    Search,
    Calendar,
    Clock,
    ListFilter,
    Info,
    Type,
    LayoutDashboard,
    MoreVertical,
    ChevronLeft,
    Palette,
    Columns,
    FileJson,
    PieChart as PieChartIcon,
    Table as TableIcon,
    Hash,
    Type as TypeIcon,
    Hexagon
} from 'lucide-react';

// --- 1. CONSTANTS & CONFIGURATION ---

const CHART_TYPES = {
    table: {
        label: 'Data Table',
        icon: TableIcon,
        echartsType: 'table',
        sections: [
            {
                title: 'Pagination & Data',
                fields: [
                    { key: 'enablePagination', label: 'Enable Pagination', type: 'boolean', default: true },
                    { key: 'pageSize', label: 'Rows per Page', type: 'number', min: 5, max: 100, default: 10 },
                ]
            },
            {
                title: 'Search & Sort',
                fields: [
                    { key: 'enableSearch', label: 'Show Search Bar', type: 'boolean', default: true },
                    { key: 'searchFields', label: 'Searchable Fields (comma sep)', type: 'text', default: '' },
                    { key: 'enableSort', label: 'Allow Sorting', type: 'boolean', default: true },
                ]
            },
            {
                title: 'Styling',
                fields: [
                    { key: 'striped', label: 'Striped Rows', type: 'boolean', default: true },
                    { key: 'compact', label: 'Compact Layout', type: 'boolean', default: false },
                    { key: 'bordered', label: 'Bordered', type: 'boolean', default: true },
                ]
            }
        ]
    },
    bar: {
        label: 'Bar Chart',
        icon: BarChartIcon,
        echartsType: 'bar',
        sections: [
            {
                title: 'Series Layout',
                fields: [
                    { key: 'stack', label: 'Stack Series', type: 'boolean', default: false },
                    { key: 'barCategoryGap', label: 'Gap Between Groups (%)', type: 'range', min: 0, max: 80, step: 5, default: 30 },
                    { key: 'barWidth', label: 'Bar Width (%)', type: 'number', min: 10, max: 100, default: 60 },
                ]
            },
            {
                title: 'Appearance',
                fields: [
                    { key: 'color', label: 'Primary Color', type: 'color', default: '#3b82f6' },
                    { key: 'opacity', label: 'Opacity', type: 'range', min: 0.1, max: 1, step: 0.1, default: 0.9 },
                    { key: 'barRadius', label: 'Rounded Corners', type: 'boolean', default: true },
                ]
            },
            {
                title: 'Layout',
                fields: [
                    { key: 'showGrid', label: 'Show Grid', type: 'boolean', default: true },
                    { key: 'showLegend', label: 'Show Legend', type: 'boolean', default: false },
                    { key: 'showTooltip', label: 'Show Tooltip', type: 'boolean', default: true },
                ]
            },
            {
                title: 'Axes',
                fields: [
                    { key: 'xAxisLabel', label: 'X Axis Label', type: 'text', default: '' },
                    { key: 'yAxisLabel', label: 'Y Axis Label', type: 'text', default: '' },
                    { key: 'rotateXLabel', label: 'Rotate Labels', type: 'boolean', default: false },
                ]
            }
        ]
    },
    line: {
        label: 'Line Chart',
        icon: LineChartIcon,
        echartsType: 'line',
        sections: [
            {
                title: 'Appearance',
                fields: [
                    { key: 'color', label: 'Line Color', type: 'color', default: '#3b82f6' },
                    { key: 'lineWidth', label: 'Line Thickness', type: 'range', min: 1, max: 8, step: 1, default: 3 },
                    { key: 'smooth', label: 'Smooth Curve', type: 'boolean', default: true },
                    { key: 'showSymbol', label: 'Show Points', type: 'boolean', default: true },
                    { key: 'symbolSize', label: 'Point Size', type: 'number', min: 2, max: 15, default: 6 },
                ]
            },
            {
                title: 'Layout',
                fields: [
                    { key: 'showGrid', label: 'Show Grid', type: 'boolean', default: true },
                    { key: 'showLegend', label: 'Show Legend', type: 'boolean', default: false },
                    { key: 'areaStyle', label: 'Fill Area', type: 'boolean', default: false },
                ]
            },
            {
                title: 'Axes',
                fields: [
                    { key: 'xAxisLabel', label: 'X Axis Label', type: 'text', default: '' },
                    { key: 'yAxisLabel', label: 'Y Axis Label', type: 'text', default: '' },
                ]
            }
        ]
    },
    scatter: {
        label: 'Scatter Plot',
        icon: Grid,
        echartsType: 'scatter',
        sections: [
            {
                title: 'Appearance',
                fields: [
                    { key: 'color', label: 'Point Color', type: 'color', default: '#3b82f6' },
                    { key: 'symbolSize', label: 'Point Size', type: 'range', min: 2, max: 30, step: 1, default: 10 },
                    { key: 'opacity', label: 'Opacity', type: 'range', min: 0.1, max: 1, step: 0.1, default: 0.7 },
                ]
            },
            {
                title: 'Layout',
                fields: [
                    { key: 'showGrid', label: 'Show Grid', type: 'boolean', default: true },
                    { key: 'showLegend', label: 'Show Legend', type: 'boolean', default: false },
                ]
            },
            {
                title: 'Axes',
                fields: [
                    { key: 'xAxisLabel', label: 'X Axis Label', type: 'text', default: '' },
                    { key: 'yAxisLabel', label: 'Y Axis Label', type: 'text', default: '' },
                ]
            }
        ]
    },
    pie: {
        label: 'Pie Chart',
        icon: PieChartIcon,
        echartsType: 'pie',
        sections: [
            {
                title: 'Type & Shape',
                fields: [
                    { key: 'donut', label: 'Donut Chart', type: 'boolean', default: false },
                    { key: 'innerRadius', label: 'Hole Size (%)', type: 'range', min: 20, max: 80, step: 5, default: 50 },
                    { key: 'roseType', label: 'Rose Chart', type: 'boolean', default: false },
                    { key: 'borderRadius', label: 'Rounded Sectors', type: 'boolean', default: false },
                ]
            },
            {
                title: 'Labels',
                fields: [
                    { key: 'showLabels', label: 'Show Labels', type: 'boolean', default: true },
                    { key: 'labelPosition', label: 'Position', type: 'text', default: 'outside' },
                ]
            },
            {
                title: 'Layout',
                fields: [
                    { key: 'showLegend', label: 'Show Legend', type: 'boolean', default: true },
                    { key: 'showTooltip', label: 'Show Tooltip', type: 'boolean', default: true },
                ]
            }
        ]
    },
    radar: {
        label: 'Radar Chart',
        icon: Hexagon,
        echartsType: 'radar',
        sections: [
            {
                title: 'Appearance',
                fields: [
                    { key: 'shape', label: 'Shape (Poly/Circle)', type: 'boolean', default: false },
                    { key: 'color', label: 'Color Theme', type: 'color', default: '#3b82f6' },
                    { key: 'areaStyle', label: 'Fill Area', type: 'boolean', default: true },
                    { key: 'opacity', label: 'Fill Opacity', type: 'range', min: 0.1, max: 1, step: 0.1, default: 0.3 },
                    { key: 'showSymbol', label: 'Show Points', type: 'boolean', default: true },
                ]
            },
            {
                title: 'Layout',
                fields: [
                    { key: 'showLegend', label: 'Show Legend', type: 'boolean', default: true },
                    { key: 'showTooltip', label: 'Show Tooltip', type: 'boolean', default: true },
                ]
            }
        ]
    }
};

const getInitialConfig = (type) => {
    const defaults = {};
    const schema = CHART_TYPES[type] || CHART_TYPES.bar;
    if (schema && schema.sections) {
        schema.sections.forEach(section => {
            section.fields.forEach(field => {
                defaults[field.key] = field.default;
            });
        });
    }
    return defaults;
};

// --- 2. UTILS ---

const generateDummyData = (count = 500) => {
    const regions = ['North', 'South', 'East', 'West'];
    const segments = ['Consumer', 'Corporate', 'Home Office'];
    const shipModes = ['Standard Class', 'Second Class', 'First Class', 'Same Day'];

    const categories = {
        'Technology': ['Phones', 'Laptops', 'Accessories', 'Copiers'],
        'Furniture': ['Chairs', 'Tables', 'Bookcases', 'Furnishings'],
        'Office Supplies': ['Paper', 'Binders', 'Art', 'Storage', 'Fasteners', 'Labels']
    };

    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 3);

    for (let i = 0; i < count; i++) {
        const region = regions[Math.floor(Math.random() * regions.length)];
        const segment = segments[Math.floor(Math.random() * segments.length)];
        const shipMode = shipModes[Math.floor(Math.random() * shipModes.length)];

        const categoryKeys = Object.keys(categories);
        const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const subCategory = categories[category][Math.floor(Math.random() * categories[category].length)];

        const quantity = Math.floor(Math.random() * 14) + 1;
        let basePrice = 20 + Math.random() * 100;

        if (category === 'Technology') basePrice = 200 + Math.random() * 800;
        if (category === 'Furniture') basePrice = 100 + Math.random() * 400;

        const discount = Math.random() < 0.3 ? Math.floor(Math.random() * 4) * 0.1 : 0;
        const sales = Number((basePrice * quantity * (1 - discount)).toFixed(2));

        let margin = 0.25;
        if (category === 'Furniture') margin = 0.15;
        if (category === 'Office Supplies') margin = 0.35;
        if (discount > 0) margin -= (discount * 1.8);

        const profit = Number((sales * margin).toFixed(2));
        const shippingCost = Number((Math.random() * 20 + (quantity * 2)).toFixed(2));

        const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const orderDateStr = date.toISOString().split('T')[0];

        data.push({
            id: i,
            'Order Date': orderDateStr,
            'Year': date.getFullYear().toString(),
            Region: region,
            Segment: segment,
            'Ship Mode': shipMode,
            Category: category,
            'Sub-Category': subCategory,
            Sales: sales,
            Profit: profit,
            Quantity: quantity,
            Discount: Number(discount.toFixed(2)),
            'Shipping Cost': shippingCost
        });
    }
    return data.sort((a, b) => new Date(a['Order Date']) - new Date(b['Order Date']));
};

const generateEChartsOption = (data, config, includeData = true) => {
    if (!data || !config.x || !config.y) return null;
    if (config.type === 'table') return null;

    const xField = config.x;
    const yFields = Array.isArray(config.y) ? config.y : [config.y];
    const hasMultiMeasures = yFields.length > 1;
    const groupField = hasMultiMeasures ? null : config.breakdown;

    const xValues = [...new Set(data.map(d => String(d[xField])))].sort();
    const groups = hasMultiMeasures
        ? yFields
        : (groupField ? [...new Set(data.map(d => String(d[groupField])))].sort() : ['Total']);

    const aggregatedMap = {};
    xValues.forEach(x => {
        aggregatedMap[x] = {};
        groups.forEach(g => aggregatedMap[x][g] = 0);
    });

    data.forEach(row => {
        const x = String(row[xField]);
        if (hasMultiMeasures) {
            yFields.forEach(measure => {
                if (aggregatedMap[x]) {
                    aggregatedMap[x][measure] += Number(row[measure]);
                }
            });
        } else {
            const g = groupField ? String(row[groupField]) : 'Total';
            const y = yFields[0];
            if (aggregatedMap[x] && aggregatedMap[x][g] !== undefined) {
                aggregatedMap[x][g] += Number(row[y]);
            }
        }
    });

    const settings = config.settings || {};
    const series = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (config.type === 'pie') {
        const measure = yFields[0];
        const pieData = xValues.map(x => {
            const totalForX = groups.reduce((acc, g) => acc + aggregatedMap[x][g], 0);
            return { name: x, value: Number(totalForX.toFixed(2)) };
        });

        if (includeData) {
            series.push({
                type: 'pie',
                radius: settings.donut ? [`${settings.innerRadius}%`, '70%'] : '70%',
                roseType: settings.roseType ? 'radius' : false,
                itemStyle: {
                    borderRadius: settings.borderRadius ? 5 : 0,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: settings.showLabels,
                    position: settings.labelPosition || 'outside'
                },
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            });
        }
    } else if (config.type === 'radar') {
        const indicators = xValues.map(x => {
            let max = 0;
            groups.forEach(g => {
                if (aggregatedMap[x][g] > max) max = aggregatedMap[x][g];
            });
            return { name: x, max: Math.ceil(max * 1.1) };
        });

        const radarData = groups.map((g, i) => {
            const values = xValues.map(x => aggregatedMap[x][g] || 0);
            return {
                name: g,
                value: values,
                itemStyle: { color: colors[i % colors.length] },
                areaStyle: settings.areaStyle ? {
                    opacity: settings.opacity,
                    color: colors[i % colors.length]
                } : undefined
            };
        });

        if (includeData) {
            series.push({
                type: 'radar',
                data: radarData,
                symbol: settings.showSymbol ? 'circle' : 'none',
                symbolSize: 6,
            });
        }

    } else {
        // STANDARD CARTESIAN CHARTS
        groups.forEach((group, index) => {
            const seriesData = xValues.map(x => {
                const val = aggregatedMap[x][group];
                return val ? Number(val.toFixed(2)) : 0;
            });

            if (includeData) {
                const baseSeries = {
                    name: group,
                    type: CHART_TYPES[config.type]?.echartsType || 'bar',
                    data: seriesData,
                    smooth: settings.smooth,
                    symbolSize: settings.symbolSize || 6,
                    showSymbol: settings.showSymbol,
                };

                if (config.type === 'bar') {
                    baseSeries.type = 'bar';
                    baseSeries.stack = settings.stack ? 'total' : undefined;
                    baseSeries.barGap = settings.stack ? undefined : '0%';
                    baseSeries.barCategoryGap = settings.barCategoryGap ? `${settings.barCategoryGap}%` : '30%';
                    baseSeries.barWidth = settings.barWidth ? `${settings.barWidth}%` : '50%';

                    baseSeries.itemStyle = {
                        color: (hasMultiMeasures || groupField) ? colors[index % colors.length] : settings.color,
                        opacity: settings.opacity,
                        borderRadius: settings.barRadius ? [4, 4, 0, 0] : 0,
                    };
                } else if (config.type === 'line') {
                    baseSeries.lineStyle = {
                        width: settings.lineWidth,
                        color: (hasMultiMeasures || groupField) ? colors[index % colors.length] : settings.color
                    };
                    baseSeries.itemStyle = {
                        color: (hasMultiMeasures || groupField) ? colors[index % colors.length] : settings.color
                    };
                    baseSeries.areaStyle = settings.areaStyle ? { opacity: 0.2 } : null;
                } else if (config.type === 'scatter') {
                    baseSeries.itemStyle = {
                        color: (hasMultiMeasures || groupField) ? colors[index % colors.length] : settings.color,
                        opacity: settings.opacity
                    };
                }

                series.push(baseSeries);
            }
        });
    }

    const option = {
        tooltip: {
            show: settings.showTooltip !== false,
            trigger: (config.type === 'pie' || config.type === 'radar') ? 'item' : 'axis',
            axisPointer: { type: 'shadow' },
        },
        legend: {
            show: settings.showLegend,
            bottom: 0,
            type: 'scroll'
        },
        series: series
    };

    if (config.type !== 'pie' && config.type !== 'radar') {
        option.grid = {
            show: settings.showGrid,
            left: '3%',
            right: '4%',
            bottom: '12%',
            top: '10%',
            containLabel: true,
            borderColor: '#e2e8f0'
        };
        option.xAxis = {
            type: 'category',
            data: includeData ? xValues : [],
            name: settings.xAxisLabel || '',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: {
                color: '#64748b',
                rotate: settings.rotateXLabel ? 45 : 0,
                interval: 'auto',
                fontSize: 10
            },
            axisLine: { lineStyle: { color: '#cbd5e1' } },
            axisTick: { show: false },
            splitLine: {
                show: settings.showGrid,
                lineStyle: { type: 'dashed', color: '#e2e8f0' }
            }
        };
        option.yAxis = {
            type: 'value',
            name: settings.yAxisLabel || '',
            nameLocation: 'middle',
            nameGap: 40,
            axisLabel: {
                color: '#64748b',
                formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val,
                fontSize: 10
            },
            splitLine: {
                show: settings.showGrid,
                lineStyle: { type: 'dashed', color: '#e2e8f0' }
            }
        };
    } else if (config.type === 'radar') {
        option.radar = {
            shape: settings.shape ? 'circle' : 'polygon',
            indicator: includeData ? xValues.map(x => {
                let max = 0;
                groups.forEach(g => { if (aggregatedMap[x][g] > max) max = aggregatedMap[x][g]; });
                return { name: x, max: Math.ceil(max * 1.1) };
            }) : [],
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
                }
            }
        };
    }

    return option;
};

// --- 3. COMPONENTS ---

const TableRenderer = ({ data, config }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');

    const settings = config.settings || {};

    const columns = useMemo(() => {
        const cols = [];
        if (config.x) cols.push(config.x);
        if (config.y) {
            if (Array.isArray(config.y)) cols.push(...config.y);
            else cols.push(config.y);
        }
        return cols.filter(Boolean);
    }, [config.x, config.y]);

    useEffect(() => {
        setCurrentPage(1);
    }, [data, searchText, config]);

    const filteredData = useMemo(() => {
        if (!settings.enableSearch || !searchText) return data;

        const searchFields = settings.searchFields
            ? settings.searchFields.split(',').map(s => s.trim())
            : columns;

        return data.filter(row => {
            return searchFields.some(field => {
                if (row[field] !== undefined) {
                    return String(row[field]).toLowerCase().includes(searchText.toLowerCase());
                }
                return false;
            });
        });
    }, [data, searchText, settings.enableSearch, settings.searchFields, columns]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key || !settings.enableSort) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [filteredData, sortConfig, settings.enableSort]);

    const pageSize = settings.pageSize || 10;
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = useMemo(() => {
        if (!settings.enablePagination) return sortedData;
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, settings.enablePagination]);

    const handleSort = (key) => {
        if (!settings.enableSort) return;
        setSortConfig(current => {
            if (current.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    if (columns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                <TableIcon className="w-8 h-8 opacity-20" />
                <p>Add fields to Columns/Rows to build the table</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            {settings.enableSearch && (
                <div className="p-2 border-b border-slate-100 flex justify-end">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search table..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:border-blue-500 outline-none w-64 bg-slate-50"
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-auto">
                <table className={`w-full text-left border-collapse ${settings.compact ? 'text-xs' : 'text-sm'}`}>
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm text-slate-500 font-semibold">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col}
                                    className={`
                    px-4 py-3 cursor-pointer hover:bg-slate-100 select-none
                    ${settings.bordered ? 'border-b border-r border-slate-200 last:border-r-0' : 'border-b border-slate-200'}
                  `}
                                    onClick={() => handleSort(col)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col}
                                        {sortConfig.key === col && (
                                            <span className="text-xs text-blue-500">
                                                {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`
                    hover:bg-blue-50 transition-colors
                    ${settings.striped && i % 2 === 0 ? 'bg-white' : settings.striped ? 'bg-slate-50/50' : 'bg-white'}
                    ${settings.bordered ? 'border-b border-slate-100' : 'border-b border-slate-100'}
                  `}
                                >
                                    {columns.map(col => (
                                        <td
                                            key={col}
                                            className={`
                        px-4 py-2 truncate max-w-[200px]
                        ${settings.bordered ? 'border-r border-slate-100 last:border-r-0' : ''}
                      `}
                                            title={row[col]}
                                        >
                                            {typeof row[col] === 'number' ? row[col].toLocaleString() : row[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 italic">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {settings.enablePagination && totalPages > 1 && (
                <div className="p-2 border-t border-slate-200 flex justify-between items-center bg-white shrink-0 text-xs text-slate-500">
                    <span>
                        Page <b>{currentPage}</b> of <b>{totalPages}</b>
                        <span className="mx-2 text-slate-300">|</span>
                        {sortedData.length} total items
                    </span>
                    <div className="flex gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-1 px-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-1 px-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChartRenderer = ({ data, config }) => {
    if (config.type === 'table') {
        return <TableRenderer data={data} config={config} />;
    }

    const option = useMemo(() => {
        return generateEChartsOption(data, config, true);
    }, [data, config]);

    if (!data || data.length === 0 || !config.x || !config.y || (Array.isArray(config.y) && config.y.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                <BarChartIcon className="w-8 h-8 opacity-20" />
                <p>Add fields to Columns and Rows to visualize</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

const ConfigInput = ({ field, value, onChange }) => {
    if (field.hidden) return null;

    switch (field.type) {
        case 'color':
            return (
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                        />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{value}</span>
                </div>
            );
        case 'boolean':
            return (
                <button
                    onClick={() => onChange(!value)}
                    className={`
            w-10 h-6 rounded-full p-1 transition-colors flex items-center
            ${value ? 'bg-blue-600' : 'bg-slate-200'}
          `}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
            );
        case 'range':
            return (
                <div className="flex items-center gap-3 w-full">
                    <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs text-slate-500 w-8 text-right">{value}</span>
                </div>
            );
        case 'number':
            return (
                <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:border-blue-500 outline-none"
                />
            );
        case 'text':
        default:
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                />
            );
    }
};

const ConfigPanel = ({ schema, values, onChange }) => {
    if (!schema || !values) return null;

    return (
        <div className="space-y-6">
            {schema.sections.map((section, idx) => (
                <div key={idx}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">{section.title}</h4>
                    <div className="space-y-4">
                        {section.fields.map(field => {
                            if (field.hidden) return null;
                            return (
                                <div key={field.key}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-medium text-slate-600">{field.label}</label>
                                    </div>
                                    <ConfigInput
                                        field={field}
                                        value={values[field.key] !== undefined ? values[field.key] : field.default}
                                        onChange={(val) => onChange(field.key, val)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {idx < schema.sections.length - 1 && <div className="border-t border-slate-100 my-4" />}
                </div>
            ))}
        </div>
    );
};

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

const Shelf = ({ label, items, onItemDrop, onRemoveItem, placeholder, icon }) => {
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

const JsonEditor = ({ data, chartData, onUpdate, readOnly = false, label = "Configuration" }) => {
    const [mode, setMode] = useState('edit');
    const [includeData, setIncludeData] = useState(false);

    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (isFocused) return;

        if (mode === 'edit') {
            setText(JSON.stringify(data, null, 2));
        } else if (mode === 'option') {
            const option = generateEChartsOption(chartData, data, includeData);
            setText(JSON.stringify(option, null, 2));
        } else if (mode === 'data') {
            const option = generateEChartsOption(chartData, data, true);
            if (option && option.series) {
                if (data.type === 'pie') {
                    setText(JSON.stringify(option.series[0].data, null, 2));
                } else if (option.xAxis && option.xAxis.data) {
                    const xValues = option.xAxis.data;
                    const formattedData = option.series.map(s => ({
                        seriesName: s.name,
                        data: s.data.map((val, idx) => ({
                            category: xValues[idx],
                            value: val
                        }))
                    }));
                    setText(JSON.stringify(formattedData, null, 2));
                }
            } else if (data.type === 'table') {
                setText("Table View: Raw Data Display");
            } else {
                setText('[]');
            }
        }
    }, [data, chartData, mode, includeData, isFocused]);

    const handleChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        if (!readOnly && onUpdate && mode === 'edit') {
            try {
                const parsed = JSON.parse(newText);
                setError(null);
                onUpdate(parsed);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10 shrink-0">
                {!readOnly ? (
                    <div className="flex items-center gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button onClick={() => setMode('edit')} className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${mode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Edit3 size={12} /> Config
                        </button>
                        {data.type !== 'table' && (
                            <button onClick={() => setMode('option')} className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${mode === 'option' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <FileCode size={12} /> ECharts
                            </button>
                        )}
                        <button onClick={() => setMode('data')} className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${mode === 'data' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <FileJson size={12} /> Data
                        </button>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <FileCode size={14} className="text-slate-400" /> {label}
                    </span>
                )}

                <div className="flex items-center gap-3">
                    {mode === 'option' && !readOnly && (
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-800 select-none">
                            <input type="checkbox" checked={includeData} onChange={(e) => setIncludeData(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            Include Data
                        </label>
                    )}
                    {error && <span className="text-xs text-red-500 font-mono truncate max-w-[200px]" title={error}>Error: {error}</span>}
                    <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        title="Copy to Clipboard"
                    >
                        <Copy size={12} /> Copy
                    </button>
                </div>
            </div>
            <div className="flex-1 relative group">
                <textarea
                    value={text}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    readOnly={readOnly || mode !== 'edit'}
                    className={`
            absolute inset-0 w-full h-full p-4 font-mono text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none resize-none
            ${error ? 'bg-red-50/30' : ''}
            ${readOnly || mode !== 'edit' ? 'cursor-default text-slate-500' : ''}
          `}
                    spellCheck="false"
                />
                {mode !== 'edit' && !readOnly && (
                    <div className="absolute top-2 right-4 text-[10px] text-slate-400 font-mono pointer-events-none bg-slate-100/80 px-2 py-0.5 rounded">
                        READ ONLY
                    </div>
                )}
            </div>
        </div>
    );
};

const DashboardList = ({ dashboards, onCreate, onView, onEdit }) => {
    return (
        <div className="flex-1 bg-slate-50 p-8 overflow-auto">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <LayoutDashboard size={32} className="text-blue-600" /> My Dashboards
                        </h1>
                        <p className="text-slate-500 mt-1">Manage and view your analytics dashboards.</p>
                    </div>
                    <button
                        onClick={onCreate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium"
                    >
                        <Plus size={18} /> Create New Dashboard
                    </button>
                </div>

                {dashboards.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LayoutDashboard size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No Dashboards Yet</h3>
                        <p className="text-slate-400 mb-6">Create your first dashboard to get started.</p>
                        <button onClick={onCreate} className="text-blue-600 font-medium hover:underline">
                            Create Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboards.map(dash => (
                            <div key={dash.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
                                <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100">
                                    <Activity className="text-slate-300" size={48} />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{dash.metadata.title || 'Untitled Dashboard'}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">{dash.metadata.description || 'No description provided.'}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView(dash)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                        <button
                                            onClick={() => onEdit(dash)}
                                            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Edit3 size={14} /> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TableauLite() {
    const [view, setView] = useState('list');
    const [dashboards, setDashboards] = useState([]);

    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('sheet');
    const [sheets, setSheets] = useState([]);
    const [activeSheetId, setActiveSheetId] = useState('1');
    const [dashboardItems, setDashboardItems] = useState([]);
    const [dashboardLayout, setDashboardLayout] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [dashboardMeta, setDashboardMeta] = useState({
        id: null,
        title: 'New Dashboard',
        description: '',
        infoText: ''
    });
    const [dashboardConfig, setDashboardConfig] = useState({ filters: [] });
    const [dashboardFilters, setDashboardFilters] = useState({});

    const [fieldTypes, setFieldTypes] = useState({});

    useEffect(() => {
        const rawData = generateDummyData(500);
        setData(rawData);

        if (rawData.length > 0) {
            const initialTypes = {};
            Object.keys(rawData[0]).forEach(key => {
                const val = rawData[0][key];
                if (key === 'id') initialTypes[key] = 'dimension';
                else if (typeof val === 'number') initialTypes[key] = 'measure';
                else initialTypes[key] = 'dimension';
            });
            setFieldTypes(initialTypes);
        }
    }, []);

    const dimensions = useMemo(() => Object.keys(fieldTypes).filter(k => fieldTypes[k] === 'dimension'), [fieldTypes]);
    const measures = useMemo(() => Object.keys(fieldTypes).filter(k => fieldTypes[k] === 'measure'), [fieldTypes]);

    const activeSheet = sheets.find(s => s.id === activeSheetId);

    const toggleFieldType = (field) => {
        setFieldTypes(prev => ({
            ...prev,
            [field]: prev[field] === 'dimension' ? 'measure' : 'dimension'
        }));
    };

    const resetWorkspace = () => {
        setSheets([{
            id: '1',
            name: 'Sheet 1',
            x: null,
            y: null,
            breakdown: null,
            type: 'bar',
            aggregation: 'SUM',
            settings: getInitialConfig('bar')
        }]);
        setActiveSheetId('1');
        setDashboardItems([]);
        setDashboardLayout({});
        setDashboardConfig({ filters: [] });
        setDashboardFilters({});
        setDashboardMeta({ id: null, title: 'New Dashboard', description: 'Description...', infoText: '' });
        setActiveTab('sheet');
        setIsEditMode(false);
    };

    const loadDashboardIntoWorkspace = (dash) => {
        setSheets(dash.sheets);
        setDashboardItems(dash.configuration.items);
        setDashboardLayout(dash.configuration.layout);
        setDashboardConfig({ filters: dash.configuration.filters });
        setDashboardMeta({ ...dash.metadata, id: dash.id });
        setDashboardFilters({});
        setActiveTab('dashboard');
        setActiveSheetId(dash.sheets[0]?.id || '1');
    };

    const handleCreateNew = () => {
        resetWorkspace();
        setView('editor');
    };

    const handleView = (dash) => {
        loadDashboardIntoWorkspace(dash);
        setView('viewer');
    };

    const handleEdit = (dash) => {
        loadDashboardIntoWorkspace(dash);
        setView('editor');
    };

    const handleSave = () => {
        const newId = dashboardMeta.id || crypto.randomUUID();
        const newDashboard = {
            id: newId,
            updatedAt: new Date().toISOString(),
            metadata: { ...dashboardMeta, id: newId },
            configuration: {
                filters: dashboardConfig.filters,
                layout: dashboardLayout,
                items: dashboardItems
            },
            sheets: sheets
        };

        setDashboards(prev => {
            const exists = prev.findIndex(d => d.id === newId);
            if (exists >= 0) {
                const updated = [...prev];
                updated[exists] = newDashboard;
                return updated;
            }
            return [...prev, newDashboard];
        });

        setView('list');
    };

    const dashboardData = useMemo(() => {
        return data.filter(row => {
            return dashboardConfig.filters.every(filter => {
                const value = dashboardFilters[filter.field];
                if (!value) return true;

                if (filter.type === 'search') return String(row[filter.field]).toLowerCase().includes(String(value).toLowerCase());
                if (filter.type === 'date') return String(row[filter.field]).startsWith(value);
                if (filter.type === 'year') return String(row[filter.field]).substring(0, 4) === value;
                if (filter.type === 'month') return String(row[filter.field]).substring(5, 7) === value;
                if (filter.type === 'date-range') {
                    const { min, max } = value || {};
                    const rowDate = new Date(row[filter.field]);
                    if (min && new Date(min) > rowDate) return false;
                    if (max && new Date(max) < rowDate) return false;
                    return true;
                }
                return String(row[filter.field]) === value;
            });
        });
    }, [data, dashboardFilters, dashboardConfig.filters]);

    const updateSheet = (updates) => {
        setSheets(sheets.map(s => {
            if (s.id === activeSheetId) {
                if (updates.type && updates.type !== s.type) {
                    return {
                        ...s,
                        ...updates,
                        settings: getInitialConfig(updates.type)
                    };
                }
                return { ...s, ...updates };
            }
            return s;
        }));
    };

    const updateSheetSettings = (key, value) => {
        setSheets(sheets.map(s => {
            if (s.id === activeSheetId) {
                return { ...s, settings: { ...s.settings, [key]: value } };
            }
            return s;
        }));
    };

    const createSheet = () => {
        const newId = (sheets.length + 1).toString();
        const newSheet = {
            id: newId,
            name: `Sheet ${newId}`,
            x: null,
            y: null,
            breakdown: null,
            type: 'bar',
            aggregation: 'SUM',
            settings: getInitialConfig('bar')
        };
        setSheets([...sheets, newSheet]);
        setActiveSheetId(newId);
        setActiveTab('sheet');
    };

    // --- Sub-Renderers ---

    const renderDashboardList = () => (
        <div className="flex-1 bg-slate-50 p-8 overflow-auto">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <LayoutDashboard size={32} className="text-blue-600" /> My Dashboards
                        </h1>
                        <p className="text-slate-500 mt-1">Manage and view your analytics dashboards.</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium"
                    >
                        <Plus size={18} /> Create New Dashboard
                    </button>
                </div>

                {dashboards.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LayoutDashboard size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No Dashboards Yet</h3>
                        <p className="text-slate-400 mb-6">Create your first dashboard to get started.</p>
                        <button onClick={handleCreateNew} className="text-blue-600 font-medium hover:underline">
                            Create Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboards.map(dash => (
                            <div key={dash.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
                                <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100">
                                    <Activity className="text-slate-300" size={48} />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{dash.metadata.title || 'Untitled Dashboard'}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">{dash.metadata.description || 'No description provided.'}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(dash)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(dash)}
                                            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Edit3 size={14} /> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderDataView = () => (
        <div className="flex-1 overflow-auto bg-white p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Data Source</h2>
                <p className="text-slate-500 text-sm">Review data and configure field types (Click icon in header to toggle).</p>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                        <tr>
                            {Object.keys(data[0] || {}).map(k => (
                                <th key={k} className="px-4 py-3 group bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleFieldType(k)}
                                            className={`
                           p-1 rounded transition-all flex items-center gap-1.5 text-xs font-bold
                           ${fieldTypes[k] === 'dimension'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'}
                         `}
                                            title={`Current: ${fieldTypes[k]}. Click to convert.`}
                                        >
                                            {fieldTypes[k] === 'dimension' ? <TypeIcon size={12} strokeWidth={2.5} /> : <Hash size={12} strokeWidth={2.5} />}
                                        </button>
                                        <span>{k}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 20).map((row) => (
                            <tr key={row.id} className="border-b hover:bg-slate-50">
                                {Object.values(row).map((val, i) => (
                                    <td key={i} className="px-4 py-2 text-slate-600">
                                        {typeof val === 'number' && val > 100 ? val.toLocaleString() : val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFilterEditor = () => (
        <div className="flex flex-1 overflow-hidden bg-slate-50">
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-3 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2 bg-slate-50">
                    <Database className="w-4 h-4" /> Available Fields
                </div>
                <div className="p-2 overflow-y-auto flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Dimensions</div>
                    {dimensions.map(d => (
                        <div
                            key={d}
                            onClick={() => {
                                if (!dashboardConfig.filters.find(f => f.field === d)) {
                                    setDashboardConfig(prev => ({ ...prev, filters: [...prev.filters, { field: d, type: 'select' }] }));
                                }
                            }}
                            className="px-2 py-2 hover:bg-blue-50 text-slate-700 rounded cursor-pointer text-sm flex items-center justify-between group transition-colors mb-1"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 opacity-70 text-xs font-mono">Abc</span> {d}
                            </div>
                            <Plus size={14} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard Filter Configuration</h2>
                        <p className="text-slate-500 text-sm">Select fields from the left to add them as filters to your dashboard. Configure their input type below.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                        {dashboardConfig.filters.length === 0 ? (
                            <div className="p-12 text-center">
                                <Filter size={32} className="mx-auto text-slate-300 mb-2" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">No Filters Configured</h3>
                                <p className="text-slate-400">Click on fields in the sidebar to add filters.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                <div className="px-6 py-3 bg-slate-50 flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div className="w-1/3">Field Name</div>
                                    <div className="w-1/3">Input Type</div>
                                    <div className="w-1/3 text-right">Actions</div>
                                </div>
                                {dashboardConfig.filters.map(filter => (
                                    <div key={filter.field} className="px-6 py-4 flex items-center hover:bg-slate-50/50 transition-colors">
                                        <div className="w-1/3 font-medium text-slate-700 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Abc</span>
                                            {filter.field}
                                        </div>
                                        <div className="w-1/3 pr-8">
                                            <select
                                                value={filter.type}
                                                onChange={(e) => {
                                                    setDashboardConfig(prev => ({
                                                        ...prev,
                                                        filters: prev.filters.map(f => f.field === filter.field ? { ...f, type: e.target.value } : f)
                                                    }));
                                                    const newFilters = { ...dashboardFilters };
                                                    delete newFilters[filter.field];
                                                    setDashboardFilters(newFilters);
                                                }}
                                                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white focus:border-blue-500 outline-none"
                                            >
                                                <option value="select">Dropdown Menu</option>
                                                <option value="search">Search Bar</option>
                                                <option value="date">Date Picker (Single)</option>
                                                <option value="date-range">Date Range Picker</option>
                                                <option value="year">Year Selector</option>
                                                <option value="month">Month Selector</option>
                                            </select>
                                        </div>
                                        <div className="w-1/3 text-right">
                                            <button
                                                onClick={() => {
                                                    setDashboardConfig(prev => ({ ...prev, filters: prev.filters.filter(f => f.field !== filter.field) }));
                                                    const newFilters = { ...dashboardFilters };
                                                    delete newFilters[filter.field];
                                                    setDashboardFilters(newFilters);
                                                }}
                                                className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                title="Remove Filter"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSheetBuilder = () => {
        if (!activeSheet) return <div className="p-8">Loading Sheet...</div>;

        const yItems = Array.isArray(activeSheet.y)
            ? activeSheet.y.map(name => ({ name, type: 'measure' }))
            : (activeSheet.y ? [{ name: activeSheet.y, type: 'measure' }] : []);

        return (
            <div className="flex flex-1 overflow-hidden">
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
                                    onClick={() => updateSheet({ x: d })}
                                    className="px-2 py-1.5 hover:bg-blue-50 text-slate-700 rounded cursor-pointer text-sm flex items-center gap-2 group transition-colors"
                                >
                                    <span className="text-blue-500 opacity-70 text-xs font-mono">Abc</span> {d}
                                    <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
                                </div>
                            ))}
                        </div>

                        <div className="my-2 border-t border-slate-200 mx-2"></div>

                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Measures</div>
                            {measures.map(m => (
                                <div
                                    key={m}
                                    onClick={() => {
                                        const currentY = Array.isArray(activeSheet.y) ? activeSheet.y : (activeSheet.y ? [activeSheet.y] : []);
                                        if (!currentY.includes(m)) updateSheet({ y: [...currentY, m] });
                                    }}
                                    className="px-2 py-1.5 hover:bg-emerald-50 text-slate-700 rounded cursor-pointer text-sm flex items-center gap-2 group transition-colors"
                                >
                                    <span className="text-emerald-500 opacity-70 text-xs font-mono">#</span> {m}
                                    <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-slate-50/30">
                    <div className="bg-white border-b border-slate-200 shadow-sm z-10">
                        <div className="flex gap-4 px-3 py-2">
                            <div className="flex-1">
                                <Shelf
                                    label="Columns"
                                    items={activeSheet.x ? [{ name: activeSheet.x, type: 'dimension' }] : []}
                                    placeholder="Drop Dimension"
                                    onItemDrop={() => { }}
                                    onRemoveItem={() => updateSheet({ x: null })}
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
                                        updateSheet({ y: newY.map(i => i.name) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="px-3 pb-2">
                            <Shelf
                                label="Color / Group"
                                icon={<Palette size={12} />}
                                items={activeSheet.breakdown ? [{ name: activeSheet.breakdown, type: 'dimension' }] : []}
                                placeholder="Drop to Group"
                                onRemoveItem={() => updateSheet({ breakdown: null })}
                            />
                        </div>
                    </div>

                    <div className="h-12 border-b border-slate-200 flex items-center px-4 gap-4 bg-white sticky top-0 z-20">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marks</span>

                        <div className="flex bg-slate-100 rounded-md p-0.5 border border-slate-200">
                            {Object.entries(CHART_TYPES).map(([type, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => updateSheet({ type })}
                                        className={`p-1.5 rounded-sm transition-all ${activeSheet.type === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                        title={config.label}
                                    >
                                        <Icon size={16} />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="h-5 w-[1px] bg-slate-200 mx-2" />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500">Aggregation:</span>
                            <select
                                value={activeSheet.aggregation}
                                onChange={(e) => updateSheet({ aggregation: e.target.value })}
                                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                            >
                                <option value="SUM">Sum</option>
                                <option value="AVG">Average</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <div className="flex-1 p-6 min-h-0 flex flex-col">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <h2 className="text-lg font-bold text-slate-800 editable px-2 py-1 -ml-2 rounded hover:bg-slate-200/50 transition-colors">
                                    {activeSheet.name}
                                </h2>
                            </div>

                            <div className="flex-1 border border-slate-200 bg-white rounded-lg shadow-sm p-4 relative min-h-0">
                                <ChartRenderer
                                    data={data}
                                    config={{
                                        x: activeSheet.x,
                                        y: activeSheet.y,
                                        type: activeSheet.type,
                                        breakdown: activeSheet.breakdown,
                                        aggregation: activeSheet.aggregation,
                                        xType: dimensions.includes(activeSheet.x) ? 'string' : 'number',
                                        settings: activeSheet.settings
                                    }}
                                />
                            </div>
                        </div>

                        <div className="h-64 border-t border-slate-200 shrink-0">
                            <JsonEditor
                                data={activeSheet}
                                chartData={data}
                                onUpdate={updateSheet}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                    <div className="p-3 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2 bg-slate-50">
                        <Sliders className="w-4 h-4" /> {CHART_TYPES[activeSheet.type]?.label || 'Chart'} Settings
                    </div>

                    <div className="p-4 space-y-6 overflow-y-auto flex-1">
                        <ConfigPanel
                            schema={CHART_TYPES[activeSheet.type]}
                            values={activeSheet.settings}
                            onChange={updateSheetSettings}
                        />

                        <div className="border-t border-slate-100 pt-4 mt-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Sheet Info</h4>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Sheet Name</label>
                            <input
                                type="text"
                                value={activeSheet.name}
                                onChange={(e) => updateSheet({ name: e.target.value })}
                                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 mb-4 focus:border-blue-500 outline-none transition-colors"
                            />

                            <button
                                onClick={() => {
                                    if (!dashboardItems.includes(activeSheet.id)) {
                                        setDashboardItems(prev => [...prev, activeSheet.id]);
                                        setDashboardLayout(prev => ({ ...prev, [activeSheet.id]: { width: 'half' } }));
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Add to Dashboard
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    const renderDashboard = () => {
        const getUniqueValues = (field) => {
            return [...new Set(data.map(d => String(d[field])))].sort();
        };
        const getYearsFromDate = (field) => [...new Set(data.map(d => String(d[field]).substring(0, 4)))].sort();
        const getMonths = () => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        const moveItem = (index, direction) => {
            const newItems = [...dashboardItems];
            if (direction === 'left' && index > 0) {
                [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
            } else if (direction === 'right' && index < newItems.length - 1) {
                [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            }
            setDashboardItems(newItems);
        };

        const toggleSize = (sheetId) => {
            setDashboardLayout(prev => ({
                ...prev,
                [sheetId]: { width: prev[sheetId]?.width === 'full' ? 'half' : 'full' }
            }));
        };

        const removeFromDashboard = (sheetId) => {
            setDashboardItems(prev => prev.filter(id => id !== sheetId));
            const newLayout = { ...dashboardLayout };
            delete newLayout[sheetId];
            setDashboardLayout(newLayout);
        };

        return (
            <div className="flex flex-col flex-1 overflow-hidden bg-slate-100">

                <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-wrap shrink-0 shadow-sm z-20">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium border-r border-slate-200 pr-4 mr-1">
                        <Filter size={16} /> Filters:
                    </div>

                    {dashboardConfig.filters.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No active filters.</span>
                    )}

                    {dashboardConfig.filters.map(filter => (
                        <div key={filter.field} className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{filter.field}</label>
                            {filter.type === 'select' && (
                                <select
                                    value={dashboardFilters[filter.field] || ''}
                                    onChange={(e) => setDashboardFilters(prev => ({ ...prev, [filter.field]: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-slate-50 min-w-[120px]"
                                >
                                    <option value="">All</option>
                                    {getUniqueValues(filter.field).map(val => <option key={val} value={val}>{val}</option>)}
                                </select>
                            )}
                            {filter.type === 'year' && (
                                <select
                                    value={dashboardFilters[filter.field] || ''}
                                    onChange={(e) => setDashboardFilters(prev => ({ ...prev, [filter.field]: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-slate-50"
                                >
                                    <option value="">All Years</option>
                                    {getYearsFromDate(filter.field).map(val => <option key={val} value={val}>{val}</option>)}
                                </select>
                            )}
                            {filter.type === 'month' && (
                                <select
                                    value={dashboardFilters[filter.field] || ''}
                                    onChange={(e) => setDashboardFilters(prev => ({ ...prev, [filter.field]: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-slate-50"
                                >
                                    <option value="">All Months</option>
                                    {getMonths().map(val => <option key={val} value={val}>{val}</option>)}
                                </select>
                            )}
                            {filter.type === 'search' && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dashboardFilters[filter.field] || ''}
                                        onChange={(e) => setDashboardFilters(prev => ({ ...prev, [filter.field]: e.target.value }))}
                                        placeholder={`Search...`}
                                        className="text-sm border border-slate-200 rounded px-2 py-1.5 pl-7 focus:border-blue-500 outline-none bg-slate-50 w-32 focus:w-48 transition-all"
                                    />
                                    <Search size={12} className="absolute left-2 top-2.5 text-slate-400" />
                                </div>
                            )}
                            {filter.type === 'date' && (
                                <input
                                    type="date"
                                    value={dashboardFilters[filter.field] || ''}
                                    onChange={(e) => setDashboardFilters(prev => ({ ...prev, [filter.field]: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-slate-50"
                                />
                            )}
                            {filter.type === 'date-range' && (
                                <div className="flex gap-1 items-center bg-slate-50 border border-slate-200 rounded px-1">
                                    <input
                                        type="date"
                                        value={dashboardFilters[filter.field]?.min || ''}
                                        onChange={(e) => setDashboardFilters(prev => ({
                                            ...prev,
                                            [filter.field]: { ...prev[filter.field], min: e.target.value }
                                        }))}
                                        className="text-xs bg-transparent outline-none py-1.5 w-24"
                                    />
                                    <span className="text-slate-400 text-xs">-</span>
                                    <input
                                        type="date"
                                        value={dashboardFilters[filter.field]?.max || ''}
                                        onChange={(e) => setDashboardFilters(prev => ({
                                            ...prev,
                                            [filter.field]: { ...prev[filter.field], max: e.target.value }
                                        }))}
                                        className="text-xs bg-transparent outline-none py-1.5 w-24"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.keys(dashboardFilters).length > 0 && (
                        <button onClick={() => setDashboardFilters({})} className="ml-auto text-xs text-blue-600 hover:underline">
                            Clear All
                        </button>
                    )}
                </div>

                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                                    {dashboardMeta.title}
                                    {dashboardMeta.infoText && (
                                        <div className="group relative">
                                            <Info size={18} className="text-slate-400 cursor-help hover:text-blue-500" />
                                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 bg-slate-800 text-white text-xs p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                {dashboardMeta.infoText}
                                            </div>
                                        </div>
                                    )}
                                </h1>
                                <p className="text-slate-500">{dashboardMeta.description}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                {view === 'editor' ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-3 py-1.5 text-xs font-medium rounded flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                                        >
                                            <Save size={14} /> Save Dashboard
                                        </button>
                                        <div className="bg-white p-1 rounded-lg border border-slate-200 flex items-center shadow-sm">
                                            <button
                                                onClick={() => setIsEditMode(false)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-2 transition-colors ${!isEditMode ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                            <button
                                                onClick={() => setIsEditMode(true)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-2 transition-colors ${isEditMode ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <Edit3 size={14} /> Edit Layout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setView('list')}
                                        className="px-3 py-1.5 text-xs font-medium rounded flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                                    >
                                        <ArrowLeft size={14} /> Back to List
                                    </button>
                                )}
                            </div>
                        </div>

                        {dashboardItems.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-16 text-center shadow-sm">
                                <Layout size={32} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">Your Dashboard is Empty</h3>
                                {view === 'editor' && (
                                    <button onClick={() => setActiveTab('sheet')} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                        Go to Sheets
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-12 gap-6 items-start">
                                {dashboardItems.map((id, index) => {
                                    const sheet = sheets.find(s => s.id === id);
                                    const layout = dashboardLayout[id] || { width: 'half' };
                                    const colSpan = layout.width === 'full' ? 'col-span-12' : 'col-span-6';
                                    if (!sheet) return null;

                                    return (
                                        <div key={id} className={`${colSpan} bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden h-80 relative group transition-all duration-300 ${isEditMode ? 'ring-2 ring-blue-400 ring-opacity-50 hover:shadow-lg' : ''}`}>
                                            <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white z-10 shrink-0 h-10">
                                                <h3 className="font-semibold text-slate-700 text-sm truncate flex items-center gap-2">
                                                    {isEditMode && <Move size={12} className="text-slate-400" />} {sheet.name}
                                                </h3>
                                                {isEditMode && (
                                                    <div className="flex gap-1 items-center bg-slate-100 rounded p-0.5">
                                                        <button onClick={() => moveItem(index, 'left')} disabled={index === 0} className="p-1 text-slate-500 hover:bg-white rounded disabled:opacity-30"><ArrowLeft size={12} /></button>
                                                        <button onClick={() => moveItem(index, 'right')} disabled={index === dashboardItems.length - 1} className="p-1 text-slate-500 hover:bg-white rounded disabled:opacity-30"><ArrowRight size={12} /></button>
                                                        <div className="w-[1px] h-3 bg-slate-300 mx-1"></div>
                                                        <button onClick={() => toggleSize(id)} className="p-1 text-slate-500 hover:bg-white rounded">{layout.width === 'full' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}</button>
                                                        <div className="w-[1px] h-3 bg-slate-300 mx-1"></div>
                                                        <button onClick={() => removeFromDashboard(id)} className="p-1 text-red-400 hover:bg-red-50 rounded hover:text-red-600"><Trash2 size={12} /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 w-full overflow-hidden relative p-2">
                                                {isEditMode && <div className="absolute inset-0 z-20 bg-transparent" />}
                                                <ChartRenderer
                                                    data={dashboardData}
                                                    config={{
                                                        x: sheet.x,
                                                        y: sheet.y,
                                                        type: sheet.type,
                                                        breakdown: sheet.breakdown,
                                                        aggregation: sheet.aggregation,
                                                        xType: dimensions.includes(sheet.x) ? 'string' : 'number',
                                                        settings: sheet.settings
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {view === 'editor' && isEditMode && (
                    <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                        <div className="p-3 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2 bg-slate-50">
                            <Settings className="w-4 h-4" /> Dashboard Settings
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Dashboard Title</label>
                                <input type="text" value={dashboardMeta.title} onChange={(e) => setDashboardMeta(prev => ({ ...prev, title: e.target.value }))} className="w-full text-sm border border-slate-200 rounded px-2 py-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Subtitle</label>
                                <input type="text" value={dashboardMeta.description} onChange={(e) => setDashboardMeta(prev => ({ ...prev, description: e.target.value }))} className="w-full text-sm border border-slate-200 rounded px-2 py-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Info Tooltip Text</label>
                                <textarea value={dashboardMeta.infoText} onChange={(e) => setDashboardMeta(prev => ({ ...prev, infoText: e.target.value }))} rows={4} className="w-full text-sm border border-slate-200 rounded px-2 py-2 focus:border-blue-500 outline-none resize-none" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (view === 'list') return <DashboardList dashboards={dashboards} onCreate={handleCreateNew} onView={handleView} onEdit={handleEdit} />;

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
            <div className="h-14 bg-[#1e293b] flex items-center px-4 justify-between shrink-0 shadow-lg z-30">
                <div className="flex items-center gap-3 text-white font-bold text-lg tracking-tight cursor-pointer" onClick={() => setView('list')}>
                    <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-400/30"><Activity className="text-blue-400 w-5 h-5" /></div>
                    <span>Tableau<span className="font-light opacity-70 text-blue-200">Lite</span></span>
                </div>
                {view !== 'list' && (
                    <button onClick={() => setView('list')} className="text-slate-300 hover:text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-white/10 transition-colors flex items-center gap-2">
                        <ArrowLeft size={16} /> Back
                    </button>
                )}
            </div>

            {view === 'viewer' ? renderDashboard() : (
                <>
                    {activeTab === 'data' && renderDataView()}
                    {activeTab === 'sheet' && renderSheetBuilder()}
                    {activeTab === 'filters' && renderFilterEditor()}
                    {activeTab === 'dashboard' && renderDashboard()}

                    <div className="h-9 bg-slate-200 border-t border-slate-300 flex items-end px-2 gap-1 shrink-0 overflow-x-auto select-none">
                        <button onClick={() => setActiveTab('data')} className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all ${activeTab === 'data' ? 'bg-white border-slate-300 text-blue-600' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}><Database size={12} /> Data Source</button>
                        {sheets.map(sheet => (
                            <button key={sheet.id} onClick={() => { setActiveSheetId(sheet.id); setActiveTab('sheet'); }} className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r min-w-[100px] transition-all ${activeTab === 'sheet' && activeSheetId === sheet.id ? 'bg-white border-slate-300 text-blue-600' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}>
                                {CHART_TYPES[sheet.type] ? React.createElement(CHART_TYPES[sheet.type].icon, { size: 12 }) : <BarChartIcon size={12} />} {sheet.name}
                            </button>
                        ))}
                        <button onClick={createSheet} className="px-2 py-1.5 text-slate-500 hover:text-blue-600"><Plus size={16} /></button>
                        <div className="w-[1px] h-4 bg-slate-300 mx-1 mb-2"></div>
                        <button onClick={() => setActiveTab('filters')} className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all ${activeTab === 'filters' ? 'bg-white border-slate-300 text-blue-600' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}><ListFilter size={12} /> Filters</button>
                        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-2 rounded-t-sm border-t border-l border-r transition-all ${activeTab === 'dashboard' ? 'bg-white border-slate-300 text-blue-600' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'} `}><Layout size={12} /> Dashboard 1</button>
                    </div>
                </>
            )}
        </div>
    );
}