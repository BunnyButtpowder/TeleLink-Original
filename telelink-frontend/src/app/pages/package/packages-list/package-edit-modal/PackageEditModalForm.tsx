import { FC, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ID, isNotEmpty, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { initialPackage, Package } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createPackage, updatePackage } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL;

type Props = {
  isUserLoading: boolean
  pack: Package
}

const token = localStorage.getItem('auth_token');

const packageSchema = Yup.object().shape({
  code: Yup.string().min(2, 'Tối thiểu 2 ký tự').required('Vui lòng điền vào trường này'),
  title: Yup.string().required('Vui lòng điền vào trường này'),
  provider: Yup.string().required('Vui lòng điền vào trường này'),
  type: Yup.string().required('Vui lòng chọn 1 loại gói cước'),
  price: Yup.number()
  .min(10000, 'Giá phải lớn hơn hoặc bằng 10,000')
  .integer('Giá phải là số nguyên')
  .typeError('Vui lòng nhập số hợp lệ')
  .required('Vui lòng điền vào trường này'),})

const PackageEditModalForm: FC<Props> = ({ pack, isUserLoading }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [packageForEdit, setPackageForEdit] = useState<Package>({
    ...pack,
    code: pack.code || initialPackage.code,
    title: pack.title || initialPackage.title,
    provider: pack.provider || initialPackage.provider,
    type: pack.type || initialPackage.type,
    price: pack.price || initialPackage.price,
  });


  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  // Salesman formik form
  const packageFormik = useFormik<Package>({
    initialValues: packageForEdit,
    enableReinitialize: true,
    validationSchema: packageSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updatePackage(values, token || '')
        } else {
          await createPackage(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
      {/* Package Form */}
      {
        <form id='kt_modal_add_user_form' className='form' onSubmit={packageFormik.handleSubmit} noValidate>
          {/* Package form fields */}
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

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CODE' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Mã số'
                {...packageFormik.getFieldProps('code')}
                type='text'
                name='code'
                
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': packageFormik.touched.code && packageFormik.errors.code },
                  {
                    'is-valid': packageFormik.touched.code && !packageFormik.errors.code,
                    
                  }
                )}
                autoComplete='off'
                disabled={packageFormik.isSubmitting || isUserLoading}
                
              />
              {packageFormik.touched.code && packageFormik.errors.code && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{packageFormik.errors.code}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'PACKAGE.CODE' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Mã gói cước'
                {...packageFormik.getFieldProps('title')}
                type='text'
                name='title'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': packageFormik.touched.title && packageFormik.errors.title },
                  { 'is-valid': packageFormik.touched.title && !packageFormik.errors.title }
                )}
                autoComplete='off'
                disabled={packageFormik.isSubmitting || isUserLoading}
              />
              {packageFormik.touched.title && packageFormik.errors.title && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{packageFormik.errors.title}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'NETWORK' })}</label>
              {/* end::Label */}
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...packageFormik.getFieldProps('provider')}
                    name='provider'
                    type='radio'
                    value="Viettel"
                    id='kt_modal_update_role_option_0'
                    checked={packageFormik.values.provider === 'Viettel'}
                    onChange={() => packageFormik.setFieldValue('provider', 'Viettel')}
                    disabled={packageFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                    <div className='fw-bolder text-gray-800'>Viettel</div>
                    {/* <div className="text-gray-600">Best for business owners and company administrators</div> */}
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...packageFormik.getFieldProps('provider')}
                    name='auth.status'
                    type='radio'
                    value="Vinaphone"
                    id='kt_modal_update_role_option_1'
                    checked={packageFormik.values.provider === 'Vinaphone'}
                    onChange={() => packageFormik.setFieldValue('provider', 'Vinaphone')}
                    disabled={packageFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>Vinaphone</div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...packageFormik.getFieldProps('provider')}
                    name='auth.status'
                    type='radio'
                    value="Mobiphone"
                    id='kt_modal_update_role_option_1'
                    checked={packageFormik.values.provider === 'Mobiphone'}
                    onChange={() => packageFormik.setFieldValue('provider', 'Mobiphone')}
                    disabled={packageFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>Mobiphone</div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Roles */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CLASSIFY' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              {/* begin::Select */}
              <select
                {...packageFormik.getFieldProps('type')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': packageFormik.touched.type && packageFormik.errors.type },
                  {
                    'is-valid': packageFormik.touched.type && !packageFormik.errors.type,
                  }
                )}
                name='type'
                disabled={packageFormik.isSubmitting || isUserLoading}
              >
                <option value=''></option>
                <option value='TT'>Trả trước</option>
                <option value='TS'>Trả sau</option>
              </select>
              {/* end::Select */}
              {/* end::Input */}
              {packageFormik.touched.type && packageFormik.errors.type && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{packageFormik.errors.type}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className="fv-row mb-7">
            {/* Label */}
            <label className="required fw-bold fs-6 mb-2">{intl.formatMessage({ id: 'UNIT.PRICE' })}</label>

            {/* Input */}
            <div className="position-relative">
              <input
                placeholder="0"
                {...packageFormik.getFieldProps('price')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': packageFormik.touched.price && packageFormik.errors.price },
                  { 'is-valid': packageFormik.touched.price && !packageFormik.errors.price }
                )}
                // type="text"
                // name="price"
                autoComplete="off"
                disabled={packageFormik.isSubmitting || isUserLoading}
                // onBlur={(e) => {
                //   const value = parseInt(e.target.value.replace(/\./g, ''), 10);
                //   if (!isNaN(value) && value >= 10000) {
                //     packageFormik.setFieldValue('price', value.toLocaleString('vi-VN')); // Format value
                //   } else {
                //     packageFormik.setFieldValue('price', ''); // Reset invalid values
                //   }
                //   console.log(packageFormik.touched.price);
                //   packageFormik.validateField('price'); // Trigger validation on blur
                // }}
                // onChange={(e) => {
                //   const rawValue = e.target.value.replace(/\./g, '');
                //   if (/^\d*$/.test(rawValue)) {
                //     packageFormik.setFieldValue('price', rawValue); // Set value if valid
                //   }
                //   packageFormik.validateField('price'); // Validate on every change
                // }}
              />
              <span className="position-absolute top-50 end-0 translate-middle-y pe-3">VND</span>
            </div>

            {/* Error Message */}
            {packageFormik.touched.price && packageFormik.errors.price && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{packageFormik.errors.price}</span>
                </div>
              </div>
            )}
          </div>
            {/* end::Input group */}
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-5'>
            <button
              type='reset'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={packageFormik.isSubmitting || isUserLoading}
            >
              {intl.formatMessage({ id: "FORM.CANCEL" })}
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || packageFormik.isSubmitting || !packageFormik.isValid || !packageFormik.dirty}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(packageFormik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(packageFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
          </div>
        </form>
      }
      {(packageFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { PackageEditModalForm }
