import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import ListPosts from './pages/Listposts';
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
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/detail/:id" element={<ProtectedRoute><DetailPost /></ProtectedRoute>} />
        <Route path="*" element={<ErrorPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><UserSignup /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/posts" element={<ProtectedRoute><ListPosts /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;