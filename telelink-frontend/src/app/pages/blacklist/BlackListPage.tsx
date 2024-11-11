import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {BlackListWrapper} from './black-list/BlackList'
import {useIntl} from 'react-intl'

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
              <PageTitle>{intl.formatMessage({id: 'BLACKLIST'})}</PageTitle>
              <BlackListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {BlackListPage}
