import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CallBackListHeader} from './components/header/CallBackListHeader'
import {CallBackTable} from './table/CallBackTable'
import {RehandleModal} from './rehandle-modal/RehandleModal'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const CallBackList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <CallBackListHeader /> */}
        <CallBackTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <RehandleModal />}
    </>
  )
}

const CallBackListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <CallBackList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CallBackListWrapper}
