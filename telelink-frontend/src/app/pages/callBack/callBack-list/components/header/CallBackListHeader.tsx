import {useListView} from '../../core/ListViewProvider'
import {CallBackListToolbar} from './CallBackListToolbar'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const CallBackListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6 d-flex justify-content-end'>
      {/* <UsersListSearchComponent /> */}
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        <CallBackListToolbar />
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {CallBackListHeader}
