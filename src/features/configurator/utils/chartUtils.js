export const aggregateData = (data, config) => {
    if (!data || !config.x || !config.y) return null;

    const xField = config.x;
    const yFields = Array.isArray(config.y) ? config.y : [config.y];
    const hasMultiMeasures = yFields.length > 1;
    const groupField = hasMultiMeasures ? null : config.breakdown;
    const aggregation = config.aggregation || 'sum';
    const timeGrouping = config.timeGrouping; // 'monthly' | 'yearly' | 'none'

    const formatXValue = (val) => {
        if (!timeGrouping || timeGrouping === 'none') return String(val);
        const date = new Date(val);
        if (isNaN(date.getTime())) return String(val); // Fallback for invalid dates

        if (timeGrouping === 'yearly') {
            return String(date.getFullYear());
        } else if (timeGrouping === 'monthly') {
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
        }
        return String(val);
    };

    const xValues = [...new Set(data.map(d => formatXValue(d[xField])))].sort((a, b) => {
        // Custom sort for dates if needed, but lexicographical YYYY is fine, Mmm YYYY needs help
        if (timeGrouping === 'monthly') {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        }
        return a.localeCompare(b);
    });

    const groups = hasMultiMeasures
        ? yFields
        : (groupField ? [...new Set(data.map(d => String(d[groupField])))].sort() : ['Total']);

    // Temporary map to hold arrays of values for aggregation
    const valuesMap = {};
    xValues.forEach(x => {
        valuesMap[x] = {};
        groups.forEach(g => valuesMap[x][g] = []);
    });

    data.forEach(row => {
        const x = formatXValue(row[xField]);
        if (hasMultiMeasures) {
            yFields.forEach(measure => {
                if (valuesMap[x]) {
                    valuesMap[x][measure].push(Number(row[measure]));
                }
            });
        } else {
            const g = groupField ? String(row[groupField]) : 'Total';
            const y = yFields[0];
            if (valuesMap[x] && valuesMap[x][g]) {
                valuesMap[x][g].push(Number(row[y]));
            }
        }
    });

    // Compute final aggregated map
    const aggregatedMap = {};
    xValues.forEach(x => {
        aggregatedMap[x] = {};
        groups.forEach(g => {
            const values = valuesMap[x][g];
            let result = 0;
            if (values.length > 0) {
                switch (aggregation) {
                    case 'average': // Average
                        result = values.reduce((a, b) => a + b, 0) / values.length;
                        break;
                    case 'min': // Min
                        result = Math.min(...values);
                        break;
                    case 'max': // Max
                        result = Math.max(...values);
                        break;
                    case 'count': // Count
                        result = values.length;
                        break;
                    case 'sum': // Sum
                    default:
                        result = values.reduce((a, b) => a + b, 0);
                        break;
                }
            }
            aggregatedMap[x][g] = result;
        });
    });

    return { xValues, groups, aggregatedMap, hasMultiMeasures, groupField };
};

import { CHART_METADATA } from '../constants';

export const createInitialOption = (type) => {
    // Deep clone default option to avoid mutation
    return JSON.parse(JSON.stringify(CHART_METADATA[type]?.defaultOption || {}));
};

/**
 * Merges data-driven properties (series data, axis categories) into the existing option
 * Preserves user's manual style edits in other parts of the option object.
 */
