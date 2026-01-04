import React from 'react';

const MetadataStep = ({ metadata, onChange, onNext }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...metadata, [name]: value });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Dashboard Details</h2>

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                        Dashboard Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={metadata.title}
                        onChange={handleChange}
                        placeholder="e.g. Q4 Sales Report"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={metadata.description}
                        onChange={handleChange}
                        placeholder="Describe the purpose of this dashboard..."
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={onNext}
                        disabled={!metadata.title.trim()}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next, Select Data Source
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetadataStep;
