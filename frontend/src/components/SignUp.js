import React, { useState } from "react"
import './css/Login.css'
import logooptima from './assests/Optimaoptima black .png'
import { useNavigate } from "react-router-dom"
export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    dob: ''
  })
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    console.log(data);
    if (data.password !== data.confirmPassword || data.name.length <= 0 || data.email.length <= 0 || data.emergencyContact.length < 8 || data.password.length <= 0) {
      alert('please enter the data');
      return;
    }
    e.preventDefault();
    data.dob = (new Date(data.dob));
    let res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
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
      navigate('/guide');
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
            <h3 className="Auth-form-title">Sign Up</h3>
            <div className="form-group mt-3">
              <label>Full name</label>
              <br />
              <input
                type="text"
                className="form-control mt-1"
                placeholder=" Enter name"
                name="name"
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <br />
              <input
                type="email"
                className="form-control mt-1"
                placeholder=" Enter email"
                name="email"
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Date of Birth</label>
              <br />
              <input
                type="date"
                className="form-control mt-1"
                placeholder=" Select date of birth"
                name="dob"
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
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
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Confirm Password</label>
              <br />
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter confirm password"
                name="confirmPassword"
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Emergency contact number</label>
              <br />
              <input
                type="tel"
                className="form-control mt-1"
                placeholder=" Enter emergency contact"
                name="emergencyContact"
                onChange={(e) => {
                  setData({ ...data, [e.target.name]: e.target.value });
                }}
              />
            </div>

            <br />

            <div className="d-grid gap-2 mt-3">
              <center>
                <button onClick={handleSignup}>
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