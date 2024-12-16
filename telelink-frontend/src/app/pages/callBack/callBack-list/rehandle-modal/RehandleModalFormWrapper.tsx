import { useEffect } from 'react'
import {useQuery} from 'react-query'
import {RehandleModalForm} from './RehandleModalForm'
import {isNotEmpty, QUERIES} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
// import {getResultById} from '../../../reportCallResults/result-list/core/_requests'
import { initialResult } from '../core/_models'
import { getRehandleById } from '../core/_requests'

const RehandleModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: result,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getRehandleById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      refetchOnWindowFocus: false,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  if (isLoading) {
    console.log("Still loading no data yet...");
    return <div>Đang tải...</div>;
  }
  
  if (error) {
    return <div>Lỗi tải kết quả cuộc gọi</div>;
  }
  
  return (
    <RehandleModalForm
      isUserLoading={isLoading}
      result={result || initialResult}
    />
  );
}

export {RehandleModalFormWrapper}
