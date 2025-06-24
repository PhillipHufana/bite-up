import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import logo from './assets/logo.png';
import { ClipboardList, Calculator, FolderOpen, Edit3 } from 'lucide-react';

const App = () => {
  const menuItems = [
    { icon: <ClipboardList size={40} />, label: 'Inventory', path: '/inventory' },
    { icon: <Calculator size={40} />, label: 'Costing Calculator', path: '/costingcalculator' },
    { icon: <FolderOpen size={40} />, label: 'Records', path: '/records' },
    { icon: <Edit3 size={40} />, label: 'Orders', path: '/orders' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-blue-100 flex flex-col items-center justify-center text-gray-800">
      <img src={logo} alt="BiteUP Logo" className="w-96" />

      <h1 className="text-[35px] font-[Marcellus] text-amber-900">Bakery Management System</h1>
      <p className="text-lg text-gray-600 mt-1 mb-10">Hello, Admin! What do you want to do?</p>

      <div className="flex gap-10 flex-wrap justify-center">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex flex-col items-center hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-[#EEE1B4] rounded-full p-5 shadow-md mb-2 text-brown-700">
              {item.icon}
            </div>
            <span className="text-md font-medium text-center w-24">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default App;
