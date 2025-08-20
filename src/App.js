import './App.css';
import {Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import Listposts from './pages/Listposts';
import Detailposts from './pages/Detailpost';
import Createposts from './pages/Createpost';
import Editposts from './pages/Editpost';

function App() {
  return (
      <>
        <Navbar/>
        <Routes>
          <Route path = "/" element = {<Listposts />} />
          <Route path = "/detail/:id" element = {<Detailposts />} />
          <Route path = "/create" element = {<Createposts />} />
          <Route path = "/edit/:id" element = {<Editposts />} />
        </Routes>
      </>
  );
}

export default App;
