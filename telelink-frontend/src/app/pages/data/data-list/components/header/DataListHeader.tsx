import React, { useState } from 'react'
import {useListView} from '../../core/ListViewProvider'
import {DataListToolbar} from './DataListToolbar'
import {DataListSearchComponent} from './DataListSearchComponent'
import {Data} from '../../core/_models'

type DataListHeaderProps = {
  onUploadComplete: (data: Data[]) => void
}

const DataListHeader: React.FC <DataListHeaderProps> = ({ onUploadComplete }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <DataListSearchComponent refreshTrigger={refreshTrigger}/>
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        <DataListToolbar 
          onUploadComplete={onUploadComplete} 
          onRefresh={handleRefresh}/>
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {DataListHeader}
