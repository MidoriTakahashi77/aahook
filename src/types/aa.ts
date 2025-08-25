/**
 * ASCII Art related type definitions
 */

export interface AAMetadata {
  name: string;
  displayName: string;
  description: string;
  author: string;
  tags: string[];
  suggestedHooks?: {
    success?: string[];
    error?: string[];
  };
}

export interface CategoryMetadata {
  name: string;
  displayName: string;
  description: string;
  arts: AAMetadata[];
}

export interface AA {
  category: string;
  name: string;
  content: string;
  metadata?: AAMetadata;
}

export interface IndexData {
  version: string;
  updated: string;
  categories: CategoryInfo[];
  total: number;
}

export interface CategoryInfo {
  name: string;
  displayName: string;
  count: number;
}

export interface HookSuggestion {
  command: string;
  type: 'success' | 'error';
}

export interface InstallOptions {
  overwrite?: boolean;
  autoConfig?: boolean;
}

export interface GalleryOptions {
  category?: string;
  limit?: number;
}

export interface BrowseOptions {
  cache?: boolean;
}

export interface PreviewOptions {
  remote?: boolean;
}