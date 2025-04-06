
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
