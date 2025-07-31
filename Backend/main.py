import json
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.basemap import Basemap
from networkx.algorithms.community import greedy_modularity_communities
import matplotlib.cm as cm
from geopy.distance import geodesic

# Load city data
with open("cities.json") as f:
    connections = json.load(f)

# Create graph
G = nx.Graph()
cities = {}

# Add nodes and edges with geodesic distances
for conn in connections:
    from_city = conn['from']
    to_city = conn['to']
    from_coords = tuple(conn['coordinates']['from'])
    to_coords = tuple(conn['coordinates']['to'])

    cities[from_city] = from_coords
    cities[to_city] = to_coords

    # Use geopy to calculate actual distance in km
    distance_km = geodesic(from_coords, to_coords).km
    G.add_edge(from_city, to_city, distance=distance_km)

# Setup Basemap
plt.figure(figsize=(14, 8))
m = Basemap()
m.drawcoastlines()
m.drawcountries()

# Project city coordinates to map
pos = {}
for city, (lat, lon) in cities.items():
    x, y = m(lon, lat)
    pos[city] = (x, y)

# Clustering (Community Detection)
communities = greedy_modularity_communities(G)
colors = cm.rainbow(np.linspace(0, 1, len(communities)))
node_colors = {}

for color, community in zip(colors, communities):
    for node in community:
        node_colors[node] = color

# Draw cities by clusters
nx.draw_networkx_nodes(G, pos, node_color=[node_colors[n] for n in G.nodes()], node_size=200)
nx.draw_networkx_labels(G, pos, font_size=9)

# Draw all edges (light)
nx.draw_networkx_edges(G, pos, alpha=0.4)

# Optional: Add edge distances as labels (can comment this out if too cluttered)
edge_labels = nx.get_edge_attributes(G, 'distance')
rounded_labels = {k: f"{v:.1f} km" for k, v in edge_labels.items()}
nx.draw_networkx_edge_labels(G, pos, edge_labels=rounded_labels, font_size=6)

# 🧭 Get input from user
start_city = input("Enter starting city: ")
end_city = input("Enter destination city: ")

try:
    shortest_path = nx.shortest_path(G, source=start_city, target=end_city, weight='distance')
    total_distance = sum(
        G[u][v]['distance'] for u, v in zip(shortest_path[:-1], shortest_path[1:])
    )
    print(f"📍 Shortest path from {start_city} to {end_city}:")
    print(" ➡️ " + " → ".join(shortest_path))
    print(f"🛣️ Total distance: {total_distance:.2f} km")

    # Highlight shortest path
    path_edges = list(zip(shortest_path, shortest_path[1:]))
    nx.draw_networkx_edges(G, pos, edgelist=path_edges, edge_color='red', width=3)

except nx.NetworkXNoPath:
    print(f"⚠️ No path found between {start_city} and {end_city}.")

plt.title("Geographical Network with Clustering & Real-World Shortest Path", fontsize=14)
plt.show()
