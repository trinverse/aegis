import React from 'react';
import type { View } from '../App';
import DashboardIcon from './icons/DashboardIcon';
import PreparednessIcon from './icons/PreparednessIcon';
import OperationsIcon from './icons/OperationsIcon';


interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  hasAnalysis: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, hasAnalysis }) => {
  const navItems = [
    { id: 'awareness', icon: DashboardIcon, label: 'Situational Awareness' },
    { id: 'operations', icon: OperationsIcon, label: 'Operations Hub', disabled: !hasAnalysis },
    { id: 'preparedness', icon: PreparednessIcon, label: 'Public Preparedness' },
  ];

  return (
    <nav className="w-16 md:w-64 bg-gray-900 border-r border-gray-700/50 p-2 md:p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center md:justify-start gap-3 p-2 mb-8">
          <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
          </svg>
          <h1 className="text-xl font-bold hidden md:block">Aegis AI</h1>
        </div>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id as View)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 p-3 my-1 rounded-lg transition-colors text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className="hidden md:block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
       <div className="p-2 text-center text-xs text-gray-500 hidden md:block">
          <p>&copy; 2024 Aegis AI Systems</p>
          <p>Emergency Management Redefined</p>
        </div>
    </nav>
  );
};

export default Sidebar;