import React, { useState, useEffect, useCallback } from 'react';
import { Workflow, WorkflowStats, WorkflowFilters, WorkflowDetail } from '../types/workflow';
import { workflowApi } from '../services/api';
import WorkflowCard from './WorkflowCard';
import WorkflowModal from './WorkflowModal';
import SearchFilters from './SearchFilters';
import StatsHeader from './StatsHeader';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const WorkflowApp: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WorkflowFilters>({
    trigger: '',
    complexity: '',
    category: '',
    activeOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflowDetail, setWorkflowDetail] = useState<WorkflowDetail | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const perPage = 12;

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load workflows when filters change
  useEffect(() => {
    if (stats) { // Only load workflows after initial data is loaded
      loadWorkflows(true);
    }
  }, [searchQuery, filters]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, categoriesData, mappingsData] = await Promise.all([
        workflowApi.getStats(),
        workflowApi.getCategories(),
        workflowApi.getCategoryMappings(),
      ]);

      setStats(statsData);
      setCategories(categoriesData.categories);
      setCategoryMap(new Map(Object.entries(mappingsData.mappings)));

      // Load initial workflows
      await loadWorkflows(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkflows = async (reset = false) => {
    try {
      if (reset) {
        setCurrentPage(1);
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
      }

      const page = reset ? 1 : currentPage + 1;
      
      const params = {
        q: searchQuery || undefined,
        trigger: filters.trigger || undefined,
        complexity: filters.complexity || undefined,
        active_only: filters.activeOnly || undefined,
        page,
        per_page: perPage,
      };

      const response = await workflowApi.getWorkflows(params);

      if (reset) {
        setWorkflows(response.workflows);
      } else {
        setWorkflows(prev => [...prev, ...response.workflows]);
        setCurrentPage(page);
      }

      setTotalPages(response.pages);
      setTotalCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<WorkflowFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleWorkflowClick = async (workflow: Workflow) => {
    try {
      setSelectedWorkflow(workflow);
      const detail = await workflowApi.getWorkflowDetail(workflow.filename);
      setWorkflowDetail(detail);
    } catch (err) {
      console.error('Failed to load workflow detail:', err);
      setWorkflowDetail(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedWorkflow(null);
    setWorkflowDetail(null);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      loadWorkflows(false);
    }
  };

  const handleRetry = () => {
    loadInitialData();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error && !stats) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="workflow-app">
      <StatsHeader stats={stats} />
      
      <div className="controls">
        <div className="container">
          <SearchFilters
            searchQuery={searchQuery}
            filters={filters}
            categories={categories}
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            onThemeToggle={toggleTheme}
            isDarkMode={isDarkMode}
          />
          
          <div className="results-info">
            Showing {workflows.length} of {totalCount} workflows
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>
      </div>

      <main className="main">
        <div className="container">
          {error && (
            <div className="error-banner" style={{
              background: 'var(--error)',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {workflows.length === 0 && !isLoading ? (
            <EmptyState 
              searchQuery={searchQuery}
              hasFilters={Object.values(filters).some(f => f)}
            />
          ) : (
            <>
              <div className="workflow-grid">
                {workflows.map((workflow) => (
                  <WorkflowCard
                    key={workflow.filename}
                    workflow={workflow}
                    categoryMap={categoryMap}
                    onClick={() => handleWorkflowClick(workflow)}
                  />
                ))}
              </div>

              {currentPage < totalPages && (
                <div className="load-more">
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedWorkflow && (
        <WorkflowModal
          workflow={selectedWorkflow}
          workflowDetail={workflowDetail}
          categoryMap={categoryMap}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WorkflowApp;