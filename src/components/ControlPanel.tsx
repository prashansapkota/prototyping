import React from 'react';

interface ControlPanelProps {
  eveActive: boolean;
  isSimulating: boolean;
  isConnected: boolean;
  onEveToggle: (active: boolean) => void;
  onStartQKD: () => void;
  onStartUnsafe: () => void;
  onRenewKeys: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  eveActive,
  isSimulating,
  isConnected,
  onEveToggle,
  onStartQKD,
  onStartUnsafe,
  onRenewKeys,
  onReset
}) => {
  return (
    <div className="ui-panel w-72">
      <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        🎯 TACTICAL QKD CONTROL
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="eve-toggle" className="font-medium">⚠️ Hostile Intercept:</label>
          <div className="flex items-center">
            <span className="mr-2 text-red-400 text-sm">Off</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="eve-toggle"
                className="sr-only peer"
                checked={eveActive}
                onChange={(e) => onEveToggle(e.target.checked)}
                disabled={isSimulating}
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
            <span className="ml-2 text-green-400 text-sm">On</span>
          </div>
        </div>
        <button
          onClick={onStartQKD}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none mb-2"
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              QKD Active...
            </span>
          ) : (
            '🛡️ SECURE QKD COMMUNICATION'
          )}
        </button>
        <button
          onClick={onStartUnsafe}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-orange-300 disabled:to-red-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none mb-2"
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Unsafe Active...
            </span>
          ) : (
            '⚠️ UNSAFE COMMUNICATION'
          )}
        </button>
        {isConnected && (
          <button
            onClick={onRenewKeys}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none mb-2"
          >
            {isSimulating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Renewing...
              </span>
            ) : (
              'RENEW SECURE KEYS'
            )}
          </button>
        )}
        <button
          onClick={onReset}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          RESET MISSION
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
