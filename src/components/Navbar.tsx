"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUser, FaBell } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="p-3 m-4 ">
      <nav className="p-2 fixed top-0 left-0 w-full shadow-md z-10 bg-white">
        <div className="flex w-11/12 md:w-10/12 mx-auto items-center justify-between ">
          <div>
            <Link href="/" className="flex items-center ">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={180}
                height={50}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4 ">
            <div className="relative">
              <Link href="/notifications">
                <FaBell className="p-1 text-2xl md:text-4xl text-gray-800 border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition" />
              </Link>
            </div>
            <div>
              <Link href="/signin">
                <FaUser className="p-1 text-2xl md:text-4xl text-gray-800 border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
