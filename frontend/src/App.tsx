import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Campaigns from './pages/Campaigns';
import Templates from './pages/Templates';
import Phished from './pages/Phished';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/users' element={<Users />} />
          <Route path='/campaigns' element={<Campaigns />} />
          <Route path='/templates' element={<Templates />} />
          <Route path='/phished' element={<Phished />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
