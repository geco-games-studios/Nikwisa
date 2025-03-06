import Link from "next/link";
import { usePathname } from "next/navigation"; // To track the active route
import { AiOutlineHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { RiStore2Fill } from "react-icons/ri";

export const links = [
  { id: 1, text: "Home", path: "/dashboard", icon: <AiOutlineHome /> },
  {
    id: 2,
    text: "Profile",
    path: "/dashboard/profile",
    icon: <FaUser />,
  },
  {
    id: 3,
    text: "My Stores",
    path: "/dashboard/stores-lists",
    icon: <RiStore2Fill />,
  },
];

const Navlinks = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
  const pathname = usePathname(); // Get the current active path

  return (
    <nav className="flex flex-col space-y-4">
      {links.map(({ text, path, id, icon }) => (
        <Link
          key={id}
          href={path}
          onClick={toggleSidebar}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
            pathname === path
              ? "bg-gray-200 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {icon && <span className="text-xl">{icon}</span>} <span>{text}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navlinks;
