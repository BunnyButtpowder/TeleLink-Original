import { KTIcon } from '../../../../../../_metronic/helpers'
import { useState, useEffect } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../../app/modules/auth'
import { getData } from '../../core/_requests'
import { useQueryResponse } from '../../core/QueryResponseProvider';
import { AddReportModal } from '../../add-report-modal/AddReportModal';
import { BlacklistEditModal } from '../../blacklist-edit-modal/BlackListEditModal';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomersListToolbar = () => {
  const intl = useIntl()
  const { currentUser, setCurrentUserData } = useAuth();
  const [isAddReportModalOpen, setAddReportModalOpen] = useState(false)
  const [isBlacklistEditModalOpen, setBlacklistEditModalOpen] = useState(false)
  const { setDataDetails } = useQueryResponse();
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

  const fetchData = async () => {
    if (!salesmanId) return;

    try {
      const dataDetails = await getData(salesmanId);
      // Store data details in salesman's local storage or token
      localStorage.setItem(`dataDetails_${salesmanId}`, JSON.stringify(dataDetails));
      // setCurrentUserData({dataDetails});
      setDataDetails(dataDetails);
      console.log('Fetched data details:', dataDetails);
      toast.success('Lấy số thành công');
    } catch (error: any) {
      console.error('Failed to fetch data details:', error);
      const errorMessage = error.response?.data?.message
      toast.error(errorMessage);
    }
  };

  const handleGetData = () => {
    fetchData();
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

        {/* begin::Get Data */}
        <button type='button' className='btn btn-light-primary me-3' onClick={handleGetData} disabled={cooldown}>
          <KTIcon iconName='exit-up' className='fs-2' />
          Lấy số
        </button>
        {/* end::Get Data */}

        {/* begin: Add Blacklist */}
        <button type='button' className='btn btn-danger me-3' onClick={openBlacklistEditModal}>
          <KTIcon iconName='abstract-11' className='fs-2' />
          Chặn số
        </button>
        {/* end: Add Blacklist */}

        {/* begin::Add user */}
        <button type='button' className='btn btn-primary' onClick={openAddReportModal}>
          <KTIcon iconName='plus' className='fs-2' />
          {intl.formatMessage({ id: 'CREATE.REPORT' })}
        </button>
        {/* end::Add user */}
      </div>
      {isAddReportModalOpen && <AddReportModal onClose={closeAddReportModal} />}
      {isBlacklistEditModalOpen && <BlacklistEditModal onClose={closeBlacklistEditModal} />}
    </>
  )
}

export { CustomersListToolbar }
