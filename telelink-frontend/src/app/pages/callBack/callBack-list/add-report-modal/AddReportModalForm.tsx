import React, { FC, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { initialResult, Result } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createCallResult, getPackagesByDataId } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../modules/auth'

type Props = {
  onClose: () => void
}

const resultSchema = Yup.object().shape({
  result: Yup.number().required('Vui lòng chọn kết quả cuộc gọi'),
  dataPackage: Yup.string().nullable(),
  customerName: Yup.string().nullable(),
  address: Yup.string().nullable(),
  note: Yup.string().nullable(),
})

const AddReportModalForm: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const dataDetails = localStorage.getItem(`dataDetails_${currentUser?.id}`) || ''
  const dataId = dataDetails ? JSON.parse(dataDetails).id : ''
  const { setDataDetails, refetch } = useQueryResponse()
  const [date, setDate] = useState<string>('')
  const [packages, setPackages] = useState<Array<{ id: number, title: string }>>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  const callResultOptions = [
    { value: 1, label: 'Đồng ý' },
    { value: 2, label: 'Không đồng ý' },
    { value: 3, label: 'Không bắt máy' },
    { value: 4, label: 'Không liên lạc được' },
    { value: 5, label: 'Hẹn gọi lại sau' },
    { value: 6, label: 'Đang tư vấn' },
    { value: 7, label: 'Chờ nạp thẻ, chuyển khoản' },
    { value: 8, label: 'Mất đơn' },
  ]

  const fetchPackages = async () => {
    setIsLoadingPackages(true);
    try {
      const packageArray = await getPackagesByDataId(dataId); // Correctly typed return value
      console.log('Fetched packages:', packageArray);
  
      setPackages(packageArray); // Directly set the result
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setIsLoadingPackages(false);
    }
  };
  

  useEffect(() => {
    fetchPackages();
  }, [])

  const handlePackageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPackage = e.target.value;
    formik.setFieldValue('dataPackage', selectedPackage);
  }

  const formik = useFormik<Result>({
    initialValues: initialResult,
    enableReinitialize: true,
    validationSchema: resultSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        let response;
        if (dataId) {
          response = await createCallResult(values, dataId, date);
          refetch();
          localStorage.removeItem(`dataDetails_${currentUser?.id}`);
          setDataDetails(undefined);
          onClose()
          toast.success('Gửi báo cáo thành công!')
        }
        else {
          console.log('Data ID: ', dataId);
          toast.error('Hãy lấy số trước khi gửi kết quả cuộc gọi!')
        }
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || 'Gửi kết quả cuộc gọi thất bại!'
        toast.error(errorMessage)
        console.error('Có lỗi trong quá trình tạo kết quả cuộc gọi', errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Show call back field only if the call result case is 5, 6, 7
  const showCallbackDate = [5, 6, 7].includes(formik.values.result)

  return (
    <>
      <ToastContainer />
      {/* Report Form */}
      {
        <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit}>
          <div
            className='d-flex flex-column scroll-y me-n7 pe-7'
            id='kt_modal_add_user_scroll'
            data-kt-scroll='true'
            data-kt-scroll-activate='{default: false, lg: true}'
            data-kt-scroll-max-height='auto'
            data-kt-scroll-dependencies='#kt_modal_add_user_header'
            data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
            data-kt-scroll-offset='300px'
          >

            {/* begin::Call Result */}
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CALL_RESULT' })}</label>

              <select
                {...formik.getFieldProps('result')}
                onChange={(e) => formik.setFieldValue('result', parseInt(e.target.value))}
                className={clsx(
                  'cursor-pointer form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.result && formik.errors.result },
                  { 'is-valid': formik.touched.result && !formik.errors.result }
                )}
                disabled={formik.isSubmitting}
              >
                <option value='' label={intl.formatMessage({ id: 'CHOOSE_CALL_RESULT' })} disabled />
                {callResultOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.result && formik.errors.result && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.result}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Call Result */}

            {/* begin::Customer Name */}
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CUSTOMER.NAME' })}</label>

              <input
                placeholder='Nhập tên khách hàng'
                {...formik.getFieldProps('customerName')}
                type='text'
                name='customerName'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.customerName && formik.errors.customerName },
                  { 'is-valid': formik.touched.customerName && !formik.errors.customerName }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
              />
              {formik.touched.customerName && formik.errors.customerName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.customerName}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Customer Name */}

            {/* begin::Customer address */}
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CUSTOMER.ADDRESS' })}</label>

              <input
                placeholder='Nhập địa chỉ khách hàng'
                {...formik.getFieldProps('address')}
                type='text'
                name='address'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.address && formik.errors.address },
                  { 'is-valid': formik.touched.address && !formik.errors.address }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
              />
              {formik.touched.address && formik.errors.address && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.address}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Customer address */}

            {/* begin::Package Selection */}
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'PACKAGE' })}</label>

              <select
                {...formik.getFieldProps('dataPackage')}
                className={clsx(
                  'cursor-pointer form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.dataPackage && formik.errors.dataPackage },
                  { 'is-valid': formik.touched.dataPackage && !formik.errors.dataPackage }
                )}
                onChange={handlePackageChange}
              >
                <option value='' disabled>{intl.formatMessage({ id: 'CHOOSE_PACKAGE' })}</option>
                {isLoadingPackages ? (
                  <option>Loading packages...</option>
                ) : (
                  packages.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title}
                    </option>
                  )))
                }
              </select>
              {formik.touched.dataPackage && formik.errors.dataPackage && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.dataPackage}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Package Selection */}

            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'NOTE' })}</label>

              <input
                placeholder='Nhập ghi chú'
                {...formik.getFieldProps('note')}
                type='text'
                name='note'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.note && formik.errors.note },
                  { 'is-valid': formik.touched.note && !formik.errors.note }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
              />
              {formik.touched.note && formik.errors.note && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.note}</span>
                  </div>
                </div>
              )}
            </div>

            {/* begin::Callback Date */}
            {showCallbackDate && (
              <div className='fv-row mb-7'>
                <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CALLBACK_DATE' })}</label>

                <input
                  placeholder='Ngày gọi lại'
                  className='form-control form-control-solid mb-3 mb-lg-0'
                  type='date'
                  value={date}
                  autoComplete='off'
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}
            {/* end::Callback Date */}
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-5'>
            <button type='button' onClick={onClose} className='btn btn-light me-3' disabled={formik.isSubmitting}>
              {intl.formatMessage({ id: 'FORM.CANCEL' })}
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(formik.isSubmitting) && (
                <span className='indicator-progress'>
                  Đang xử lý...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(formik.isSubmitting) && <UsersListLoading />}
          </div>
        </form>
      }
      {(formik.isSubmitting) && <UsersListLoading />}
    </>
  )
}

export { AddReportModalForm }
