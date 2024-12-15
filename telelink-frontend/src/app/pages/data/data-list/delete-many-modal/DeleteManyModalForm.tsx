import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useQueryResponse } from '../core/QueryResponseProvider';
import { deleteManyData } from '../core/_requests';

type Props = {
  onClose: () => void;
};

const DeleteManySchema = Yup.object().shape({
  networkName: Yup.string().required('Vui lòng chọn tên mạng'),
  createdAt: Yup.string().nullable(),
});

const DeleteManyModalForm: FC<Props> = ({ onClose }) => {
  const { refetch } = useQueryResponse();
  
  const [deleteForm] = useState({
    networkName: '',
    createdAt: '',
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    onClose();
  };

  const deleteFormik = useFormik({
    initialValues: deleteForm,
    enableReinitialize: true,
    validationSchema: DeleteManySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await deleteManyData(values);
        refetch();
        toast.success('Xóa dữ liệu thành công!');
        onClose();
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.message || 'Xóa dữ liệu thất bại!';
        toast.error(errorMessage);
        console.error('Error deleting data:', errorMessage);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  return (
    <>
      <ToastContainer />
      <form
        id="kt_modal_delete_many_form"
        className="form"
        onSubmit={deleteFormik.handleSubmit}
        noValidate
      >
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_delete_many_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_delete_many_header"
          data-kt-scroll-wrappers="#kt_modal_delete_many_scroll"
          data-kt-scroll-offset="300px"
        >
          {/* Dropdown: Network Name */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              Nhà mạng
            </label>
            <select
              {...deleteFormik.getFieldProps('networkName')}
              name="networkName"
              className={`form-control form-control-solid mb-3 mb-lg-0 ${
                deleteFormik.touched.networkName &&
                deleteFormik.errors.networkName
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              disabled={deleteFormik.isSubmitting}
            >
              <option value="">Chọn mạng</option>
              <option value="Viettel">Viettel</option>
              <option value="Vinaphone">Vinaphone</option>
              <option value="Mobifone">Mobifone</option>
            </select>
            {deleteFormik.touched.networkName &&
              deleteFormik.errors.networkName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{deleteFormik.errors.networkName}</span>
                  </div>
                </div>
              )}
          </div>

          {/* Input Group: Created At */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Ngày tạo</label>
            <input
              placeholder="Ngày tạo (YYYY-MM-DD)"
              {...deleteFormik.getFieldProps('createdAt')}
              type="date"
              name="createdAt"
              className={`form-control form-control-solid mb-3 mb-lg-0 ${
                deleteFormik.touched.createdAt && deleteFormik.errors.createdAt
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              autoComplete="off"
              disabled={deleteFormik.isSubmitting}
            />
            {deleteFormik.touched.createdAt &&
              deleteFormik.errors.createdAt && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{deleteFormik.errors.createdAt}</span>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center pt-5">
          <button
            type="reset"
            onClick={onClose}
            className="btn btn-light me-3"
            disabled={deleteFormik.isSubmitting}
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              deleteFormik.isSubmitting ||
              !deleteFormik.isValid ||
              !deleteFormik.dirty
            }
          >
            <span className="indicator-label">Xóa</span>
            {deleteFormik.isSubmitting && (
              <span className="indicator-progress">
                Please wait...{' '}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export { DeleteManyModalForm };
