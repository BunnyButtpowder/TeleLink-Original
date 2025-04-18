import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CustomersListHeader} from './components/header/CustomersListHeader'
import {CustomersTable} from './table/CustomersTable'
import {KTCard, toAbsoluteUrl} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { CustomerForm } from './components/widget/CustomerForm'

const CustomersList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
        {/* <CustomersTable /> */}
        <CustomerForm className='card-xl-stretch mb-xl-8' color='primary' img={toAbsoluteUrl('media/patterns/pattern-1.jpg')} />
      {/* {itemIdForUpdate !== undefined && <AddReportModal />} */}
    </>
  )
}

const CustomersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <CustomersList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CustomersListWrapper}
