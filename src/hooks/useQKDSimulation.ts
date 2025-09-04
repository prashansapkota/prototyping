import { useState, useCallback } from 'react';
import { PhotonData, ComparisonResult, SimulationState } from '../types/qkd';

const PHOTON_COUNT = 40;

export const useQKDSimulation = () => {
  const [state, setState] = useState<SimulationState>({
    aliceData: [],
    bobData: [],
    isSimulating: false,
    siftedAlice: [],
    siftedBob: [],
    comparisonResults: [],
    errorRate: 0,
    isSecure: false,
    lastEvent: null,
    isConnected: false,
    keyRenewalCount: 0,
    connectionPhase: 'idle'
  });

  const [logs, setLogs] = useState<string[]>([]);

  const log = useCallback((message: string) => {
    setLogs(prev => [...prev, `> ${message}`]);
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [monitoringInterval, setMonitoringInterval] = useState<number | null>(null);

  // Remove unused reset function since we use resetWithCleanup

  const runSingleQKDRound = useCallback(async (eveIsActive: boolean, withQKDProtection: boolean, isRenewal: boolean = false) => {
    const renewalText = isRenewal ? " [KEY RENEWAL]" : "";
    const protectionMode = withQKDProtection ? "QKD PROTECTED" : "UNPROTECTED";
    log(`🎯 INITIATING ${protectionMode} PROTOCOL${renewalText}...`);
    
    // 1. Send Photons
    log('📡 TANK Alpha transmitting quantum photons...');
    const aliceData: PhotonData[] = [];
    const bobData: PhotonData[] = [];
    
    if (eveIsActive) log('🚨 WARNING: HOSTILE DRONE INTERCEPTING CHANNEL!');
    
    for (let i = 0; i < PHOTON_COUNT; i++) {
      const bit = Math.round(Math.random());
      const basis: '+' | 'x' = Math.random() < 0.5 ? '+' : 'x';
      aliceData.push({ bit, basis, originalBit: bit, originalBasis: basis });
      
      let photonData = { ...aliceData[i] };
      
      // Eve's interference
      if (eveIsActive && Math.random() < 0.7) { // Higher interference rate
        const eveBasis: '+' | 'x' = Math.random() < 0.5 ? '+' : 'x';
        if (photonData.basis !== eveBasis) {
          photonData.bit = Math.round(Math.random());
        }
      }
      
      const bobBasis: '+' | 'x' = Math.random() < 0.5 ? '+' : 'x';
      let measuredBit = photonData.bit;
      if (photonData.basis !== bobBasis) {
        measuredBit = Math.round(Math.random());
      }
      bobData.push({ bit: measuredBit, basis: bobBasis, originalBit: photonData.bit, originalBasis: bobBasis });
      
      await sleep(20);
    }
    
    log('✅ APC Bravo received all transmissions.');

    // 2. Sift Keys
    await sleep(200);
    log('🔄 Units coordinating basis verification...');
    
    aliceData.forEach((d, i) => {
      d.basisMatch = d.originalBasis === bobData[i].originalBasis;
    });
    bobData.forEach((d, i) => {
      d.basisMatch = d.originalBasis === aliceData[i].originalBasis;
    });
    
    const siftedAlice = aliceData.filter(d => d.basisMatch);
    const siftedBob = bobData.filter(d => d.basisMatch);
    
    log(`🔐 Key sifting complete. ${siftedAlice.length} bits retained.`);

    // 3. Security Verification
    await sleep(200);
    log('🔍 Executing security verification...');
    
    let errors = 0;
    const comparisonResults: ComparisonResult[] = [];
    
    if (withQKDProtection) {
      // With QKD: Detect interference but maintain secure keys through error correction
      siftedAlice.forEach((d, i) => {
        const rawMatch = d.originalBit === siftedBob[i].bit;
        if (!rawMatch) errors++;
        // QKD error correction ensures all keys end up secure (green)
        comparisonResults.push({ match: true }); // All keys secure with QKD!
      });
      
      const errorRate = siftedAlice.length > 0 ? (errors / siftedAlice.length) * 100 : 0;
      log(`📊 Raw interference detected: ${errorRate.toFixed(1)}%`);
      
      if (eveIsActive && errorRate > 5) {
        log('🛡️ QKD error correction activated - All keys secured!');
        log('✅ Interference detected and compensated automatically!');
      }
      
      return {
        aliceData,
        bobData,
        siftedAlice,
        siftedBob,
        comparisonResults,
        errorRate: 0, // QKD corrects all errors
        isSecure: true // Always secure with QKD
      };
    } else {
      // Without QKD: Show the raw damage from Eve's interference
      siftedAlice.forEach((d, i) => {
        const match = d.originalBit === siftedBob[i].bit;
        if (!match) errors++;
        comparisonResults.push({ match }); // Show actual errors
      });
      
      const errorRate = siftedAlice.length > 0 ? (errors / siftedAlice.length) * 100 : 0;
      log(`📊 Communication compromised: ${errorRate.toFixed(1)}% corruption!`);
      
      return {
        aliceData,
        bobData,
        siftedAlice,
        siftedBob,
        comparisonResults,
        errorRate,
        isSecure: errorRate <= 10
      };
    }
  }, [log]);

  const runAdaptiveQKD = useCallback(async (eveIsActive: boolean, onLaserUpdate: (visible: boolean, color?: string) => void) => {
    if (state.isSimulating) return;
    
    setState(prev => ({ ...prev, isSimulating: true, connectionPhase: 'establishing' }));
    onLaserUpdate(true);
    
    // Initial key establishment WITH QKD protection
    const qkdRound = await runSingleQKDRound(eveIsActive, true, false);
    
    setState(prev => ({
      ...prev,
      ...qkdRound,
      isConnected: true,
      connectionPhase: 'monitoring',
      keyRenewalCount: 0,
      isSimulating: false
    }));

    log("✅ QKD PROTECTION ACTIVE - Secure channel established!");
    if (eveIsActive) {
      log("🛡️ Drone interference detected and neutralized by QKD!");
      log("🟢 ALL KEYS REMAIN SECURE despite hostile intercept!");
      log("👁️ Auto-renewal will trigger when red beam intersects green beam...");
    } else {
      log("🔒 Secure communication established - Ready for operations!");
      setState(prev => ({ ...prev, connectionPhase: 'idle' }));
    }
    
    onLaserUpdate(true, '#06b6d4');
    
  }, [state.isSimulating, runSingleQKDRound, log]);

  const runUnsafeComms = useCallback(async (eveIsActive: boolean, onLaserUpdate: (visible: boolean, color?: string) => void) => {
    if (state.isSimulating) return;
    
    setState(prev => ({ ...prev, isSimulating: true, connectionPhase: 'establishing' }));
    onLaserUpdate(true, '#ff6600'); // Orange for unsafe
    
    log("⚠️ ESTABLISHING UNPROTECTED COMMUNICATION...");
    log("🚨 WARNING: NO QUANTUM PROTECTION ACTIVE!");
    
    // Run communication WITHOUT QKD protection
    const unsafeRound = await runSingleQKDRound(eveIsActive, false, false);
    
    setState(prev => ({
      ...prev,
      ...unsafeRound,
      isConnected: true,
      connectionPhase: 'idle',
      keyRenewalCount: 0,
      isSimulating: false // Allow immediate new clicks
    }));

    if (eveIsActive) {
      log("🚨 DRONE SUCCESSFULLY INTERCEPTED COMMUNICATIONS!");
      log("🔴 Many keys corrupted - Communication compromised!");
      log("❌ No protection against eavesdropping!");
      log("🔄 Try QKD protection to secure communications!");
    } else {
      log("✅ Communication established (but vulnerable)");
      log("⚠️ No protection if attacker appears!");
      log("💡 Consider using QKD protection for security!");
    }
    
    onLaserUpdate(true, '#ff6600');
    
  }, [state.isSimulating, runSingleQKDRound, log]);

  const renewKeys = useCallback(async (eveIsActive: boolean, onLaserUpdate: (visible: boolean, color?: string) => void) => {
    if (state.isSimulating || !state.isConnected) return;
    
    setState(prev => ({ ...prev, isSimulating: true, connectionPhase: 'renewing' }));
    
    log("🔄 MANUAL KEY RENEWAL INITIATED...");
    
    // Generate new secure keys
    const renewalRound = await runSingleQKDRound(eveIsActive, true, true);
    
    setState(prev => ({
      ...prev,
      ...renewalRound,
      keyRenewalCount: prev.keyRenewalCount + 1,
      connectionPhase: 'idle',
      isSimulating: false
    }));
    
    log(`✅ KEY RENEWAL #${state.keyRenewalCount + 1} COMPLETE!`);
    log("🟢 All keys remain secure - QKD protection maintained!");
    
    // Flash green to show renewal
    onLaserUpdate(true, '#00ff00');
    await sleep(300);
    onLaserUpdate(true, '#06b6d4');
    
  }, [state.isSimulating, state.isConnected, state.keyRenewalCount, runSingleQKDRound, log]);

  const triggerAutoRenewal = useCallback(async (onLaserUpdate: (visible: boolean, color?: string) => void) => {
    // Only trigger if QKD is connected and not already simulating
    if (!state.isConnected || state.isSimulating || state.connectionPhase === 'idle') {
      return;
    }

    const currentRenewalCount = state.keyRenewalCount + 1;
    log(`⚠️ BEAM INTERSECTION DETECTED! Auto-renewing keys...`);
    
    setState(prev => ({ ...prev, isSimulating: true, connectionPhase: 'renewing' }));
    
    // Quick key renewal
    const renewalRound = await runSingleQKDRound(true, true, true);
    
    setState(prev => ({
      ...prev,
      ...renewalRound,
      keyRenewalCount: currentRenewalCount,
      connectionPhase: 'monitoring',
      isSimulating: false
    }));
    
    log(`✅ AUTO-RENEWAL #${currentRenewalCount} COMPLETE - Keys refreshed!`);
    log("🟢 All keys remain secure - QKD adapted to interference!");
    
    // Quick green flash for auto-renewal
    onLaserUpdate(true, '#00ff00');
    await sleep(200);
    onLaserUpdate(true, '#06b6d4');
    
  }, [state.isConnected, state.isSimulating, state.connectionPhase, state.keyRenewalCount, runSingleQKDRound, log]);

  const stopMonitoring = useCallback(() => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  }, [monitoringInterval]);

  // Clean up monitoring on reset
  const resetWithCleanup = useCallback(() => {
    stopMonitoring();
    setState({
      aliceData: [],
      bobData: [],
      isSimulating: false,
      siftedAlice: [],
      siftedBob: [],
      comparisonResults: [],
      errorRate: 0,
      isSecure: false,
      lastEvent: null,
      isConnected: false,
      keyRenewalCount: 0,
      connectionPhase: 'idle'
    });
    setLogs([]);
    log('🎯 TACTICAL SYSTEMS READY - Awaiting orders.');
  }, [stopMonitoring, log]);

  return {
    state,
    logs,
    runQKD: runAdaptiveQKD,
    runUnsafeComms,
    renewKeys,
    triggerAutoRenewal,
    reset: resetWithCleanup
  };
};
