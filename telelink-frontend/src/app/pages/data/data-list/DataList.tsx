import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {DataEditModal} from './user-edit-modal/DataEditModal'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const DataList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <DataEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DataList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {UsersListWrapper}
