import { Dispatch, SetStateAction } from 'react'

export type ID = undefined | null | number

export type PaginationState = {
  page: number
  items_per_page: 10 | 30 | 50 | 100,
  total_pages?: number
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: {
    role?: number
    last_login?: string
    placeOfIssue?: string
    networkName?: string
    type?: string
    provider?: string
    saleman?: number
    agencyId?: number
    result?: number
    gender?: string
    agency?: number 
    date?: string
    month?: string
    year?: string
  }
}

export type SearchState = {
  search?: string
}

export type Response<T> = {
  data?: T
  count?: number
  currentPage?: number
  perPage?: number
  totalCount?: number
  totalPages?: number
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    placeOfIssue: '',
    networkName: '',
  },
}

export const initialResultState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    month: undefined,
    year: undefined,
    agency: undefined,
    result: undefined,
    saleman: undefined,
  },
}

export const initialPackageQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    provider: '',
    type: '',
  },
}

export const initialUserQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    role: undefined,
    agency: undefined
  },
}

export const initialResultQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    date: '',
    agencyId: undefined,
    result: undefined,
  },
}

export const initialReportQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  filter: {
    date: '',
  },
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => { },
}

export type SingleObjectQueryResponseContextProps<T> = {
  response?: T | undefined;
  refetch: () => void;
  isLoading: boolean;
  setDataDetails: (data: T | undefined) => void;
};

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = { refetch: () => { }, isLoading: false, query: '' }

export type ExtendedResponse<T> = T & {
  networks?: Record<string, { count: number }>;
};

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => { },
  onSelectAll: () => { },
  clearSelected: () => { },
  setItemIdForUpdate: () => { },
  isAllSelected: false,
  disabled: false,
}
