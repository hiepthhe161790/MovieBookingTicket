import React from 'react';
import Sidebar from '../Pages/Admin/Sidebar';

const AdminLayout = ({ children, setUser }) => {
  return (
    <div className="flex h-screen bg-gray-100">
       <Sidebar setUser={setUser} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default AdminLayout;
