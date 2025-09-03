import React from 'react';

function AnimatedBanner({ message = "Welcome to CI/CD Pipeline Management 🚀" }) {
  return (
    <div className="animated-banner">
      {message}
      <span className="pipeline-indicator">
        <span className="step">Build</span>
        <span className="arrow">→</span>
        <span className="step">Test</span>
        <span className="arrow">→</span>
        <span className="step">Deploy</span>
      </span>
    </div>
  );
}

export default AnimatedBanner;