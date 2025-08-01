// Simulated city data for demo purposes
const cityData = {
  "Delhi": { cluster: 1 },
  "Tokyo": { cluster: 1 },
  "London": { cluster: 2 },
  "New York": { cluster: 2 },
  "Mumbai": { cluster: 1 },
  "Paris": { cluster: 2 },
};

// Simulated pathfinding function
function findShortestPath() {
  const start = document.getElementById("startCity").value.trim();
  const end = document.getElementById("endCity").value.trim();

  const output = document.getElementById("output");

  if (!start || !end) {
    output.innerHTML = "❌ Please enter both cities.";
    return;
  }

  if (!cityData[start] || !cityData[end]) {
    output.innerHTML = `⚠️ One or both cities not found in data. Try: Delhi, Tokyo, London, etc.`;
    return;
  }

  // Dummy response
  const dummyPath = [start, "IntermediateCity", end];
  const dummyDistance = Math.floor(Math.random() * 5000) + 1000;

  output.innerHTML = `
    📍 Shortest path: <b>${dummyPath.join(" ➝ ")}</b><br/>
    🛣️ Distance: <b>${dummyDistance} km</b>
  `;
}

// Simulated cluster function
function showClusters() {
  const output = document.getElementById("output");
  const clusters = {};

  Object.keys(cityData).forEach(city => {
    const group = cityData[city].cluster;
    if (!clusters[group]) clusters[group] = [];
    clusters[group].push(city);
  });

  let result = "<h3>🧠 Clusters:</h3>";
  for (let group in clusters) {
    result += `<b>Cluster ${group}:</b> ${clusters[group].join(", ")}<br/>`;
  }

  output.innerHTML = result;
}
