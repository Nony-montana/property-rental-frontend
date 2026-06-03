import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const formik = useFormik({
    initialValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, 'OTP must be 6 digits')
        .required('OTP is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await API.post('/auth/reset-password', {
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        navigate('/login');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to reset password' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card p-4 shadow" style={{ borderRadius: '12px' }}>

          <h3 className="text-center mb-2" style={{ color: 'var(--primary)' }}>
            Reset Password
          </h3>
          <p className="text-center mb-4" style={{ color: 'var(--text-light)' }}>
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>

            {/* OTP */}
            <div className="mb-3">
              <label className="form-label">OTP Code</label>
              <input
                type="text"
                name="otp"
                className={`form-control ${formik.touched.otp && formik.errors.otp ? 'is-invalid' : ''}`}
                placeholder="Enter 6-digit OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={6}
                style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
              />
              {formik.touched.otp && formik.errors.otp && (
                <div className="invalid-feedback">{formik.errors.otp}</div>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className={`form-control ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
                placeholder="Enter new password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="invalid-feedback">{formik.errors.newPassword}</div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm new password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn w-100"
              disabled={formik.isSubmitting}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
              {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center mt-3">
            Didn't receive OTP?{' '}
            <Link to="/forgot-password" style={{ color: 'var(--accent)', fontWeight: '500' }}>
              Try again
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;