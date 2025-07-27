import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Search from '../Components/Search';

const UserLayout = ({ children, showSearch, setShowSearch, setCurrentPage, watchList }) => {
  return (
    <>
      <Navbar setShowSearch={setShowSearch} watchList={watchList} />
      <Search showSearch={showSearch} setShowSearch={setShowSearch} setCurrentPage={setCurrentPage} />
      {children}
      <Footer />
    </>
  );
};

export default UserLayout;
