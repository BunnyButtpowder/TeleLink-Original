import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { DataListFilter } from './DataListFilter'
import { useIntl } from 'react-intl'
import { Data } from '../../core/_models'
import { DataDistributionModal } from '../../data-distribution-modal/DataDistributionModal'
import { DeleteManyModal } from '../../delete-many-modal/DeleteManyModal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { useAuth } from '../../../../../../app/modules/auth'

const DataListToolbar: React.FC<{ onUploadComplete: (data: Data[]) => void, onRefresh: () => void }> = ({ onUploadComplete, onRefresh }) => {
  const intl = useIntl()
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false)
  const [isDeleteManyModalOpen, setDeleteManyModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const { refetch } = useQueryResponse()
  const { currentUser } = useAuth()
  const userRole = currentUser?.auth.role

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);
      setProgress(0);
      try {
        const response = await importData(files, (progressEvent: any) => {
          const total = progressEvent.total || 1;
          const percentCompleted = Math.round((progressEvent.loaded / total) * 100);
          setProgress(percentCompleted);
        });
        onUploadComplete(response.data);
        refetch();
        toast.success('Upload data thành công!');
      } catch (error) {
        console.error('Error uploading the file: ', error);
        toast.error('Upload data thất bại!');
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onRefresh()
      }
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const openDataDistributionModal = () => {
    setDistributionModalOpen(true);
  }

  const closeDataDistributionModal = () => {
    setDistributionModalOpen(false);
    onRefresh();
  }

  const openDeleteManyModal = () => {
    setDeleteManyModalOpen(true);
  }

  const closeDeleteManyModal = () => {    
    setDeleteManyModalOpen(false);
    onRefresh();
  }
  
  return (
    <>
      <ToastContainer />
      {/* Progress bar */}
      {/* {uploading && (
        <div className='progress mt-3' style={{ height: '20px' }}>
          <div className='progress-bar progress-bar-striped progress-bar-animated'
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {progress}%
          </div>
        </div>
      )} */}
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <button className='btn btn-danger me-3' onClick={openDeleteManyModal}>
            <KTIcon iconName='abstract-11' className='fs-2' />
            Xóa nhiều Dữ liệu
      </button>
        <DataListFilter />

        {userRole === 1 && (
          
          <>
          <button className='btn btn-danger me-3' onClick={openDeleteManyModal}>
            <KTIcon iconName='abstract-11' className='fs-2' />
            Xóa dữ liệu
          </button>
            {/* begin::Upload data */}
            < input
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
          </>
        )}

        {/* begin::Distribute Data */}
        <button type='button' className='btn btn-primary' onClick={openDataDistributionModal}>
          <KTIcon iconName='share' className='fs-2' />
          {intl.formatMessage({ id: 'DATA.DISTRIBUTION' })}
        </button>
        {/* end::Distribute Data */}
      </div>
      {isDistributionModalOpen && <DataDistributionModal onClose={closeDataDistributionModal} />}
      {isDeleteManyModalOpen && <DeleteManyModal onClose={closeDeleteManyModal} />}
    </>
  )
}

export { DataListToolbar }
