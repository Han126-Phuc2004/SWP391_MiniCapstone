import React from 'react';

export default function HomeAdmin({ user }) {
  return (
    <div className="homepage-container">
      <div className="banner" style={{ background: 'linear-gradient(90deg, #ff9800 0%, #f44336 100%)' }}>
        <h1>Chào mừng Admin {user?.email}!</h1>
        <p>Quản lý hệ thống, người dùng, bài đăng, báo cáo...</p>
        {/* Thêm dashboard, thống kê, quản lý user/job/report... */}
      </div>
    </div>
  );
} 