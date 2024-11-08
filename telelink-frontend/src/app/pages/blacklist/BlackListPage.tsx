import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {BlackListWrapper} from './black-list/BlackList'
import {useIntl} from 'react-intl'
import { ToastContainer } from 'react-bootstrap'

const blacklistBreadcrumbs: Array<PageLink> = [
  {
    title: 'Danh sách chặn',
    path: '#',
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

const BlackListPage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle  breadcrumbs={blacklistBreadcrumbs}>{intl.formatMessage({id: 'ECOMMERCE.BLACKLIST'})}</PageTitle>
              <BlackListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {BlackListPage}
