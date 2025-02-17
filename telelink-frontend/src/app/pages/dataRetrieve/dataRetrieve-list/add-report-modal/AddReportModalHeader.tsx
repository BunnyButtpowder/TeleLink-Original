import {KTIcon} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {useIntl} from 'react-intl'

interface AddReportModalHeaderProps {
  onClose: () => void;
}

const AddReportModalHeader : React.FC<AddReportModalHeaderProps> = ({ onClose }) => {
  const {setItemIdForUpdate} = useListView()
  const intl = useIntl()
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Thu hồi dữ liệu</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={onClose}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export {AddReportModalHeader}
