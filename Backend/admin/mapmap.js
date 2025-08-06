
var map = L.map('map').setView([21.1466, 79.0888], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


L.marker([19.0760, 72.8777]).addTo(map).bindPopup("Mumbai");
L.marker([13.0827, 80.2707]).addTo(map).bindPopup("Chennai");
L.marker([17.3850, 78.4867]).addTo(map).bindPopup("Hyderabad");
