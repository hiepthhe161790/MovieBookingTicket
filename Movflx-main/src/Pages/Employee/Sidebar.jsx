import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiFilm, FiPlusCircle, FiGrid, FiMenu, FiUsers, FiLogOut, FiArrowLeftCircle, FiCalendar, FiLayers } from "react-icons/fi"; // Thêm FiLayers

const Sidebar = ({ setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const menuItems = [
    { icon: FiHome, text: "Dashboard", path: "/employee/dashboard" },
    { icon: FiFilm, text: "Movies", path: "/employee/movies" },
    { icon: FiPlusCircle, text: "Cinema Rooms", path: "/employee/cinema-rooms" },
    { icon: FiGrid, text: "Categories", path: "/employee/types" },
    { icon: FiCalendar, text: "Movie Schedule", path: "/employee/movie-schedule" },
    { icon: FiLayers, text: "Seats", path: "/employee/seats" } 
  ];

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Đặt user về null
    navigate("/login");
  };

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col h-screen`}>
      <div className="p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="mt-4 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-100 transition"
            onClick={() => navigate(item.path)}
          >
            <item.icon size={20} />
            {sidebarOpen && <span>{item.text}</span>}
          </button>
        ))}
      </nav>
      <div className="mb-6 flex flex-col gap-2 px-2">
        <button
          className="w-full flex items-center gap-4 p-3 rounded hover:bg-blue-50 text-blue-600 font-semibold transition"
          onClick={() => navigate("/")}
        >
          <FiArrowLeftCircle size={20} />
          {sidebarOpen && <span>Trang chủ</span>}
        </button>
        <button
          className="w-full flex items-center gap-4 p-3 rounded hover:bg-red-50 text-red-500 font-semibold transition"
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;