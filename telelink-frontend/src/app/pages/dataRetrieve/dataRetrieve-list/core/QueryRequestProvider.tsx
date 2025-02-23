/* eslint-disable react-refresh/only-export-components */
import {FC, useState, createContext, useContext, useEffect} from 'react'
import {
  QueryState,
  QueryRequestContextProps,
  initialQueryRequest,
  WithChildren,
} from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state)

  const updateState = (updates: Partial<QueryState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
      filter: {
        ...prevState.filter,
        ...(updates.filter || {}),
      },
    }))
  }

  return (
    <QueryRequestContext.Provider value={{state, updateState}}>
      {children}
    </QueryRequestContext.Provider>
  )
}

const useQueryRequest = () => useContext(QueryRequestContext)
export {QueryRequestProvider, useQueryRequest}
