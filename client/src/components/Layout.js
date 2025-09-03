import React, { useState } from 'react';
import logo from '../logo.svg';
import InfoPopup from './InfoPopup';
import AnimatedBanner from './AnimatedBanner';

function Layout({ children }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="app-layout">
      <header className="app-header slide-down">
        <div className="brand">
          <img src={logo} alt="Areeba's DevOps Hub logo" className="logo" />
          <div>
            <h1 className="brand-title">Areeba's DevOps Hub</h1>
            <p className="nav-subtitle">GitHub Actions CI/CD Pipeline Manager</p>
          </div>
        </div>
      </header>
      <AnimatedBanner message="Welcome to CI/CD Pipeline Management 🚀" />
      <div className="app-body">
        <aside className="sidebar slide-in-left">
          <h3>Connect & Learn</h3>
          <ul className="social-links">
            <li><a className="sidebar-btn" href="https://www.linkedin.com/in/areeba-uroj/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a className="sidebar-btn" href="https://github.com/Areeba-Uroj" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a className="sidebar-btn" href="https://www.youtube.com/@areebadevops" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            <li><a className="sidebar-btn" href="https://www.instagram.com/areeba.devops" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
          
          <div className="pipeline-status">
            <h4>Quick Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Active Pipelines:</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Deployments Today:</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate:</span>
              <span className="stat-value">96%</span>
            </div>
          </div>

          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <button className="sidebar-btn action-btn">🔄 Trigger Pipeline</button>
            <button className="sidebar-btn action-btn">📊 View Logs</button>
            <button className="sidebar-btn action-btn">⚙️ Pipeline Config</button>
          </div>
        </aside>
        <main className="main-content fade-in">
          {children}
        </main>
      </div>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Areeba's DevOps Hub. Automating the world, one pipeline at a time.</p>
      </footer>
      
      <button className="help-btn" onClick={() => setShowInfo(true)}>?</button>
      {showInfo && <InfoPopup onClose={() => setShowInfo(false)} />}
      
      <div className="bubble-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble" />
        ))}
      </div>
      <div className="star-container">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>
    </div>
  );
}

export default Layout;
