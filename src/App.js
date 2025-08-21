import './App.css';
import {Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import Listposts from './pages/Listposts';
import Detailposts from './pages/Detailpost';
import Createposts from './pages/Createpost';
import Editposts from './pages/Editpost';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';


function App() {
  return (
      <>
        <Navbar/>
        <Routes>
          <Route path = "/" element = {<Listposts />} />
          <Route path = "/signup" element = {<SignUpPage />} />
          <Route path = "/login" element = {<LoginPage />} />
          <Route path = "/detail/:id" element = {<Detailposts />} />
          <Route path = "/create" element = {<Createposts />} />
          <Route path = "/edit/:id" element = {<Editposts />} />
        </Routes>
      </>
  );
}

export default App;
