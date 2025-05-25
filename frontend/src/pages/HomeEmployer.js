import React from 'react';

export default function HomeEmployer({ user }) {
  return (
    <div className="homepage-container">
      <div className="banner" style={{ background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)' }}>
        <h1>Xin chào {user?.email}!</h1>
        <p>Quản lý các bài đăng tuyển dụng của bạn tại đây.</p>
        {/* Thêm các chức năng quản lý bài đăng: danh sách, tạo mới, sửa, xóa... */}
      </div>
      {/* Thêm component quản lý bài đăng ở đây */}
    </div>
  );
} 