// components/Sidenav.jsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineDashboard } from "react-icons/ai";
import { PiNotebookBold } from "react-icons/pi";
import { FaFlagCheckered } from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { usePathname } from 'next/navigation';

export default function Sidenav({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  // prevent body scroll when mobile drawer open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: AiOutlineDashboard },
    { href: '/journal', label: 'Journal', icon: PiNotebookBold },
    { href: '/challenge', label: 'Challenge', icon: FaFlagCheckered },
  ];

  return (
    <>
      {/* ===== Desktop sidebar (always visible on sm+) ===== */}
      <div
        className="hidden sm:flex sticky top-0 h-screen z-20 w-[290px] overflow-hidden border-r border-gray-200 dark:border-gray-800 dark:bg-gray-dark"
        style={{ backgroundColor: "rgb(18 32 49/var(--tw-bg-opacity,1))" }}
      >
        <div className='flex h-full flex-col py-10 pl-[25px] pr-[7px]'>
          <div className="relative pr-4.5">
            <div className='flex'>
              <BsBarChart size={30} className="text-[#10B981]" />
              <p className='ml-3 text-2xl'>Eluri Mahesh</p>
            </div>
          </div>

          <div className='custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10'>
            <nav className='mb-6'>
              <ul className='space-y-2'>
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={[
                          "rounded-lg px-3.5 font-medium transition-all duration-200 relative flex items-center gap-3 py-3",
                          isActive
                            ? "bg-gray-200 text-black dark:bg-[#FFFFFF1A] dark:text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-black hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
                        ].join(" ")}
                      >
                        <span><Icon size={18} /></span>
                        <span>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ===== Mobile Drawer ===== */}
      {/* backdrop */}
      <div
        className={`sm:hidden fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isOpen}
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      />

      {/* drawer panel */}
      <aside
        className={`sm:hidden fixed top-0 left-0 z-50 h-full w-64 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: "rgb(18 32 49/var(--tw-bg-opacity,1))" }}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BsBarChart size={26} className="text-[#10B981]" />
            <div className="text-lg font-semibold text-white">Eluri</div>
          </div>

          <button
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded-md text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-1"
          >
            <IoClose size={20} />
          </button>
        </div>

        <nav className="p-3">
          <ul className="space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose} // close drawer when navigating
                    className={[
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive ? "bg-gray-200 text-black dark:bg-[#FFFFFF1A] dark:text-white" : "text-gray-300 hover:bg-white/5",
                    ].join(' ')}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}