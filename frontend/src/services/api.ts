import axios from 'axios';
import { WorkflowsResponse, WorkflowStats, WorkflowDetail, DiagramResponse } from '../types/workflow';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workflowApi = {
  // Get workflows with filters and pagination
  getWorkflows: async (params: {
    q?: string;
    trigger?: string;
    complexity?: string;
    active_only?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<WorkflowsResponse> => {
    const response = await api.get('/workflows', { params });
    return response.data;
  },

  // Get workflow statistics
  getStats: async (): Promise<WorkflowStats> => {
    const response = await api.get('/stats');
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<{ categories: string[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category mappings
  getCategoryMappings: async (): Promise<{ mappings: Record<string, string> }> => {
    const response = await api.get('/category-mappings');
    return response.data;
  },

  // Get workflow detail
  getWorkflowDetail: async (filename: string): Promise<WorkflowDetail> => {
    const response = await api.get(`/workflows/${filename}`);
    return response.data;
  },

  // Get workflow diagram
  getWorkflowDiagram: async (filename: string): Promise<DiagramResponse> => {
    const response = await api.get(`/workflows/${filename}/diagram`);
    return response.data;
  },

  // Get download URL for workflow
  getDownloadUrl: (filename: string): string => {
    return `${API_BASE_URL}/workflows/${filename}/download`;
  },
};

export default workflowApi;