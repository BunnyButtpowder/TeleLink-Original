import {KTIcon} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {ReportListFilter} from './ReportListFilter'
import {useIntl} from 'react-intl'

const ReportListToolbar = () => {
  const intl = useIntl()
  const {setItemIdForUpdate} = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <ReportListFilter />

      {/* <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button>

      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        {intl.formatMessage({id: 'USERS.MANAGEMENT.ADD_USER'})}
      </button> */}
    </div>
  )
}

export {ReportListToolbar}
