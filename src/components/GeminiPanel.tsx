import React, { useState } from 'react';
import { callGeminiAPI } from '../services/geminiAPI';
import { LastEvent } from '../types/qkd';
import { Sparkles } from 'lucide-react';

interface GeminiPanelProps {
  lastEvent: LastEvent | null;
  disabled: boolean;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ lastEvent, disabled }) => {
  const [output, setOutput] = useState<string>('Click below for analysis.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!lastEvent || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setOutput('Analyzing...');
    
    const prompt = `
      As a quantum security expert, briefly explain the last event in a vehicle-to-vehicle QKD simulation.
      Event Type: ${lastEvent.type}
      Details: ${lastEvent.details}
      Explain its significance for establishing a secure key. If an eavesdropper was detected, explain how.
    `;
    
    const result = await callGeminiAPI(prompt);
    setOutput(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="ui-panel flex-1">
      <h3 className="text-lg font-semibold text-indigo-600 mb-2 flex items-center gap-2">
        <Sparkles size={16} className="text-purple-500" />
        INTEL ANALYSIS
      </h3>
      <div className="text-xs text-gray-700 h-24 overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-2 rounded-md mb-2">
        {output}
      </div>
      <button
        onClick={handleAnalyze}
        disabled={disabled || !lastEvent || isAnalyzing}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-purple-300 disabled:to-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={14} className="animate-pulse" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={14} />
            ANALYZE OPERATION
          </span>
        )}
      </button>
    </div>
  );
};

export default GeminiPanel;
