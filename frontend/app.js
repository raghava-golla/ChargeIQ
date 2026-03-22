const CONNECTOR_TYPES = {
  1: 'Type 1 (J1772)',
  2: 'CHAdeMO',
  25: 'Type 2',
  32: 'CCS (Type 1)',
  33: 'CCS (Type 2)',
  27: 'Type 2 (Tethered)',
  1036: 'Type 2 (Tethered)',
  30: 'DC Fast',
  28: 'Type 3',
  36: 'CCS Combo',
  38: 'Type 2 (Socket)',
  3: 'SCAME',
  8: 'Type 2 (Mennekes)'
};

const map = L.map('map', { zoomControl: false }).setView([12.9716, 77.5946], 12);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO'
}).addTo(map);

let allMarkers = [];

async function loadChargers() {
  try {
    const response = await fetch(''https://chargeiq-production.up.railway.app/api/stations'');
    const json = await response.json();
    const data = json.stations;

    document.getElementById('station-count').textContent = `${data.length} stations`;

    data.forEach(station => {
      const lat = station.AddressInfo.Latitude;
      const lng = station.AddressInfo.Longitude;
      const name = station.AddressInfo.Title;
      const operator = station.OperatorInfo?.Title || 'Unknown Operator';
      const connections = station.Connections || [];

      const hasDC = connections.some(c => c.LevelID === 3 || c.PowerKW >= 40);
      const color = hasDC ? '#10B981' : '#38BDF8';
      const label = hasDC ? 'DC Fast' : 'AC';

      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: color,
        color: '#030B14',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      // ← store marker HERE after it's created
      allMarkers.push({ marker, hasDC });

      const connectorBadges = connections.map(c => {
        const name = CONNECTOR_TYPES[c.ConnectionTypeID]
          || c.ConnectionType?.Title
          || `Type ${c.ConnectionTypeID}`;
        const isDC = c.CurrentTypeID === 30;
        return `<span class="popup-badge ${isDC ? '' : 'ac'}">${name}</span>`;
      }).join('');

      const powerKW = connections[0]?.PowerKW
        ? `${connections[0].PowerKW} kW`
        : 'Unknown';

      marker.bindPopup(`
        <div class="popup-header">
          <div class="popup-name">${name}</div>
          <div class="popup-operator">⚡ ${operator}</div>
        </div>
        <div class="popup-body">
          <div class="popup-row"><span>🔌</span><div>${connectorBadges || 'No connector data'}</div></div>
          <div class="popup-row"><span>⚡</span><strong>Max power: ${powerKW}</strong></div>
          <div class="popup-row"><span>📍</span><strong>Ports: ${connections.length}</strong></div>
          <div class="popup-row"><span>🏷</span><strong style="color:${color}">${label} Charger</strong></div>
        </div>
      `, { className: 'chargeiq-popup' }).addTo(map);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

loadChargers();

function filterStations(type) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  allMarkers.forEach(({ marker, hasDC }) => {
    if (type === 'all') {
      marker.addTo(map);
    } else if (type === 'dc' && hasDC) {
      marker.addTo(map);
    } else if (type === 'ac' && !hasDC) {
      marker.addTo(map);
    } else {
      map.removeLayer(marker);
    }
  });

  const visible = type === 'all' ? allMarkers.length
    : allMarkers.filter(m => type === 'dc' ? m.hasDC : !m.hasDC).length;
  document.getElementById('station-count').textContent = `${visible} stations`;
}