import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import emblem from '../assets/emblem.svg';

export default function Navbar() {
  return (
    <nav className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-1 bg-slate-50 rounded-md border border-slate-100">
               <img src={emblem} alt="emblem" className="w-11 h-11" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wide leading-none">CivicConnect</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Unified Grievance Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link to="/citizen" className="hover:text-slate-900 transition-colors">Citizen Portal</Link>
            <Link to="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>

          {/* Action Button */}
           <div className="flex gap-4 items-center">
             <Link to="/citizen" className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-all shadow">
               Lodge Grievance
             </Link>
             <Link to="/login" className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition-all">
               Official Login
             </Link>
           </div>

        </div>
      </div>
    </nav>
  );
}