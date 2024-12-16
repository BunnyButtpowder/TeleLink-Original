import {KTIcon} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {useIntl} from 'react-intl'

const RehandleModalHeader = () => {
  const {setItemIdForUpdate} = useListView()
  const intl = useIntl()
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Báo cáo gọi lại</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForUpdate(undefined)}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export {RehandleModalHeader}
