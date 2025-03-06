import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <div className="flex items-center space-x-4">
        {/* <img src="/logo.png" alt="Nikwisa Logo" className="h-10" /> */}
        <h1 className="text-lg font-bold text-black">Nikwisa</h1>
      </div>
      <button className="w-32 bg-[#B8902E] hover:bg-yellow-600 text-white py-2 px-4 rounded text-sm font-medium transition">
        Login/Sign Up
      </button>
    </header>
  );
};

export default Header;
