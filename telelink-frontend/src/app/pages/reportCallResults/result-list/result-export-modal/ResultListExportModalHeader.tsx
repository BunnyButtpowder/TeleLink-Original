import {KTIcon} from '../../../../../_metronic/helpers'
import {useIntl} from 'react-intl'


interface BlacklistEditModalHeaderProps {
  onClose: () => void;
}

const UserEditModalHeader: React.FC<BlacklistEditModalHeaderProps> = ({ onClose }) => {
  const intl = useIntl();
  
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>{'Xuất báo cáo cuộc gọi'}</h2>
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

export {UserEditModalHeader}
