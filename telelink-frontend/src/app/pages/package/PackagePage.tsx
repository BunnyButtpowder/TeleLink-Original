import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {PackageListWrapper} from './packages-list/PackagesList'
import {useIntl} from 'react-intl'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Quản lý gói cước',
    path: '/packages',
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

const PackagePage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>{intl.formatMessage({id: 'ECOMMERCE.CELLPHONE.PLAN'})}</PageTitle>
              <PackageListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {PackagePage}
