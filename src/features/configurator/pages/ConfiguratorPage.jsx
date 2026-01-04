import { useState, useMemo, useEffect } from 'react';
import { useExcelParser } from '../../../hooks/useExcelParser';
import DataStep from '../components/DataStep';
import MetadataStep from '../components/MetadataStep';
import ConfiguratorTabs from '../components/ConfiguratorTabs';
import ChartBuilderStep from '../components/ChartBuilderStep';
import FiltersStep from '../components/FiltersStep';
import LayoutStep from '../components/LayoutStep';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveDashboard, getDashboardById } from '../../../utils/storageUtils';
import { toPng } from 'html-to-image';

const ConfiguratorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('metadata');
    const existingDashboard = useMemo(() => {
        return id ? getDashboardById(id) : null;
    }, [id]);

    const [metadata, setMetadata] = useState(() => {
        return existingDashboard ? existingDashboard.metadata : { title: '', description: '' };
    });
    // Charts State
    const [charts, setCharts] = useState([{ id: 'default', title: 'Chart 1', description: '' }]);
    const [chartToDelete, setChartToDelete] = useState(null);

    const [filters, setFilters] = useState([]); // Lifted filters state

    // Lifted state from DataStep
    const excelParser = useExcelParser({
        data: existingDashboard?.data,
        columns: existingDashboard?.data && existingDashboard.data.length > 0 ? Object.keys(existingDashboard.data[0]) : [],
        columnTypes: existingDashboard?.fieldTypes
    });
    const { columnTypes } = excelParser;

    // State for Toast
    const [showToast, setShowToast] = useState(false);

    // Hydrate metadata state when ID changes (if navigating between edit pages)
    useEffect(() => {
        if (id && existingDashboard) {
            setMetadata(existingDashboard.metadata || { title: '', description: '' });
            if (existingDashboard.charts) setCharts(existingDashboard.charts);
            if (existingDashboard.filters) setFilters(existingDashboard.filters);
            // Data hydration is now handled by initial state of useExcelParser
            // forcing a re-initialization if ID changes is tricky with hooks though.
            // Since ConfiguratorPage re-mounts on route change (same component, diff key?),
            // actually if we navigate /edit/1 -> /edit/2, the component might NOT remount.
            // We need to handle that.
            if (existingDashboard.data) {
                excelParser.setData(existingDashboard.data);
                excelParser.setColumns(Object.keys(existingDashboard.data[0]));
                if (existingDashboard.fieldTypes) {
                    excelParser.setColumnTypes(existingDashboard.fieldTypes);
                }
            } else if (!existingDashboard) {
                // reset?
            }
        }
    }, [id, existingDashboard]);

    const handleSave = async () => {
        if (!metadata.title) {
            alert('Please enter a dashboard name.');
            setActiveTab('metadata');
            return;
        }

        let thumbnail = existingDashboard ? existingDashboard.thumbnail : null;

        // Capture thumbnail if on layout tab
        if (activeTab === 'layout') {
            const element = document.getElementById('dashboard-layout-capture');
            if (element) {
                try {
                    thumbnail = await toPng(element, {
                        pixelRatio: 0.5, // Reduced quality for thumbnail
                        backgroundColor: '#f8fafc', // matched to bg-slate-50
                    });
                } catch (error) {
                    console.error('Failed to capture thumbnail:', error);
                }
            }
        }

        const newDashboard = {
            id: existingDashboard ? existingDashboard.id : Date.now().toString(),
            metadata,
            fieldTypes: columnTypes, // Persist field types
            data: excelParser.data.slice(0, 500), // Persist top 500 rows
            charts, // Persist all charts configurations
            filters, // Persist global filters
            thumbnail, // Save thumbnail
            createdAt: existingDashboard ? existingDashboard.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        saveDashboard(newDashboard);
        setShowToast(true);

        // Redirect after delay
        setTimeout(() => {
            navigate('/dashboards');
        }, 1500);
    };

    const handleChartUpdate = (chartId, updates) => {
        setCharts(prev => prev.map(chart =>
            chart.id === chartId ? { ...chart, ...updates } : chart
        ));
    };

    const handleAddChart = () => {
        const newId = Date.now().toString();
        // Initialize with default config
        const newChart = {
            id: newId,
            title: `Chart ${charts.length + 1}`,
            description: '',
            config: {
                type: 'bar',
                x: null,
                y: null,
                breakdown: null,
                settings: {}
            }
        };
        setCharts([...charts, newChart]);
        setActiveTab(`chart-${newId}`);
    };

    const confirmDeleteChart = (chartId) => {
        setChartToDelete(chartId);
    };

    const handleDeleteChart = () => {
        if (!chartToDelete) return;

        const newCharts = charts.filter(c => c.id !== chartToDelete);
        setCharts(newCharts);
        setChartToDelete(null);

        // If we deleted the active chart, switch tab
        if (activeTab === `chart-${chartToDelete}`) {
            if (newCharts.length > 0) {
                setActiveTab(`chart-${newCharts[0].id}`);
            } else {
                setActiveTab('metadata');
            }
        }
    };

    const handleLayoutChange = (layout) => {
        // layout is array of { i, x, y, w, h }
        const layoutMap = new Map(layout.map(l => [l.i, l]));

        setCharts(prev => prev.map(chart => {
            const newItem = layoutMap.get(chart.id);
            if (newItem) {
                return {
                    ...chart,
                    layout: { x: newItem.x, y: newItem.y, w: newItem.w, h: newItem.h }
                };
            }
            return chart;
        }));
    };

    const activeChartId = activeTab.startsWith('chart-') ? activeTab.replace('chart-', '') : null;
    const activeChart = charts.find(c => c.id === activeChartId);

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="bg-white/20 rounded-full p-1">
                            <Save size={16} />
                        </div>
                        <span className="font-medium">Dashboard Saved Successfully!</span>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {chartToDelete && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Chart?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this chart? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setChartToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteChart}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-slate-200 shrink-0">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboards')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Dashboards</span>
                    </button>
                    <div className="font-semibold text-slate-800">
                        {metadata.title || 'New Dashboard Configuration'}
                    </div>
                    <div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium text-sm"
                        >
                            <Save size={16} /> Save Dashboard
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {activeTab === 'metadata' && (
                    <div className="max-w-4xl mx-auto py-10 px-4 w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800">Dashboard Metadata</h1>
                            <p className="text-slate-500 mt-2">Define the core details of your dashboard.</p>
                        </div>
                        <MetadataStep
                            metadata={metadata}
                            onChange={setMetadata}
                            onNext={() => setActiveTab('data')}
                        />
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="max-w-7xl mx-auto py-6 px-4 w-full h-full flex flex-col">
                        <div className="mb-6 shrink-0">
                            <h1 className="text-2xl font-bold text-slate-800">Data Source</h1>
                            <p className="text-slate-500 text-sm mt-1">Import your data to start building visualizations.</p>
                        </div>
                        <DataStep
                            parserState={excelParser}
                            onNext={() => setActiveTab(`chart-${charts[0].id}`)}
                        />
                    </div>
                )}

                {activeTab.startsWith('chart-') && (
                    <div className="flex-1 flex flex-col h-full">
                        <ChartBuilderStep
                            activeChart={activeChart}
                            onUpdateChart={(updates) => {
                                // Adapter to handle both new and legacy updates
                                const safeUpdates = updates.config || updates.title || updates.description !== undefined
                                    ? updates
                                    : { config: updates };
                                handleChartUpdate(activeChartId, safeUpdates);
                            }}
                            data={excelParser.data}
                            columnTypes={excelParser.columnTypes}
                        />
                    </div>
                )}

                {activeTab === 'filters' && (
                    <div className="flex-1 flex flex-col h-full">
                        <FiltersStep
                            filters={filters}
                            setFilters={setFilters}
                            columnTypes={columnTypes}
                        />
                    </div>
                )}

                {activeTab === 'layout' && (
                    <div className="flex-1 flex flex-col h-full">
                        <LayoutStep
                            filters={filters}
                            charts={charts}
                            data={excelParser.data}
                            onLayoutChange={handleLayoutChange}
                        />
                    </div>
                )}
            </main>

            <ConfiguratorTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                charts={charts}
                onAddChart={handleAddChart}
                onDeleteChart={confirmDeleteChart}
            />
        </div>
    );
};

export default ConfiguratorPage;