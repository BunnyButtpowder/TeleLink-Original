import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {UsersListWrapper} from './data-list/DataList'
import {useIntl} from 'react-intl'

const DataPage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <PageTitle>{intl.formatMessage({id: 'DATA'})}</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export {DataPage}
