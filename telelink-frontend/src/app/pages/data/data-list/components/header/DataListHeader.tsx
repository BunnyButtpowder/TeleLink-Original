import {useListView} from '../../core/ListViewProvider'
import {DataListToolbar} from './DataListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {DataListSearchComponent} from './DataListSearchComponent'
import {Data} from '../../core/_models'

type DataListHeaderProps = {
  onUploadComplete: (data: Data[]) => void
}

const DataListHeader: React.FC <DataListHeaderProps> = ({ onUploadComplete }) => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <DataListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <DataListToolbar onUploadComplete={onUploadComplete}/>}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {DataListHeader}
