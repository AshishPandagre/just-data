import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Home } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-linear-to-tr from-blue-600 to-cyan-500 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                    <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-slate-600">
                    just data
                </span>
            </Link>
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    <Home size={18} />
                    Home
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
