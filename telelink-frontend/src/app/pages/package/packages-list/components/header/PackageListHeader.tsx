import {useListView} from '../../core/ListViewProvider'
import {PackageListToolbar} from './PackageListToolbar'
import {PackageListGrouping} from './PackageListGrouping'
import {PackageListSearchComponent} from './PackageListSearchComponent'
import {Package} from '../../core/_models'

type PackageListheaderProps = {
  onUploadComplete: (data: Package[]) => void
}
const PackageListHeader: React.FC <PackageListheaderProps> = ({ onUploadComplete }) => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <PackageListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <PackageListGrouping /> : <PackageListToolbar onUploadComplete={onUploadComplete}/>}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {PackageListHeader}
