import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Campaigns from './pages/Campaigns';
import Templates from './pages/Templates';
import Phished from './pages/Phished';
import Login from './pages/Login';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function NavbarWrapper() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen bg-gray-100'>
          <NavbarWrapper />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/users'
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path='/campaigns'
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path='/templates'
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route path='/phished' element={<Phished />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
