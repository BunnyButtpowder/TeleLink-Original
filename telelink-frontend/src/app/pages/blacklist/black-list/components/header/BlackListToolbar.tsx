import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { Blacklist } from '../../core/_models'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataListToolbar: React.FC<{ onUploadComplete: (data: Blacklist[]) => void }> = ({ onUploadComplete }) => {
  const intl = useIntl()
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const {setItemIdForUpdate} = useListView()
  const openAddBlacklistModal = () => {
    setItemIdForUpdate(null)
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);

      try {
        const response = await importData(files);
        onUploadComplete(response.data);
        alert('Upload blacklist thành công!');
      } catch (error) {
        console.error('Error uploading the file: ', error);
        alert('Upload blacklist thất bại!');
      } finally {
        setUploading(false);
      }
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        <UsersListFilter />

        {/* begin::Upload data */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          id="fileInput"
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <label htmlFor="fileInput">
          <button
            type="button"
            className="btn btn-light-primary me-3"
            disabled={uploading}
            onClick={triggerFileUpload}
          >
            <KTIcon iconName="exit-up" className="fs-2" />
            {uploading ? 'Đang tải lên...' : 'Upload dữ liệu'}
          </button>
        </label>
        {/* end::Upload data */}
        
        {/* begin::Add user */}
          <button type='button' className='btn btn-primary' onClick={openAddBlacklistModal}>
            <KTIcon iconName='plus' className='fs-2' />
          {intl.formatMessage({id: 'BLACKLIST.MANAGEMENT.ADD_BLACKLIST'})}
          </button>
      {/* end::Add user */}
      </div>
      
     
    </>
  )
}

export { DataListToolbar }
