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

  useEffect(() => {
    if (userRole === 3) {
      navigate('/error/404');
    }
  }, [userRole, navigate])

  const fetchData = async () => {
    const { search = '', sort = '', order = '', filter = {}, page = 1, items_per_page = 10 } = state;

    const { placeOfIssue, networkName } = filter;
    if (userRole === 1) {
      const branches = await getAllDataAssignedAgency();
      return { data: branches };
    } else if (userRole === 2 && agencyId) {
      const response = await getSalemanDataAssignedByAgencyID(agencyId);
      const salesmenData = response.data;
      const groupedBranches = salesmenData.reduce((acc: { [key: string]: any }, salesman) => {
        const { agency, user, userName, totalData, categories } = salesman;
  
        if (!acc[agency]) {
          acc[agency] = {
            branchId: agencyId, // Assuming agencyId is unique
            branchName: agency,
            assignedData: [],
            unassignedData: {},
            unassignedTotal: 0
          };
        }
  
        acc[agency].assignedData.push({ user, userName, totalData, categories });
  
        return acc;
      }, {});
  
      // Convert object to array format
      const transformedData = Object.values(groupedBranches);
  
      console.log("Transformed Data for Agency:", transformedData); // Debugging
      return { data: transformedData };
    } else {
      return Promise.resolve({ data: [], count: 0 });
    }
  };

  const { isFetching, refetch, data: response } = useQuery(
    [`${QUERIES.USERS_LIST}-${query}`, state.filter],
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
