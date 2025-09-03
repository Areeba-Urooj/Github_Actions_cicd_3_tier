import React from 'react';

function InfoPopup({ onClose }) {
  return (
    <div className="info-overlay" onClick={onClose}>
      <div className="info-box" onClick={e => e.stopPropagation()}>
        <h3>About Areeba's CI/CD Pipeline Manager</h3>
        <p>
          This project demonstrates a complete 3-tier GitHub Actions CI/CD pipeline 
          with React frontend, Node.js backend, and MySQL database. Built by Areeba, 
          a DevOps Engineer passionate about automation and continuous delivery.
        </p>
        <div className="tech-stack">
          <h4>Tech Stack:</h4>
          <ul>
            <li>🔸 Frontend: React.js</li>
            <li>🔸 Backend: Node.js + Express</li>
            <li>🔸 Database: MySQL</li>
            <li>🔸 CI/CD: GitHub Actions</li>
            <li>🔸 Containerization: Docker</li>
            <li>🔸 Orchestration: Kubernetes</li>
          </ul>
        </div>
        <div className="features">
          <h4>Features:</h4>
          <ul>
            <li>✅ User Management System</li>
            <li>✅ Role-based Access Control</li>
            <li>✅ Automated CI/CD Pipeline</li>
            <li>✅ Container Orchestration</li>
            <li>✅ Pipeline Monitoring</li>
          </ul>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default InfoPopup;