'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiStockFill } from "react-icons/ri";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiNotebookBold } from "react-icons/pi";
import { FaFlagCheckered } from "react-icons/fa";

export default function Sidenav() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: AiOutlineDashboard },
        { href: '/journal', label: 'Journal', icon: PiNotebookBold },
        { href: '/challenge', label: 'Challenge', icon: FaFlagCheckered },
    ];

    return (
        <div style={{ backgroundColor: "rgb(18 32 49/var(--tw-bg-opacity,1))" }} className="max-w-[290px] overflow-hidden border-r border-gray-200 transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark sticky top-0 h-screen w-full">
            <div className='flex h-full flex-col py-10 pl-[25px] pr-[7px]'>
                <div className="relative pr-4.5">

                    <div className='flex'>
                        <RiStockFill size={30} className="text-green-600" />
                        <p className='ml-3 text-2xl'>
                            Eluri Mahesh
                        </p>
                    </div>

                </div>
                <div className='custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10'>
                    <div className='mb-6'>
                        <nav >
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

        </div>
    );
}
