import React, { useState } from 'react';
import { LayoutDashboard, Plus, Sparkles, AlertTriangle } from 'lucide-react';
import DashboardListItem from '../components/DashboardListItem';
import NoDashboardsFound from '../components/NoDashboardsFound';
import { getDashboards, deleteDashboard } from '../../../utils/storageUtils';
import { generateRandomDashboard } from '../../../utils/randomDashboardGenerator';
import Navbar from '../../../components/Navbar';

import { useNavigate } from 'react-router-dom';

const DashboardList = () => {
    const navigate = useNavigate();
    const [dashboards, setDashboards] = useState(() => getDashboards()); // Need setter now

    const handleCreate = () => {
        navigate('/dashboard/create');
    };

    const handleView = (dashboard) => {
        navigate(`/dashboard/${dashboard.id}`);
    };

    const handleEdit = (dashboard) => {
        navigate(`/dashboard/edit/${dashboard.id}`);
    };

    const [dashboardToDelete, setDashboardToDelete] = useState(null);

    const handleDeleteClick = (dashboard) => {
        setDashboardToDelete(dashboard);
    };

    const confirmDelete = () => {
        if (dashboardToDelete) {
            deleteDashboard(dashboardToDelete.id);
            setDashboards(getDashboards()); // Refresh list
            setDashboardToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <div className="flex-1 p-8 overflow-auto relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <LayoutDashboard size={32} className="text-blue-600" /> My Dashboards
                            </h1>
                            <p className="text-slate-500 mt-1">Manage and view your dashboards.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    generateRandomDashboard();
                                    setDashboards(getDashboards());
                                }}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium cursor-pointer"
                            >
                                <Sparkles size={18} /> Surprise Me
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium cursor-pointer"
                            >
                                <Plus size={18} /> Create New Dashboard
                            </button>
                        </div>
                    </div>

                    {dashboards.length === 0 ? (
                        <NoDashboardsFound onCreate={handleCreate} />
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            {dashboards.map(dash => (
                                <DashboardListItem
                                    key={dash.id}
                                    dashboard={dash}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {dashboardToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Dashboard?</h3>
                                <p className="text-slate-500 mb-6">
                                    Are you sure you want to delete <strong>{dashboardToDelete.metadata?.title}</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setDashboardToDelete(null)}
                                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardList;
