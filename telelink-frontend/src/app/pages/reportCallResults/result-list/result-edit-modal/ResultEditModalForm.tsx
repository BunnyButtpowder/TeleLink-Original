import React, {FC, useState, useEffect} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {initialCallResult, CallResult} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {updateCallResult} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { getPackagesByDataId } from '../../../customer/customers-list/core/_requests'

type Props = {
  isUserLoading: boolean
  result: CallResult
}

const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const editResultSchema = Yup.object().shape({
  result: Yup.number().required('Vui lòng chọn kết quả cuộc gọi'),
  dataPackage: Yup.string()
  // .nullable()
  // .typeError('Vui lòng chọn gói cước hợp lệ') // Custom error message for invalid type
  .required('Vui lòng chọn gói cước'),  
  customerName: Yup.string().nullable(),
  address: Yup.string().nullable(),
  note: Yup.string().nullable(),
  // subscriberNumber: Yup.string()
  // .matches(vietnamesePhoneRegExp, 'Số điện thoại không hợp lệ')
  // .nullable(),
  revenue: Yup.number().nullable(),
  dateToCall: Yup.string().nullable(),
  
})

const ResultEditModalForm: FC<Props> = ({result, isUserLoading}) => {
  const intl = useIntl();
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
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

  const fetchPackages = async (dataId: number) => {
    setIsLoadingPackages(true);
    try {
      const packageArray = await getPackagesByDataId(dataId.toString());
      setPackages(
        packageArray.map((pack) => ({
          id: Number(pack.id), // Ensure IDs are numbers
          title: pack.title,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setIsLoadingPackages(false);
    }
  };
  

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPackageId = parseInt(e.target.value, 10); // Ensure it's a number
    formik.setFieldValue('dataPackage', isNaN(selectedPackageId) ? null : selectedPackageId);
  };
  
  

  const [resultForEdit] = useState<CallResult>({
    ...result,
    result: result.result || initialCallResult.result,
    data_id: result.data_id || initialCallResult.data_id,
    dataPackage: result.dataPackage || '',
    customerName: result.customerName || initialCallResult.customerName,
    address: result.address || initialCallResult.address,
    note: result.note || initialCallResult.note,
    // subscriberNumber: result.subscriberNumber || initialCallResult.subscriberNumber,
    revenue: result.revenue || initialCallResult.revenue,
    dateToCall: result.dateToCall || initialCallResult.dateToCall,
  })

  // console.log('resultForEdit:', resultForEdit);

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: resultForEdit,
    validationSchema: editResultSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      console.log(resultForEdit)
      try {
        if (values.id) {
          let response;
          response = await updateCallResult(values.id, values);
          toast.success('Cập nhật kết quả thành công');
          refetch()
        } else {
          toast.error('Không tìm thấy ID của kết quả cuộc gọi')
        }
      } catch (error: any) {
        console.error('Error updating call result:', error);
        const errorMessage = error.response?.data?.message || 'Cập nhật thất bại';
        toast.error(errorMessage);
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  useEffect(() => {
    if (resultForEdit.data_id?.id) {
      fetchPackages(resultForEdit.data_id.id);
    }

    if (![5, 6, 7].includes(formik.values.result)) {
      formik.setFieldValue('dateToCall', '');
    }
  }, [formik.values.result])

  // Show call back field only if the call result case is 5, 6, 7
  const showCallbackDate = [5, 6, 7].includes(formik.values.result)
  // console.log('Rendering ResultEditModalForm with:', { isUserLoading, result });

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
                value={formik.values.dataPackage || ''} // Explicitly set the value to '' when not selected
                onChange={handlePackageChange}
              >
                <option value='' disabled>
                  {intl.formatMessage({ id: 'CHOOSE_PACKAGE' })}
                </option>
                {isLoadingPackages ? (
                  <option disabled>Loading packages...</option>
                ) : (
                  packages.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title}
                    </option>
                  ))
                )}
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
                  {...formik.getFieldProps('dateToCall')}
                  className='form-control form-control-solid mb-3 mb-lg-0'
                  type='date'
                  value={formik.values.dateToCall || ''}
                  autoComplete='off'
                  onChange={(e) => formik.setFieldValue('dateToCall', e.target.value)}
                />
              </div>
            )}
            {/* end::Callback Date */}
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-5'>
            <button type='button' onClick={() => cancel()} className='btn btn-light me-3' disabled={formik.isSubmitting}>
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

export {ResultEditModalForm}
