import React, { FC, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ID, isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../../../accounts/components/core/firebaseConfig'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useAuth } from '../../../../../../app/modules/auth'
const API_URL = import.meta.env.VITE_APP_API_URL;

type Props = {
  isUserLoading: boolean
  user: User  
}
const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const token = localStorage.getItem('auth_token');
const firebaseApp = initializeApp(firebaseConfig);


const salesmanSchema = Yup.object().shape({
  auth: Yup.object().shape({
    username: Yup.string().required('Vui lòng điền vào trường này'),
    email: Yup.string()
      .email('Sai định dạng email')
      .min(3, 'Cần tối thiểu 3 ký tự')
    .max(50, 'Cần tối đa 50 ký tự')
      .required('Vui lòng điền vào trường này'),
    password: Yup.string()
    .min(3, 'Cần tối thiểu 3 ký tự')
    .max(50, 'Cần tối đa 50 ký tự')
    .required('Vui lòng nhập mật khẩu'),
    isActive: Yup.boolean().required('Vui lòng chọn trạng thái hoạt động'),
    role: Yup.number().required('Vui lòng chọn quyền'),
  }),
  fullName: Yup.string().min(3, 'Cần tối thiểu 3 ký tự').required('Vui lòng điền vào trường này'),
  phoneNumber: Yup.string()
  .matches(vietnamesePhoneRegExp, 'Số điện thoại không hợp lệ')
  .required('Vui lòng điền vào trường này'),
  address: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  gender: Yup.string().nullable(),
  agency: Yup.object().shape({
    id: Yup.number().nullable(),
  }),
  avatar: Yup.string().nullable(),
})


const agencySchema = Yup.object().shape({
  auth: Yup.object().shape({
    username: Yup.string().required('Vui lòng điền vào trường này'),
    email: Yup.string()
      .email('Sai định dạng email')
      .min(3, 'Cần tối thiểu 3 ký tự')
    .max(50, 'Cần tối đa 50 ký tự')
      .required('Vui lòng điền vào trường này'),
    password: Yup.string()
    .min(3, 'Cần tối thiểu 3 ký tự')
    .max(50, 'Cần tối đa 50 ký tự')
    .required('Vui lòng nhập mật khẩu'),
    isActive: Yup.boolean().required('Vui lòng chọn trạng thái hoạt động'),
    role: Yup.number().required('Vui lòng chọn quyền'),
  }),
  fullName: Yup.string().min(3,'Cần tối thiểu 3 ký tự').required('Vui lòng điền vào trường này'),
  phoneNumber: Yup.string()
  .matches(vietnamesePhoneRegExp, 'Số điện thoại không hợp lệ')
  .required('Vui lòng điền vào trường này'),
  address: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  gender: Yup.string().nullable(),
  agency: Yup.object().shape({
    id: Yup.number().nullable(),
    name: Yup.string().nullable().required('Vui lòng điền vào trường này'),
  }),
  avatar: Yup.string().nullable(),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const { currentUser, setCurrentUser } = useAuth();

  const agency = currentUser?.agency?.id;

  const roleConfig: { [key: number]: string } = {
    1: 'admin',
    2: 'agency',
    3: 'salesman',
  };

  const [selectedRole, setSelectedRole] = useState(user.auth?.role ? roleConfig[user.auth.role] : 'salesman');
  const [agencies, setAgencies] = useState<Array<{ id: ID; name: string }>>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/agencys/getall`)
      .then((response) => {
        const agenciesData = response.data.data;
        if (Array.isArray(agenciesData)) {
          setAgencies(agenciesData);
        } else {
          console.error('Unexpected data format:', agenciesData);
          setAgencies([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching agencies: ', error);
        setAgencies([]);
      });
  }, []);

  const [userForEdit, setUserForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    auth: {
      ...user.auth,
      email: user.auth?.email || initialUser.auth?.email,
      username: user.auth?.username || initialUser.auth?.username,
      isActive: user.auth?.isActive || initialUser.auth?.isActive,
      role: user.auth?.role || initialUser.auth?.role,
    },
    fullName: user.fullName || initialUser.fullName,
    phoneNumber: user.phoneNumber || initialUser.phoneNumber,
    address: user.address || initialUser.address,
    dob: user.dob || initialUser.dob,
    gender: user.gender || initialUser.gender,
    agency: {
      ...user.agency,
      id: user.agency?.id || initialUser.agency?.id,
      name: user.agency?.name || initialUser.agency?.name,
    },
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const storage = getStorage(firebaseApp);

  const userAvatarImg = userForEdit.avatar;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `avatars/${userForEdit?.id || 'new_user'}_${file.name}`);
    console.log('Storage reference created:', storageRef);
    try {
      await uploadBytes(storageRef, file);
      console.log('File uploaded successfully!', file.name);

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL: ', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file: ', error);
      return null;
    }
  };

  const salemanFormik = useFormik<User>({
    initialValues: userForEdit,
    enableReinitialize: true,
    validationSchema: salesmanSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let avatarUrl = values.avatar;
        if (selectedFile) {
          const uploadedAvatarUrl = await uploadImage(selectedFile);
          if (uploadedAvatarUrl) {
            avatarUrl = uploadedAvatarUrl;
          } else {
            toast.error('Lỗi tải ảnh lên, vui lòng thử lại sau!');
          }
        }
        values.avatar = avatarUrl;

        let response;
        if (isNotEmpty(values.id)) {
          response = await updateUser(values, token || '');
          toast.success('Cập nhật thành công!');
        } else {
          response = await createUser(values);
          toast.success('Tạo tài khoản thành công!');
        }
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message;
        toast.error(errorMessage);
        console.error('From UserEditModalForm: ', errorMessage);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  // Add the separated useEffect here
  useEffect(() => {
    if (currentUser?.auth?.role === 2) {
      salemanFormik.setFieldValue('agency.id', currentUser?.agency?.id || null);
    }
  }, [currentUser?.auth?.role, currentUser?.agency?.id]);

  // useEffect(() => {
  //   console.log('Formik state:', {
  //     values: salemanFormik.values,
  //     errors: salemanFormik.errors,
  //     touched: salemanFormik.touched,
  //     isValid: salemanFormik.isValid,
  //     isSubmitting: salemanFormik.isSubmitting,
  //     dirty: salemanFormik.dirty,
  //   });
  // }, [salemanFormik]);

  // Agency formik form
  const agencyFormik = useFormik<User>({
    initialValues: userForEdit,
    enableReinitialize: true,
    validationSchema: agencySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        let avatarUrl = values.avatar;
        if (selectedFile) {
          const uploadedAvatarUrl = await uploadImage(selectedFile);
          if (uploadedAvatarUrl) {
            avatarUrl = uploadedAvatarUrl;
          } else {
            toast.error('Lỗi tải ảnh lên, vui lòng thử lại sau!');
          }
        }
        values.avatar = avatarUrl;

        let response;
        if (isNotEmpty(values.id)) {
          response = await updateUser(values, token || '')
          toast.success('Cập nhật thành công!')
        } else {
          response = await createUser(values)
          toast.success('Tạo tài khoản thành công!')
        }
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message
        toast.error(errorMessage);
        console.error("From UserEditModalForm: ", errorMessage)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  const isAgencyNameTouched = agencyFormik.touched.agency && typeof agencyFormik.touched.agency === 'object' && (agencyFormik.touched.agency as any).name;
  const isAgencyNameError = agencyFormik.errors.agency && typeof agencyFormik.errors.agency === 'object' && (agencyFormik.errors.agency as any).name;


  // Handling the role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRole = e.target.value;
    setSelectedRole(selectedRole);

    const roleValue = selectedRole === 'agency' ? 2 : 3;

    // Update auth.role
    agencyFormik.setFieldValue('auth.role', roleValue);
    salemanFormik.setFieldValue('auth.role', roleValue);
  }

  return (
    <>
      {/* Role Selection */}
    {!currentUser?.agency && (
      <div className='mb-7'>
        <label className='required fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.ROLE' })}</label>
        <div className='d-flex'>
          <label className='form-check form-check-custom form-check-solid me-5' style={{ cursor: 'pointer' }}>
            <input
              className='form-check-input'
              type='radio'
              name='role'
              value='agency'
              checked={selectedRole === 'agency'}
              style={{ cursor: 'pointer' }}
              onChange={handleRoleChange}
            />
            <span className='form-check-label'>{intl.formatMessage({ id: 'AGENCY' })}</span>
          </label>
          <label className='form-check form-check-custom form-check-solid' style={{ cursor: 'pointer' }}>
            <input
              className='form-check-input'
              type='radio'
              name='role'
              value='salesman'
              checked={selectedRole === 'salesman'}
              style={{ cursor: 'pointer' }}
              onChange={handleRoleChange}
            />
            <span className='form-check-label'>{intl.formatMessage({ id: 'SALESMAN' })}</span>
          </label>
        </div>
      </div>
    )}
      {/* Form for Salesman */}
      {selectedRole === 'salesman' ? (
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
              <label className='d-block fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.AVATAR' })}</label>

              {/* begin::Image input */}
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={{ backgroundImage: `url('${previewUrl || userAvatarImg || toAbsoluteUrl('https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg')}')` }}
              >
                {/* begin::Preview existing avatar */}
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{ backgroundImage: `url('${previewUrl || userAvatarImg}')` }}
                ></div>
                {/* end::Preview existing avatar */}

                <label
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='change'
                  title='Change avatar'
                >
                  <i className='bi bi-pencil-fill fs-7'></i>
                  <input type='file' name='avatar' accept='.png, .jpg, .jpeg' onChange={handleFileChange} />
                  <input type='hidden' name='avatar_remove' />
                </label>

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
              <div className='form-text'>Chấp nhận ảnh dạng: png, jpg, jpeg.</div>
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
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'AUTH.INPUT.PASSWORD' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder={intl.formatMessage({ id: 'AUTH.INPUT.PASSWORD' })}
                {...salemanFormik.getFieldProps('auth.password')}
                type='text'
                name='auth.password'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': salemanFormik.touched.auth?.password && salemanFormik.errors.auth?.password },
                  { 'is-valid': salemanFormik.touched.auth?.password && !salemanFormik.errors.auth?.password }
                )}
                autoComplete='off'
                disabled={salemanFormik.isSubmitting || isUserLoading}
              />
              {salemanFormik.touched.auth?.password && salemanFormik.errors.auth?.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{salemanFormik.errors.auth?.password}</span>
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
              {salemanFormik.touched.gender && salemanFormik.errors.gender && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{salemanFormik.errors.gender}</span>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            {currentUser?.auth?.role !== 2 ? (
              <div className='fv-row mb-7'> 
                {/* begin::Label */}
                <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'AGENCY' })}</label>
                {/* end::Label */}

                {/* begin::Dropdown */}
                <select
                  value={salemanFormik.values.agency?.id || ''}
                  onChange={(e) => {
                    const selectedAgencyId = e.target.value ? parseInt(e.target.value) : null;
                    salemanFormik.setFieldValue('agency.id', selectedAgencyId);
                  }}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': salemanFormik.touched.agency && salemanFormik.errors.agency },
                    { 'is-valid': salemanFormik.touched.agency && !salemanFormik.errors.agency }
                  )}
                  name='agency.id'
                  disabled={salemanFormik.isSubmitting || isUserLoading}
                >
                  <option value='' disabled>{intl.formatMessage({ id: 'SELECT.AGENCY' })}</option>
                  {agencies.length > 0 ? (
                    agencies.map((agency) => (
                      <option key={agency.id} value={agency.id ?? ''}>
                        {agency.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>{intl.formatMessage({ id: 'NO.AGENCY' })}</option>
                  )}
                </select>
                {salemanFormik.touched.agency && salemanFormik.errors.agency && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{salemanFormik.errors.agency}</span>
                  </div>
                )}
                {/* end::Dropdown */}
              </div>
            ) : null}
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
                    {...salemanFormik.getFieldProps('auth.isActive')}
                    name='auth.isActive'
                    type='radio'
                    value="true"
                    id='kt_modal_update_role_option_0'
                    checked={salemanFormik.values.auth?.isActive === true}
                    onChange={() => salemanFormik.setFieldValue('auth.isActive', true)}
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
                    {...salemanFormik.getFieldProps('auth.isActive')}
                    name='auth.isActive'
                    type='radio'
                    value="false"
                    id='kt_modal_update_role_option_1'
                    checked={salemanFormik.values.auth?.isActive === false}
                    onChange={() => salemanFormik.setFieldValue('auth.isActive', false)}
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
              disabled={isUserLoading || salemanFormik.isSubmitting || !salemanFormik.isValid || !salemanFormik.dirty}
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
      ) : (
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
              <div className='fv-row mb-7'>
                <label className='d-block fw-bold fs-6 mb-5'>{intl.formatMessage({ id: 'USERS.AVATAR' })}</label>

                {/* begin::Image input */}
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{ backgroundImage: `url('${previewUrl || userAvatarImg || toAbsoluteUrl('https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg')}')` }}
                >
                  {/* begin::Preview existing avatar */}
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{ backgroundImage: `url('${previewUrl || userAvatarImg}')` }}
                  ></div>
                  {/* end::Preview existing avatar */}

                  <label
                    className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                    data-kt-image-input-action='change'
                    title='Change avatar'
                  >
                    <i className='bi bi-pencil-fill fs-7'></i>
                    <input type='file' name='avatar' accept='.png, .jpg, .jpeg' onChange={handleFileChange} />
                    <input type='hidden' name='avatar_remove' />
                  </label>

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
                <div className='form-text'>Chấp nhận ảnh dạng: png, jpg, jpeg.</div>
                {/* end::Hint */}
              </div>
              {/* end::Input group */}
              {/* begin::Input group */}
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'AGENCY.NAME' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Tên chi nhánh'
                  {...agencyFormik.getFieldProps('agency.name')}
                  type='text'
                  name='agency.name'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': isAgencyNameTouched && isAgencyNameError },
                    { 'is-valid': isAgencyNameTouched && !isAgencyNameError }
                  )}
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {isAgencyNameTouched && isAgencyNameError && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{isAgencyNameError}</span>
                    </div>
                  </div>
                )}
                {/* end::Input */}
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
                  {...agencyFormik.getFieldProps('fullName')}
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
                <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'AUTH.INPUT.PASSWORD' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder={intl.formatMessage({ id: 'AUTH.INPUT.PASSWORD' })}
                  {...agencyFormik.getFieldProps('auth.password')}
                  type='text'
                  name='auth.password'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.auth?.password && agencyFormik.errors.auth?.password },
                    { 'is-valid': agencyFormik.touched.auth?.password && !agencyFormik.errors.auth?.password }
                  )}
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {agencyFormik.touched.auth?.password && agencyFormik.errors.auth?.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{agencyFormik.errors.auth?.password}</span>
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
                  type='text'
                  name='auth.email'
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
              <div className='fv-row mb-7'>
                {/* begin::Label */}
                <label className='fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'USERS.DOB' })}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder='Ngày sinh'
                  {...agencyFormik.getFieldProps('dob')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.dob && agencyFormik.errors.dob },
                    {
                      'is-valid': agencyFormik.touched.dob && !agencyFormik.errors.dob,
                    }
                  )}
                  type='date'
                  name='dob'
                  autoComplete='off'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                />
                {agencyFormik.touched.dob && agencyFormik.errors.dob && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{agencyFormik.errors.dob}</span>
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
                  {...agencyFormik.getFieldProps('gender')}
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': agencyFormik.touched.gender && agencyFormik.errors.gender },
                    {
                      'is-valid': agencyFormik.touched.gender && !agencyFormik.errors.gender,
                    }
                  )}
                  name='gender'
                  disabled={agencyFormik.isSubmitting || isUserLoading}
                >
                  <option value='' disabled>{intl.formatMessage({ id: 'SELECT.GENDER' })}</option>
                  <option value='male'>{intl.formatMessage({ id: 'GENDER.MALE' })}</option>
                  <option value='female'>{intl.formatMessage({ id: 'GENDER.FEMALE' })}</option>
                  <option value='other'>{intl.formatMessage({ id: 'GENDER.OTHER' })}</option>
                </select>
                {agencyFormik.touched.gender && agencyFormik.errors.gender && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{agencyFormik.errors.gender}</span>
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
                {/* begin::Input row */}
                <div className='d-flex fv-row'>
                  {/* begin::Radio */}
                  <div className='form-check form-check-custom form-check-solid'>
                    {/* begin::Input */}
                    <input
                      className='form-check-input me-3'
                      {...agencyFormik.getFieldProps('auth.isActive')}
                      name='auth.isActive'
                      type='radio'
                      value="true"
                      id='kt_modal_update_role_option_0'
                      checked={agencyFormik.values.auth?.isActive === true}
                      onChange={() => agencyFormik.setFieldValue('auth.isActive', true)}
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
                      {...agencyFormik.getFieldProps('auth.isActive')}
                      name='auth.isActive'
                      type='radio'
                      value="false"
                      id='kt_modal_update_role_option_1'
                      checked={agencyFormik.values.auth?.isActive === false}
                      onChange={() => agencyFormik.setFieldValue('auth.isActive', false)}
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
              disabled={isUserLoading || agencyFormik.isSubmitting || !agencyFormik.isValid || !agencyFormik.dirty}
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
