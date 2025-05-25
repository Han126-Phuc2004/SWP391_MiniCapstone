import React, { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Đang xác thực email...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
        .then(res => res.text())
        .then(msg => setMessage(msg))
        .catch(() => setMessage('Có lỗi xảy ra khi xác thực!'));
    } else {
      setMessage('Thiếu token xác thực!');
    }
  }, []);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Xác thực email</h2>
      <p>{message}</p>
      <a href="/login" style={{ color: '#1dbf73', fontWeight: 600 }}>Quay lại đăng nhập</a>
    </div>
  );
} 