import {useListView} from '../../core/ListViewProvider'
import {DataListToolbar} from './BlackListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {UsersListSearchComponent} from './UsersListSearchComponent'
import {Blacklist} from '../../core/_models'

type BlackListHeaderProps = {
  onUploadComplete: (data: Blacklist[]) => void
}

const BlackListHeader: React.FC <BlackListHeaderProps> = ({ onUploadComplete }) => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
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

export {BlackListHeader}
