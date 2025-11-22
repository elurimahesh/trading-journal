'use client';

import { useState } from 'react';
import Header from './Header';
import Sidenav from './Sidebar';

export default function Layout({ children }) {
    const [isSidenavOpen, setSidenavOpen] = useState(true);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidenav */}
            <Sidenav />

            {/* Main content area */}
            <main className='w-full bg-gray-2 dark:bg-[#020d1a]'>
                {/* Header */}
                <Header />

                {/* Page content */}
                {children}
            </main>
        </div>
    );
}
