'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

function getWelfareColor(score) {
  if (score >= 0.7) return '#22c55e';
  if (score >= 0.5) return '#eab308';
  if (score >= 0.3) return '#f97316';
  if (score >= 0.15) return '#ef4444';
  return '#dc2626';
}

function getMarkerSize(production) {
  if (production > 10000000) return 18;
  if (production > 5000000) return 15;
  if (production > 1000000) return 12;
  if (production > 100000) return 9;
  return 7;
}

export default function WorldMap({ countries, filters, fullPage = false }) {
  const filteredCountries = useMemo(() => {
    let data = countries || [];
    if (filters?.region && filters.region !== 'All') {
      data = data.filter(c => c.region === filters.region);
    }
    return data;
  }, [countries, filters]);

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <h3>🗺️ Global Aquaculture Welfare Coverage</h3>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#22c55e' }} />
            <span>High (≥0.7)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#eab308' }} />
            <span>Medium (0.5-0.7)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#f97316' }} />
            <span>Low (0.3-0.5)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#ef4444' }} />
            <span>Very Low (&lt;0.3)</span>
          </div>
        </div>
      </div>
      <div className="map-container" style={{ height: fullPage ? '650px' : '500px' }}>
        <MapContainer
          center={[20, 10]}
          zoom={2}
          style={{ height: '100%', width: '100%', background: '#0a0e1a' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {filteredCountries.map(country => (
            <CircleMarker
              key={country.id}
              center={[country.lat, country.lng]}
              radius={getMarkerSize(country.totalAquacultureProduction)}
              fillColor={getWelfareColor(country.welfareScore)}
              fillOpacity={0.75}
              stroke={true}
              color={getWelfareColor(country.welfareScore)}
              weight={2}
              opacity={0.9}
            >
              <Popup>
                <div>
                  <div className="popup-title">{country.name}</div>
                  <div className="popup-stat">
                    <span>Region:</span>
                    <span>{country.region}</span>
                  </div>
                  <div className="popup-stat">
                    <span>Production:</span>
                    <span>{(country.totalAquacultureProduction / 1000000).toFixed(1)}M tonnes</span>
                  </div>
                  <div className="popup-stat">
                    <span>Welfare Score:</span>
                    <span style={{ color: getWelfareColor(country.welfareScore) }}>
                      {(country.welfareScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="popup-stat">
                    <span>Legislation:</span>
                    <span>{country.regulatoryFramework.hasLegislation ? 
                      (country.regulatoryFramework.enforced ? '✅ Enforced' : '⚠️ Not enforced') : 
                      '❌ None'}
                    </span>
                  </div>
                  <div className="popup-stat">
                    <span>Certified:</span>
                    <span>{country.certifiedProductionPercent}%</span>
                  </div>
                  <div className="popup-stat">
                    <span>Certifications:</span>
                    <span>{country.activeCertifications.length > 0 ? 
                      country.activeCertifications.join(', ') : 'None'}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                    Species: {country.speciesFarmed?.slice(0, 4).join(', ')}
                    {country.speciesFarmed?.length > 4 ? ` +${country.speciesFarmed.length - 4} more` : ''}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
