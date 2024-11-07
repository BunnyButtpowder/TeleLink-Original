import React, { useState, useRef } from 'react'
import { importData, getAllData} from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { Data } from '../../core/_models'
import { DataDistributionModal } from '../../data-distribution-modal/DataDistributionModal'
import { Modal, Button } from 'react-bootstrap' 





const DataListToolbar: React.FC<{ onUploadComplete: (data: Data[]) => void }> = ({ onUploadComplete }) => {
  const intl = useIntl()
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false)
  const [isAlertModalOpen, setAlertModalOpen] = useState(false) // State for Alert Modal
  const [alertMessage, setAlertMessage] = useState('') // State for the alert message
  const [uploading, setUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element


 
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);

      try {
        const response = await importData(files);
        onUploadComplete(response.data);
        setAlertMessage("Upload data thành công");
        setIsSuccess(true)
        setAlertModalOpen(true);
       
      } catch (error) {
        console.error('Error uploading the file: ', error);
        setAlertMessage("Upload data thất bại");
        setIsSuccess(false)
        setAlertModalOpen(true); 
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

  const openDataDistributionModal = () => {
    setDistributionModalOpen(true);
  }

  const closeDataDistributionModal = () => {
    setDistributionModalOpen(false);
  }

  const closeAlertModal = () => {
    setAlertModalOpen(false);
  }

  return (
    <>
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

        {/* begin::Distribute Data */}
        <button type='button' className='btn btn-primary' onClick={openDataDistributionModal}>
          <KTIcon iconName='share' className='fs-2' />
          {intl.formatMessage({ id: 'DATA.DISTRIBUTION' })}
        </button>
        {/* end::Distribute Data */}
      </div>

      {/* Alert Modal */}
      <Modal show={isAlertModalOpen} onHide={closeAlertModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom text-center">
          {isSuccess ? (
            <>
              <div>{alertMessage}</div>
            </>
          ) : (
            <div>{alertMessage}</div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeAlertModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data Distribution Modal */}
      {isDistributionModalOpen && <DataDistributionModal onClose={closeDataDistributionModal} />}
    </>
  )
}

export { DataListToolbar }
