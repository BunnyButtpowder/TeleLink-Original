import { KTIcon } from '../../../../../../_metronic/helpers'
import { useState, useEffect } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../modules/auth'
import { useQueryResponse } from '../../core/QueryResponseProvider';
import { AddReportModal } from '../../add-report-modal/AddReportModal';
import React from 'react'
import clsx from 'clsx'

import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomersListToolbar = () => {
  const intl = useIntl()
  const { currentUser, setCurrentUserData } = useAuth();
  const [isAddReportModalOpen, setAddReportModalOpen] = useState(false)
  const [networkCategories, setNetworkCategories] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const salesmanId = currentUser?.id;

  const openAddReportModal = () => {
    setAddReportModalOpen(true);
  }

  const closeAddReportModal = () => {
    setAddReportModalOpen(false);
  }

  return (
    <>
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        {/* <UsersListFilter /> */}

        {/* begin::Add report */}
        <button type='button' className='btn btn-light-danger' onClick={openAddReportModal}>
          <KTIcon iconName='arrows-loop' className='fs-2' />
          Thu hồi
        </button>
        {/* end::Add report */}
      </div>
      {isAddReportModalOpen && <AddReportModal onClose={closeAddReportModal} />}
    </>
  )
}

export { CustomersListToolbar }
