
import React from 'react';
import { PublicNavbar } from './navbar/PublicNavbar';
import { AppNavbar } from './navbar/AppNavbar';

interface NavbarProps {
  type?: 'public' | 'app';
}

const Navbar: React.FC<NavbarProps> = ({ type = 'public' }) => {
  if (type === 'app') {
    return <AppNavbar />;
  }

  return <PublicNavbar />;
};

export default Navbar;
