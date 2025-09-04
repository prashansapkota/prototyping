export interface PhotonData {
  bit: number;
  basis: '+' | 'x';
  originalBit: number;
  originalBasis: '+' | 'x';
  basisMatch?: boolean;
}

export interface ComparisonResult {
  match: boolean;
}

export interface LastEvent {
  type: 'send_photons' | 'sifting' | 'eavesdropper_detected' | 'secure_key';
  details: string;
}

export interface SimulationState {
  aliceData: PhotonData[];
  bobData: PhotonData[];
  isSimulating: boolean;
  siftedAlice: PhotonData[];
  siftedBob: PhotonData[];
  comparisonResults: ComparisonResult[];
  errorRate: number;
  isSecure: boolean;
  lastEvent: LastEvent | null;
  isConnected: boolean;
  keyRenewalCount: number;
  connectionPhase: 'idle' | 'establishing' | 'monitoring' | 'renewing';
}
