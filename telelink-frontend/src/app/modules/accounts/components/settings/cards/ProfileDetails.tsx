import { useState, FC, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { IProfileDetails, profileDetailsInitValues as initialValues } from '../SettingsModel';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../../../../../../app/modules/auth';

// Regex for Vietnamese phone number format
const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const profileDetailsSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  contactPhone: Yup.string()
    .matches(vietnamesePhoneRegExp, 'Phone number is not valid')
    .required('Contact phone is required'),
  address: Yup.string().required('Address is required'),
  agency: Yup.string().required('Agency is required'),
  gender: Yup.string()
    .oneOf(['Male', 'Female'], 'Gender must be either Male or Female')
    .required('Gender is required'),
  role: Yup.string().required('Role is required'),
});

const ProfileDetails: FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<IProfileDetails>(initialValues);
  const [loading, setLoading] = useState(false);

  // Pre-populate the form when the component mounts or when `currentUser` changes
  useEffect(() => {
    if (currentUser) {
      // Assuming currentUser contains all the necessary information
      setData({
        ...data,
        fullName: currentUser.fullName || '',
        contactPhone: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        agency: currentUser.agency || '',
        gender: currentUser.gender || '',
        // role: currentUser.role || '',
        avatar: currentUser.avatar || initialValues.avatar, // if avatar exists
      });
    }
  }, [currentUser]);

  const handleUpdateProfile = async (updatedProfile: IProfileDetails) => {
    try {
      const response = await axios.patch(`/user/${currentUser?.id}`, updatedProfile);
      console.log('Profile update successful:', response.data);
      setData(response.data); // Ensure the data is updated after successful response
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };
  

  const formik = useFormik<IProfileDetails>({
    initialValues: data, // use the `data` that is set from `currentUser`
    enableReinitialize: true, // allow reinitialization when `data` changes
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const updatedProfile = { ...values, id: currentUser?.id };
      await handleUpdateProfile(updatedProfile);

      // Update local state
      setData(values);
      setLoading(false);
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
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{ backgroundImage: `url(${toAbsoluteUrl(data.avatar)})` }}
                  ></div>
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

            {/* Contact Phone */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">Số điện thoại</span>
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="tel"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Số điện thoại"
                  {...formik.getFieldProps('contactPhone')}
                />
                {formik.touched.contactPhone && formik.errors.contactPhone && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.contactPhone}</div>
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
                  value="Male"
                  checked={formik.values.gender === 'male'}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label" htmlFor="male">
                  Nam
                </label>
              </div>
              <div className="form-check form-check-inline ms-4">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  value="Female"
                  checked={formik.values.gender !== 'male'}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label" htmlFor="female">
                  Nữ
                </label>
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

            {/* <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">Vai trò</label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Vai trò"
                  {...formik.getFieldProps('role')}
                />
                {formik.touched.role && formik.errors.role && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.role}</div>
                  </div>
                )}
              </div>
            </div> */}


            {/* <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">Chi nhánh</label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Chi nhánh"
                  {...formik.getFieldProps('agency')}
                />
                {formik.touched.agency && formik.errors.agency && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.agency}</div>
                  </div>
                )}
              </div>
            </div>*/}
          </div> 

          <div className="card-footer d-flex justify-content-end py-6 px-9">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {!loading && 'Lưu'}
              {loading && (
                <span className="indicator-progress" style={{ display: 'block' }}>
                  Đang lưu... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProfileDetails };
