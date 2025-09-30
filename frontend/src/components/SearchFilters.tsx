import React from 'react';
import { WorkflowFilters } from '../types/workflow';

interface SearchFiltersProps {
  searchQuery: string;
  filters: WorkflowFilters;
  categories: string[];
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: Partial<WorkflowFilters>) => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  filters,
  categories,
  onSearchChange,
  onFilterChange,
  onThemeToggle,
  isDarkMode
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (key: keyof WorkflowFilters, value: string | boolean) => {
    onFilterChange({ [key]: value });
  };

  return (
    <>
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search workflows by name, description, or integration..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="theme-toggle" onClick={onThemeToggle}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Trigger:</label>
          <select
            value={filters.trigger}
            onChange={(e) => handleFilterChange('trigger', e.target.value)}
          >
            <option value="">All Triggers</option>
            <option value="Triggered">Event Triggered</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Webhook">Webhook</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Complexity:</label>
          <select
            value={filters.complexity}
            onChange={(e) => handleFilterChange('complexity', e.target.value)}
          >
            <option value="">All Complexities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={filters.activeOnly}
              onChange={(e) => handleFilterChange('activeOnly', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Active Only
          </label>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;