import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import DetailPost from './pages/Detailpost';
import CreatePost from './pages/Createpost';
import EditPost from './pages/Editpost';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserProfile from './pages/UserProfile';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPost />} />
        <Route path="/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><UserSignup /></PublicRoute>} />
        <Route path="*" element={<ErrorPage />} />

        {/* Protected Routes */}
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;