import React, { useState, useEffect } from 'react';
import { Workflow, WorkflowDetail } from '../types/workflow';
import { workflowApi } from '../services/api';
import mermaid from 'mermaid';

interface WorkflowModalProps {
  workflow: Workflow;
  workflowDetail: WorkflowDetail | null;
  categoryMap: Map<string, string>;
  onClose: () => void;
}

const WorkflowModal: React.FC<WorkflowModalProps> = ({ 
  workflow, 
  workflowDetail, 
  categoryMap, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'json' | 'diagram'>('overview');
  const [diagram, setDiagram] = useState<string | null>(null);
  const [isLoadingDiagram, setIsLoadingDiagram] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({ 
      startOnLoad: true,
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'diagram' && !diagram) {
      loadDiagram();
    }
  }, [activeTab, workflow.filename]);

  const loadDiagram = async () => {
    try {
      setIsLoadingDiagram(true);
      const response = await workflowApi.getWorkflowDiagram(workflow.filename);
      setDiagram(response.diagram);
      
      // Render mermaid diagram
      setTimeout(() => {
        mermaid.init();
      }, 100);
    } catch (err) {
      console.error('Failed to load diagram:', err);
      setDiagram('graph TD\n    A[Error loading diagram]');
    } finally {
      setIsLoadingDiagram(false);
    }
  };

  const handleCopyJson = async () => {
    if (workflowDetail?.raw_json) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(workflowDetail.raw_json, null, 2));
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{workflow.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="tab-navigation" style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}>
            {(['overview', 'json', 'diagram'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  marginRight: '0.25rem'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="workflow-detail">
                <h4>Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Status:</strong> {workflow.active ? 'Active' : 'Inactive'}
                  </div>
                  <div>
                    <strong>Trigger:</strong> {workflow.trigger_type}
                  </div>
                  <div>
                    <strong>Complexity:</strong> {workflow.complexity}
                  </div>
                  <div>
                    <strong>Nodes:</strong> {workflow.node_count}
                  </div>
                  <div>
                    <strong>Category:</strong> {getCategory(workflow.filename)}
                  </div>
                  <div>
                    <strong>Filename:</strong> {workflow.filename}
                  </div>
                </div>
              </div>

              {workflow.description && (
                <div className="workflow-detail">
                  <h4>Description</h4>
                  <p>{workflow.description}</p>
                </div>
              )}

              {workflow.integrations && workflow.integrations.length > 0 && (
                <div className="workflow-detail">
                  <h4>Integrations ({workflow.integrations.length})</h4>
                  <div className="integrations-list">
                    {workflow.integrations.map((integration, index) => (
                      <span key={index} className="integration-tag">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="workflow-actions">
                <a 
                  href={workflowApi.getDownloadUrl(workflow.filename)}
                  className="action-btn primary"
                  download
                >
                  Download Workflow
                </a>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="json-tab">
              <div className="section-header">
                <h4>Raw JSON Data</h4>
                <button 
                  className={`copy-btn ${copyStatus === 'copied' ? 'copied' : ''}`}
                  onClick={handleCopyJson}
                >
                  {copyStatus === 'copied' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              
              {workflowDetail ? (
                <div className="json-viewer">
                  {JSON.stringify(workflowDetail.raw_json, null, 2)}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Loading workflow data...
                </div>
              )}
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="diagram-tab">
              <h4>Workflow Diagram</h4>
              
              {isLoadingDiagram ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Loading diagram...
                </div>
              ) : diagram ? (
                <div className="mermaid" key={workflow.filename}>
                  {diagram}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No diagram available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowModal;