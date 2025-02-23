import {useListView} from '../../core/ListViewProvider'
import {CustomersListToolbar} from './CustomersListToolbar'
import {DataRetrieveSearchComponent} from './DataRetrieveSearchComponent'

const DataRetrieveHeader = () => {
  const {selected} = useListView()
  return (
    <div className='border-0  d-flex justify-content-end'>
      <DataRetrieveSearchComponent/>
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        <CustomersListToolbar />
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {DataRetrieveHeader}
