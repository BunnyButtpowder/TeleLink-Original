import { useQuery } from 'react-query'
import { PackageEditModalForm } from './PackageEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getPackageById } from '../core/_requests'
import { initialPackage } from '../core/_models'
import { useEffect } from 'react'

const PackageEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const enabledQuery: boolean = itemIdForUpdate !== null && isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: pack,
    error,
  } = useQuery(
    [`${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`],
    () => getPackageById(itemIdForUpdate),
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
    return <PackageEditModalForm isUserLoading={isLoading} pack={initialPackage}/>
  }

  if (!isLoading && !error && pack) {
    return <PackageEditModalForm isUserLoading={isLoading} pack={pack}/>
  }

  return <div>Lỗi tải thông tin gói cước!</div>
}

export { PackageEditModalFormWrapper }
