import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Logo } from '../assets/img';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import { useStateValue } from '../context/StateProvider';

import { getAuth, signOut } from 'firebase/auth'; 
import { app } from '../config/firebase.config';

import { motion } from 'framer-motion';

const Header = () => {
  const [{ user }] = useStateValue();
  const [isMenu, setisMenu] = useState(false);

  const navigate = useNavigate();

  const logOut = () => {
    const firebaseAuth = getAuth(app);
    signOut(firebaseAuth)
      .then(() => {
        window.localStorage.setItem('auth', 'false');
      })
      .catch((e) => console.log(e));
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center w-full p-4 md:py-2 md:px-6" 
    style={{ 
      backgroundColor: '#15182B', 
      backdropFilter: 'blur(8px)', }}>
      <NavLink to="/" className="flex items-center text-white">
        <img src={Logo} alt="LOGO" className="w-16" />
        <span
          className="text-lg font-bold ml-0.5"
          style={{ fontFamily: 'Franklin Gothic Heavy', fontSize: '1.5rem' }}
        >
          YouMusic
        </span>
      </NavLink>

      <ul className="flex items-center justify-center ml-7">
        <li className="mx-5 text-lg">
          <NavLink to={'/home'} className={({ isActive }) => (isActive ? isActiveStyles : isNotActiveStyles)}>
            Home
          </NavLink>
        </li>
      </ul>

      <div
        onMouseEnter={() => setisMenu(true)}
        onMouseLeave={() => setisMenu(false)}
        className="flex items-center ml-auto cursor-pointer gap-2 relative"
      >
        <img
          className="w-12 min-w-[44px] object-cover rounded-full shadow-lg"
          src={user?.user?.imageURL || 'fallback_image_url'} 
          alt=""
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <p className="text-textColor text-lg hover:text-headingColor font-semibold">
            {user?.user?.name || 'Guest'} 
          </p>
        </div>

        {isMenu && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute z-10 top-12 p-3 right-0 w-275 gap-2 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
          >

            {user?.user?.role === 'admin' && (
              <>
                <NavLink to={'/dashboard/home'}>
                  <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                    Dashboard
                  </p>
                </NavLink>

                <hr />
              </>
            )}

            <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out" onClick={logOut}>
              Sign Out
            </p>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
