import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SituationalAwareness from './components/SituationalAwareness';
import PublicPreparedness from './components/PublicPreparedness';
import OperationsHub from './components/OperationsHub';
import type { AnalysisResult, IncidentDetails } from './types';

export type View = 'awareness' | 'preparedness' | 'operations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('awareness');
  const [incidentDetails, setIncidentDetails] = useState<IncidentDetails | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Create a guarded handler for changing views to prevent invalid state transitions.
  const handleSetCurrentView = (view: View) => {
    // The only way to navigate to the Operations Hub is if an analysis has been completed.
    if (view === 'operations' && !analysisResult) {
      // This prevents a user from navigating to the Operations Hub before data is ready.
      // The UI should already disable the button, so this is a logical safeguard.
      console.warn("Navigation to Operations Hub blocked: No analysis is available.");
      return;
    }
    setCurrentView(view);
  };


  const renderView = () => {
    switch (currentView) {
      case 'awareness':
        return <SituationalAwareness 
                  setAnalysisResult={setAnalysisResult} 
                  setIncidentDetails={setIncidentDetails}
                  setCurrentView={handleSetCurrentView}
                />;
      case 'preparedness':
        return <PublicPreparedness />;
      case 'operations':
        return <OperationsHub 
                  analysisResult={analysisResult}
                  incidentDetails={incidentDetails}
                />;
      default:
        return <SituationalAwareness 
                  setAnalysisResult={setAnalysisResult} 
                  setIncidentDetails={setIncidentDetails}
                  setCurrentView={handleSetCurrentView}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView}
        hasAnalysis={!!analysisResult}
      />
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;