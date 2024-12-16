import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {CallBackListWrapper} from './callBack-list/CallBackList'
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

const CallBackPage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle>Xử lý lại</PageTitle>
              <CallBackListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {CallBackPage}
