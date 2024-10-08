import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import Logout from "./Logout";
import Create from './Create';

const Navbar = ({ toggleTheme, theme }) => {
    const navbarStyle = theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white';
    const logoColor = theme === 'light' ? 'text-gray-900' : 'text-white';
    
    return (
        <div className={`navbar shadow-md px-4 py-2 ${navbarStyle}`}>
            <div className="flex-1 flex items-center">
                <a className={`btn btn-ghost text-xl font-bold ${logoColor} hover:text-blue-300 transition duration-300`}>
                    oilDrive.uz
                </a>
                <img 
                    src="https://oiltrade.uz/templates/oiltrade/images/logo1.png" 
                    alt="Логотип oilTrade" 
                    className="h-10 ml-4" 
                />
            </div>
            <li className=' mr-5'>
                <Create />
            </li>
            <div className="flex-none">
                <ul className="menu menu-horizontal p-0"></ul>
            </div>
            <li>
                <Logout />
            </li>
            <div onClick={toggleTheme} className="cursor-pointer ml-4 hover:text-blue-300 transition duration-300">
                {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} 
            </div>
        </div>
    );
};

export default Navbar;
