import React, { useEffect, useState } from "react";
import { FiUsers, FiFilm, FiDollarSign, FiVideo } from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line
} from "recharts";
const iconMap = [
  <FiUsers className="text-3xl text-blue-500" />,
  <FiDollarSign className="text-3xl text-green-500" />,
  <FiFilm className="text-3xl text-purple-500" />,
  <FiVideo className="text-3xl text-yellow-500" />,
];
const colorMap = [
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-yellow-100",
];

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/report/overview")
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || []);
        setRevenueData(data.revenueData || []);
        setTopMovies(data.topMovies || []);
      });
  }, []);

  const maxRevenue = Math.max(...revenueData.map(d => d.value || 0), 1);

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Báo cáo tổng quan hệ thống đặt vé phim</h1>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl p-6 flex items-center gap-4 shadow ${colorMap[idx]}`}>
              <div>{iconMap[idx]}</div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Doanh thu theo tháng (VND)</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={revenueData}
                margin={{ left: 24, right: 24, top: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => v.toLocaleString("vi-VN")} />
                <Tooltip formatter={v => `${v.toLocaleString("vi-VN")} VND`} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Movies */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Top phim bán chạy</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">#</th>
                <th className="py-2">Tên phim</th>
                <th className="py-2">Số vé đã bán</th>
                <th className="py-2">Đánh giá TB</th>
                <th className="py-2">Số đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {topMovies.map((movie, idx) => (
                <tr key={movie.name} className="border-t">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2">{movie.name}</td>
                  <td className="py-2">{movie.tickets}</td>
                  <td className="py-2">{movie.averageRating ? movie.averageRating.toFixed(1) : "Chưa có"}</td>
                  <td className="py-2">{movie.totalReviews || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;