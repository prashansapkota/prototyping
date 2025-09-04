import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const useThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const frameRef = useRef<number | null>(null);
  
  // Store vehicle references for animation
  const vehicleRefs = useRef<{
    vehicle1: THREE.Group | null;
    vehicle2: THREE.Group | null;
  }>({ vehicle1: null, vehicle2: null });
  
  const [laser, setLaser] = useState<THREE.Line | null>(null);
  const [hostileDrone, setHostileDrone] = useState<THREE.Group | null>(null);
  const lastIntersectionTime = useRef<number>(0);
  const intersectionCallbackRef = useRef<(() => void) | null>(null);

  const createMilitaryVehicle = (type: 'tank' | 'apc', color: number): THREE.Group => {
    const vehicle = new THREE.Group();

    if (type === 'tank') {
      // Tank Hull
      const hullGeo = new THREE.BoxGeometry(3.5, 1.2, 6);
      const hullMat = new THREE.MeshStandardMaterial({ 
        color, 
        metalness: 0.8, 
        roughness: 0.3,
        envMapIntensity: 0.5 
      });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.position.y = 0.8;
      hull.castShadow = true;
      vehicle.add(hull);

      // Tank Turret
      const turretGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16);
      const turretMat = new THREE.MeshStandardMaterial({ 
        color: color * 0.8, 
        metalness: 0.9, 
        roughness: 0.2 
      });
      const turret = new THREE.Mesh(turretGeo, turretMat);
      turret.position.y = 2;
      turret.castShadow = true;
      vehicle.add(turret);

      // Tank Cannon
      const cannonGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 8);
      const cannonMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
      const cannon = new THREE.Mesh(cannonGeo, cannonMat);
      cannon.position.set(0, 2.2, 2);
      cannon.rotation.z = Math.PI / 2;
      cannon.castShadow = true;
      vehicle.add(cannon);

      // Quantum Communication Array (realistic antenna)
      const arrayGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
      const arrayMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x002233 });
      const array = new THREE.Mesh(arrayGeo, arrayMat);
      array.position.set(0, 3.5, -1);
      array.castShadow = true;
      vehicle.add(array);

      // Tank Tracks
      for (let side = -1; side <= 1; side += 2) {
        const trackGeo = new THREE.BoxGeometry(0.6, 0.8, 5.5);
        const trackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
        const track = new THREE.Mesh(trackGeo, trackMat);
        track.position.set(side * 1.8, 0.4, 0);
        track.castShadow = true;
        vehicle.add(track);

        // Track wheels
        for (let i = -2; i <= 2; i++) {
          const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 12);
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.position.set(side * 1.8, 0.4, i * 1.2);
          wheel.rotation.z = Math.PI / 2;
          wheel.castShadow = true;
          vehicle.add(wheel);
        }
      }
    } else {
      // APC (Armored Personnel Carrier)
      const bodyGeo = new THREE.BoxGeometry(2.8, 1.8, 5.5);
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color, 
        metalness: 0.7, 
        roughness: 0.4 
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.2;
      body.castShadow = true;
      vehicle.add(body);

      // APC Turret
      const turretGeo = new THREE.BoxGeometry(1.5, 0.8, 1.5);
      const turretMat = new THREE.MeshStandardMaterial({ 
        color: color * 0.9, 
        metalness: 0.8, 
        roughness: 0.3 
      });
      const turret = new THREE.Mesh(turretGeo, turretMat);
      turret.position.y = 2.4;
      turret.position.z = 1;
      turret.castShadow = true;
      vehicle.add(turret);

      // Quantum Communication Dish
      const dishGeo = new THREE.SphereGeometry(0.8, 16, 8);
      const dishMat = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x001122,
        metalness: 0.9 
      });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.set(0, 3, -1.5);
      dish.scale.y = 0.3;
      dish.castShadow = true;
      vehicle.add(dish);

      // APC Wheels
      const wheelPositions = [
        { x: 1.6, y: 0.5, z: 2 },    // Front right
        { x: -1.6, y: 0.5, z: 2 },   // Front left
        { x: 1.6, y: 0.5, z: 0 },    // Middle right
        { x: -1.6, y: 0.5, z: 0 },   // Middle left
        { x: 1.6, y: 0.5, z: -2 },   // Rear right
        { x: -1.6, y: 0.5, z: -2 }   // Rear left
      ];

      wheelPositions.forEach(pos => {
        const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 12);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        vehicle.add(wheel);
      });
    }

    return vehicle;
  };

  const createHostileDrone = (): THREE.Group => {
    const drone = new THREE.Group();

    // Main drone body
    const bodyGeo = new THREE.BoxGeometry(1.5, 0.4, 1.5);
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x2c2c2c, 
      metalness: 0.8, 
      roughness: 0.2 
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    drone.add(body);

    // Drone arms (4 arms for quadcopter design)
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
    const armMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      metalness: 0.9, 
      roughness: 0.1 
    });

    const armPositions = [
      { x: 0.8, z: 0.8, rotation: Math.PI / 4 },
      { x: -0.8, z: 0.8, rotation: -Math.PI / 4 },
      { x: 0.8, z: -0.8, rotation: -Math.PI / 4 },
      { x: -0.8, z: -0.8, rotation: Math.PI / 4 }
    ];

    const rotors: THREE.Mesh[] = [];
    armPositions.forEach((pos) => {
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(pos.x, 0, pos.z);
      arm.rotation.y = pos.rotation;
      arm.castShadow = true;
      drone.add(arm);

      // Rotor at end of each arm
      const rotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 3);
      const rotorMat = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        transparent: true, 
        opacity: 0.7 
      });
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.position.set(pos.x * 1.4, 0.3, pos.z * 1.4);
      rotor.castShadow = true;
      drone.add(rotor);
      rotors.push(rotor);
    });

    // Store rotors for animation
    (drone as any).rotors = rotors;

    // Hostile antenna array for intercepting signals
    const antennaGeo = new THREE.ConeGeometry(0.1, 0.5, 8);
    const antennaMat = new THREE.MeshStandardMaterial({ 
      color: 0xff0000, 
      emissive: 0x330000 
    });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 0.5, 0);
    antenna.castShadow = true;
    drone.add(antenna);

    // Warning lights
    const lightGeo = new THREE.SphereGeometry(0.05, 8, 6);
    const lightMat = new THREE.MeshStandardMaterial({ 
      color: 0xff0000, 
      emissive: 0xff0000 
    });
    const light1 = new THREE.Mesh(lightGeo, lightMat);
    light1.position.set(0.3, 0.1, 0.3);
    drone.add(light1);
    
    const light2 = new THREE.Mesh(lightGeo, lightMat);
    light2.position.set(-0.3, 0.1, -0.3);
    drone.add(light2);

    // Store lights for blinking animation
    (drone as any).warningLights = [light1, light2];

    // Camera/sensor gimbal
    const gimbalGeo = new THREE.SphereGeometry(0.2, 16, 8);
    const gimbalMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      metalness: 0.9 
    });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.set(0, -0.3, 0);
    gimbal.castShadow = true;
    drone.add(gimbal);

    return drone;
  };

  const updateLaser = (visible: boolean, color?: string) => {
    if (laser) {
      laser.visible = visible;
      if (color && laser.material instanceof THREE.LineBasicMaterial) {
        laser.material.color.set(color);
      }
    }
  };

  const updateDrone = (visible: boolean) => {
    if (hostileDrone) {
      hostileDrone.visible = visible;
    }
  };

  const setIntersectionCallback = (callback: (() => void) | null) => {
    intersectionCallbackRef.current = callback;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup - Battlefield atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8B7D6B); // Dusty/sandy battlefield color
    scene.fog = new THREE.Fog(0x8B7D6B, 30, 200); // Dense fog for battlefield realism

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    // Renderer setup with shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Clock
    const clock = new THREE.Clock();

    // Dramatic battlefield lighting
    const ambientLight = new THREE.AmbientLight(0x604020, 0.6); // Warm, dusty ambient
    scene.add(ambientLight);
    
    // Main sun light with dramatic shadows
    const sunLight = new THREE.DirectionalLight(0xFFE4B5, 2.0);
    sunLight.position.set(20, 40, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);
    
    // Secondary rim lighting for dramatic effect
    const rimLight = new THREE.DirectionalLight(0xFF8C00, 1.2);
    rimLight.position.set(-15, 25, -10);
    scene.add(rimLight);

    // Battlefield Terrain
    const terrainGeometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    const terrainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B7355, // Sandy/dusty color
      roughness: 0.9,
      metalness: 0.1 
    });
    
    // Add noise to terrain for realism
    const positions = terrainGeometry.attributes.position.array as Float32Array;
    for (let i = 2; i < positions.length; i += 3) {
      positions[i] = Math.random() * 2 - 1; // Random height variation
    }
    terrainGeometry.attributes.position.needsUpdate = true;
    terrainGeometry.computeVertexNormals();
    
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Patrol Route - Dirt path
    const pathGeometry = new THREE.PlaneGeometry(8, 200);
    const pathMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6B5B47,
      roughness: 0.95 
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.y = -0.5;
    path.receiveShadow = true;
    scene.add(path);

    // Create battlefield obstacles and cover
    const createObstacle = (x: number, z: number, type: 'rock' | 'debris' | 'bunker') => {
      if (type === 'rock') {
        const rockGeo = new THREE.DodecahedronGeometry(Math.random() * 2 + 1);
        const rockMat = new THREE.MeshStandardMaterial({ 
          color: 0x696969, 
          roughness: 0.9,
          metalness: 0.1 
        });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(x, 0, z);
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
      } else if (type === 'debris') {
        const debrisGeo = new THREE.BoxGeometry(
          Math.random() * 2 + 0.5,
          Math.random() * 1 + 0.5,
          Math.random() * 2 + 0.5
        );
        const debrisMat = new THREE.MeshStandardMaterial({ 
          color: 0x4A4A4A, 
          roughness: 0.8,
          metalness: 0.3 
        });
        const debris = new THREE.Mesh(debrisGeo, debrisMat);
        debris.position.set(x, 0.5, z);
        debris.rotation.y = Math.random() * Math.PI;
        debris.castShadow = true;
        debris.receiveShadow = true;
        scene.add(debris);
      } else if (type === 'bunker') {
        const bunkerGeo = new THREE.BoxGeometry(4, 2, 3);
        const bunkerMat = new THREE.MeshStandardMaterial({ 
          color: 0x5D4E37, 
          roughness: 0.9 
        });
        const bunker = new THREE.Mesh(bunkerGeo, bunkerMat);
        bunker.position.set(x, 1, z);
        bunker.castShadow = true;
        bunker.receiveShadow = true;
        scene.add(bunker);
      }
    };

    // Add battlefield obstacles
    for (let i = -60; i < 60; i += 15) {
      if (Math.abs(i) > 10) { // Keep path clear
        if (Math.random() > 0.5) createObstacle(-20 + Math.random() * 10, i, 'rock');
        if (Math.random() > 0.6) createObstacle(20 + Math.random() * 10, i, 'debris');
        if (Math.random() > 0.8) createObstacle(-30 + Math.random() * 60, i + 5, 'bunker');
      }
    }

    // Military Vehicles - Tank and APC
    const vehicle1 = createMilitaryVehicle('tank', 0x4A5D23); // Olive green tank
    const vehicle2 = createMilitaryVehicle('apc', 0x2F4F2F); // Dark green APC
    
    vehicle1.position.set(-4, 0, -15);
    vehicle2.position.set(4, 0, -25);
    
    // Enable shadows for vehicles
    vehicle1.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    vehicle2.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(vehicle1);
    scene.add(vehicle2);

    // Advanced Quantum Communication Beam
    const createQuantumBeam = () => {
      const beamGroup = new THREE.Group();
      
      // Main quantum beam
      const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
      const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.8,
        emissive: 0x004444,
        metalness: 0.1,
        roughness: 0.1
      });
      
      // Create multiple beam segments for animation
      for (let i = 0; i < 20; i++) {
        const segment = new THREE.Mesh(beamGeometry, beamMaterial.clone());
        segment.position.z = i * 0.5;
        beamGroup.add(segment);
      }
      
      // Particle effects around the beam
      const particleCount = 100;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = Math.random() * 10;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00FFFF,
        size: 0.1,
        transparent: true,
        opacity: 0.6
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      beamGroup.add(particles);
      
      return beamGroup;
    };

    const quantumBeam = createQuantumBeam();
    quantumBeam.visible = false;
    scene.add(quantumBeam);

    // Hostile Drone (initially hidden)
    const drone = createHostileDrone();
    drone.position.set(0, 8, 0); // Start high in the air
    drone.visible = false;
    scene.add(drone);
    setHostileDrone(drone);

    // Create hacking beam from drone (initially hidden)
    const createHackingBeam = () => {
      const hackingGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -5, 0)
      ]);
      const hackingMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
      });
      const hackingBeam = new THREE.Line(hackingGeometry, hackingMaterial);
      hackingBeam.visible = false;
      drone.add(hackingBeam);
      
      // Add hacking particles
      const hackParticleCount = 50;
      const hackParticleGeometry = new THREE.BufferGeometry();
      const hackPositions = new Float32Array(hackParticleCount * 3);
      
      for (let i = 0; i < hackParticleCount; i++) {
        hackPositions[i * 3] = (Math.random() - 0.5) * 0.5;
        hackPositions[i * 3 + 1] = -Math.random() * 5;
        hackPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
      
      hackParticleGeometry.setAttribute('position', new THREE.BufferAttribute(hackPositions, 3));
      const hackParticleMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.1,
        transparent: true,
        opacity: 0.8
      });
      
      const hackParticles = new THREE.Points(hackParticleGeometry, hackParticleMaterial);
      hackingBeam.add(hackParticles);
      
      return { hackingBeam, hackParticles };
    };

    const { hackingBeam, hackParticles } = createHackingBeam();
    (drone as any).hackingBeam = hackingBeam;
    (drone as any).hackParticles = hackParticles;

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    clockRef.current = clock;
    vehicleRefs.current = { vehicle1, vehicle2 };
    setLaser(quantumBeam as any); // Store quantum beam as laser for compatibility

    // Animation loop
    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Animate vehicles on patrol
      vehicle1.position.z += 3 * delta;
      vehicle2.position.z += 3 * delta;
      if (vehicle1.position.z > 60) vehicle1.position.z = -60;
      if (vehicle2.position.z > 60) vehicle2.position.z = -60;

      // Update quantum beam position and effects
      if (quantumBeam.visible) {
        // Position beam between vehicles
        const pos1 = new THREE.Vector3();
        const pos2 = new THREE.Vector3();
        vehicle1.getWorldPosition(pos1);
        vehicle2.getWorldPosition(pos2);
        
        // Position beam at vehicle1's communication array
        pos1.y += 3.5;
        pos2.y += 3;
        
        quantumBeam.position.copy(pos1);
        quantumBeam.lookAt(pos2);
        
        const distance = pos1.distanceTo(pos2);
        quantumBeam.scale.z = distance / 10;
        
        // Animate beam segments
        quantumBeam.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 0.5 + 0.3 * Math.sin(time * 5 + index * 0.5);
            child.rotation.z = time * 2 + index * 0.3;
          } else if (child instanceof THREE.Points) {
            // Animate particles
            const positions = child.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
              positions[i] += Math.sin(time * 3 + i) * 0.01;
              positions[i + 1] += Math.cos(time * 3 + i) * 0.01;
            }
            child.geometry.attributes.position.needsUpdate = true;
            child.rotation.z = time * 0.5;
          }
        });
      }

      // Animate hostile drone when visible
      if (drone.visible) {
        // Complex flight pattern - figure-8 around the vehicles
        const centerX = (vehicle1.position.x + vehicle2.position.x) / 2;
        const centerZ = (vehicle1.position.z + vehicle2.position.z) / 2;
        
        // Figure-8 pattern with varying height
        const radius = 12;
        const speed = 0.8;
        drone.position.x = centerX + radius * Math.sin(time * speed) * Math.cos(time * speed * 0.5);
        drone.position.z = centerZ + radius * Math.cos(time * speed);
        drone.position.y = 6 + 2 * Math.sin(time * 1.2); // Bobbing motion
        
        // Drone rotates to face direction of movement
        const lookDirection = new THREE.Vector3(
          Math.cos(time * speed) * Math.cos(time * speed * 0.5),
          0,
          -Math.sin(time * speed)
        );
        drone.lookAt(drone.position.clone().add(lookDirection));
        
        // Animate rotor blades (super fast spin)
        const rotors = (drone as any).rotors;
        if (rotors) {
          rotors.forEach((rotor: THREE.Mesh, index: number) => {
            rotor.rotation.y = time * 50 + index * Math.PI / 2; // Different phase for each rotor
          });
        }
        
        // Blinking warning lights
        const warningLights = (drone as any).warningLights;
        if (warningLights) {
          const blinkRate = Math.sin(time * 8) > 0;
          warningLights.forEach((light: THREE.Mesh) => {
            const material = light.material as THREE.MeshStandardMaterial;
            material.emissive.setHex(blinkRate ? 0xff0000 : 0x330000);
          });
        }
        
        // Drone tries to intercept communications
        const hackingBeam = (drone as any).hackingBeam;
        const hackParticles = (drone as any).hackParticles;
        
        if (quantumBeam.visible) {
          // Calculate optimal intercept position (midpoint of beam)
          const interceptPoint = new THREE.Vector3();
          interceptPoint.lerpVectors(
            new THREE.Vector3(vehicle1.position.x, vehicle1.position.y + 3.5, vehicle1.position.z),
            new THREE.Vector3(vehicle2.position.x, vehicle2.position.y + 3, vehicle2.position.z),
            0.5
          );
          
          // Drone actively tries to intercept but gets countered by QKD
          drone.position.lerp(interceptPoint.setY(8), 0.03);
          
          // Show hacking attempt - but with interference indicating QKD countermeasures
          if (hackingBeam) {
            hackingBeam.visible = true;
            // Flicker effect showing the beam being disrupted by QKD
            const interference = Math.sin(time * 15) * Math.sin(time * 8.5);
            hackingBeam.material.opacity = 0.3 + 0.3 * Math.abs(interference);
            
            // Change beam color to show it's being blocked/detected
            const isBlocked = interference > 0.5;
            hackingBeam.material.color.setHex(isBlocked ? 0xff0000 : 0x800000);
            
            // Detect beam intersection for auto-renewal
            const droneWorldPos = new THREE.Vector3();
            drone.getWorldPosition(droneWorldPos);
            
            const vehicle1Pos = new THREE.Vector3();
            const vehicle2Pos = new THREE.Vector3();
            vehicle1.getWorldPosition(vehicle1Pos);
            vehicle2.getWorldPosition(vehicle2Pos);
            
            // Quantum beam line from vehicle1 to vehicle2
            vehicle1Pos.y += 3.5; // Communication array height
            vehicle2Pos.y += 3;
            
            // Check if drone's hacking beam intersects the quantum communication line
            const beamDirection = new THREE.Vector3().subVectors(vehicle2Pos, vehicle1Pos).normalize();
            const vehicleToDrone = new THREE.Vector3().subVectors(droneWorldPos, vehicle1Pos);
            
            // Project drone position onto the quantum beam line
            const projectionLength = vehicleToDrone.dot(beamDirection);
            const closestPointOnBeam = new THREE.Vector3().copy(vehicle1Pos).add(beamDirection.clone().multiplyScalar(projectionLength));
            
            // Distance from drone to the quantum beam line
            const distanceToBeam = droneWorldPos.distanceTo(closestPointOnBeam);
            
            // If hacking beam is visible and close enough to quantum beam (intersection)
            const intersectionDistance = 5.0; // Increased threshold for easier intersection
            const intersectionDetected = hackingBeam.visible && distanceToBeam < intersectionDistance;
            
            // Debug logging to console
            if (hackingBeam.visible && time % 1 < 0.1) { // Log every second
              console.log(`Drone distance to beam: ${distanceToBeam.toFixed(2)}, Intersection: ${intersectionDetected}`);
            }
            
            if (intersectionDetected && time - lastIntersectionTime.current > 2) { // Reduced cooldown to 2 seconds
              console.log('🔴➡️🟢 BEAM INTERSECTION DETECTED! Triggering auto-renewal...');
              lastIntersectionTime.current = time;
              if (intersectionCallbackRef.current) {
                intersectionCallbackRef.current();
              }
            }

            // Animate hacking particles with disruption
            if (hackParticles) {
              const positions = hackParticles.geometry.attributes.position.array as Float32Array;
              for (let i = 0; i < positions.length; i += 3) {
                // Particles get scattered/disrupted by QKD
                positions[i] += (Math.random() - 0.5) * 0.05; // Scatter effect
                positions[i + 1] -= 0.1 + (Math.random() * 0.1); // Variable fall speed
                positions[i + 2] += (Math.random() - 0.5) * 0.05; // Scatter effect
                
                if (positions[i + 1] < -5) {
                  positions[i + 1] = 0; // Reset to top
                  positions[i] = (Math.random() - 0.5) * 0.5;
                  positions[i + 2] = (Math.random() - 0.5) * 0.5;
                }
              }
              hackParticles.geometry.attributes.position.needsUpdate = true;
              
              // Particle color shows interference/blocking
              hackParticles.material.color.setHex(isBlocked ? 0xff4444 : 0xff0000);
              hackParticles.material.opacity = 0.4 + 0.4 * Math.abs(interference);
              
              // Visual feedback for intersection
              if (intersectionDetected) {
                hackParticles.material.color.setHex(0xffff00); // Yellow when intersecting
                hackParticles.material.opacity = 1.0;
              }
            }
          }
        } else {
          // Hide hacking beam when not intercepting
          if (hackingBeam) {
            hackingBeam.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return {
    mountRef,
    updateLaser,
    updateDrone,
    setIntersectionCallback
  };
};
