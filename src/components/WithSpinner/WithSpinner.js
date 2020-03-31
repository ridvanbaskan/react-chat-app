import React from 'react';
import './WithSpinner.styles.css';

const WithSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container" />
      Loading...
    </div>
  );
};

export default WithSpinner;
