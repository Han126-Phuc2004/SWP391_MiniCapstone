import React, { useState } from 'react';

// State lưu thông tin form và message
export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', roleID: '' });
  const [message, setMessage] = useState('');

  // Hàm xử lý khi thay đổi input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Xử lý submit form
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
      if (res.ok) {
        setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
      } else {
        setMessage(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      setMessage('Đăng ký thất bại!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8}}>
      <h2>Đăng ký</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{width: '100%', marginBottom: 12, padding: 8}} />
      <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required style={{width: '100%', marginBottom: 12, padding: 8}} />
      <input name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" value={form.confirmPassword} onChange={handleChange} required style={{width: '100%', marginBottom: 12, padding: 8}} />
      <select name="roleID" value={form.roleID} onChange={handleChange} required style={{width: '100%', marginBottom: 12, padding: 8}}>
        <option value="">Chọn vai trò</option>
        <option value="2">Người tìm việc</option>
        <option value="3">Nhà tuyển dụng</option>
      </select>
      <button type="submit" style={{width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4}}>Đăng ký</button>
      <div style={{marginTop: 16, color: message.includes('thành công') ? 'green' : 'red'}}>{message}</div>
    </form>
  );
} 