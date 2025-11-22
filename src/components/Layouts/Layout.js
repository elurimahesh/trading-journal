'use client';

import { useState } from 'react';
import Header from './Header';
import Sidenav from './Sidebar';

export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidenav */}
            <Sidenav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}/>

            {/* Main content area */}
            <main className='w-full bg-gray-2 dark:bg-[#020d1a]'>
                {/* Header */}
                <Header onMenuClick={() => setIsMenuOpen(true)}/>

                {/* Page content */}
                {children}
            </main>
        </div>
    );
}
