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
import { Rehandle } from './_models'
import { useAuth } from '../../../../modules/auth'
import { getAllRehandles } from './_requests'

const QueryResponseContext = createSingleResponseContext<Rehandle>({
  response: undefined,
  refetch: () => { },
  isLoading: false,
  setDataDetails: (data: Rehandle | undefined) => { },
});

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { currentUser } = useAuth();
  const [dataDetails, setDataDetails] = useState<Rehandle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const storedDataDetails = localStorage.getItem(`dataDetails_${currentUser.id}`);
      setDataDetails(storedDataDetails ? JSON.parse(storedDataDetails) : undefined);
    }
    setIsLoading(false);
  }, [currentUser]);

  const handleSetDataDetails = (data: Rehandle | undefined) => {
    setDataDetails(data);
  };

  return (
    <QueryResponseContext.Provider value={{ isLoading, refetch: () => { }, response: dataDetails, setDataDetails: handleSetDataDetails }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = (): Rehandle [] => {
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
