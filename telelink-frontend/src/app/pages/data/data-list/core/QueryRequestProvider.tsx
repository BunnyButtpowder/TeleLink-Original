/* eslint-disable react-refresh/only-export-components */
import {FC, useState, createContext, useContext} from 'react'
import {
  QueryState,
  QueryRequestContextProps,
  initialQueryRequest,
  WithChildren,
} from '../../../../../_metronic/helpers'
import axios from 'axios'
import { getAllData, getDataByAgency } from './_requests'

const API_URL = import.meta.env.VITE_APP_API_URL;
const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state)

  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = { ...state, ...updates };
    if (JSON.stringify(state) !== JSON.stringify(updatedState)) {
      setState(updatedState);
    }
  };

  return (
    <QueryRequestContext.Provider value={{state, updateState}}>
      {children}
    </QueryRequestContext.Provider>
  )
}

const useQueryRequest = () => useContext(QueryRequestContext)
export {QueryRequestProvider, useQueryRequest}
