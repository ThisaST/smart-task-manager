/**
 * Common Types and Interfaces
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

/**
 * Common component props
 */
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Loading states for async operations
 */
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

/**
 * Common filter and sort interfaces
 */
export interface BaseFilter {
  searchQuery: string
}

export interface BaseSortConfig {
  field: string
  direction: 'asc' | 'desc'
} 