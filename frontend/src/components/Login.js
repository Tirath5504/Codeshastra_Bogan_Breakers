import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import './css/Login.css'
import logooptima from './assests/Optimaoptima black .png'
export default function Demo() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const handleLogin = async (e) => {
    if (data.email.length <= 0 || data.password.length <= 0) {
      alert('please enter a valid credentials')
      return;
    }
    e.preventDefault();
    let res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    res = await res.json();
    console.log(res);
    if (res.success) {
      localStorage.setItem('authToken', res.authToken);
      navigate('/video');
    } else {
      alert(res.msg);
    }
  }
  return (
    <div className="LoginBack">

      <div className="Auth-form-container">
        <img src={logooptima} alt="optima logo" style={{ margin: "100px" }} />
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Log In</h3>
            <div className="form-group mt-3">
              <label>Email address</label>
              <br />
              <input
                type="email"
                className="form-control mt-1"
                placeholder=" Enter email"
                name="email"
                onChange={(e) => { setData({ ...data, [e.target.name]: e.target.value }) }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <br />
              <input
                type="password"
                className="form-control mt-1"
                placeholder=" Enter password"
                name="password"
                onChange={(e) => { setData({ ...data, [e.target.name]: e.target.value }) }}
              />
            </div>
            <br />
            <div className="d-grid gap-2 mt-3">
              <center>
                <button onClick={handleLogin}>
                  Submit
                </button>
              </center>
            </div>
            {/* <p className="forgot-password text-right mt-2">
            Forgot <a href="#">password?</a>
          </p> */}
          </div>
        </form>
      </div>
    </div>
  )
}