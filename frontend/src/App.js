import Demo from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from 'react-login-page';
import Guide from './components/Guide';

function App() {
  return (
    <>
     {/* <Demo/>  */}
    {/* <SignUp/> */}
    {/* <BrowserRouter>
      <Routes>

          <Route index element={<Home />} />
          <Route path="login" element={<Demo />} />
          <Route path="signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter> */}
    {/* <Home/> */}
    <Guide/>

    </>
  );
}

export default App;
