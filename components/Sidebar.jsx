'use client';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'species', label: 'Species Explorer', icon: '🐟' },
    { id: 'map', label: 'Global Map', icon: '🗺️' },
    { id: 'gaps', label: 'Gap Analysis', icon: '⚠️' },
    { id: 'simulator', label: 'Simulator', icon: '🚀' },
    { id: 'ai-suite', label: 'AI Suite', icon: '🧠' },
    { id: 'report', label: 'Reports', icon: '📋' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🐟</div>
          <div className="sidebar-logo-text">
            <h1>AquaWelfare</h1>
            <p>Welfare Tracker</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Data: FAO 2024, ASC, BAP, RSPCA</p>
        <p style={{ marginTop: 4 }}>OpenPaws Project © 2026</p>
      </div>
    </aside>
  );
}
