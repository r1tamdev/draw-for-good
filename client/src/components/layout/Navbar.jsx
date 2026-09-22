import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { logout } from '../../api/auth.js';
import Button from '../common/Button.jsx';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
      
      <Link to="/" className="text-xl font-bold text-white">
        DrawForGood
      </Link>

      <div className="flex items-center gap-4">
       
        <Link
          to="/charities"
          className="text-neutral-300 hover:text-white"
        >
          Charities
        </Link>

        {user ? (
          <>
           
            <Link
              to={profile?.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-neutral-300 hover:text-white"
            >
              Dashboard
            </Link>


            {profile?.role !== 'admin' && (
              <Link to="/subscribe">
                <Button>
                  Subscribe
                </Button>
              </Link>
            )}


            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-neutral-300 hover:text-white"
            >
              Log in
            </Link>

            <Link to="/signup">
              <Button>
                Subscribe
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}