import React from 'react';
import HomeGuest from './HomeGuest';
import HomeEmployer from './HomeEmployer';
import HomeAdmin from './HomeAdmin';
import './HomePage.css';

const categories = [
  { name: 'Thiết kế đồ họa', icon: '🎨' },
  { name: 'Lập trình web', icon: '💻' },
  { name: 'Dịch thuật', icon: '🌐' },
  { name: 'Marketing', icon: '📈' },
  { name: 'Viết nội dung', icon: '✍️' },
];

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

function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user.roleID || user.roleID === 2) {
    // Guest hoặc freelancer đều xem được job như nhau
    return <HomeGuest user={user} />;
  }
  if (user.roleID === 3) {
    // Employer: quản lý bài đăng
    return <HomeEmployer user={user} />;
  }
  if (user.roleID === 1) {
    // Admin: quản lý hệ thống
    return <HomeAdmin user={user} />;
  }
  // Trường hợp khác (dự phòng)
  return <HomeGuest />;
}

export default HomePage;
