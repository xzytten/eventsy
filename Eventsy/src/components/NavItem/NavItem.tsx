import { NavLink } from "react-router-dom";
import type { FC, ReactNode } from "react";

interface NavItemProps {
  to: string;
  children: ReactNode;
  icon?: ReactNode;
}

const NavItem: FC<NavItemProps> = ({ to, children, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 transition-colors ${isActive
        ? 'text-coral font-semibold border-b-2 border-coral pb-[2px]'
        : 'text-text-milk hover:text-coral'
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default NavItem;