import { saveDashboard } from './storageUtils';

const SCENARIOS = [
    {
        name: 'Global Sales Executive Overview',
        description: 'High-level executive summary of global sales performance, identifying regional trends and product category leaders.',
        generateData: () => {
            const rows = [];
            const categories = ['Electronics', 'Furniture', 'Office', 'Fashion', 'Auto'];
            const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];
            const channels = ['Direct', 'Partner', 'Online', 'Retail'];
            const priorities = ['High', 'Medium', 'Low'];

            // Generate 18 months of data
            for (let i = 0; i < 800; i++) {
                const date = new Date(2023, 0, 1);
                date.setDate(date.getDate() + Math.floor(Math.random() * 540));
                const dateStr = date.toISOString().split('T')[0];

                rows.push({
                    Date: dateStr,
                    Category: categories[Math.floor(Math.random() * categories.length)],
                    Region: regions[Math.floor(Math.random() * regions.length)],
                    Channel: channels[Math.floor(Math.random() * channels.length)],
                    Priority: priorities[Math.floor(Math.random() * priorities.length)],
                    Revenue: Math.floor(Math.random() * 5000) + 200,
                    Profit: Math.floor(Math.random() * 1500) + 50,
                    Discount: Math.floor(Math.random() * 20),
                    Units: Math.floor(Math.random() * 50) + 1
                });
            }
            return rows;
        },
        fieldTypes: {
            Date: 'date',
            Category: 'dimension',
            Region: 'dimension',
            Channel: 'dimension',
            Priority: 'dimension',
            Revenue: 'measure',
            Profit: 'measure',
            Discount: 'measure',
            Units: 'measure'
        },
        charts: [
            {
                title: 'Revenue Trend by Region',
                description: 'Monthly revenue performance broken down by global region. Shows seasonal trends and regional dominance.',
                config: {
                    type: 'line',
                    x: 'Date',
                    y: 'Revenue',
                    breakdown: 'Region', // Multi-line
                    timeGrouping: 'monthly',
                    aggregation: 'sum',
                    option: {
                        tooltip: { trigger: 'axis' },
                        legend: { bottom: 0 }
                    }
                },
                w: 8, h: 5, x: 0, y: 0
            },
            {
                title: 'Channel Distribution (Donut)',
                description: 'Share of revenue contributed by each sales channel.',
                config: {
                    type: 'pie',
                    x: 'Channel',
                    y: 'Revenue',
                    aggregation: 'sum',
                    option: {
                        series: [{
                            radius: ['40%', '70%'],
                            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 }
                        }],
                        legend: { orient: 'vertical', left: 'left' }
                    }
                },
                w: 4, h: 5, x: 8, y: 0
            },
            {
                title: 'Profitability Analysis (Radar)',
                description: 'Comparing Profit generation across different Categories.',
                config: {
                    type: 'radar',
                    x: 'Category',  // Axis
                    y: 'Profit',    // Value
                    breakdown: 'Region', // Series
                    aggregation: 'average',
                    option: {
                        legend: { top: 0 }
                    }
                },
                w: 6, h: 5, x: 0, y: 5
            },
            {
                title: 'Top Categories by Units Sold',
                description: 'Ranking of best-selling categories.',
                config: {
                    type: 'bar',
                    x: 'Category',
                    y: 'Units',
                    aggregation: 'sum',
                    option: {
                        itemStyle: { borderRadius: [4, 4, 0, 0] },
                        grid: { bottom: 30 }
                    }
                },
                w: 6, h: 5, x: 6, y: 5
            }
        ],
        filters: [
            { id: 'f1', type: 'dateRange', field: 'Date', label: 'Fiscal Period' },
            { id: 'f2', type: 'dropdown', field: 'Region', label: 'Filter Region' },
            { id: 'f3', type: 'dropdown', field: 'Category', label: 'Product Category' },
            { id: 'f4', type: 'dropdown', field: 'Priority', label: 'Order Priority' }
        ]
    },
    {
        name: 'SaaS Product Health',
        description: 'Deep dive into user engagement, churn, and platform usage metrics for the product team.',
        generateData: () => {
            const rows = [];
            const plans = ['Starter', 'Professional', 'Enterprise'];
            const platforms = ['Web', 'iOS', 'Android'];
            const sources = ['Organic', 'Paid', 'Referral', 'Social'];

            for (let i = 0; i < 800; i++) {
                const date = new Date(2023, 3, 1);
                date.setDate(date.getDate() + Math.floor(Math.random() * 400));
                const dateStr = date.toISOString().split('T')[0];

                rows.push({
                    Date: dateStr,
                    Plan: plans[Math.floor(Math.random() * plans.length)],
                    Platform: platforms[Math.floor(Math.random() * platforms.length)],
                    Source: sources[Math.floor(Math.random() * sources.length)],
                    DAU: Math.floor(Math.random() * 2000) + 500,
                    New_Users: Math.floor(Math.random() * 100) + 10,
                    Avg_Session_Min: Math.floor(Math.random() * 45) + 2,
                    Churn_Rate: Number((Math.random() * 5).toFixed(2))
                });
            }
            return rows;
        },
        fieldTypes: {
            Date: 'date',
            Plan: 'dimension',
            Platform: 'dimension',
            Source: 'dimension',
            DAU: 'measure',
            New_Users: 'measure',
            Avg_Session_Min: 'measure',
            Churn_Rate: 'measure'
        },
        charts: [
            {
                title: 'User Acquisition by Source',
                description: 'Stacked bar chart showing new user growth driven by different marketing channels.',
                config: {
                    type: 'bar',
                    x: 'Date',
                    y: 'New_Users',
                    breakdown: 'Source', // Stacked
                    timeGrouping: 'monthly',
                    aggregation: 'sum',
                    option: {
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        series: [{ stack: 'total' }, { stack: 'total' }, { stack: 'total' }, { stack: 'total' }] // Hinting stack, though generic builder handles name matching
                    }
                },
                w: 12, h: 5, x: 0, y: 0
            },
            {
                title: 'Platform Stickiness (Radar)',
                description: 'Comparing Session Duration across Platforms.',
                config: {
                    type: 'radar',
                    x: 'Platform',
                    y: 'Avg_Session_Min',
                    breakdown: 'Plan',
                    aggregation: 'average',
                    option: {}
                },
                w: 6, h: 5, x: 0, y: 5
            },
            {
                title: 'Plan Distribution (Donut)',
                description: 'Revenue base by Plan tier.',
                config: {
                    type: 'pie',
                    x: 'Plan',
                    y: 'DAU', // Proxy for value
                    aggregation: 'sum',
                    option: {
                        series: [{ radius: ['50%', '70%'] }]
                    }
                },
                w: 6, h: 5, x: 6, y: 5
            }
        ],
        filters: [
            { id: 'f1', type: 'dropdown', field: 'Plan', label: 'Subscription Plan' },
            { id: 'f2', type: 'dropdown', field: 'Platform', label: 'OS Platform' },
            { id: 'f3', type: 'dateRange', field: 'Date', label: 'Analysis Period' }
        ]
    }
];

export const generateRandomDashboard = () => {
    // 1. Pick a scenario
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const data = scenario.generateData();
    const id = Date.now().toString();

    // 2. Build Dashboard Object
    const dashboard = {
        id,
        metadata: {
            title: scenario.name,
            description: scenario.description,
        },
        data: data,
        fieldTypes: scenario.fieldTypes,
        filters: scenario.filters,
        charts: scenario.charts.map(c => ({
            id: Math.random().toString(36).substr(2, 9),
            title: c.title,
            description: c.description,
            config: c.config,
            layout: { w: c.w, h: c.h, x: c.x, y: c.y }
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // 3. Save
    saveDashboard(dashboard);

    return id;
};
