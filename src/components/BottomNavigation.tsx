import Link from "next/link";
import React from "react";
import { FaHome } from "react-icons/fa";
import {
  MdOutlineProductionQuantityLimits,
  MdStore,
  MdInsights,
} from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";

const BottomNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-md z-10">
      <div className="container mx-auto flex justify-around py-2">
        <Link
          href="/"
          className="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-100 group"
        >
          <FaHome className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
          <span className="text-xs text-gray-500 group-hover:text-yellow-500">
            Home
          </span>
        </Link>

        <Link
          href="/products"
          className="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-100 group"
        >
          <MdOutlineProductionQuantityLimits className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
          <span className="text-xs text-gray-500 group-hover:text-yellow-500">
            Products
          </span>
        </Link>

        <Link
          href="/services"
          className="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-100 group"
        >
          <RiServiceLine className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
          <span className="text-xs text-gray-500 group-hover:text-yellow-500">
            Services
          </span>
        </Link>

        <Link
          href="/blog"
          className="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-100 group"
        >
          <MdInsights className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
          <span className="text-xs text-gray-500 group-hover:text-yellow-500">
            Insights
          </span>
        </Link>

        <Link
          href="/store"
          className="inline-flex flex-col items-center justify-center px-4 hover:bg-gray-100 group"
        >
          <MdStore className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
          <span className="text-xs text-gray-500 group-hover:text-yellow-500">
            Stores
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
