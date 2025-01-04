import { useState, FC, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { initialUser as initialValues } from '../SettingsModel';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../../../../../../app/modules/auth';
import { updateProfile } from '../../core/_request';
import { useQueryResponse } from '../../../../apps/user-management/users-list/core/QueryResponseProvider'

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../core/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';

const firebaseApp = initializeApp(firebaseConfig);


// Regex for Vietnamese phone number format
const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const profileDetailsSchema = Yup.object().shape({
  fullName: Yup.string().required('Vui lòng nhập vào trường này'),
  phoneNumber: Yup.string()
    .matches(vietnamesePhoneRegExp, 'Vui lòng nhập đúng định dạng số điện thoại Việt Nam, bao gồm 10 chữ số, bắt đầu bằng các đầu số hợp lệ như 03, 05, 07, 08, hoặc 09.')
    .required('Vui lòng nhập vào trường này'),
  address: Yup.string().required('Vui lòng nhập vào trường này'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Gender must be either Male or Female'),
    // .required('Vui lòng nhập vào trường này'),
  dob: Yup.date()
    .required('Vui lòng nhập vào trường này')
    .max(new Date(), 'Ngày sinh không hợp lệ')
    .test(
      'is-18',
      'Bạn phải đủ 18 tuổi',
      (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const isOldEnough = age > 18 || (age === 18 && today >= new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)));
        return isOldEnough;
      }
    )
});

const ProfileDetails: FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [data, setData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('auth_token');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // New state for image preview

  const storage = getStorage(firebaseApp);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const preview = URL.createObjectURL(file);  // Generate preview URL
      setPreviewUrl(preview);  // Set preview URL for immediate image display
    }
  };

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `avatars/${currentUser?.id}_${file.name}`);
    console.log("Storage reference created:", storageRef);

    await uploadBytes(storageRef, file).then(() => {
      console.log("File uploaded successfully:", file.name);
    }).catch((error) => {
      console.error("Error uploading file:", error);
    });

    const downloadURL = await getDownloadURL(storageRef).catch((error) => {
      console.error("Error getting download URL:", error);
      return undefined; // handle error
    });

    console.log("Download URL:", downloadURL);
    return downloadURL;
  };


  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!currentUser) {
        console.error('User is not logged in');
        setSubmitting(false);
        return;
      }
      console.log("Firebase Config:", firebaseConfig);
      setLoading(true);
      setSubmitting(true);

      try {
        let avatarUrl = currentUser.avatar;
        if (selectedFile) {
          // Upload the selected file to Firebase Storage
          const uploadedAvatarUrl = await uploadImage(selectedFile);
          if (uploadedAvatarUrl) {
            avatarUrl = uploadedAvatarUrl; // Only set avatarUrl if upload is successful
          } else {
            console.error("Image upload failed, keeping the old avatar");
          }
        }
        console.log('Submitting profile update:', values);
        // const updatedProfile = await updateProfile(values, currentUser.id, token || '');
        const updatedProfile = await updateProfile(
          { ...values, avatar: avatarUrl }, // Include avatar URL
          currentUser.id,
          token || ''
        );
        console.log('Profile updated successfully:', updatedProfile);
        toast.success('Cập nhật thông tin thành công!');


        // Optionally update the local state with the updated profile
        const updatedUser = {
          ...currentUser,
          ...values,
          avatar: avatarUrl,
          agency: typeof values.agency === 'number'
            ? currentUser.agency  // Keep the existing agency if values.agency is just a number
            : values.agency,       // Otherwise, use the full agency object if provided
        };

        setCurrentUser(updatedUser);

        setData(values);

      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Cập nhật thông tin thất bại!');
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
                  style={{ backgroundImage: `url(${previewUrl || data.avatar || toAbsoluteUrl('https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg')})` }}  // Show previewUrl if available
                >
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{ backgroundImage: `url(${previewUrl || data.avatar})` }}  // Show previewUrl for the image preview
                  ></div>

                  {/* Input for file */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control form-control-lg form-control-solid"
                  />
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
