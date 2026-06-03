 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const ChangePassword = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .notOneOf([Yup.ref('oldPassword')], 'New password must be different from current password')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await API.post('/auth/change-password', {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
        resetForm();
        alert('Password changed successfully! Please login again.');
        logout();
        navigate('/login');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to change password' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card p-4 shadow" style={{ borderRadius: '12px' }}>

          {/* HEADER */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--primary)'
              }}>
              <FaArrowLeft size={18} />
            </button>
            <div>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>Change Password</h3>
              <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem' }}>
                Update your account password
              </p>
            </div>
          </div>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>

            {/* CURRENT PASSWORD */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <FaLock color="var(--accent)" size={14} /> Current Password
              </label>
              <input
                type="password"
                name="oldPassword"
                className={`form-control ${formik.touched.oldPassword && formik.errors.oldPassword ? 'is-invalid' : ''}`}
                placeholder="Enter your current password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <div className="invalid-feedback">{formik.errors.oldPassword}</div>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2">
                <FaLock color="var(--accent)" size={14} /> New Password
              </label>
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
              <label className="form-label d-flex align-items-center gap-2">
                <FaLock color="var(--accent)" size={14} /> Confirm New Password
              </label>
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
              {formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
