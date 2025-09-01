import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-gray-800 text-white px-4 py-4 flex justify-between items-center'>
      <div className='flex space-x-4'>
        <Link to='/dashboard' className='hover:underline'>
          Dashboard
        </Link>
        <Link to='/users' className='hover:underline'>
          Users
        </Link>
        <Link to='/templates' className='hover:underline'>
          Templates
        </Link>
        <Link to='/campaigns' className='hover:underline'>
          Campaigns
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md'
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
