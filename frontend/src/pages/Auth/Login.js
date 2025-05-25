import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Auth.css';

const API_URL = "http://localhost:5001/api/auth";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    roleID: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.roleID) {
      setMessage('Vui lòng chọn vai trò!');
      return;
    }
    if (!form.email) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!form.password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!form.roleID) {
      setError('Vui lòng chọn vai trò trước khi đăng nhập bằng Google');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await axios.post(`${API_URL}/google-login`, {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture || '',
        googleId: decoded.sub,
        roleID: parseInt(form.roleID)
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập bằng Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              className="login-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="login-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-group">
            <label htmlFor="roleID">Chọn vai trò</label>
            <select
              id="roleID"
              name="roleID"
              className="login-input"
              value={form.roleID}
              onChange={handleChange}
              required
            >
              <option value="">Chọn vai trò</option>
              <option value="1">Quản trị viên</option>
              <option value="2">Người tìm việc</option>
              <option value="3">Nhà tuyển dụng</option>
            </select>
          </div>
          <button type="submit" className="login-btn-gradient">Đăng nhập</button>
          {message && <div className="register-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <div className="login-forgot">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </form>
        <div className="login-divider"></div>
        <div className="login-signup">
          <span>Chưa có tài khoản?</span>
          <a href="/register" className="login-signup-btn">Đăng ký ngay</a>
        </div>
        <div className="login-social">
          <span>May also signup with</span>
          <div className="login-social-icons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Đăng nhập Google thất bại')}
              width="100%"
              text="signup_with"
              shape="circle"
              logo_alignment="center"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 