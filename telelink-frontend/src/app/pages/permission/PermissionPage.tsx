import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { useIntl } from 'react-intl'
import { Permissions } from './components/Permissions'
import { Content } from '../../../_metronic/layout/components/content'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'

const PermissionPage = () => {
  const intl = useIntl()
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <>
              <ToastContainer />
              <Content>
                <Permissions />
              </Content>
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export { PermissionPage }
