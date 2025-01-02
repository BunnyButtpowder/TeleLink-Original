import React, { useState, useRef } from 'react'
import { importData, exportSample } from '../../core/_requests'
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
import { UploadDataModal } from '../../upload-data-modal/UploadDataModal'
const DataListToolbar: React.FC<{ onUploadComplete: (data: Data[]) => void, onRefresh: () => void }> = ({ onUploadComplete, onRefresh }) => {
  const intl = useIntl()
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false)
  const [isDeleteManyModalOpen, setDeleteManyModalOpen] = useState(false)
  const [isUploadModalOpen, setUploadModalOpen] = useState(false); // State for UploadDataModal

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const { refetch } = useQueryResponse()
  const { currentUser } = useAuth()
  const userRole = currentUser?.auth.role

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files?.[0];
  //   if (files) {
  //     setUploading(true);
  //     setProgress(0);
  //     try {
  //       const response = await importData(files, (progressEvent: any) => {
  //         const total = progressEvent.total || 1;
  //         const percentCompleted = Math.round((progressEvent.loaded / total) * 100);
  //         setProgress(percentCompleted);
  //       });
  //       onUploadComplete(response.data);
  //       refetch();
  //       toast.success('Upload data thành công!');
  //     } catch (error) {
  //       console.error('Error uploading the file: ', error);
  //       toast.error('Upload data thất bại!');
  //     } finally {
  //       setUploading(false);
  //       if (fileInputRef.current) {
  //         fileInputRef.current.value = '';
  //       }
  //       onRefresh()
  //     }
  //   }
  // };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    onRefresh();
  };

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

  const handleExportExcel = async () => {
    try {
      await exportSample();
      toast.success('Xuất báo cáo thành công');
    } catch (error) {
      toast.error('Có lỗi trong quá trình xuất báo cáo: ' + error);
    }
  };
  
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
      <button
        type="button"
        className="btn btn-success me-3"
        onClick={handleExportExcel}
      >
        <KTIcon iconName="exit-up" className="fs-2" />
        Xuất mẫu
      </button>
        <DataListFilter />

        {userRole === 1 && (
          <>
            <button className="btn btn-danger me-3" onClick={openDeleteManyModal}>
              <KTIcon iconName="abstract-11" className="fs-2" />
              Xóa dữ liệu
            </button>
            <button type="button" className="btn btn-light-primary me-3" onClick={openUploadModal}>
              <KTIcon iconName="upload" className="fs-2" />
              Upload dữ liệu
            </button>
          </>
        )}

        {/* begin::Distribute Data */}
        <button type='button' className='btn btn-primary' onClick={openDataDistributionModal}>
          <KTIcon iconName='share' className='fs-2' />
          {intl.formatMessage({ id: 'DATA.DISTRIBUTION' })}
        </button>
        {/* end::Distribute Data */}
      </div>
      {isUploadModalOpen && <UploadDataModal onClose={closeUploadModal} />}
      {isDistributionModalOpen && <DataDistributionModal onClose={closeDataDistributionModal} />}
      {isDeleteManyModalOpen && <DeleteManyModal onClose={closeDeleteManyModal} />}
    </>
  )
}

export { DataListToolbar }