export const injectData = (baseOption, parsedData, config) => {
    if (!parsedData || !baseOption) return baseOption;

    const { xValues, groups, aggregatedMap } = parsedData;
    const type = config.type;
    const newOption = JSON.parse(JSON.stringify(baseOption)); // Deep clone to avoid mutation

    // Use default colors if not present
    const colors = newOption.color || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
    if (!newOption.color) newOption.color = colors;

    if (type === 'pie') {
        const existingData = baseOption.series && baseOption.series[0] && baseOption.series[0].data ? baseOption.series[0].data : [];

        const pieData = xValues.map((x, i) => {
            const totalForX = groups.reduce((acc, g) => acc + aggregatedMap[x][g], 0);
            const existingSlice = existingData.find(d => d.name === x) || {};

            // Explicitly assign color from palette to ensure UI matches Chart
            // If user has manually set a color (existingSlice.itemStyle.color), keep it.
            // Otherwise, assign the default palette color for this index.
            const sliceColor = existingSlice.itemStyle?.color || colors[i % colors.length];

            return {
                name: x,
                value: Number(totalForX.toFixed(2)),
                itemStyle: { color: sliceColor }
            };
        });

        // Ensure series exists
        if (!newOption.series || !newOption.series[0]) newOption.series = [{ type: 'pie' }];

        // Force type and inject data
        newOption.series[0].type = 'pie';
        newOption.series[0].data = pieData;

    } else if (type === 'radar') {
        const existingData = baseOption.series && baseOption.series[0] && baseOption.series[0].data ? baseOption.series[0].data : [];

        const radarData = groups.map((g, i) => {
            const values = xValues.map(x => aggregatedMap[x][g] || 0);
            const existingSlice = existingData.find(d => d.name === g) || {};

            const sliceColor = existingSlice.itemStyle?.color || colors[i % colors.length];

            return {
                name: g,
                value: values,
                // Keep existing style if present
                itemStyle: { color: sliceColor }
            };
        });

        if (!newOption.series || !newOption.series[0]) newOption.series = [{ type: 'radar' }];

        // Force type and inject data
        newOption.series[0].type = 'radar';
        newOption.series[0].data = radarData;

        // Inject indicator
        if (!newOption.radar) newOption.radar = {};
        newOption.radar.indicator = xValues.map(x => {
            let max = 0;
            groups.forEach(g => { if (aggregatedMap[x][g] > max) max = aggregatedMap[x][g]; });
            return { name: x, max: Math.ceil(max * 1.1) };
        });

    } else {
        // Cartesian (Bar, Line, Scatter)

        // Inject X Axis Categories
        if (!newOption.xAxis) newOption.xAxis = { type: 'category' };
        if (Array.isArray(newOption.xAxis)) {
            newOption.xAxis[0].data = xValues;
        } else {
            newOption.xAxis.data = xValues;
        }

        // Ensure Y Axis exists
        if (!newOption.yAxis) newOption.yAxis = [{ type: 'value' }];
        if (Array.isArray(newOption.yAxis) && newOption.yAxis.length === 0) newOption.yAxis.push({ type: 'value' });

        // Ensure Grid exists
        if (!newOption.grid) newOption.grid = { left: '3%', right: '4%', bottom: '3%', containLabel: true };

        // Generate Series based on groups
        const newSeries = groups.map((group, index) => {
            const seriesData = xValues.map(x => {
                const val = aggregatedMap[x][group];
                return val ? Number(val.toFixed(2)) : 0;
            });
            const existingSeries = (baseOption.series && baseOption.series[index]) ? baseOption.series[index] : (baseOption.series && baseOption.series[0] ? baseOption.series[0] : {});

            // PROGAGATE SETTINGS FROM PRIMARY SERIES (Series[0])
            const primarySeries = (baseOption.series && baseOption.series[0]) ? baseOption.series[0] : {};

            // Robust check: Handle 'true' (legacy/bug) by converting to 'total'
            let primaryStack = primarySeries.stack;
            if (primaryStack === true) primaryStack = 'total';
            if (primaryStack === false) primaryStack = undefined;

            const primaryColorBy = primarySeries.colorBy;

            // COLOR LOGIC
            const userColor = existingSeries.itemStyle?.color;
            let finalItemStyle = { ...existingSeries.itemStyle };

            if (primaryColorBy === 'data') {
                // Creating "Colorful Bars" mode.
                // We MUST delete the series-level color to allow ECharts to apply the palette to each bar.
                // Even if user selected a color, "Color by Category" mode implies rainbow.
                delete finalItemStyle.color;
            } else {
                // Standard mode (colorBy series)
                // Force palette color (cyclical) or user override
                finalItemStyle.color = userColor || colors[index % colors.length];
            }

            return {
                ...existingSeries,
                name: group,
                type: type === 'scatter' ? 'scatter' : (type === 'line' ? 'line' : 'bar'),
                stack: primaryStack, // Forced propagation
                colorBy: primaryColorBy, // Forced propagation
                itemStyle: finalItemStyle,
                data: seriesData
            };
        });
        newOption.series = newSeries;
    }

    // Global Validations for all types
    if (type === 'pie' || type === 'radar') {
        // Pie/Radar should NOT have Cartesian axes to avoid ECharts errors
        delete newOption.xAxis;
        delete newOption.yAxis;
        delete newOption.grid;
    }

    return newOption;
};
