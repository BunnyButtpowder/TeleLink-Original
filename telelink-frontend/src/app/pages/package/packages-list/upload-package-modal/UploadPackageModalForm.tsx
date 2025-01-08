import React, { FC, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useQueryResponse } from '../core/QueryResponseProvider';
import { importData, importScheduledData } from '../core/_requests';
import { useAuth } from '../../../../modules/auth';

type Props = {
  onClose: () => void;
};

const UploadDataSchema = Yup.object().shape({
  scheduledDate: Yup.string()
    .when('type', (type, schema) => {
      return type[0] === 'scheduled'
        ? schema
            .required('Vui lòng chọn ngày!')
            .test('is-future-date', 'Ngày phải từ ngày mai trở đi!', (value) => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(0, 0, 0, 0);
              return value ? new Date(value) >= tomorrow : true;
            })
        : schema.notRequired();
    }),
  file: Yup.mixed()
    .required('Vui lòng tải lên tệp!')
    .test('fileType', 'Chỉ chấp nhận tệp định dạng Excel!', (value) => {
      return (
        value &&
        ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
          (value as File).type
        )
      );
    }),
});


const UploadDataModalForm: FC<Props> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { refetch } = useQueryResponse();
  const [uploadType, setUploadType] = useState('normal'); // Default to 'normal'

  const uploadFormik = useFormik({
    initialValues: {
      id: '',
      scheduledDate: '',
      file: null,
      type: 'normal',
    },
    validationSchema: UploadDataSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const userId = currentUser?.id;
    
        if (!userId) {
          toast.error('Người dùng chưa đăng nhập!');
          return;
        }
    
        if (values.type === 'scheduled') {
          await importScheduledData(values.file!, userId, values.scheduledDate);
        } else {
          await importData(values.file!, currentUser?.id.toString());
        }
    
        refetch();
        toast.success('Tải lên dữ liệu thành công!');
        onClose();
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.error || 'Tải lên dữ liệu thất bại!';
        toast.error(errorMessage);
        console.error('Error uploading data:', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },    
  });

  return (
    <>
      <ToastContainer />
      <form
        id="kt_modal_upload_form"
        className="form"
        onSubmit={uploadFormik.handleSubmit}
        noValidate
      >
        {/* Upload Type Selection */}
        <div className="mb-7">
          <label className="fw-bold fs-6 mb-5">Chọn loại tải lên</label>
          <div className="d-flex">
            <div
              className={`form-check form-check-inline me-3 ${uploadType === 'normal' ? 'selected-radio' : ''}`}
              onClick={() => {
                setUploadType('normal');
                uploadFormik.setFieldValue('type', 'normal');
              }}
              style={{ cursor: 'pointer' }}
            >
              <input
                className="form-check-input"
                type="radio"
                id="uploadNormal"
                name="type"
                value="normal"
                checked={uploadType === 'normal'}
                readOnly
              />
              <label className="form-check-label" htmlFor="uploadNormal">
                Tải lên thường
              </label>
            </div>
            <div
              className={`form-check form-check-inline ${uploadType === 'scheduled' ? 'selected-radio' : ''}`}
              onClick={() => {
                setUploadType('scheduled');
                uploadFormik.setFieldValue('type', 'scheduled');
              }}
              style={{ cursor: 'pointer' }}
            >
              <input
                className="form-check-input"
                type="radio"
                id="uploadScheduled"
                name="type"
                value="scheduled"
                checked={uploadType === 'scheduled'}
                readOnly
              />
              <label className="form-check-label" htmlFor="uploadScheduled">
                Tải lên có lịch trình
              </label>
            </div>
          </div>
        </div>

        {/* Input Group: Scheduled Date and ID (Conditional) */}
        {uploadType === 'scheduled' && (
          <>

            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Ngày hiệu lực</label>
              <input
                placeholder="Ngày hiệu lực (YYYY-MM-DD)"
                {...uploadFormik.getFieldProps('scheduledDate')}
                type="date"
                name="scheduledDate"
                className={`form-control form-control-solid ${
                  uploadFormik.touched.scheduledDate && uploadFormik.errors.scheduledDate
                    ? 'is-invalid'
                    : 'is-valid'
                }`}
                autoComplete="off"
                disabled={uploadFormik.isSubmitting}
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
              />

              {uploadFormik.touched.scheduledDate && uploadFormik.errors.scheduledDate && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{uploadFormik.errors.scheduledDate}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* File Input */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">Tệp Excel</label>
          <input
            type="file"
            name="file"
            accept=".xlsx, .xls"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              uploadFormik.setFieldValue('file', file);
            }}
            className={`form-control form-control-solid ${
              uploadFormik.touched.file && uploadFormik.errors.file ? 'is-invalid' : 'is-valid'
            }`}
            disabled={uploadFormik.isSubmitting}
          />
          {uploadFormik.touched.file && uploadFormik.errors.file && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{uploadFormik.errors.file}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center pt-5">
          <button
            type="reset"
            onClick={onClose}
            className="btn btn-light me-3"
            disabled={uploadFormik.isSubmitting}
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              uploadFormik.isSubmitting ||
              !uploadFormik.isValid ||
              !uploadFormik.dirty
            }
          >
            <span className="indicator-label">Tải lên</span>
            {uploadFormik.isSubmitting && (
              <span className="indicator-progress">
                Vui lòng chờ...{' '}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export { UploadDataModalForm };
