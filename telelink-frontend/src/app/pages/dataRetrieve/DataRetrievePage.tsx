import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {DataRetrieveListWrapper} from './dataRetrieve-list/DataRetrieveList'
import {useIntl} from 'react-intl'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Quản lý khách hàng',
    path: '/customers',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const DataRetrievePage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              {/* <PageTitle>{intl.formatMessage({id: 'ECOMMERCE.CUSTOMERS.CUSTOMERS'})}</PageTitle> */}
              <DataRetrieveListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {DataRetrievePage}
