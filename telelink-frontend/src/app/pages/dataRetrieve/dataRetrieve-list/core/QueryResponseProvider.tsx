import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import { FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import { getAllDataAssignedAgency, getSalemanDataAssignedByAgencyID } from './_requests'
import { Branch } from './_models'
import { useQueryRequest } from './QueryRequestProvider'
import { useAuth } from '../../../../../app/modules/auth'


const QueryResponseContext = createResponseContext<Branch>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])
  const navigate = useNavigate()

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  // useEffect(() => {
  //   if (query !== updatedQuery && updatedQuery.includes("search")) {
  //     console.log("Query change detected:", query, updatedQuery);
  //     setQuery(updatedQuery);
  //   }
  // }, [updatedQuery]);

  useEffect(() => {
    if (userRole === 3) {
      navigate('/error/404');
    }
  }, [userRole, navigate])

  const fetchData = async () => {
    // console.log('fetchData called with state:', state);
    if (!state.search && !state.page) {
      return { data: [], count: 0 }; // Prevent unnecessary API call
    }
    const { search = '', sort = '', order = '', page = 1, items_per_page = 8 } = state;

    if (userRole === 1) {
      const response = await getAllDataAssignedAgency({ search: search, sort, order, page, limit: 8 });
      return {
        data: response.branches,
        currentPage: response.currentPage,
        totalBranches: response.totalBranches,
        totalPages: response.totalPages
      };
    } else if (userRole === 2 && agencyId) {
      const response = await getSalemanDataAssignedByAgencyID(agencyId, search);
      const salesmenData = response.data;
      const groupedBranches = salesmenData.reduce((acc: { [key: string]: any }, salesman) => {
        const { agency, user, userName, totalData, categories } = salesman;

        if (!acc[agency]) {
          acc[agency] = {
            branchId: agencyId,
            branchName: agency,
            assignedData: [],
            unassignedData: {},
            unassignedTotal: 0
          };
        }

        acc[agency].assignedData.push({ user, userName, totalData, categories });

        return acc;
      }, {});

      // Convert object to array
      const transformedData = Object.values(groupedBranches);

      // console.log("Transformed Data for Agency:", transformedData); // Debugging
      return {
        data: transformedData,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
        totalPages: response.totalPages
      };
    } else {
      return Promise.resolve({ data: [], count: 0 });
    }
  };

  const { isFetching, refetch, data: response } = useQuery(
    [`${QUERIES.USERS_LIST}-${query}`],
    fetchData,
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )

  return (
    <QueryResponseContext.Provider value={{ isLoading: isFetching, refetch, response, query }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const { response } = useQueryResponse()
  if (!response) {
    return []
  }

  return response?.data || []
}


const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    ...initialQueryState
  }

  const { response } = useQueryResponse()
  if (!response) {
    return defaultPaginationState
  }

  return {
    page: response.currentPage,
    items_per_page: response.perPage,
    total: response.totalCount,
    total_pages: response.totalPages,
  }
}

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
