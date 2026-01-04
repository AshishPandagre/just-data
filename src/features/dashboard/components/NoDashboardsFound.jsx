import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const NoDashboardsFound = ({ onCreate }) => {
    return (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">No Dashboards Yet</h3>
            <p className="text-slate-400 mb-6">Create your first dashboard to get started.</p>
            <button onClick={onCreate} className="text-blue-600 font-medium hover:underline cursor-pointer">
                Create Now
            </button>
        </div>
    );
};

export default NoDashboardsFound;
