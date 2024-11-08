import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {BlackListReportWrapper} from './revenue-list/BlacklistReport'
import {useIntl} from 'react-intl'

const reportsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Báo cáo',
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

const RevenuePage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle breadcrumbs={reportsBreadcrumbs}>{intl.formatMessage({id: 'ECOMMERCE.BLACKLIST.REPORT'})}</PageTitle>
              <BlackListReportWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {RevenuePage}
