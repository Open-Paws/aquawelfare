'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchData = useCallback(async () => {
    setLoading(true);
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
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const tabConfig = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'species', label: '🐟 Species', icon: '🐟' },
    { id: 'map', label: '🗺️ Map', icon: '🗺️' },
    { id: 'gaps', label: '⚠️ Gap Analysis', icon: '⚠️' },
    { id: 'simulator', label: '🚀 Simulator', icon: '🚀' },
    { id: 'ai-suite', label: '🧠 AI Suite', icon: '🧠' },
    { id: 'report', label: '📋 Report', icon: '📋' },
  ];

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
          <h2>
            {activeTab === 'dashboard' && '📊 Dashboard Overview'}
            {activeTab === 'species' && '🐟 Species Explorer'}
            {activeTab === 'map' && '🗺️ Global Welfare Map'}
            {activeTab === 'gaps' && '⚠️ Welfare Gap Analysis'}
            {activeTab === 'simulator' && '🚀 Strategic Simulator'}
            {activeTab === 'ai-suite' && '🧠 Advanced Intelligence'}
            {activeTab === 'report' && '📋 Intervention Report'}
          </h2>
          <p>
            {activeTab === 'dashboard' && 'Comprehensive overview of aquatic animal welfare worldwide'}
            {activeTab === 'species' && 'Explore welfare data for individual aquatic species'}
            {activeTab === 'map' && 'Interactive map of welfare standards coverage by country'}
            {activeTab === 'gaps' && 'AI-powered analysis identifying highest-impact intervention targets'}
            {activeTab === 'simulator' && 'Mathematically project the impact of hypothetical campaigns and policies'}
            {activeTab === 'ai-suite' && 'Leverage predictive 2030 forecasting and Natural Language Processing logic'}
            {activeTab === 'report' && 'Generate structured reports for advocacy and policy work'}
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="tabs" style={{ display: 'none' }}>
          {tabConfig.map(tab => (
            <button 
              key={tab.id} 
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {loading ? (
          <div className="loading">
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
