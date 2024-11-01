import {KTIcon} from '../../../../../../_metronic/helpers'
import { useState, useEffect } from 'react';
import {useListView} from '../../core/ListViewProvider'
import {UsersListFilter} from './UsersListFilter'
import {useIntl} from 'react-intl'
import { useAuth } from '../../../../../../app/modules/auth'
import { getData } from '../../core/_requests'
import { useQueryResponse } from '../../core/QueryResponseProvider';

const CustomersListToolbar = () => {
  const intl = useIntl()
  const {setItemIdForUpdate} = useListView();
  const {currentUser, setCurrentUserData} = useAuth();
  const { setDataDetails } = useQueryResponse();
  const [cooldown, setCooldown] = useState(false);
  const salesmanId = currentUser?.id;
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const fetchData = async () => {
    if(!salesmanId) return;

    try {
      const dataDetails = await getData(salesmanId);
      // Store data details in salesman's local storage or token
      localStorage.setItem(`dataDetails_${salesmanId}`, JSON.stringify(dataDetails));
      // setCurrentUserData({dataDetails});
      setDataDetails(dataDetails);
      console.log('Fetched data details:', dataDetails);
    } catch (error) {
      console.error('Failed to fetch data details:', error);
    }
  };

  const handleGetData = () => {
    fetchData();
    setCooldown(true);
    setTimeout(() => setCooldown(false), 15000); // 15 seconds cooldown
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      {/* begin::Get Data */}
      <button type='button' className='btn btn-light-primary me-3' onClick={handleGetData} disabled={cooldown}>
        <KTIcon iconName='exit-up' className='fs-2' />
        Lấy số
      </button>
      {/* end::Get Data */}

      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        {intl.formatMessage({id: 'CREATE.REPORT'})}
      </button>
      {/* end::Add user */}
    </div>
  )
}

export {CustomersListToolbar}
