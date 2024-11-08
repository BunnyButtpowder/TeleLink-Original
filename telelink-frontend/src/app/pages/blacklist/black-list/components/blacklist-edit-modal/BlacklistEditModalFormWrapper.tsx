import { useQuery } from 'react-query'
import { BlacklistEditModalForm } from './BlacklistEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { getBlacklistById } from '../../core/_requests'
import { initialBlacklist } from '../../core/_models'
import { useEffect } from 'react'

const BlacklistEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = itemIdForUpdate !== null && isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: number,
    error,
  } = useQuery(
    [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
    () => getBlacklistById(itemIdForUpdate),
    {
      cacheTime: 0,
      enabled: enabledQuery,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  );

  if (isLoading) {
    console.log("Still loading no data yet...");
    return <div>Đang tải...</div>;
  }

  if (!itemIdForUpdate) {
    return <BlacklistEditModalForm isUserLoading={isLoading} number={initialBlacklist}/>
  }

  if (!isLoading && !error && number) {
    return <BlacklistEditModalForm isUserLoading={isLoading} number={number}/>
  }

  return <div>Lỗi tải thông tin người dùng!</div>
}

export { BlacklistEditModalFormWrapper }
