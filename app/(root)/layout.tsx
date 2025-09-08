import Footer from "@/components/footer.tsx/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-[300px]">
        <Sidebar />
      </div>
      <div className="w-full h-screen overflow-scroll flex flex-col min-h-screen overflow-x-hidden">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
