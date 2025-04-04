/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  createResponseContext,
  createSingleResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  SingleObjectQueryResponseContextProps,
  QueryResponseContextProps,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import { Customer } from './_models'
import { useAuth } from '../../../../../app/modules/auth'

const QueryResponseContext = createSingleResponseContext<Customer>({
  response: undefined,
  refetch: () => { },
  isLoading: false,
  setDataDetails: (data: Customer | undefined) => { },
});

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { currentUser } = useAuth();
  const [dataDetails, setDataDetails] = useState<Customer | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const storedDataDetails = localStorage.getItem(`dataDetails_${currentUser.id}`);
      setDataDetails(storedDataDetails ? JSON.parse(storedDataDetails) : undefined);
    }
    setIsLoading(false);
  }, [currentUser]);

  const handleSetDataDetails = (data: Customer | undefined) => {
    setDataDetails(data);
    if (currentUser && data) {
      localStorage.setItem(`dataDetails_${currentUser.id}`, JSON.stringify(data));
    } else if (currentUser) {
      localStorage.removeItem(`dataDetails_${currentUser.id}`);
    }
  };

  return (
    <QueryResponseContext.Provider value={{ isLoading, refetch: () => { }, response: dataDetails, setDataDetails: handleSetDataDetails }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const { response } = useQueryResponse()

  return response ? [response] : [];
}

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
}
