import React from 'react';
import { WorkflowStats } from '../types/workflow';

interface StatsHeaderProps {
  stats: WorkflowStats | null;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <header className="header">
      <div className="container">
        <h1 className="title">N8N Workflow Library</h1>
        <p className="subtitle">
          Discover and explore automation workflows for your projects
        </p>
        
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{stats.total.toLocaleString()}</span>
            <span className="stat-label">Total Workflows</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.active.toLocaleString()}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.total_nodes.toLocaleString()}</span>
            <span className="stat-label">Total Nodes</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.unique_integrations.toLocaleString()}</span>
            <span className="stat-label">Integrations</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StatsHeader;