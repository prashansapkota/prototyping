import React, { useEffect, useRef } from 'react';

interface LogPanelProps {
  logs: string[];
}

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="ui-panel flex-1">
      <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
        📊 TACTICAL LOG
      </h3>
      <div
        ref={logRef}
        className="text-xs text-gray-700 h-32 overflow-y-auto bg-gray-50 border border-gray-200 p-2 rounded-md font-mono"
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default LogPanel;
