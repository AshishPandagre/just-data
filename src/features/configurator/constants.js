import { BarChartIcon, LineChartIcon, PieChartIcon, Grid, Hexagon, Table } from 'lucide-react';

export const CHART_METADATA = {
    bar: {
        label: 'Bar Chart',
        icon: BarChartIcon,
        defaultOption: {
            tooltip: { show: true, trigger: 'axis' },
            legend: { show: true, top: 0 },
            grid: { show: true, left: '3%', right: '4%', bottom: '15%', top: '15%' },
            xAxis: { type: 'category', name: '', nameLocation: 'middle', nameGap: 30, axisLabel: { rotate: 0, interval: 0 } },
            yAxis: { type: 'value', name: '', nameLocation: 'middle', nameGap: 50 },
            series: [{ type: 'bar', itemStyle: { color: '#3b82f6' } }]
        },
        settingsSchema: [
            { label: 'Show Legend', type: 'boolean', path: 'legend.show' },
            { label: 'Legend Position', type: 'select', path: 'legend.top', options: [{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }] },
            { label: 'Show Grid', type: 'boolean', path: 'grid.show' },
            { label: 'Show Tooltip', type: 'boolean', path: 'tooltip.show' },
            // { label: 'Color Palette', type: 'colorList', path: 'color' },
            // { label: 'Color by Category', type: 'boolean', path: 'series.0.colorBy', valueMap: { true: 'data', false: 'series' } },
            { label: 'Per-Series Colors', type: 'seriesColors', path: 'series' },
            { label: 'Stack Series', type: 'boolean', path: 'series.0.stack', valueMap: { true: 'total', false: undefined } },
            { label: 'X Axis Label', type: 'string', path: 'xAxis.name' },
            { label: 'Y Axis Label', type: 'string', path: 'yAxis.name' },
        ]
    },
    line: {
        label: 'Line Chart',
        icon: LineChartIcon,
        defaultOption: {
            tooltip: { show: true, trigger: 'axis' },
            legend: { show: true, top: 0 },
            grid: { show: true, top: '15%' },
            xAxis: { type: 'category', nameLocation: 'middle', nameGap: 30, axisLabel: { interval: 0 } },
            yAxis: { type: 'value', name: '', nameLocation: 'middle', nameGap: 50 },
            series: [{ type: 'line', smooth: true, lineStyle: { width: 3 } }]
        },
        settingsSchema: [
            { label: 'Show Legend', type: 'boolean', path: 'legend.show' },
            { label: 'Legend Position', type: 'select', path: 'legend.top', options: [{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }] },
            { label: 'Show Grid', type: 'boolean', path: 'grid.show' },
            // { label: 'Color Palette', type: 'colorList', path: 'color' },
            { label: 'Per-Series Colors', type: 'seriesColors', path: 'series' },
            { label: 'Smooth Line', type: 'boolean', path: 'series.0.smooth' },
            { label: 'Line Width', type: 'number', path: 'series.0.lineStyle.width' },
            { label: 'X Axis Label', type: 'string', path: 'xAxis.name' },
            { label: 'Y Axis Label', type: 'string', path: 'yAxis.name' }
        ]
    },
    pie: {
        label: 'Pie Chart',
        icon: PieChartIcon,
        defaultOption: {
            tooltip: { show: true, trigger: 'item' },
            legend: { show: true, top: 0 },
            series: [{ type: 'pie', radius: '70%', label: { show: true } }]
        },
        settingsSchema: [
            { label: 'Show Legend', type: 'boolean', path: 'legend.show' },
            { label: 'Legend Position', type: 'select', path: 'legend.top', options: [{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }] },
            // { label: 'Color Palette', type: 'colorList', path: 'color' },
            { label: 'Slice Colors', type: 'dataColors', path: 'series.0.data' },
            { label: 'Donut Chart', type: 'boolean', path: 'series.0.radius', valueMap: { true: ['40%', '70%'], false: '70%' } },
            { label: 'Show Labels', type: 'boolean', path: 'series.0.label.show' }
        ]
    },
    scatter: {
        label: 'Scatter Plot',
        icon: Grid,
        defaultOption: {
            tooltip: { show: true, trigger: 'item' },
            legend: { show: true, top: 0 },
            grid: { show: true, top: '15%' },
            xAxis: { type: 'category', nameLocation: 'middle', nameGap: 30, axisLabel: { interval: 0 } },
            yAxis: { type: 'value', name: '', nameLocation: 'middle', nameGap: 50 },
            series: [{ type: 'scatter', symbolSize: 10 }]
        },
        settingsSchema: [
            { label: 'Show Grid', type: 'boolean', path: 'grid.show' },
            // { label: 'Color Palette', type: 'colorList', path: 'color' },
            { label: 'Per-Series Colors', type: 'seriesColors', path: 'series' },
            { label: 'Symbol Size', type: 'number', path: 'series.0.symbolSize' },
            { label: 'X Axis Label', type: 'string', path: 'xAxis.name' },
            { label: 'Y Axis Label', type: 'string', path: 'yAxis.name' }
        ]
    },
    radar: {
        label: 'Radar Chart',
        icon: Hexagon,
        defaultOption: {
            tooltip: { show: true },
            legend: { show: true, top: 0 },
            radar: { shape: 'polygon' },
            series: [{ type: 'radar', areaStyle: { opacity: 0.5 } }]
        },
        settingsSchema: [
            { label: 'Show Legend', type: 'boolean', path: 'legend.show' },
            { label: 'Legend Position', type: 'select', path: 'legend.top', options: [{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }] },
            // { label: 'Color Palette', type: 'colorList', path: 'color' },
            { label: 'Per-Series Colors', type: 'seriesColors', path: 'series' },
            { label: 'Shape Circle', type: 'boolean', path: 'radar.shape', valueMap: { true: 'circle', false: 'polygon' } }
        ]
    },
    table: {
        label: 'Table',
        icon: Table,
        defaultOption: {}, // Table is special, handled separately or mocked in options
        settingsSchema: []
    }
};
