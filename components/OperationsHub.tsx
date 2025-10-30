import React, { useState, useEffect } from 'react';
import type { AnalysisResult, IncidentDetails, ImpactForecast, TeamBriefing, TrainingScenario } from '../types';
import { generateImpactForecast, generateTeamBriefing, generateTrainingScenario } from '../services/geminiService';
import TargetIcon from './icons/TargetIcon';
import UsersIcon from './icons/UsersIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface OperationsHubProps {
    analysisResult: AnalysisResult | null;
    incidentDetails: IncidentDetails | null;
}

const OperationsHub: React.FC<OperationsHubProps> = ({ analysisResult, incidentDetails }) => {
    const [forecast, setForecast] = useState<ImpactForecast | null>(null);
    const [briefing, setBriefing] = useState<TeamBriefing | null>(null);
    const [scenario, setScenario] = useState<TrainingScenario | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOperationalData = async () => {
            if (!incidentDetails || !analysisResult) return;

            setIsLoading(true);
            setError(null);
            try {
                const [forecastData, briefingData, scenarioData] = await Promise.all([
                    generateImpactForecast(incidentDetails),
                    generateTeamBriefing(analysisResult),
                    generateTrainingScenario(incidentDetails),
                ]);
                setForecast(forecastData);
                setBriefing(briefingData);
                setScenario(scenarioData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to load operational data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOperationalData();
    }, [analysisResult, incidentDetails]);

    if (!analysisResult || !incidentDetails) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center">
                <h2 className="text-3xl font-bold text-gray-400 mb-4">Operations Hub</h2>
                <p className="text-lg">Please report an incident on the "Situational Awareness" page first.</p>
                <p>Advanced operational tools will be available here once an analysis is generated.</p>
            </div>
        );
    }
    
    if (isLoading) {
        return (
             <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <svg className="animate-spin mx-auto h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-gray-400">Generating advanced operational intelligence...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="text-center text-red-400">{error}</div>
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-blue-400 mb-2">Operations Hub</h2>
            <p className="text-gray-400 mb-8">Incident: <span className="font-semibold text-gray-300">{incidentDetails.incidentType}</span> at <span className="font-semibold text-gray-300">{incidentDetails.location}</span></p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Impact Forecast */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-4">
                    <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2"><TargetIcon className="w-6 h-6" />Impact Forecast</h3>
                    <div>
                        <h4 className="font-semibold text-gray-300">Short-Term (0-12h)</h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-1">
                            {forecast?.shortTermImpacts.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-300">Long-Term (12-72h)</h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-1">
                            {forecast?.longTermImpacts.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-300 border-t border-gray-700 pt-3 mt-3">Community Lifelines</h4>
                        <div className="space-y-2 mt-2 text-sm">
                        {forecast?.communityLifelines.map((item, i) => (
                            <div key={i} className="bg-gray-700/50 p-2 rounded">
                                <p className="font-bold text-cyan-400">{item.lifeline}: <span className="font-normal text-gray-300">{item.impact}</span></p>
                                <p className="text-gray-400"><span className="font-semibold">Mitigation:</span> {item.mitigation}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Team Briefing */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-4">
                    <h3 className="text-xl font-bold text-green-400 flex items-center gap-2"><UsersIcon className="w-6 h-6" />Team Briefing</h3>
                     <div>
                        <h4 className="font-semibold text-gray-300">Mission Statement</h4>
                        <p className="text-gray-400 text-sm mt-1">{briefing?.missionStatement}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-300">Key Objectives</h4>
                        <ul className="list-decimal list-inside text-gray-400 text-sm space-y-1 mt-1">
                             {briefing?.keyObjectives.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300">Known Risks</h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-1">
                             {briefing?.knownRisks.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300">Communications Plan</h4>
                        <p className="text-gray-400 text-sm mt-1">{briefing?.commsPlan}</p>
                    </div>
                </div>

                {/* Training Scenario */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-4">
                    <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2"><ClipboardIcon className="w-6 h-6" />Training Scenario</h3>
                     <div>
                        <h4 className="font-semibold text-gray-300">{scenario?.scenarioTitle}</h4>
                         <p className="text-gray-400 text-sm mt-2">{scenario?.initialBriefing}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-300">Learning Objectives</h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-1">
                             {scenario?.learningObjectives.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 border-t border-gray-700 pt-3 mt-3">Timeline Injects</h4>
                        <div className="space-y-2 mt-2 text-sm">
                         {scenario?.timelineInjects.map((item, i) => (
                             <div key={i} className="bg-gray-700/50 p-2 rounded">
                                <p className="font-bold text-purple-300">{item.time}: <span className="font-normal text-gray-300">{item.event}</span></p>
                                <p className="text-gray-400"><span className="font-semibold">Expected Action:</span> {item.expectedAction}</p>
                            </div>
                         ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsHub;
