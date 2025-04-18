import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import { CustomersPage } from '../pages/customer/CustomersPage'
import { CallBackPage } from '../pages/callBack/CallBackPage'
import { DataPage } from '../pages/data/DataPage'
import { RevenuePage } from '../pages/reportRevenue/RevenuePage'
import { ResultPage } from '../pages/reportCallResults/ResultPage'
import { PackagePage } from '../pages/package/PackagePage'
import { BlackListPage } from '../pages/blacklist/BlackListPage'
import { PermissionPage } from '../pages/permission/PermissionPage'
import { DataRetrievePage } from '../pages/dataRetrieve/DataRetrievePage'
// import { PlanPage } from '../pages/plan/PlanPage'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route
          path='data'
          element={
            <SuspensedView>
              <DataPage />
            </SuspensedView>
          }
        />
        <Route
          path='customers'
          element={
            <SuspensedView>
              <CustomersPage />
            </SuspensedView>
          }
        />
        <Route
          path='rehandle'
          element={
            <SuspensedView>
              <CallBackPage />
            </SuspensedView>
          }
        />
        <Route
          path='packages/*'
          element={
            <SuspensedView>
              <PackagePage />
            </SuspensedView>
          }
        />
        <Route
          path='reports/revenue'
          element={
            <SuspensedView>
              <RevenuePage />
            </SuspensedView>
          }
        />
        <Route
          path='reports/call-results'
          element={
            <SuspensedView>
              <ResultPage />
            </SuspensedView>
          }
        />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='blacklist'
          element={
            <SuspensedView>
              <BlackListPage />
            </SuspensedView>
          }
        />
        <Route
          path='permissions'
          element={
            <SuspensedView>
              <PermissionPage />
            </SuspensedView>
          }
        />
        <Route
          path='retrieve'
          element={
            <SuspensedView>
              <DataRetrievePage/>
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
