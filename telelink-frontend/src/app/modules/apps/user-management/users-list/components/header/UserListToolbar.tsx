import { KTIcon } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'
import { useAuth } from '../../../../../auth'


const UsersListToolbar = () => {
  const { currentUser } = useAuth();
  const agencyID = currentUser?.agency?.id;
  const intl = useIntl()
  const { setItemIdForUpdate } = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        {agencyID == null && <UsersListFilter />}
        {/* begin::Export */}
        {/* <button type='button' className='btn btn-light-primary me-3'>
          <KTIcon iconName='exit-up' className='fs-2' />
          Export
        </button> */}
        {/* end::Export */}

        {/* begin::Add user */}
        <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
          <KTIcon iconName='plus' className='fs-2' />
          {intl.formatMessage({ id: 'USERS.MANAGEMENT.ADD_USER' })}
        </button>
        {/* end::Add user */}
      </div>
    </>
  )
}

export { UsersListToolbar }
