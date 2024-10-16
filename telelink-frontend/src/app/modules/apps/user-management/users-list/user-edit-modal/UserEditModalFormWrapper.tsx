import { useQuery } from 'react-query'
import { UserEditModalForm } from './UserEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getUserById } from '../core/_requests'
import { initialUser } from '../core/_models'
import { useEffect } from 'react'

const UserEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = itemIdForUpdate !== null && isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
    () => getUserById(itemIdForUpdate),
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
    return <UserEditModalForm isUserLoading={isLoading} user={initialUser}/>
  }

  if (!isLoading && !error && user) {
    return <UserEditModalForm isUserLoading={isLoading} user={user}/>
  }

  return <div>Lỗi tải thông tin người dùng!</div>
}

export { UserEditModalFormWrapper }
