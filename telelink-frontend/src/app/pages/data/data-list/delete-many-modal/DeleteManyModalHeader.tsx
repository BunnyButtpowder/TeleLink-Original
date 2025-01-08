import {KTIcon} from '../../../../../_metronic/helpers'
import {useIntl} from 'react-intl'


interface DeleteManyModalHeaderProps {
  onClose: () => void;
}

const DeleteManyModalHeader: React.FC<DeleteManyModalHeaderProps> = ({ onClose }) => {  
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Xóa dữ liệu</h2>
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

export {DeleteManyModalHeader}
