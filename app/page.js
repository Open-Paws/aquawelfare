'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import StatsOverview from '../components/StatsOverview';
import FilterPanel from '../components/FilterPanel';
import SpeciesExplorer from '../components/SpeciesExplorer';
import GapAnalysis from '../components/GapAnalysis';
import WelfareCharts from '../components/WelfareCharts';
import ReportPanel from '../components/ReportPanel';
import SpeciesDetail from '../components/SpeciesDetail';
import InterventionSimulator from '../components/InterventionSimulator';
import AISuite from '../components/AISuite';
import dynamic from 'next/dynamic';
import { regions } from '../data/countries';
import { productionSystems } from '../data/production-systems';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    taxonomicGroup: 'All',
    region: 'All',
    productionSystem: 'All',
    priority: 'All',
  });
  const [speciesData, setSpeciesData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [gapsData, setGapsData] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Pre-computed lookup from speciesId → gap score entry, shared across components
  // that need to correlate species records with gap analysis results.
  const gapMap = useMemo(() => {
    const map = {};
    if (gapsData?.data) {
      gapsData.data.forEach(g => { map[g.speciesId] = g; });
    }
    return map;
  }, [gapsData]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (filters.taxonomicGroup !== 'All') params.set('taxonomicGroup', filters.taxonomicGroup);
      if (filters.region !== 'All') params.set('region', filters.region);

      const [speciesRes, countriesRes, gapsRes] = await Promise.all([
        fetch(`/api/species?${params}`),
        fetch(`/api/countries?${params}`),
        fetch(`/api/welfare-gaps?${params}`),
      ]);

      const speciesJson = await speciesRes.json();
      const countriesJson = await countriesRes.json();
      const gapsJson = await gapsRes.json();

      setSpeciesData(speciesJson.data || []);
      setCountriesData(countriesJson.data || []);
      setGapsData(gapsJson);
    } catch (err) {
      console.error('Error fetching welfare data:', err);
      setFetchError('Failed to load welfare data. Please refresh the page.');
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const TAB_CONTENT = {
    dashboard: { title: '📊 Dashboard Overview', subtitle: 'Comprehensive overview of aquatic animal welfare worldwide' },
    species:   { title: '🐟 Species Explorer', subtitle: 'Explore welfare data for individual farmed aquatic species' },
    map:       { title: '🗺️ Global Welfare Map', subtitle: 'Interactive map of welfare standards coverage by country' },
    gaps:      { title: '⚠️ Welfare Gap Analysis', subtitle: 'Analysis identifying highest-impact intervention targets' },
    simulator: { title: '🚀 Strategic Simulator', subtitle: 'Project the impact of hypothetical campaigns and policies' },
    'ai-suite':{ title: '🧠 Policy Analysis Suite', subtitle: '2030 welfare trajectory and policy strictness analyzer' },
    report:    { title: '📋 Intervention Report', subtitle: 'Generate structured reports for advocacy and policy work' },
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <button 
        className="sidebar-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <h2>{TAB_CONTENT[activeTab]?.title}</h2>
          <p>{TAB_CONTENT[activeTab]?.subtitle}</p>
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          regions={regions}
          productionSystems={productionSystems}
        />

        {fetchError && (
          <div role="alert" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, color: 'var(--accent-red)', marginBottom: 16 }}>
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner" />
            Loading data...
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'dashboard' && (
              <div className="section-grid">
                <StatsOverview stats={gapsData?.stats} />
                <WelfareCharts 
                  speciesData={speciesData} 
                  gapsData={gapsData}
                  countriesData={countriesData}
                />
                <WorldMap 
                  countries={countriesData} 
                  filters={filters}
                />
              </div>
            )}

            {activeTab === 'species' && (
              <SpeciesExplorer
                species={speciesData}
                onSelect={setSelectedSpecies}
                gapsData={gapsData}
                gapMap={gapMap}
              />
            )}

            {activeTab === 'map' && (
              <WorldMap 
                countries={countriesData} 
                filters={filters}
                fullPage
              />
            )}

            {activeTab === 'gaps' && (
              <GapAnalysis 
                gapsData={gapsData}
                speciesData={speciesData}
                countriesData={countriesData}
                filters={filters}
              />
            )}

            {activeTab === 'simulator' && (
              <InterventionSimulator
                speciesData={speciesData}
                gapsData={gapsData}
                gapMap={gapMap}
              />
            )}

            {activeTab === 'ai-suite' && (
              <AISuite />
            )}

            {activeTab === 'report' && (
              <ReportPanel filters={filters} />
            )}
          </div>
        )}

        {selectedSpecies && (
          <SpeciesDetail 
            species={selectedSpecies} 
            gapsData={gapsData}
            onClose={() => setSelectedSpecies(null)} 
          />
        )}
      </main>
    </div>
  );
}
