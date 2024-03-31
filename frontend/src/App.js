import Demo from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import VideoInput from './components/VideoInput';
import UserReport from './components/UserReport';
import Guide from './components/Guide';
import CheckAuth from './components/CheckAuth';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route index element={<Home />} />
        <Route path="login" element={<Demo />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="guide" element={<Guide />} />
        <Route path="video" element={
          <>
            <CheckAuth />
            <Navbar />
            <VideoInput />
          </>} />
        <Route path="report" element={
          <>
            <CheckAuth />
            <Navbar />
            <UserReport />
          </>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
