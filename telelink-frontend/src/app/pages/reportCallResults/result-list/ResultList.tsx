import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ResultListHeader} from './components/header/ResultListHeader'
import {ResultsTable} from './table/ResultsTable'
import {ResultEditModal} from './result-edit-modal/ResultEditModal'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const ResultList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <ResultListHeader />
        <ResultsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <ResultEditModal />}
    </>
  )
}

const ResultListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <ResultList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ResultListWrapper}
