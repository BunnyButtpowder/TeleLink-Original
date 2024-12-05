import React, { FC, useState, memo } from 'react';
import clsx from 'clsx';

const PasswordInputField: FC<{ formik: any; fieldName: string; label: string }> = memo(
  ({ formik, fieldName, label }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <div className="fv-row mb-7 position-relative">
        <label className="required fw-bold fs-6 mb-2">{label}</label>
        <div className="position-relative">
          <input
            placeholder={label}
            type={isPasswordVisible ? 'text' : 'password'}
            name={fieldName}
            value={formik.values.auth?.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
              { 'is-invalid': formik.touched.auth?.password && formik.errors.auth?.password },
              { 'is-valid': formik.touched.auth?.password && !formik.errors.auth?.password }
            )}
            autoComplete="off"
            disabled={formik.isSubmitting}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
            onClick={togglePasswordVisibility}
            style={{ zIndex: 1 }}
          >
            {isPasswordVisible ? (
              <i className="bi bi-eye-fill fs-5"></i>
            ) : (
              <i className="bi bi-eye-slash-fill fs-5"></i>
            )}
          </span>
        </div>
        {formik.touched.auth?.password && formik.errors.auth?.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.auth?.password}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default PasswordInputField;
