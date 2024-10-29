import { KTIcon } from '../../../../../_metronic/helpers'
import { useIntl } from 'react-intl'

interface DataDistributionModalHeaderProps {
  onClose: () => void;
}

const DataDistributionModalHeader: React.FC<DataDistributionModalHeaderProps> = ({ onClose }) => {
  const intl = useIntl();
  const title = 'DATA.DISTRIBUTION';

  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>{intl.formatMessage({ id: title })}</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export { DataDistributionModalHeader }
