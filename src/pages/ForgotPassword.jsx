 import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await API.post('/auth/request-otp', values);
        navigate('/reset-password', { state: { email: values.email } });
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to send OTP' });
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
            Forgot Password
          </h3>
          <p className="text-center mb-4" style={{ color: 'var(--text-light)' }}>
            Enter your email and we'll send you an OTP to reset your password
          </p>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
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
              {formik.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <p className="text-center mt-3">
            Remember your password?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500' }}>
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
