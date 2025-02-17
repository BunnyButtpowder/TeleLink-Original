import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {KTCard, toAbsoluteUrl} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { DataRetrieveForm } from './components/widget/DataRetrieveForm'

const DataRetrieveList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
        {/* <DataRetrieveTable /> */}
        <DataRetrieveForm className='card-xl-stretch mb-xl-8' color='danger' img={toAbsoluteUrl('media/patterns/vector-1.png')} />
      {/* {itemIdForUpdate !== undefined && <AddReportModal />} */}
    </>
  )
}

const DataRetrieveListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DataRetrieveList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {DataRetrieveListWrapper}
