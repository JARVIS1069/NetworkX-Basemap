export function updateFlightInfo(flightData) {
  const flightList = document.getElementById('flight-list');
  
  flightList.innerHTML = flightData.slice(0, 5).map(flight => `
    <div class="flight-item">
      <div class="route">${flight.from} → ${flight.to}</div>
      <div class="distance">${flight.distance.toFixed(0)} km</div>
    </div>
  `).join('');
}

export function updateStats(flightData) {
  const totalDistance = flightData.reduce((sum, flight) => sum + flight.distance, 0);
  document.getElementById('total-distance').textContent = totalDistance.toFixed(0);
}