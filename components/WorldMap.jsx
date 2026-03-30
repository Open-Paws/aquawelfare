'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

function getWelfareColor(score) {
  if (score >= 0.7) return '#22c55e';
  if (score >= 0.5) return '#eab308';
  if (score >= 0.3) return '#f97316';
  if (score >= 0.15) return '#ef4444';
  return '#dc2626';
}

function normalizeCountryName(jsonName) {
  // Mapping standard GeoJSON country names to our custom dataset names
  const map = {
    'United States of America': 'United States',
    'Republic of Korea': 'South Korea',
    'Taiwan': 'Taiwan',
    'Russian Federation': 'Russia',
    'Republic of the Congo': 'Congo',
    'Democratic Republic of the Congo': 'DR Congo',
    'Vietnam': 'Vietnam',
    'Macedonia': 'North Macedonia'
  };
  return map[jsonName] || jsonName;
}

export default function WorldMap({ countries, filters, fullPage = false }) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef(null);

  // Load Geographic Polygon definitions dynamically
  useEffect(() => {
    fetch('/countries.geo.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Failed to load map geographic bounds.", err));
  }, []);

  const filteredCountries = useMemo(() => {
    let data = countries || [];
    if (filters?.region && filters.region !== 'All') {
      data = data.filter(c => c.region === filters.region);
    }
    return data;
  }, [countries, filters]);

  // Create a fast lookup map for O(1) matching in the Leaflet engine
  const countryDataMap = useMemo(() => {
    const map = new Map();
    filteredCountries.forEach(c => map.set(c.name, c));
    return map;
  }, [filteredCountries]);

  // Leaflet polygon style function
  const styleFeature = (feature) => {
    const rawName = feature.properties.name;
    const dbName = normalizeCountryName(rawName);
    const mappedCountry = countryDataMap.get(dbName);

    if (!mappedCountry) {
      // Unmapped countries default rendering
      return {
        fillColor: '#1e293b', // Deep gray
        weight: 1,
        color: 'rgba(255,255,255,0.05)', // Subtle borders
        fillOpacity: 0.3
      };
    }

    return {
      fillColor: getWelfareColor(mappedCountry.welfareScore),
      weight: 1,
      opacity: 1,
      color: 'rgba(255,255,255,0.1)', // Outline
      fillOpacity: 0.8
    };
  };

  // Interaction handlers strictly replacing CircleMarker <Popup>
  const onEachFeature = (feature, layer) => {
    const rawName = feature.properties.name;
    const dbName = normalizeCountryName(rawName);
    const countryData = countryDataMap.get(dbName);

    if (countryData) {
      // Build popup mimicking original component CSS layout
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">
            ${countryData.name}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #94a3b8">Region:</span>
            <span style="color: #e2e8f0">${countryData.region}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #94a3b8">Production:</span>
            <span style="color: #e2e8f0; font-weight: 500;">${(countryData.totalAquacultureProduction / 1000000).toFixed(1)}M tonnes</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #94a3b8">Welfare Score:</span>
            <span style="color: ${getWelfareColor(countryData.welfareScore)}; font-weight: bold;">
              ${(countryData.welfareScore * 100).toFixed(0)}%
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #94a3b8">Legislation:</span>
            <span style="color: #e2e8f0">${countryData.regulatoryFramework.hasLegislation ? 
              (countryData.regulatoryFramework.enforced ? '✅ Enforced' : '⚠️ Unenforced') : '❌ None'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #94a3b8">Certified %:</span>
            <span style="color: #e2e8f0">${countryData.certifiedProductionPercent}%</span>
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px; line-height: 1.4;">
            Species Formats: ${(countryData.speciesFarmed || []).slice(0, 3).join(', ')}${(countryData.speciesFarmed || []).length > 3 ? '...' : ''}
          </div>
        </div>
      `;

      layer.bindPopup(popupHtml, {
        className: 'custom-choropleth-popup' // Global container formatting
      });

      // Hover interactivity highlights
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ weight: 2, color: '#ffffff', fillOpacity: 1 });
          l.bringToFront();
        },
        mouseout: (e) => {
          if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(e.target);
          }
        }
      });
    } else {
      // Basic hover for non-active dataset countries
       layer.on({
        mouseover: (e) => {
          e.target.setStyle({ fillOpacity: 0.5 });
        },
        mouseout: (e) => {
          if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target);
        }
      });
    }
  };

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <h3>🗺️ Global Aquaculture Welfare Coverage (Choropleth)</h3>
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
          
          {geoData && (
            <GeoJSON 
              key={JSON.stringify(filteredCountries.map(c => c.name))}
              ref={geoJsonRef}
              data={geoData}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}

        </MapContainer>
      </div>
    </div>
  );
}
