import React, { useState } from 'react';
import { Box } from '@mui/material';
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

  // Prevent navigating to Operations before analysis is ready.
  const handleSetCurrentView = (view: View) => {
    if (view === 'operations' && !analysisResult) {
      console.warn('Navigation to Operations Hub blocked: No analysis is available.');
      return;
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'awareness':
        return (
          <SituationalAwareness
            setAnalysisResult={setAnalysisResult}
            setIncidentDetails={setIncidentDetails}
            setCurrentView={handleSetCurrentView}
          />
        );
      case 'preparedness':
        return <PublicPreparedness />;
      case 'operations':
        return (
          <OperationsHub
            analysisResult={analysisResult}
            incidentDetails={incidentDetails}
          />
        );
      default:
        return (
          <SituationalAwareness
            setAnalysisResult={setAnalysisResult}
            setIncidentDetails={setIncidentDetails}
            setCurrentView={handleSetCurrentView}
          />
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Sidebar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        hasAnalysis={!!analysisResult}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {renderView()}
      </Box>
    </Box>
  );
};

export default App;