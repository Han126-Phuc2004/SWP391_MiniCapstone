import React, { useState } from 'react';
import './Auth.css';

// state lưu thông tin form và message
export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleID: ''
  });
  const [message, setMessage] = useState('');

  // hàm xử lý khi thay đổi input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // xử lý submit form
  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message || 'Đăng ký thất bại!');
    } catch (err) {
      setMessage('Đăng ký thất bại!');
    }
  };

  return (
    <div className="register-bg">
      <form onSubmit={handleSubmit} className="register-box">
        <h2 className="register-title">Đăng ký</h2>
        <div className="register-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Nhập username"
            className="register-input"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="register-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email"
            className="register-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="register-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            className="register-input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="register-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="register-input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="register-group">
          <label htmlFor="roleID">Chọn vai trò</label>
          <select
            id="roleID"
            name="roleID"
            className="register-input"
            value={form.roleID}
            onChange={handleChange}
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="2">Người tìm việc</option>
            <option value="3">Nhà tuyển dụng</option>
          </select>
        </div>
        <button type="submit" className="register-btn">Đăng ký</button>
        {message && <div className="register-message">{message}</div>}
      </form>
    </div>
  );
} 