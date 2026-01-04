import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, Trash2, Hash, Type, CalendarDays } from 'lucide-react';

const DataStep = ({ onNext, parserState }) => {
    const { file, data, columns, columnTypes, processFile, toggleColumnType, clearFile } = parserState;
    console.log('DataStep Render:', { file: !!file, dataLength: data?.length });
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    const handleClear = () => {
        clearFile();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Upload Data</h2>

            {(!file && data.length === 0) ? (
                <>
                    <p className="text-slate-500 mb-6">Upload your Excel file to get started.</p>
                    <div
                        className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                        </div>
                        <p className="text-slate-800 font-medium text-lg">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-400 mt-2">Excel files only (.xlsx, .xls)</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">{file ? file.name : 'Saved Dataset'}</p>
                                <p className="text-xs text-slate-500">{file ? (file.size / 1024).toFixed(2) + ' KB' : `${data.length} rows`}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2"
                            title="Remove file"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between">
                            <span>Data Preview <span className="text-slate-400 font-normal ml-2">({data.length} rows)</span></span>
                        </h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
                                        {columns.map((col, idx) => (
                                            <th key={idx} className="px-4 py-3 whitespace-nowrap min-w-[150px]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => toggleColumnType(col)}
                                                        className={`p-1 rounded hover:bg-slate-200 transition-colors ${columnTypes[col] === 'measure' ? 'text-green-600 bg-green-50' :
                                                            columnTypes[col] === 'date' ? 'text-purple-600 bg-purple-50' :
                                                                'text-blue-500 bg-blue-50'
                                                            }`}
                                                        title={`Current: ${columnTypes[col]}. Click to cycle: Dimension -> Date -> Measure`}
                                                    >
                                                        {columnTypes[col] === 'measure' ? <Hash size={14} /> :
                                                            columnTypes[col] === 'date' ? <CalendarDays size={14} /> :
                                                                <Type size={14} />}
                                                    </button>
                                                    <span>{col}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.slice(0, 5).map((row, rowIdx) => (
                                        <tr key={rowIdx} className="hover:bg-slate-50">
                                            {columns.map((col, colIdx) => (
                                                <td key={colIdx} className="px-4 py-3 text-slate-600 whitespace-nowrap text-center">
                                                    {row[col] !== undefined ? row[col] : ''}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">Showing first 5 rows</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <span>Sweet! Let's Visualize 🚀</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataStep;
