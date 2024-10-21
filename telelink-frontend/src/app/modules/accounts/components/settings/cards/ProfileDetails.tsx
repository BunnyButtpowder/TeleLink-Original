import { useState, FC, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { initialUser  as initialValues } from '../SettingsModel';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../../../../../../app/modules/auth';
import { updateProfile } from '../../core/_request';

// Regex for Vietnamese phone number format
const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const profileDetailsSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string()
    .matches(vietnamesePhoneRegExp, 'Phone number is not valid')
    .required('Contact phone is required'),
  address: Yup.string().required('Address is required'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Gender must be either Male or Female')
    .required('Gender is required'),
  dob: Yup.date().nullable().required('Date of birth is required'),
});

const ProfileDetails: FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [data, setData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('auth_token');

  // Pre-populate the form when the component mounts or when `currentUser` changes
  useEffect(() => {
    if (currentUser) {
      setData({
        ...data,
        fullName: currentUser.fullName || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        gender: currentUser.gender || '',
        dob: currentUser.dob || '',
        avatar: currentUser.avatar || initialValues.avatar, // if avatar exists
      });
      console.log("CurrentUser: ", currentUser);
      console.log("Data: ", data);
    }
  }, [currentUser]);

  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,  // This ensures the form picks up changes in `data`
    validationSchema: profileDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!currentUser) {
        console.error('User is not logged in');
        setSubmitting(false);
        return;
      }
      setLoading(true);
      setSubmitting(true);

      try {
        console.log('Submitting profile update:', values);
        const updatedProfile = await updateProfile(values, currentUser.id, token || '');
        console.log('Profile updated successfully:', updatedProfile);

        // // Optionally update the local state with the updated profile
        // setCurrentUser({ ...currentUser, ...updatedProfile });
        // setData(values);
        
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-header border-0 cursor-pointer">
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Thông tin</h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
        <form onSubmit={formik.handleSubmit} noValidate className="form">
          <div className="card-body border-top p-9">
            {/* Avatar */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">Ảnh đại diện</label>
              <div className="col-lg-8">
                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{ backgroundImage: `url(${toAbsoluteUrl('media/avatars/blank.png')})` }}
                >
                  {/* <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{ backgroundImage: `url(${toAbsoluteUrl(data.avatar)})` }}
                  ></div> */}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">Tên đầy đủ</label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Họ và tên"
                  {...formik.getFieldProps('fullName')}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.fullName}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">Số điện thoại</span>
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="tel"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Số điện thoại"
                  {...formik.getFieldProps('phoneNumber')}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.phoneNumber}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">Giới tính</label>
              <div className="col-lg-8 fv-row d-flex align-items-center">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    checked={formik.values.gender === 'male'}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="male">Nam</label>
                </div>
                <div className="form-check form-check-inline ms-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={formik.values.gender === 'female'}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="female">Nữ</label>
                </div>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.gender}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">Địa chỉ</span>
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Địa chỉ"
                  {...formik.getFieldProps('address')}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.address}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6 required">Ngày sinh</label>
              <div className="col-lg-8 fv-row">
                <input
                  type="date"
                  className="form-control form-control-lg form-control-solid"
                  {...formik.getFieldProps('dob')}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.dob}</div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Submit button */}
          <div className="card-footer d-flex justify-content-end py-6 px-9">
            <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
              {!loading ? 'Lưu' : 'Đang lưu...'}
              {loading && (
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProfileDetails };
