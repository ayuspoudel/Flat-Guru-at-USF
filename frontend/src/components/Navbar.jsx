import { useState } from 'react';
import { BsCart3, BsMoonFill, BsSunFill, BsPerson } from 'react-icons/bs';
import { FaBarsStaggered } from 'react-icons/fa6';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import NavLinks from './NavLinks';
import { logoutUser, toggleTheme } from '../features/user/userSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useSelector((state) => state.userState.user); // User state

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);
  const theme = useSelector((state) => state.userState.theme);
  const isDarkTheme = theme === 'dracula';

  // Handle user menu toggle
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/');
    dispatch(clearCart());
    dispatch(logoutUser());
    queryClient.removeQueries();
  };

  // Redirect to profile page
  // const handleGoToProfile = () => {
  //   navigate('/profile');
  // };

  return (
    <nav className='bg-base-200'>
      <div className='navbar align-element'>
        <div className='navbar-start'>
          {/* TITLE */}
          <NavLink
            to='/'
            className='hidden lg:flex btn btn-primary text-3xl items-center'
          >
            C
          </NavLink>
          {/* DROPDOWN */}
          <div className='dropdown'>
            <label tabIndex={0} className='btn btn-ghost lg:hidden'>
              <FaBarsStaggered className='h-6 w-6' />
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52'
            >
              <NavLinks />
            </ul>
          </div>
        </div>
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal'>
            <NavLinks />
          </ul>
        </div>
        <div className='navbar-end'>
          {/* THEME SETUP */}
          <label className='swap swap-rotate mr-4'> {/* Added margin to right */}
            <input
              type='checkbox'
              onChange={handleTheme}
              defaultChecked={isDarkTheme}
            />
            {/* sun icon */}
            <BsSunFill className='swap-on h-4 w-4 mr-2' /> {/* Added margin-right */}
            {/* moon icon */}
            <BsMoonFill className='swap-off h-4 w-4' />
          </label>

          {/* CONDITIONAL RENDERING BASED ON USER AUTHENTICATION */}
          {user ? (
            <>
              {/* CART LINK */}
              <NavLink to='/cart' className='btn btn-ghost btn-circle btn-md ml-4'>
                <div className='indicator'>
                  <BsCart3 className='h-6 w-6' />
                  <span className='badge badge-sm badge-primary indicator-item'>
                    {numItemsInCart}
                  </span>
                </div>
              </NavLink>
              {/* USER PROFILE DROPDOWN */}
              <div className='relative'>
                <button
                  onClick={handleUserMenuToggle} // Toggle user menu visibility
                  className='btn btn-ghost btn-circle btn-md ml-4'
                >
                  <BsPerson className='h-6 w-6' />
                </button>
                {isUserMenuOpen && (
                  <ul className='absolute right-0 mt-2 w-48 p-2 shadow bg-base-200 rounded-box'>
                    <li>
                      <NavLink to='/userProfile' className='block p-2'>
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/update-user' className='block p-2'>
                        Update User
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout} className='block p-2 w-full text-left'>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className='flex gap-x-6 justify-center items-center'>
              <NavLink to='/login' className='link link-hover text-xs sm:text-sm'>
                Sign in / Guest
              </NavLink>
              <NavLink to='/register' className='link link-hover text-xs sm:text-sm'>
                Create Account
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
