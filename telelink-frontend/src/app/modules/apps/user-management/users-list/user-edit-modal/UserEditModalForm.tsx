import { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { useIntl } from 'react-intl'

type Props = {
  isUserLoading: boolean
  user: User
}

const salesmanSchema = Yup.object().shape({
  auth: Yup.object().shape({
    username: Yup.string().required('Vui lòng điền vào trường này'),
    email: Yup.string()
      .email('Sai định dạng email')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Vui lòng điền vào trường này'),
    status: Yup.boolean().required('Vui lòng chọn trạng thái hoạt động'),
  }),
  fullName: Yup.string().min(3, 'Minimum 3 symbols').required('Vui lòng điền vào trường này'),
  phoneNumber: Yup.string().nullable(),
  address: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  gender: Yup.string().nullable(),
  agency: Yup.number().required('Vui lòng điền vào trường này'),
})

const agencySchema = Yup.object().shape({
  auth: Yup.object().shape({
    username: Yup.string().required('Vui lòng điền vào trường này'),
    email: Yup.string().email('Sai định dạng email').required('Vui lòng điền vào trường này'),
    status: Yup.boolean().required('Vui lòng chọn trạng thái hoạt động'),
  }),
  agencyName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Vui lòng điền vào trường này'),
  phoneNumber: Yup.string().nullable(),
  address: Yup.string()
    .nullable(),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  // Define the roles and configurations
  const roleConfig: { [key: number]: string } = {
    1: 'admin',
    2: 'agency',
    3: 'salesman',
  };

  const [selectedRole, setSelectedRole] = useState(user.auth?.role ? roleConfig[user.auth.role] : 'salesman');

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    fullName: user.fullName || initialUser.fullName,
    auth: {
      ...user.auth,
      email: user.auth?.email || initialUser.auth?.email,
      username: user.auth?.username || initialUser.auth?.username,
      status: user.auth?.status || initialUser.auth?.status,
      role: user.auth?.role || initialUser.auth?.role,
    },
    address: user.address || initialUser.address,
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.avatar}`)

  // Salesman formik form
  const salemanFormik = useFormik({
    initialValues: userForEdit,
    validationSchema: salesmanSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  // Agency formik form
  const agencyFormik = useFormik({
    initialValues: userForEdit,
    validationSchema: agencySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  // Handling the role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value);
  }

  return (
    <>
      {/* Role Selection */}
      <div className='mb-7'>
        <label className='required fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.ROLE' })}</label>
        <div className='d-flex'>
          <label className='form-check form-check-custom form-check-solid me-5'>
            <input
              className='form-check-input'
              type='radio'
              name='role'
              value='agency'
              checked={selectedRole === 'agency'}
              onChange={handleRoleChange}
            />
            <span className='form-check-label'>{intl.formatMessage({ id: 'AGENCY' })}</span>
          </label>
          <label className='form-check form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='radio'
              name='role'
              value='salesman'
              checked={selectedRole === 'salesman'}
              onChange={handleRoleChange}
            />
            <span className='form-check-label'>{intl.formatMessage({ id: 'SALESMAN' })}</span>
          </label>
        </div>
      </div>

      {/* Form for Salesman */}
      {selectedRole === 'salesman' && (
        <form id='kt_modal_add_user_form' className='form' onSubmit={salemanFormik.handleSubmit} noValidate>
          {/* Salesman form fields */}
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
              <label className='d-block fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.AVATAR' })}</label>
              {/* end::Label */}

              {/* begin::Image input */}
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={{ backgroundImage: `url('${blankImg}')` }}
              >
                {/* begin::Preview existing avatar */}
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{ backgroundImage: `url('${userAvatarImg}')` }}
                ></div>
                {/* end::Preview existing avatar */}

                {/* begin::Label */}
                <label
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  title='Change avatar'
                >
                  <i className='bi bi-pencil-fill fs-7'></i>

                  <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
                  <input type='hidden' name='avatar_remove' />
                </label>
                {/* end::Label */}

                {/* begin::Cancel */}
                {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='cancel'
              data-bs-toggle='tooltip'
              title='Cancel avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
                {/* end::Cancel */}

                {/* begin::Remove */}
                {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='remove'
              data-bs-toggle='tooltip'
              title='Remove avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
                {/* end::Remove */}
              </div>
              {/* end::Image input */}

              {/* begin::Hint */}
              {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
              {/* end::Hint */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.FULLNAME' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Tên đầy đủ'
                {...salemanFormik.getFieldProps('fullName')}
                type='text'
                name='fullName'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.fullName && salemanFormik.errors.fullName },
                  {
                    'is-valid': salemanFormik.touched.fullName && !salemanFormik.errors.fullName,
                  }
                )}
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {salemanFormik.touched.fullName && salemanFormik.errors.fullName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{salemanFormik.errors.fullName}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.USERNAME' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Tên đăng nhập'
                {...salemanFormik.getFieldProps('auth.username')}
                type='text'
                name='auth.username'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.auth?.username && salemanFormik.errors.auth?.username },
                  { 'is-valid': salemanFormik.touched.auth?.username && !salemanFormik.errors.auth?.username }
                )}
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />


              {salemanFormik.touched.auth?.username && salemanFormik.errors.auth?.username && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{salemanFormik.errors.auth?.username}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Email</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Email'
                {...salemanFormik.getFieldProps('auth.email')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.auth?.email && salemanFormik.errors.auth?.email },
                  {
                    'is-valid': salemanFormik.touched.auth?.email && !salemanFormik.errors.auth?.email,
                  }
                )}
                type='text'
                name='auth.email'
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {salemanFormik.touched.auth?.email && salemanFormik.errors.auth?.email && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.auth?.email}</span>
                </div>
              )}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.ADDRESS' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Địa chỉ'
                {...salemanFormik.getFieldProps('address')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.address && salemanFormik.errors.address },
                  {
                    'is-valid': salemanFormik.touched.address && !salemanFormik.errors.address,
                  }
                )}
                type='text'
                name='address'
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {salemanFormik.touched.address && salemanFormik.errors.address && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.address}</span>
                </div>
              )}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.PHONE' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Số điện thoại'
                {...salemanFormik.getFieldProps('phoneNumber')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.phoneNumber && salemanFormik.errors.phoneNumber },
                  {
                    'is-valid': salemanFormik.touched.phoneNumber && !salemanFormik.errors.phoneNumber,
                  }
                )}
                type='text'
                name='phoneNumber'
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {salemanFormik.touched.phoneNumber && salemanFormik.errors.phoneNumber && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.phoneNumber}</span>
                </div>
              )}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.DOB' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Ngày sinh'
                {...salemanFormik.getFieldProps('dob')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.dob && salemanFormik.errors.dob },
                  {
                    'is-valid': salemanFormik.touched.dob && !salemanFormik.errors.dob,
                  }
                )}
                type='date'
                name='dob'
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {salemanFormik.touched.dob && salemanFormik.errors.dob && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.dob}</span>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.GENDER' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <select
                {...salemanFormik.getFieldProps('gender')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.gender && salemanFormik.errors.gender },
                  {
                    'is-valid': salemanFormik.touched.gender && !salemanFormik.errors.gender,
                  }
                )}
                name='gender'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              >
                <option value='' disabled>{intl.formatMessage({ id: 'SELECT.GENDER' })}</option>
                <option value='male'>{intl.formatMessage({ id: 'GENDER.MALE' })}</option>
                <option value='female'>{intl.formatMessage({ id: 'GENDER.FEMALE' })}</option>
                <option value='other'>{intl.formatMessage({ id: 'GENDER.OTHER' })}</option>
              </select>
              {salemanFormik.touched.fullName && salemanFormik.errors.fullName && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.gender}</span>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.STATUS' })}</label>
              {/* end::Label */}
              {/* begin::Roles */}
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...salemanFormik.getFieldProps('auth.status')}
                    name='role'
                    type='radio'
                    value='active'
                    id='kt_modal_update_role_option_0'
                    checked={salemanFormik.values.auth?.status === true}
                    disabled={salemanFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                    <div className='fw-bolder text-success'>Đã kích hoạt</div>
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
                    {...salemanFormik.getFieldProps('auth.status')}
                    name='role'
                    type='radio'
                    value='inactive'
                    id='kt_modal_update_role_option_1'
                    checked={salemanFormik.values.auth?.status === false}
                    disabled={salemanFormik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-danger'>Chưa kích hoạt</div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* end::Roles */}
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
              disabled={salemanFormik.isSubmitting || isUserLoading}
            >
              {intl.formatMessage({ id: "FORM.CANCEL" })}
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || salemanFormik.isSubmitting || !salemanFormik.isValid || !salemanFormik.touched}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(salemanFormik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(salemanFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
          </div>
        </form>
      )}

      {/* Form for Agency */}
      {selectedRole === 'agency' && (
        <form id='kt_modal_add_user_form' className='form' onSubmit={agencyFormik.handleSubmit} noValidate>
          {/* Agency form fields */}
          <div className='fv-row mb-7'>
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
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.FULLNAME' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Tên đầy đủ'
                  {...salemanFormik.getFieldProps('fullName')}
                  type='text'
                  name='fullName'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.fullName && agencyFormik.errors.fullName },
                    {
                      'is-valid': agencyFormik.touched.fullName && !agencyFormik.errors.fullName,
                    }
                  )}
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {agencyFormik.touched.fullName && agencyFormik.errors.fullName && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{agencyFormik.errors.fullName}</span>
                    </div>
                  </div>
                )}
                {/* end::Input */}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.USERNAME' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Tên đăng nhập'
                  {...agencyFormik.getFieldProps('auth.username')}
                  type='text'
                  name='auth.username'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.auth?.username && agencyFormik.errors.auth?.username },
                    {
                      'is-valid': agencyFormik.touched.auth?.username && !agencyFormik.errors.auth?.username,
                    }
                  )}
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {agencyFormik.touched.auth?.username && agencyFormik.errors.auth?.username && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{agencyFormik.errors.auth?.username}</span>
                    </div>
                  </div>
                )}
                {/* end::Input */}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>Email</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Email'
                  {...agencyFormik.getFieldProps('auth.email')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.auth?.email && agencyFormik.errors.auth?.email },
                    {
                      'is-valid': agencyFormik.touched.auth?.email && !agencyFormik.errors.auth?.email,
                    }
                  )}
                  type='email'
                  name='email'
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {agencyFormik.touched.auth?.email && agencyFormik.errors.auth?.email && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{agencyFormik.errors.auth?.email}</span>
                  </div>
                )}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.ADDRESS' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Địa chỉ'
                  {...agencyFormik.getFieldProps('address')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.address && agencyFormik.errors.address },
                    {
                      'is-valid': agencyFormik.touched.address && !agencyFormik.errors.address,
                    }
                  )}
                  type='text'
                  name='address'
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {agencyFormik.touched.address && agencyFormik.errors.address && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{agencyFormik.errors.address}</span>
                  </div>
                )}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.PHONE' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Số điện thoại'
                  {...agencyFormik.getFieldProps('phoneNumber')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.phoneNumber && agencyFormik.errors.phoneNumber },
                    {
                      'is-valid': agencyFormik.touched.phoneNumber && !agencyFormik.errors.phoneNumber,
                    }
                  )}
                  type='text'
                  name='phoneNumber'
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {agencyFormik.touched.phoneNumber && agencyFormik.errors.phoneNumber && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{agencyFormik.errors.phoneNumber}</span>
                  </div>
                )}
              </div>
              {/* end::Input group */}

              {/* begin::Input group */}
              <div className='mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.STATUS' })}</label>
                {/* end::Label */}
                {/* begin::Input row */}
                <div className='d-flex fv-row'>
                  {/* begin::Radio */}
                  <div className='form-check form-check-custom form-check-solid'>
                    {/* begin::Input */}
                    <input
                      className='form-check-input me-3'
                      {...agencyFormik.getFieldProps('auth.status')}
                      name='role'
                      type='radio'
                      value='active'
                      id='kt_modal_update_role_option_0'
                      checked={agencyFormik.values.auth?.status === true}
                      disabled={agencyFormik.isSubmitting || isUserLoading}
                    />

                    {/* end::Input */}
                    {/* begin::Label */}
                    <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                      <div className='fw-bolder text-success'>Đã kích hoạt</div>
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
                      {...agencyFormik.getFieldProps('auth.status')}
                      name='role'
                      type='radio'
                      value='inactive'
                      id='kt_modal_update_role_option_1'
                      checked={agencyFormik.values.auth?.status === false}
                      disabled={agencyFormik.isSubmitting || isUserLoading}
                    />
                    {/* end::Input */}
                    {/* begin::Label */}
                    <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                      <div className='fw-bolder text-danger'>Chưa kích hoạt</div>
                    </label>
                    {/* end::Label */}
                  </div>
                  {/* end::Radio */}
                </div>
                {/* end::Input row */}
                <div className='separator separator-dashed my-5'></div>
                {/* end::Roles */}
              </div>
              {/* end::Input group */}
            </div>
            {/* end::Scroll */}
          </div>

          {/* begin::Actions */}
          <div className='text-center pt-1'>
            <button
              type='reset'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={agencyFormik.isSubmitting || isUserLoading}
            >
              {intl.formatMessage({ id: "FORM.CANCEL" })}
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || agencyFormik.isSubmitting || !agencyFormik.isValid || !agencyFormik.touched}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(agencyFormik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      )}
      {(salemanFormik.isSubmitting || agencyFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
