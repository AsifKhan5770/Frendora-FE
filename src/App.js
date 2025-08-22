import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import Listposts from './pages/ListPosts';
import Detailposts from './pages/DetailPost';
import Createposts from './pages/CreatePost';
import Editposts from './pages/EditPost';
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
        {/* Open Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<Detailposts />} />
        <Route path="*" element={<ErrorPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><UserSignup /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/posts" element={<ProtectedRoute><Listposts /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><Createposts /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><Editposts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;