import Demo from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserReport from './components/UserReport';
// import Login from 'react-login-page';
// import Guide from './components/Guide';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
