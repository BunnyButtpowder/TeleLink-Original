import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import {KTIcon} from '../../../../../../_metronic/helpers'
import { Package } from '../../core/_models'
import {useListView} from '../../core/ListViewProvider'
import {PackageListFilter} from './PackageListFilter'
import {useIntl} from 'react-intl'
import { ToastContainer, toast } from 'react-toastify';
import { UploadPackageModal } from '../../upload-package-modal/UploadPackageModal'
import { ManageScheduledModal } from '../../manage-scheduled-package-modal/ManageScheduledModal'
import { useQueryResponse } from '../../core/QueryResponseProvider'

const PackageListToolbar: React.FC<{ onUploadComplete: (data: Package[]) => void }> = ({ onUploadComplete }) => {  
  const intl = useIntl()
  const {setItemIdForUpdate} = useListView()
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const { refetch } = useQueryResponse()

  const [isUploadModalOpen, setUploadModalOpen] = useState(false); // State for UploadDataModal
  const [isManageScheduledModalOpen, setManageScheduledModalOpen] = useState(false); // State for ManageScheduledModal
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const openManageScheduledModal = () => {
    setManageScheduledModalOpen(true);
  }
  const closeManageScheduledModal = () => {setManageScheduledModalOpen(false); refetch()};


  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files?.[0];
  //   const user = localStorage.getItem('currentUser') || '';
  //   const userId = JSON.parse(user).id;

  //   if (!userId) {
  //         toast.error('User ID is missing. Please log in again.');
  //         return;
  //       }

  //   if (files) {
  //     setUploading(true);

  //     try {
  //       const response = await importData(files, userId);
  //       onUploadComplete(response.data);
  //       refetch();
  //       toast.success('Upload gói cước thành công!');
  //     } catch (error) {
  //       console.error('Error uploading the file: ', error);
  //       toast.error('Upload gói cước thất bại!');
  //     } finally {
  //       setUploading(false);
  //       if (fileInputRef.current) {
  //         fileInputRef.current.value = '';
  //       }
  //     }
  //   }
  // };

  // const triggerFileUpload = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // }

  return (
    <>
    <ToastContainer/>
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <PackageListFilter />

      {/* begin::Upload data */}
      <button type="button" className="btn btn-light-primary me-3" onClick={openUploadModal}>
        <KTIcon iconName="exit-up" className="fs-2" />
        Upload gói cước
      </button>
        {/* end::Upload data */}
      <button type="button" className="btn btn-light-primary me-3" onClick={openManageScheduledModal} >
        <KTIcon iconName="calendar" className="fs-2" />
        Lịch upload
      </button>
      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        {intl.formatMessage({id: 'PACKAGE.MANAGEMENT.ADD_PACKAGE'})}
      </button>
      {/* end::Add user */}
    </div>
    {isUploadModalOpen && <UploadPackageModal onClose={closeUploadModal} />}
    {isManageScheduledModalOpen && <ManageScheduledModal onClose={closeManageScheduledModal} />}
    </>
    
  )
}

export {PackageListToolbar}
