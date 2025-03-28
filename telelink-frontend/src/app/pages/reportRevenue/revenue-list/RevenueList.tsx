import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {RevenueTable} from './table/RevenueTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const RevenueList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <RevenueTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const RevenueListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <RevenueList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {RevenueListWrapper}
