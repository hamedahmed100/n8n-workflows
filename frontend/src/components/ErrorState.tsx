import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="state">
      <div className="icon">❌</div>
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;