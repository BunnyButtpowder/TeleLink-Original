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

const numberToWords = (num: number): string => {
  const viUnits = ["", "mươi", "trăm", "nghìn", "triệu", "tỷ"];
  const viNums = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  if (num === 0) return "Không đồng";

  const getPart = (n: number): string => {
    let part = "";
    const hundreds = Math.floor(n / 100);
    const tensAndOnes = n % 100;
    const tens = Math.floor(tensAndOnes / 10);
    const ones = tensAndOnes % 10;

    // Handle hundreds
    if (hundreds > 0) {
      part += viNums[hundreds] + " " + viUnits[2] + " ";
    }

    // Handle tens and ones
    if (tens > 0) {
      if (tens === 1) {
        part += "mười ";
      } else {
        part += viNums[tens] + " " + viUnits[1] + " ";
      }
      if (ones > 0) {
        part += ones === 5 ? "lăm " : viNums[ones] + " ";
      }
    } else if (ones > 0) {
      // Add "linh" only if there are no tens and not a single-digit number
      part += (n >= 10 ? "linh " : "") + (ones === 5 ? "lăm " : viNums[ones] + " ");
    }

    return part.trim();
  };

  let result = "";
  let unitIndex = 0;
  while (num > 0) {
    const part = num % 1000;
    if (part > 0) {
      const unit = unitIndex > 0 ? viUnits[unitIndex + 2] : ""; // "nghìn", "triệu", "tỷ"
      const partString = getPart(part);

      // For four-digit numbers, remove "linh"
      if (unitIndex > 0 && partString.includes("linh")) {
        result = partString.replace("linh", "") + (unit ? " " + unit : "") + " " + result;
      } else {
        result = partString + (unit ? " " + unit : "") + " " + result;
      }
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }

  // Special case cleanup for redundant words
  result = result
    .replace(/\bLinh Một Triệu\b/g, "Một triệu")
    .replace(/\bKhông Tỷ\b/g, "Tỷ")
    .replace(/\bKhông Triệu\b/g, "Triệu")
    .trim();

  return result + " đồng";
};


const packageSchema = Yup.object().shape({
  title: Yup.string().required('Vui lòng điền vào trường này'),
  provider: Yup.string().required('Vui lòng điền vào trường này'),
  type: Yup.string().required('Vui lòng chọn 1 loại gói cước'),
  price: Yup.string()
  .required('Vui lòng điền vào trường này')
  .test('min-price', 'Giá tối thiểu là 10.000 VND', (value) => {
    if (!value) return false; // Đảm bảo trường không bị bỏ trống
    const numericValue = parseInt(value.replace(/\./g, ''), 10); // Xóa dấu chấm và chuyển sang số
    return numericValue >= 10000; // Kiểm tra giá tối thiểu
  })
  .test('max-price', 'Giá tối đa là 999.999.999.999 VND', (value) => {
    if (!value) return false; // Đảm bảo trường không bị bỏ trống
    const numericValue = parseInt(value.replace(/\./g, ''), 10); // Xóa dấu chấm và chuyển sang số
    return numericValue <= 999999999999; // Kiểm tra giá tối đa
  }),
  //  code: Yup.string().nullable(),
  //  title: Yup.string().nullable(),
  //  provider: Yup.string().nullable(),
  //  type: Yup.string().nullable(), 
  //  price: Yup.string().required(),

})

const PackageEditModalForm: FC<Props> = ({ pack, isUserLoading }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [packageForEdit, setPackageForEdit] = useState<Package>({
    ...pack,
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
      setSubmitting(true);
      try {
        // Remove dots from price and convert to number
        const sanitizedValues = {
          ...values,
          price: parseInt(String(values.price).replace(/\./g, ''), 10), // Convert price to plain number
        };
  
        if (isNotEmpty(sanitizedValues.id)) {
          await updatePackage(sanitizedValues, token || '');
        } else {
          await createPackage(sanitizedValues);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });
  

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
                    value="Mobifone"
                    id='kt_modal_update_role_option_1'
                    checked={packageFormik.values.provider === 'Mobifone'}                   
                    onChange={() => packageFormik.setFieldValue('provider', 'Mobifone')}
                    disabled={packageFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>Mobifone</div>
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
                <option value='Trả trước'>Trả trước</option>
                <option value='Trả sau'>Trả sau</option>
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
              <label className="required fw-bold fs-6 mb-2">{intl.formatMessage({ id: 'UNIT.PRICE' })}</label>
              <div className="position-relative">
                <input
                  placeholder="0"
                  {...packageFormik.getFieldProps('price')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': packageFormik.touched.price && packageFormik.errors.price },
                    { 'is-valid': packageFormik.touched.price && !packageFormik.errors.price }
                  )}
                  type="text"
                  name="price"
                  autoComplete="off"
                  disabled={packageFormik.isSubmitting || isUserLoading}
                  onBlur={(e) => {
                    const rawValue = e.target.value.replace(/\./g, '');
                    const value = parseInt(rawValue, 10);
                    if (!isNaN(value) && value >= 10000 && value <= 999999999999) {
                      packageFormik.setFieldValue('price', value.toLocaleString('vi-VN')); 
                    }
                    packageFormik.validateField('price'); 
                  }}
                  onChange={(e) => {
                    let rawValue = e.target.value.replace(/\./g, '');
                    if (/^\d*$/.test(rawValue)) {
                      const value = parseInt(rawValue, 10);
                      if (value <= 999999999999) {
                        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        packageFormik.setFieldValue('price', formattedValue); 
                      }
                    }
                    packageFormik.validateField('price'); 
                  }}
                  
                />
                <span className="position-absolute top-50 end-0 translate-middle-y pe-3">VND</span>
              </div>

              {/* Display the formatted price in words */}
              {packageFormik.values.price && (
                <div className="text-muted mt-2">
                  <small style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                        {numberToWords(parseInt(String(packageFormik.values.price).replace(/\./g, ''), 10))}
                  </small>                
                </div>
              )}

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
