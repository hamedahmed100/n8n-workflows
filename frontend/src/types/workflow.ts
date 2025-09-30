export interface Workflow {
  filename: string;
  name: string;
  description: string;
  active: boolean;
  trigger_type: string;
  complexity: 'low' | 'medium' | 'high';
  node_count: number;
  integrations: string[];
}

export interface WorkflowStats {
  total: number;
  active: number;
  total_nodes: number;
  unique_integrations: number;
}

export interface WorkflowFilters {
  trigger: string;
  complexity: string;
  category: string;
  activeOnly: boolean;
}

export interface WorkflowState {
  workflows: Workflow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  isLoading: boolean;
  searchQuery: string;
  filters: WorkflowFilters;
  categories: string[];
  categoryMap: Map<string, string>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface WorkflowsResponse {
  workflows: Workflow[];
  total: number;
  pages: number;
}

export interface WorkflowDetail {
  raw_json: any;
}

export interface DiagramResponse {
  diagram: string;
}