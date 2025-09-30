import React from 'react';
import { Workflow } from '../types/workflow';

interface WorkflowCardProps {
  workflow: Workflow;
  categoryMap: Map<string, string>;
  onClick: () => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, categoryMap, onClick }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'complexity-low';
      case 'medium': return 'complexity-medium';
      case 'high': return 'complexity-high';
      default: return 'complexity-low';
    }
  };

  const getTriggerType = (trigger: string) => {
    const triggerMap: Record<string, string> = {
      'Triggered': 'Event',
      'Scheduled': 'Schedule',
      'Webhook': 'Webhook',
      'Manual': 'Manual'
    };
    return triggerMap[trigger] || trigger;
  };

  const getCategory = (filename: string) => {
    const parts = filename.split('_');
    if (parts.length >= 2) {
      const categoryKey = parts[1].toLowerCase();
      return categoryMap.get(categoryKey) || parts[1];
    }
    return 'Uncategorized';
  };

  return (
    <div className="workflow-card" onClick={onClick}>
      <div className="workflow-header">
        <div className="workflow-meta">
          <div className={`status-dot ${workflow.active ? 'status-active' : 'status-inactive'}`}></div>
          <span>{workflow.active ? 'Active' : 'Inactive'}</span>
          <div className={`complexity-dot ${getComplexityColor(workflow.complexity)}`}></div>
          <span>{workflow.complexity}</span>
        </div>
        <div className="trigger-badge">
          {getTriggerType(workflow.trigger_type)}
        </div>
      </div>

      <h3 className="workflow-title">{workflow.name}</h3>
      
      <p className="workflow-description">
        {workflow.description || 'No description available'}
      </p>

      <div className="workflow-meta" style={{ marginTop: '1rem' }}>
        <span>{workflow.node_count} nodes</span>
        <span className="category-badge">{getCategory(workflow.filename)}</span>
      </div>

      {workflow.integrations && workflow.integrations.length > 0 && (
        <div className="workflow-integrations">
          <div className="integrations-title">Integrations:</div>
          <div className="integrations-list">
            {workflow.integrations.slice(0, 5).map((integration, index) => (
              <span key={index} className="integration-tag">
                {integration}
              </span>
            ))}
            {workflow.integrations.length > 5 && (
              <span className="integration-tag">
                +{workflow.integrations.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="workflow-actions">
        <button className="action-btn primary">
          View Details
        </button>
        <a 
          href={`/api/workflows/${workflow.filename}/download`}
          className="action-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default WorkflowCard;