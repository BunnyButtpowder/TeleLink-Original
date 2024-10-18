import React, { useState, useRef } from 'react'
import { importData } from '../../core/_requests'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useIntl } from 'react-intl'
import { Data } from '../../core/_models'

const DataListToolbar: React.FC<{ onUploadComplete: (data: Data[]) => void }> = ({ onUploadComplete }) => {
  const intl = useIntl()
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input element

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0];
    if (files) {
      setUploading(true);

      try {
        const response = await importData(files);
        onUploadComplete(response.data);
        alert('Upload data thành công!');
      } catch (error) {
        console.error('Error uploading the file: ', error);
        alert('Upload data thất bại!');
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
          {uploading ? 'Đang tải lên...' : 'Tải dữ liệu lên'}
        </button>
      </label>
      {/* end::Upload data */}
    </div>
  )
}

export { DataListToolbar }
