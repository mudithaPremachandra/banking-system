import React from 'react';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen text-white font-sans flex flex-col relative w-full overflow-x-hidden">
            <div className="fixed inset-0 liquid-sheen opacity-10 pointer-events-none" style={{ zIndex: -5 }}></div>

            <Navbar />

            {/* Main Content Area - padded top for fixed Navbar */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-12 relative z-10">
                {children}
            </main>
        </div>
    );
};
