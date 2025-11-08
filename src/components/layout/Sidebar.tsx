'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/lib/constants/navigation';

interface SidebarProps {
  navItems: NavItem[];
  role: string;
}

export default function Sidebar({ navItems, role }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 bg-white min-h-screen shadow-lg fixed left-0 top-0 overflow-y-auto">
      {/* Logo and Title */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 font-bold text-2xl">Edux ↑</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Education Tracking & Attendance System
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {/* Main Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
            Main
          </h3>
          <div className="border-t border-gray-200 mb-3"></div>
          {navItems.slice(0, 3).map((item) => (
            <NavItemComponent key={item.href} item={item} isActive={isActive} />
          ))}
        </div>

        {/* Control Section (Admin only) */}
        {role === 'admin' && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
              Control
            </h3>
            <div className="border-t border-gray-200 mb-3"></div>
            {navItems.slice(3, 4).map((item) => (
              <NavItemComponent key={item.href} item={item} isActive={isActive} />
            ))}
          </div>
        )}

        {/* Academic Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
            Academic
          </h3>
          <div className="border-t border-gray-200 mb-3"></div>
          {(role === 'admin' ? navItems.slice(4, 5) : navItems.slice(3, 5)).map((item) => (
            <NavItemComponent key={item.href} item={item} isActive={isActive} />
          ))}
        </div>

        {/* Announcement Section */}
        <div className="mb-6">
          {(role === 'admin' ? navItems.slice(5, 6) : navItems.slice(5, 6)).map((item) => (
            <NavItemComponent key={item.href} item={item} isActive={isActive} />
          ))}
        </div>

        {/* General Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
            General
          </h3>
          <div className="border-t border-gray-200 mb-3"></div>
          {navItems.slice(-1).map((item) => (
            <NavItemComponent key={item.href} item={item} isActive={isActive} />
          ))}
          <button className="w-full text-left px-3 py-2 text-gray-400 italic text-sm hover:bg-gray-50 rounded">
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}

function NavItemComponent({
  item,
  isActive,
  nested = false,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  nested?: boolean;
}) {
  const active = isActive(item.href);

  return (
    <div>
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded relative mb-1
          ${nested ? 'pl-8' : ''}
          ${
            active
              ? 'text-black font-semibold bg-blue-50'
              : 'text-gray-400 italic hover:bg-gray-50'
          }
        `}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"></div>
        )}
        <span className="text-sm">{item.label}</span>
      </Link>
      {item.children && (
        <div className="ml-4">
          {item.children.map((child) => (
            <NavItemComponent
              key={child.href}
              item={child}
              isActive={isActive}
              nested={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

