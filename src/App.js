import './App.css';
import {Routes, Route} from "react-router-dom";
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


function App() {
  return (
      <>
        <Navbar/>
        <Routes>
          <Route path = "/home" element = {<HomePage />} />
          <Route path = "*" element = {<ErrorPage />} />
        </Routes>
        <Routes>
          <Route path = "/signup" element = {<UserSignup />} />
          <Route path = "/login" element = {<UserLogin />} />
        </Routes>
        <Routes>
          <Route path = "/" element = {<Listposts />} />
          <Route path = "/create" element = {<Createposts />} />
          <Route path = "/detail/:id" element = {<Detailposts />} />
          <Route path = "/edit/:id" element = {<Editposts />} />
          <Route path = "/profile" element = {<UserProfile />} />
        </Routes>
      </>
  );
}

export default App;
