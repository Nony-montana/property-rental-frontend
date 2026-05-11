import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .required('Last name is required'),
      email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
      phone: Yup.string()
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please confirm your password'),
      role: Yup.string()
        .required('Please select a role'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post('/auth/register', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: values.role,
        });
        login(res.data.data, res.data.token);
        navigate('/');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Registration failed' });
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
            Create Account
          </h3>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>

            {/* FIRST NAME */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                placeholder="Enter your first name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="invalid-feedback">{formik.errors.firstName}</div>
              )}
            </div>

            {/* LAST NAME */}
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Enter your last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="invalid-feedback">{formik.errors.lastName}</div>
              )}
            </div>

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

            {/* PHONE */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter your phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="invalid-feedback">{formik.errors.phone}</div>
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

            {/* CONFIRM PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* ROLE */}
            <div className="mb-3">
              <label className="form-label">I am a</label>
              <select
                name="role"
                className={`form-select ${formik.touched.role && formik.errors.role ? 'is-invalid' : ''}`}
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}>
                <option value="">-- Select your role --</option>
                <option value="RENT">I am looking to Rent</option>
                <option value="BUY">I am looking to Buy</option>
                <option value="LANDLORD">I am a Landlord</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="invalid-feedback">{formik.errors.role}</div>
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
              {formik.isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500' }}>
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;