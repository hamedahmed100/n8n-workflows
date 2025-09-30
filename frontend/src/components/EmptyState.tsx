import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  hasFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, hasFilters }) => {
  return (
    <div className="state">
      <div className="icon">🔍</div>
      <h3>No Workflows Found</h3>
      <p>
        {searchQuery || hasFilters
          ? 'Try adjusting your search terms or filters to find more workflows.'
          : 'No workflows are currently available in the library.'}
      </p>
    </div>
  );
};

export default EmptyState;