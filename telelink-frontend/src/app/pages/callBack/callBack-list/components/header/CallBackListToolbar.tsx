import { KTIcon } from '../../../../../../_metronic/helpers'
import { useState, useEffect } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../modules/auth'
import { useQueryResponse } from '../../core/QueryResponseProvider';
import { RehandleModal } from '../../rehandle-modal/RehandleModal';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CallBackListToolbar = () => {
  const intl = useIntl()
  const { currentUser, setCurrentUserData } = useAuth();
  const [isAddReportModalOpen, setAddReportModalOpen] = useState(false)
  const [isBlacklistEditModalOpen, setBlacklistEditModalOpen] = useState(false)
  const [cooldown, setCooldown] = useState(false);
  const salesmanId = currentUser?.id;
  const COOLDOWN_TIME = 15000;

  const getRemainingCooldown = (): number => {
    const savedTimestamp = localStorage.getItem(`cooldown_${salesmanId}`);
    if (savedTimestamp) {
      const elapsedTime = Date.now() - parseInt(savedTimestamp);
      return COOLDOWN_TIME - elapsedTime;
    }
    return 0;
  }

  useEffect(() => {
    const remainingCooldown = getRemainingCooldown();
    if (remainingCooldown > 0) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), remainingCooldown);
    }
  }, [salesmanId]);

  const openAddReportModal = () => {
    setAddReportModalOpen(true);
  }

  const closeAddReportModal = () => {
    setAddReportModalOpen(false);
  }
  
  const openBlacklistEditModal = () => {
    setBlacklistEditModalOpen(true);
  }

  const closeBlacklistEditModal = () => {
    setBlacklistEditModalOpen(false);
  }

  const handleGetData = () => {
    setCooldown(true);
    const timestamp = Date.now();
    localStorage.setItem(`cooldown_${salesmanId}`, timestamp.toString());

    setTimeout(() => {
      setCooldown(false),
      localStorage.removeItem(`cooldown_${salesmanId}`);
    }, COOLDOWN_TIME); // 15 seconds cooldown
  }

  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        {/* <UsersListFilter /> */}

        {/* begin::Add user */}
        <button type='button' className='btn btn-primary' onClick={openAddReportModal}>
          <KTIcon iconName='plus' className='fs-2' />
          {intl.formatMessage({ id: 'CREATE.REPORT' })}
        </button>
        {/* end::Add user */}
      </div>
      {isAddReportModalOpen && <RehandleModal />}
    </>
  )
}

export { CallBackListToolbar }
