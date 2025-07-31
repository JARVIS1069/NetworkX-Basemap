import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { flightData } from './data/flights.js';
import { createPlaneGeometry, animatePlanes } from './components/planes.js';
import { setupControls } from './components/controls.js';
import { updateFlightInfo, updateStats } from './components/ui.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011, 1);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Globe setup
const Globe = new ThreeGlobe()
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png');

Globe.scale.set(0.8, 0.8, 0.8);
scene.add(Globe);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Camera position
camera.position.z = 300;

// Flight paths and planes
const planes = [];
const flightPaths = [];
let showLabels = true;
let autoRotate = true;
let animationSpeed = 1;

// Create flight paths
flightData.forEach((flight, index) => {
  const startCoords = flight.coordinates.from;
  const endCoords = flight.coordinates.to;
  
  // Create arc path
  const pathData = [{
    startLat: startCoords[0],
    startLng: startCoords[1],
    endLat: endCoords[0],
    endLng: endCoords[1],
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][index % 5],
    distance: flight.distance
  }];
  
  Globe.arcsData(Globe.arcsData().concat(pathData))
    .arcColor('color')
    .arcDashLength(0.4)
    .arcDashGap(0.2)
    .arcDashAnimateTime(2000)
    .arcStroke(0.5);
  
  // Create plane for this route
  const plane = createPlaneGeometry();
  plane.userData = {
    flight: flight,
    pathIndex: index,
    progress: Math.random(), // Random starting position
    speed: 0.002 + Math.random() * 0.001 // Varying speeds
  };
  
  scene.add(plane);
  planes.push(plane);
  flightPaths.push(pathData[0]);
});

// Add city markers
const cityData = [];
const processedCities = new Set();

flightData.forEach(flight => {
  if (!processedCities.has(flight.from)) {
    cityData.push({
      lat: flight.coordinates.from[0],
      lng: flight.coordinates.from[1],
      name: flight.from,
      color: '#ffffff',
      size: 0.8
    });
    processedCities.add(flight.from);
  }
  
  if (!processedCities.has(flight.to)) {
    cityData.push({
      lat: flight.coordinates.to[0],
      lng: flight.coordinates.to[1],
      name: flight.to,
      color: '#ffffff',
      size: 0.8
    });
    processedCities.add(flight.to);
  }
});

Globe.pointsData(cityData)
  .pointColor('color')
  .pointAltitude(0.01)
  .pointRadius('size');

// Labels for distances
const labelData = flightData.map(flight => ({
  lat: (flight.coordinates.from[0] + flight.coordinates.to[0]) / 2,
  lng: (flight.coordinates.from[1] + flight.coordinates.to[1]) / 2,
  text: `${flight.distance.toFixed(0)} km`,
  color: '#ffffff',
  size: 0.8
}));

Globe.labelsData(labelData)
  .labelText('text')
  .labelColor('color')
  .labelSize('size')
  .labelResolution(2);

// Mouse controls
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
  mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
  
  if (!autoRotate) {
    targetRotationX = mouseY * 0.5;
    targetRotationY = mouseX * 0.5;
  }
});

// Setup UI controls
setupControls({
  onSpeedChange: (speed) => { animationSpeed = speed; },
  onToggleLabels: () => {
    showLabels = !showLabels;
    Globe.labelsData(showLabels ? labelData : []);
  },
  onToggleRotation: () => { autoRotate = !autoRotate; }
});

// Update UI
updateFlightInfo(flightData);
updateStats(flightData);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Auto rotation
  if (autoRotate) {
    Globe.rotation.y += 0.002;
  } else {
    Globe.rotation.x += (targetRotationX - Globe.rotation.x) * 0.05;
    Globe.rotation.y += (targetRotationY - Globe.rotation.y) * 0.05;
  }
  
  // Animate planes
  animatePlanes(planes, flightPaths, animationSpeed);
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();