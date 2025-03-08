import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <span className="ml-3 text-xl text-white">Device Control</span>
                </a>

                {/* Navigation Links with Active & Inactive Tracking */}
                <nav className="md:ml-auto md:mr-auto flex flex-wrap  items-center text-base justify-center">
                <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `mr-5 px-3 py-2 transition duration-300 ${isActive
                                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                                : "text-gray-500 hover:text-gray-900"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/history"
                        className={({ isActive }) =>
                            ` px-3 py-2 transition duration-300 ${isActive
                                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                                : "text-gray-500 hover:text-gray-900"
                            }`
                        }
                    >
                        History
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
