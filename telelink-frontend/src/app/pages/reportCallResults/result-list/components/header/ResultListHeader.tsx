import {useListView} from '../../core/ListViewProvider'
import {ResultListToolbar} from './ResultListToolbar'
import {ResultListGrouping} from './ResultListGrouping'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const ResultListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <ResultListGrouping /> : <ResultListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {ResultListHeader}
