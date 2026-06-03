import * as React from 'react';
import { Map as MapIcon, Search, ArrowLeftRight, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { NavBar } from '../ui/TubelightNavbar';

export const TabBar = () => {
  const navItems = [
    { name: 'Home', url: '/', icon: Search },
    { name: 'Map', url: '/map', icon: MapIcon },
    { name: 'Compare', url: '/compare', icon: ArrowLeftRight },
    { name: 'Guide', url: '/voting-guide', icon: ShieldCheck },
    { name: 'More', url: '/more', icon: MoreHorizontal }
  ];

  return <NavBar items={navItems} />;
};
