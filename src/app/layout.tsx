"use client";

import { usePathname } from "next/navigation"; // Import Next.js router
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import store from "@/reducers/store";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname() || ""; // Ensure pathname is always a string

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/signup" || pathname === "/signin";

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfairDisplay.variable}`}
    >
      <body className="antialiased">
        <Provider store={store}>
          {/* Navbar */}
          {!isDashboardRoute && <Navbar />}

          {/* Optional Search Bar */}
          {!isDashboardRoute && !isAuthRoute && (
            <div className="w-11/12 md:w-10/12 mx-auto">
              {/* SearchBar placeholder */}
            </div>
          )}

          {/* Main Content */}
          <div
            className={`${
              isDashboardRoute ? "w-full h-full" : "w-11/12 lg:w-10/12 mx-auto"
            }`}
          >
            {children}
          </div>

          {/* Bottom Navigation */}
          {/* {!isDashboardRoute && <BottomNavigation />} */}
        </Provider>
      </body>
    </html>
  );
}
