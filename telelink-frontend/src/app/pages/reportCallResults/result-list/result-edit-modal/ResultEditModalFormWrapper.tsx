import {useQuery} from 'react-query'
import {ResultEditModalForm} from './ResultEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getResultById} from '../core/_requests'
import { initialCallResult } from '../core/_models'

const ResultEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: result,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getResultById(itemIdForUpdate)
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
    <ResultEditModalForm
      isUserLoading={isLoading}
      result={result || initialCallResult}
    />
  );
}

export {ResultEditModalFormWrapper}
