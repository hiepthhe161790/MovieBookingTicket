import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import './style.css';
import { FiUser, FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";

const Navbar = ({ setShowSearch, watchList, user, onLogout }) => {
  const [sticky, setSticky] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [showSide, setShowSide] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef();
  const handleResponsive = () => {
    setResponsive(window.innerWidth < 820);
  };

  useEffect(() => {
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
    return () => window.removeEventListener('resize', handleResponsive);
  }, []);

  const handleScroll = () => {
    setSticky(window.scrollY > 245);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSide ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSide]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShowSearch = () => {
    setShowSide(false);
    setShowSearch(true);
  };

  return (
    <nav className={sticky ? 'navbar sticky' : 'navbar'}>
      <div className="container">
        <div className="row">
          <div className="navbar-brand">
            <Link className="navbar-item link" to="/">
              <img src={logo} alt="Movflx" className="logo" />
            </Link>
          </div>
          <ul className={responsive ? (showSide ? 'navbar-menu sidebar show' : 'navbar-menu sidebar') : 'navbar-menu'}>
            {responsive && (
              <button className="btn close-btn" onClick={() => setShowSide(false)}>
                <i className="ri-close-line"></i>
              </button>
            )}
            {user && user.role === "ADMIN" && (
              <li className="navbar-item">
                <Link className="navbar-link" to="/admin/dashboard" onClick={() => setShowSide(false)}>
                  Admin Dashboard
                </Link>
              </li>
            )}
              {user && user.role === "EMPLOYEE" && (
              <li className="navbar-item">
                <Link className="navbar-link" to="/employee/dashboard" onClick={() => setShowSide(false)}>
                  Employee Dashboard
                </Link>
              </li>
            )}
            <li className="navbar-item">
              <Link className="navbar-link" to="/" onClick={() => setShowSide(false)}>
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/movies" onClick={() => setShowSide(false)}>
                Movies
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link favourites" to="/favourites" onClick={() => setShowSide(false)}>
                Favourites
                {watchList.length ? <span className="num">{watchList.length}</span> : null}
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/#Subscribe" onClick={() => setShowSide(false)}>
                Subscribe
              </Link>
            </li>
            {user ? (
              <li className="navbar-item relative" ref={accountMenuRef}>
                <button
                  className="navbar-link btn"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <FiUser />
                  <span style={{ marginLeft: 4 }}>{user.username}</span>
                </button>
                {accountMenuOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                    <li>
                      <Link
                        className="block px-4 py-2 hover:bg-gray-100 text-black"
                        to="/personal"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <FiUser className="inline mr-2" /> Tài khoản
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => { onLogout(); setAccountMenuOpen(false); setShowSide(false); }}
                      >
                        <FiLogOut className="inline mr-2" /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="navbar-item">
                  <Link className="navbar-link" to="/login" onClick={() => setShowSide(false)}>
                    <FiLogIn className="inline mr-2" /> Login
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link className="navbar-link" to="/register" onClick={() => setShowSide(false)}>
                    <FiUserPlus className="inline mr-2" /> Register
                  </Link>
                </li>
              </>
            )}
            <li className="navbar-item">
              <button className="navbar-link btn" onClick={handleShowSearch}>
                Search
              </button>
            </li>
          </ul>
          {responsive && (
            <div className="right-btns">
              <button className="btn menu-toggle" onClick={() => setShowSide(true)}>
                <i className="ri-menu-3-line"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;