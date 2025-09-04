import { useState, useEffect, useCallback } from 'react';
import { useQKDSimulation } from './hooks/useQKDSimulation';
import { useThreeScene } from './hooks/useThreeScene';
import ControlPanel from './components/ControlPanel';
import LogPanel from './components/LogPanel';
import KeyStatusPanel from './components/KeyStatusPanel';
import GeminiPanel from './components/GeminiPanel';

function App() {
  const [eveActive, setEveActive] = useState(false);
  const { state, logs, runQKD, runUnsafeComms, renewKeys, triggerAutoRenewal, reset } = useQKDSimulation();
  
  const { mountRef, updateLaser, updateDrone, setIntersectionCallback } = useThreeScene();
  
  // Create auto-renewal callback after we have updateLaser
  const handleBeamIntersection = useCallback(() => {
    console.log('App: Beam intersection callback triggered!');
    triggerAutoRenewal(updateLaser);
  }, [triggerAutoRenewal, updateLaser]);

  // Set the intersection callback when it changes
  useEffect(() => {
    setIntersectionCallback(handleBeamIntersection);
  }, [handleBeamIntersection, setIntersectionCallback]);

  const handleStartQKD = () => {
    runQKD(eveActive, updateLaser);
  };

  const handleStartUnsafe = () => {
    runUnsafeComms(eveActive, updateLaser);
  };

  const handleRenewKeys = () => {
    renewKeys(eveActive, updateLaser);
  };

  const handleReset = () => {
    reset();
    updateLaser(false);
    updateDrone(false);
  };

  // Control drone visibility based on Eve toggle
  useEffect(() => {
    updateDrone(eveActive);
  }, [eveActive, updateDrone]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {/* Three.js Scene */}
        <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />
        
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="p-4 flex flex-col justify-between h-full">
            {/* Top Left: Controls */}
            <div className="self-start">
              <ControlPanel
                eveActive={eveActive}
                isSimulating={state.isSimulating}
                isConnected={state.isConnected}
                onEveToggle={setEveActive}
                onStartQKD={handleStartQKD}
                onStartUnsafe={handleStartUnsafe}
                onRenewKeys={handleRenewKeys}
                onReset={handleReset}
              />
            </div>

            {/* Bottom Panels */}
            <div className="flex flex-col lg:flex-row gap-4 self-end w-full">
              <LogPanel logs={logs} />
              <KeyStatusPanel state={state} />
              <GeminiPanel 
                lastEvent={state.lastEvent} 
                disabled={state.isSimulating || !state.lastEvent} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
