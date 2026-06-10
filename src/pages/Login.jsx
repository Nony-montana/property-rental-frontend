import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const Login = () => {
  const { login, getDashboardRoute } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post('/auth/login', values);

        if (res.data.requires2FA) {
          setShow2FA(true);
          setAdminEmail(values.email);
          setSubmitting(false);
          return;
        }

        login(res.data.data, res.data.token);
        navigate(getDashboardRoute(res.data.data.role));
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Login failed' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handle2FASubmit = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await API.post('/auth/login', {
        email: adminEmail,
        password: formik.values.password,
        otp,
      });
      login(res.data.data, res.data.token);
      navigate(getDashboardRoute(res.data.data.role));
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card p-4 shadow" style={{ borderRadius: "12px" }}>
          <h3 className="text-center mb-4" style={{ color: "var(--primary)" }}>
            Welcome Back
          </h3>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
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
                backgroundColor: "var(--primary)",
                color: "var(--white)",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "500",
              }}>
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-2">
            <Link to="/forgot-password" style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
              Forgot your password?
            </Link>
          </p>

          <p className="text-center mt-2">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '500' }}>
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* 2FA MODAL */}
      {show2FA && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '380px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h5 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              🛡️ Admin 2FA Verification
            </h5>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              A verification code has been sent to your email. Enter it below to continue.
            </p>
            {otpError && <div className="alert alert-danger">{otpError}</div>}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
            />
            <button
              onClick={handle2FASubmit}
              className="btn w-100 mb-2"
              disabled={otpLoading || otp.length < 6}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                borderRadius: '8px',
                padding: '10px'
              }}>
              {otpLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              onClick={() => { setShow2FA(false); setOtp(''); setOtpError(''); }}
              className="btn w-100"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                borderRadius: '8px',
                padding: '8px'
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;