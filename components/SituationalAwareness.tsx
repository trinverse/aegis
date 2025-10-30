import React, { useState } from 'react';
import type { View } from '../App';
import type { AnalysisResult, IncidentDetails } from '../types';
import { getIncidentAnalysis } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const incidentTypes = ['Natural Disaster', 'Technological Accident', 'Terrorism', 'Public Health Emergency', 'Other'];
const severityLevels = ['Low', 'Moderate', 'High', 'Severe', 'Catastrophic'];

interface SituationalAwarenessProps {
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setIncidentDetails: (details: IncidentDetails | null) => void;
    setCurrentView: (view: View) => void;
}

const SituationalAwareness: React.FC<SituationalAwarenessProps> = ({ setAnalysisResult, setIncidentDetails, setCurrentView }) => {
    const [incidentType, setIncidentType] = useState<string>(incidentTypes[0]);
    const [location, setLocation] = useState<string>('');
    const [severity, setSeverity] = useState<string>(severityLevels[2]);
    const [description, setDescription] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !description) {
            setError('Location and Description are required.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setAnalysisResult(null);
        setIncidentDetails(null);

        try {
            const details: IncidentDetails = { incidentType, location, severity, description };
            const result = await getIncidentAnalysis(details);
            setAnalysis(result);
            setAnalysisResult(result);
            setIncidentDetails(details);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold text-blue-400 mb-6">Incident Report</h2>
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-2xl">
                    <div>
                        <label htmlFor="incidentType" className="block text-sm font-medium text-gray-300">Incident Type</label>
                        <select id="incidentType" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white p-2">
                            {incidentTypes.map(type => <option key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white p-2" placeholder="e.g., Downtown Metro Area, Sector 7G" />
                    </div>
                    <div>
                        <label htmlFor="severity" className="block text-sm font-medium text-gray-300">Severity Level</label>
                        <select id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white p-2">
                            {severityLevels.map(level => <option key={level}>{level}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white p-2" placeholder="Provide a detailed description of the situation..."></textarea>
                    </div>
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                Generate AI Analysis
                            </>
                        )}
                    </button>
                </form>
            </div>
            <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold text-blue-400 mb-6">AI-Powered Analysis</h2>
                <div className="bg-gray-800 p-8 rounded-lg shadow-2xl min-h-[400px]">
                    {isLoading && <div className="flex justify-center items-center h-full text-gray-400">Processing incident data...</div>}
                    {analysis && (
                        <div className="space-y-6 animate-fade-in">
                             <div className="p-4 bg-gray-900/50 border border-blue-700 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-blue-300">Analysis Complete</h3>
                                <p className="text-blue-400 mt-1 text-sm">Advanced operational tools are now available for this incident.</p>
                                <button 
                                    onClick={() => setCurrentView('operations')}
                                    className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white transition-colors shadow-lg"
                                >
                                    Go to Operations Hub
                                </button>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-400 border-b border-gray-600 pb-2 mb-2">Summary</h3>
                                <p className="text-gray-300">{analysis.summary}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-400 border-b border-gray-600 pb-2 mb-2">Recommended Actions</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {analysis.recommendedActions.map((action, i) => <li key={i}>{action}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-400 border-b border-gray-600 pb-2 mb-2">Potential Risks</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {analysis.potentialRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-cyan-400 border-b border-gray-600 pb-2 mb-2">Resource Suggestions</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {analysis.resourceSuggestions.map((resource, i) => <li key={i}>{resource}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                    {!isLoading && !analysis && (
                         <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center">
                            <SparklesIcon className="w-16 h-16 mb-4 text-gray-600"/>
                            <p className="text-lg">Analysis will appear here.</p>
                            <p>Fill out the incident report to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SituationalAwareness;