import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {ResultListWrapper} from './result-list/ResultList'
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

const ResultPage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle breadcrumbs={reportsBreadcrumbs}>{intl.formatMessage({id: 'MENU.REPORTS.CALL_RESULTS'})}</PageTitle>
              <ResultListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {ResultPage}
