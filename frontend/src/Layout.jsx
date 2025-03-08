import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

const Layout = () => {
    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen">
            <Navbar />
            <main className="container mx-auto p-5 bg-gray-800 rounded-lg shadow-lg">
                <Outlet />
            </main>
        </div>

    );
};

export default Layout;
