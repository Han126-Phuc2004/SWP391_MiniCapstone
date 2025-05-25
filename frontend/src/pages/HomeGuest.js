import React from 'react';
import './HomePage.css';

const jobs = [
  {
    title: 'Thiết kế logo chuyên nghiệp',
    company: 'ABC Studio',
    price: '1.500.000đ',
  },
  {
    title: 'Lập trình website bán hàng',
    company: 'WebPro',
    price: '5.000.000đ',
  },
  {
    title: 'Dịch tài liệu Anh-Việt',
    company: 'TransViet',
    price: '500.000đ',
  },
  {
    title: 'Viết bài SEO chuẩn',
    company: 'SEO King',
    price: '300.000đ',
  },
  {
    title: 'Quản lý quảng cáo Facebook',
    company: 'AdMax',
    price: '2.000.000đ',
  },
];

export default function HomeGuest() {
  return (
    <div className="homepage-container">
      <div className="banner">
        <h1>Chào mừng đến với Freelancer Việt!</h1>
        <p>Xem các bài tuyển dụng mới nhất và tìm cơ hội cho bạn.</p>
      </div>
      <div className="jobs-section">
        <h2>Các job nổi bật</h2>
        <div className="job-list">
          {jobs.map((job, idx) => (
            <div className="job-card" key={idx}>
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company}</div>
              <div className="job-price">{job.price}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <a href="/login" className="cta-btn">Đăng nhập</a>
        <a href="/register" className="cta-btn" style={{ marginLeft: 16 }}>Đăng ký</a>
      </div>
    </div>
  );
}
