import Link from "next/link";
import Image from "next/image";
import Navlinks from "./Navlinks";

const BigSidebar: React.FC<{
  showSidebar: boolean;
  toggleSidebar: () => void;
}> = ({ showSidebar, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-md w-64 transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="sticky top-0 h-full">
        <header className="flex items-center p-6 pt-2">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Company Logo" width={180} height={50} />
          </Link>
        </header>
        <div className="pt-8">
          {/* Pass toggleSidebar to Navlinks */}
          <Navlinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </aside>
  );
};

export default BigSidebar;

// import Link from "next/link";
// import Image from "next/image";
// import Navlinks from "./Navlinks";

// const BigSidebar: React.FC<{ showSidebar: boolean; toggleSidebar: () => void; }> = ({ showSidebar }) => {
//   return (
//     <aside
//       className={`fixed top-0 left-0 h-full bg-white shadow-md w-64 transition-transform duration-300 ${
//         showSidebar ? "translate-x-0" : "-translate-x-64"
//       }`}
//     >
//       <div className="sticky top-0 h-full">
//         <header className="flex items-center p-6 pt-2">
//           <Link href="/" className="flex items-center">
//             <Image src="/logo.png" alt="Company Logo" width={180} height={50} />
//           </Link>
//         </header>
//         <div className="pt-8">
//           <Navlinks />
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default BigSidebar;
