// OverlayComponent.js
import React from 'react';
import './OverlayComponent.css'; // Import your CSS file for styling

const OverlayComponent = ({ children }) => {
  return (
    <div className="overlay-container">
      {children}
      <div className="overlay"></div>
    </div>
  );
};

export default OverlayComponent;
