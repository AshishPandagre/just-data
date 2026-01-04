import React from 'react';

export const ConfigSection = ({ title, children }) => (
    <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">{title}</h4>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const ConfigRow = ({ label, children }) => (
    <div>
        <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-600">{label}</label>
        </div>
        {children}
    </div>
);

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const ColorInput = ({ value, onChange }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                />
            </div>
            <span className="text-xs font-mono text-slate-500">{value}</span>
        </div>
        {/* Quick Palette */}
        <div className="flex flex-wrap gap-1">
            {PALETTE.map(color => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className="w-4 h-4 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                />
            ))}
        </div>
    </div>
);

// ... (ToggleInput, etc. unchanged)

export const NamedColorListInput = ({ value, onChange }) => {
    // Value is array of objects: [{ name: 'A', itemStyle: { color: 'red' } }, ...]
    if (!Array.isArray(value) || value.length === 0) {
        return <div className="text-xs text-slate-400 italic">No data series available.</div>;
    }

    const handleColorChange = (index, color) => {
        const newValue = JSON.parse(JSON.stringify(value));
        if (!newValue[index].itemStyle) newValue[index].itemStyle = {};
        newValue[index].itemStyle.color = color;
        onChange(newValue);
    };

    return (
        <div className="space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {value.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-slate-50 pb-2 last:border-0">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 truncate max-w-[120px] font-medium" title={item.name || `Series ${i + 1}`}>
                            {item.name || `Series ${i + 1}`}
                        </span>
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 transition-colors">
                            <input
                                type="color"
                                value={item.itemStyle?.color || '#3b82f6'}
                                onChange={(e) => handleColorChange(i, e.target.value)}
                                className="absolute -top-[10px] -left-[10px] w-12 h-12 cursor-pointer p-0 m-0 opacity-0"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: item.itemStyle?.color || '#3b82f6' }} />
                        </div>
                    </div>
                    {/* Quick Palette for this row */}
                    <div className="flex flex-wrap gap-1 justify-end opacity-50 hover:opacity-100 transition-opacity">
                        {PALETTE.map(color => (
                            <button
                                key={color}
                                onClick={() => handleColorChange(i, color)}
                                className="w-3 h-3 rounded-full border border-slate-200 hover:scale-125 transition-transform"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ToggleInput = ({ value, onChange }) => (
    <button
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${value ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
);

export const RangeInput = ({ value, onChange, min, max, step }) => (
    <div className="flex items-center gap-3 w-full">
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs text-slate-500 w-8 text-right">{value}</span>
    </div>
);

export const NumberInput = ({ value, onChange, min, max }) => (
    <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:border-blue-500 outline-none"
    />
);

export const TextInput = ({ value, onChange }) => (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
    />
);

export const SelectInput = ({ value, onChange, options = [] }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none appearance-none bg-white pr-8"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    </div>
);
export const ColorListInput = ({ value, onChange }) => {
    // Value should be an array of color strings
    // If undefined, use default list
    const colors = Array.isArray(value) ? value : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Helper to update a single color at index
    const handleUpdate = (index, newColor) => {
        const newColors = [...colors];
        newColors[index] = newColor;
        onChange(newColors);
    };

    return (
        <div className="grid grid-cols-6 gap-2">
            {colors.map((c, i) => (
                <div key={i} className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                    <input
                        type="color"
                        value={c}
                        onChange={(e) => handleUpdate(i, e.target.value)}
                        className="absolute -top-[10px] -left-[10px] w-12 h-12 cursor-pointer p-0 m-0 opacity-0"
                    // opacity-0 but actionable, overlaying a styled div
                    />
                    <div className="w-full h-full" style={{ backgroundColor: c }} />
                </div>
            ))}
        </div>
    );
};

// End of file
