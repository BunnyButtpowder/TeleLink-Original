import {useListView} from '../../core/ListViewProvider'
import {CustomersListToolbar} from './CustomersListToolbar'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const CustomersListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6 d-flex justify-content-end'>
      {/* <UsersListSearchComponent /> */}
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

export {CustomersListHeader}
