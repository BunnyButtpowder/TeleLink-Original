import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { DataListFilter } from './DataListFilter'
import { useIntl } from 'react-intl'
import { Data } from '../../core/_models'
import { DataDistributionModal } from '../../data-distribution-modal/DataDistributionModal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryResponse } from '../../core/QueryResponseProvider'

const DataListToolbar: React.FC<{ onUploadComplete: (data: Data[]) => void }> = ({ onUploadComplete }) => {
  const intl = useIntl()
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const { refetch } = useQueryResponse()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);

      try {
        const response = await importData(files);
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
  }

  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        <DataListFilter />

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

        {/* begin::Distribute Data */}
        <button type='button' className='btn btn-primary' onClick={openDataDistributionModal}>
          <KTIcon iconName='share' className='fs-2' />
          {intl.formatMessage({ id: 'DATA.DISTRIBUTION' })}
        </button>
        {/* end::Distribute Data */}
      </div>
      {isDistributionModalOpen && <DataDistributionModal onClose={closeDataDistributionModal} />}
    </>
  )
}

export { DataListToolbar }
