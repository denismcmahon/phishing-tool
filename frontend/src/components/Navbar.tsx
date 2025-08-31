import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-4 flex space-x-4">
      <Link to="/" className="hover:underline">
        Dashboard
      </Link>
      <Link to="/users" className="hover:underline">
        Users
      </Link>
      <Link to="/campaigns" className="hover:underline">
        Campaigns
      </Link>
    </nav>
  );
}

export default Navbar;
