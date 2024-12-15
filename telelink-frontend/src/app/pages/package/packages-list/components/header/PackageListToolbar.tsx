import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import {KTIcon} from '../../../../../../_metronic/helpers'
import { Package } from '../../core/_models'
import {useListView} from '../../core/ListViewProvider'
import {PackageListFilter} from './PackageListFilter'
import {useIntl} from 'react-intl'
import { ToastContainer, toast } from 'react-toastify';

import { useQueryResponse } from '../../core/QueryResponseProvider'

const PackageListToolbar: React.FC<{ onUploadComplete: (data: Package[]) => void }> = ({ onUploadComplete }) => {  
  const intl = useIntl()
  const {setItemIdForUpdate} = useListView()
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const { refetch } = useQueryResponse()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);

      try {
        const response = await importData(files);
        onUploadComplete(response.data);
        refetch();
        toast.success('Upload gói cước thành công!');
      } catch (error) {
        console.error('Error uploading the file: ', error);
        toast.error('Upload gói cước thất bại!');
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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
    <ToastContainer/>
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <PackageListFilter />

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
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        {intl.formatMessage({id: 'PACKAGE.MANAGEMENT.ADD_PACKAGE'})}
      </button>
      {/* end::Add user */}
    </div>
    </>
    
  )
}

export {PackageListToolbar}
