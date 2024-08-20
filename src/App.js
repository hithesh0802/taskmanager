import logo from './logo.svg';
import './App.css';
import Register from './pages/RegisterPage';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/LoginPage';
import DashBoard from './pages/DashBoard';
import ListHeader from './components/ListHeader';
import CreateProject from './pages/CreateProject';
import ProjectList from './components/ProjectList';

const App=()=> {
  return (
    <div className="App" >
      <ListHeader listname={'Taskify'}></ListHeader>
      <Router>
        <Routes>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/dashboard' element={<DashBoard></DashBoard>}></Route>
          <Route path='/project' element={<ProjectList></ProjectList>}></Route>
          <Route path="/projects/new" element={<CreateProject />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
