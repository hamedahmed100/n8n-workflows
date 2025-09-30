import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="state">
      <div className="icon">⏳</div>
      <h3>Loading Workflows</h3>
      <p>Please wait while we fetch the workflow data...</p>
    </div>
  );
};

export default LoadingState;