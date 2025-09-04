import React from 'react';
import KeyDisplay from './KeyDisplay';
import { SimulationState } from '../types/qkd';

interface KeyStatusPanelProps {
  state: SimulationState;
}

const KeyStatusPanel: React.FC<KeyStatusPanelProps> = ({ state }) => {
  const getConnectionStatus = () => {
    if (!state.isConnected && state.connectionPhase === 'idle') {
      return (
        <div className="text-center font-bold text-lg text-gray-400 mb-2">
          📡 AWAITING CONNECTION
        </div>
      );
    }
    
    if (state.connectionPhase === 'establishing') {
      return (
        <div className="text-center font-bold text-lg text-blue-400 mb-2">
          🔄 ESTABLISHING SECURE LINK
        </div>
      );
    }
    
    if (state.isConnected) {
      const phaseText = {
        monitoring: '👁️ MONITORING CHANNEL',
        renewing: '🔄 RENEWING KEYS',
        idle: '✅ SECURE COMMS ACTIVE'
      }[state.connectionPhase] || '✅ SECURE COMMS ACTIVE';
      
      return (
        <div className="text-center mb-2">
          <div className="font-bold text-lg text-green-400">
            {phaseText}
          </div>
          {state.keyRenewalCount > 0 && (
            <div className="text-sm text-yellow-400 mt-1">
              🔄 Key Renewals: {state.keyRenewalCount}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="ui-panel flex-1">
      <h3 className="text-lg font-semibold text-purple-600 mb-2 flex items-center gap-2">
        🔐 ENCRYPTION STATUS
      </h3>
      <div className="h-16 mb-2">
        {getConnectionStatus()}
      </div>
      <div className="text-xs space-y-2">
        {state.siftedAlice.length > 0 && (
          <>
            <KeyDisplay
              data={state.siftedAlice.map(d => ({ ...d, bit: d.originalBit }))}
              comparisonResults={state.comparisonResults}
              title="TANK Alpha Key"
            />
            <KeyDisplay
              data={state.siftedBob}
              comparisonResults={state.comparisonResults}
              title="APC Bravo Key"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default KeyStatusPanel;
