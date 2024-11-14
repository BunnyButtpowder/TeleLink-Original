import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useIntl } from 'react-intl'
import { Blacklist } from '../../core/_models'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryResponse } from '../../core/QueryResponseProvider'


const BlackListToolbar: React.FC<{ onUploadComplete: (data: Blacklist[]) => void }> = ({ onUploadComplete }) => {
  const intl = useIntl()
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element
  const {setItemIdForUpdate} = useListView()

  const { refetch } = useQueryResponse()
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
        refetch();
        toast.success('Upload danh sách thành công!');
      } catch (error) {
        console.error('Error uploading the file: ', error);
        toast.error('Upload danh sách thất bại!');
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
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
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

export { BlackListToolbar }
