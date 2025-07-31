import * as THREE from 'three';

export function createPlaneGeometry() {
  // Create a simple plane shape
  const geometry = new THREE.ConeGeometry(0.5, 2, 4);
  const material = new THREE.MeshLambertMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.9
  });
  
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.set(0.3, 0.3, 0.3);
  
  return plane;
}

export function animatePlanes(planes, flightPaths, speed) {
  planes.forEach((plane, index) => {
    const path = flightPaths[index];
    const userData = plane.userData;
    
    // Update progress
    userData.progress += userData.speed * speed;
    if (userData.progress > 1) {
      userData.progress = 0; // Reset to start
    }
    
    // Calculate position along the arc
    const startLat = path.startLat * Math.PI / 180;
    const startLng = path.startLng * Math.PI / 180;
    const endLat = path.endLat * Math.PI / 180;
    const endLng = path.endLng * Math.PI / 180;
    
    // Spherical interpolation for smooth arc movement
    const t = userData.progress;
    const radius = 100; // Globe radius
    const altitude = 5 + Math.sin(t * Math.PI) * 10; // Arc height
    
    // Interpolate between start and end coordinates
    const lat = startLat + (endLat - startLat) * t;
    const lng = startLng + (endLng - startLng) * t;
    
    // Convert to 3D coordinates
    const x = (radius + altitude) * Math.cos(lat) * Math.cos(lng);
    const y = (radius + altitude) * Math.sin(lat);
    const z = (radius + altitude) * Math.cos(lat) * Math.sin(lng);
    
    plane.position.set(x, y, z);
    
    // Calculate direction for plane orientation
    const nextT = Math.min(t + 0.01, 1);
    const nextLat = startLat + (endLat - startLat) * nextT;
    const nextLng = startLng + (endLng - startLng) * nextT;
    const nextAltitude = 5 + Math.sin(nextT * Math.PI) * 10;
    
    const nextX = (radius + nextAltitude) * Math.cos(nextLat) * Math.cos(nextLng);
    const nextY = (radius + nextAltitude) * Math.sin(nextLat);
    const nextZ = (radius + nextAltitude) * Math.cos(nextLat) * Math.sin(nextLng);
    
    // Point plane in direction of movement
    const direction = new THREE.Vector3(nextX - x, nextY - y, nextZ - z).normalize();
    plane.lookAt(plane.position.clone().add(direction));
    
    // Add some rotation for realism
    plane.rotation.z += 0.02;
  });
}