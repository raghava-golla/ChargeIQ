// Initialize map centered on Bengaluru
const map = L.map('map').setView([12.9716, 77.5946], 12);

// Add map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
// Fetch real Bengaluru chargers from Open Charge Map
async function loadChargers() {
  const apiKey = 'bf570013-018e-41ff-bc9c-98ccb09fb821';
  const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&latitude=12.9716&longitude=77.5946&distance=15&distanceunit=km&maxresults=100&compact=true&verbose=false&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Chargers found:', data.length);

    data.forEach(station => {
      const lat = station.AddressInfo.Latitude;
      const lng = station.AddressInfo.Longitude;
      const name = station.AddressInfo.Title;
      const operator = station.OperatorInfo?.Title || 'Unknown Operator';
      const connections = station.Connections?.length || 0;

      // Add marker
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#10B981',
        color: '#030B14',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      // Build connector info
const connectorList = station.Connections?.map(c => 
  c.ConnectionType?.Title || 'Unknown'
).join(', ') || 'No data';

const powerKW = station.Connections?.[0]?.PowerKW 
  ? `${station.Connections[0].PowerKW} kW` 
  : 'Unknown';

// Popup on click
marker.bindPopup(`
  <div style="font-family:sans-serif; min-width:200px">
    <b style="font-size:14px">⚡ ${name}</b><br><br>
    <span style="color:#666; font-size:12px">🏢 ${operator}</span><br>
    <span style="color:#666; font-size:12px">🔌 ${connectorList}</span><br>
    <span style="color:#666; font-size:12px">⚡ Max power: ${powerKW}</span><br>
    <span style="color:#666; font-size:12px">📍 Ports: ${connections}</span>
  </div>
`);
    });

  } catch (error) {
    console.error('Error fetching chargers:', error);
  }
}

loadChargers();