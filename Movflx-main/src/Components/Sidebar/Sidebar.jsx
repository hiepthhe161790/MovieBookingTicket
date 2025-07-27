import React from 'react';
import { useState } from 'react';
import { FiHome, FiFilm, FiPlusCircle, FiGrid, FiMenu } from "react-icons/fi";
const Sidebar = () => {
      const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
 <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
         <div className="p-4">
           <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-2 hover:bg-gray-100 rounded-full"
           >
             <FiMenu size={24} />
           </button>
         </div>
         <nav className="mt-4">
           {[
             { icon: FiHome, text: "Dashboard" },
             { icon: FiFilm, text: "Movies" },
             { icon: FiPlusCircle, text: "Add Movie" },
             { icon: FiGrid, text: "Categories" }
           ].map((item, index) => (
             <button
               key={index}
               className="w-full p-4 flex items-center gap-4 hover:bg-gray-100"
             >
               <item.icon size={20} />
               {sidebarOpen && <span>{item.text}</span>}
             </button>
           ))}
         </nav>
       </div>
  );
}
export default Sidebar;