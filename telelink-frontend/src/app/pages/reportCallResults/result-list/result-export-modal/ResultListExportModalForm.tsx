import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FC } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { exportReport } from '../core/_requests';

type Props = {
  onClose: () => void;
};

const ExportSchema = Yup.object().shape({
  startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
  endDate: Yup.string().required('Vui lòng chọn ngày kết thúc'),
});

const ResultListExportModalForm: FC<Props> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
    },
    validationSchema: ExportSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await exportReport(values.startDate, values.endDate);
        toast.success('Xuất báo cáo thành công');
        onClose();
      } catch (error) {
        const errorMessage = (error as any)?.response?.data?.message || 'Lỗi khi xuất báo cáo';
        toast.error(errorMessage);
        console.error('Error exporting report:', errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <ToastContainer />
      <form id="kt_modal_export_form" className="form" onSubmit={formik.handleSubmit} noValidate>
        {/* Input for start date */}
        <div className="mb-7">
          <label className="required fw-bold fs-6 mb-2">Ngày bắt đầu</label>
          <input
            type="date"
            {...formik.getFieldProps('startDate')}
            className={clsx(
              'form-control form-control-solid mb-3',
              { 'is-invalid': formik.touched.startDate && formik.errors.startDate },
              { 'is-valid': formik.touched.startDate && !formik.errors.startDate }
            )}
            disabled={isSubmitting}
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.startDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input for end date */}
        <div className="mb-7">
          <label className="required fw-bold fs-6 mb-2">Ngày kết thúc</label>
          <input
            type="date"
            {...formik.getFieldProps('endDate')}
            className={clsx(
              'form-control form-control-solid mb-3',
              { 'is-invalid': formik.touched.endDate && formik.errors.endDate },
              { 'is-valid': formik.touched.endDate && !formik.errors.endDate }
            )}
            disabled={isSubmitting}
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.endDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center pt-5">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-light me-3"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formik.isValid || !formik.dirty}
          >
            <span className="indicator-label">Xuất báo cáo</span>
            {isSubmitting && (
              <span className="indicator-progress">
                Vui lòng chờ...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export { ResultListExportModalForm };
