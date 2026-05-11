import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post('/auth/login', values);
        login(res.data.data, res.data.token);
        navigate('/');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Login failed' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card p-4 shadow" style={{ borderRadius: '12px' }}>

          <h3 className="text-center mb-4" style={{ color: 'var(--primary)' }}>
            Welcome Back
          </h3>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label">Email</label>
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

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
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
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '500' }}>
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;