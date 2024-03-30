import React from "react"
import './Login.css'
import logooptima from './Optimaoptima black .png'
export default function SignUp () {
  return (
    <div className="LoginBack">
 
    <div className="Auth-form-container">
    <img src={logooptima} alt="optima logo" style={{margin:"100px"}}/>
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="form-group mt-3">
          <label>Full name</label>
            <br/>
            <input
              type="text"
              className="form-control mt-1"
              placeholder=" Enter name"
            />
          </div>
          <div className="form-group mt-3">
          <label>Email address</label>
            <br/>
            <input
              type="email"
              className="form-control mt-1"
              placeholder=" Enter email"
            />
          </div>
          <div className="form-group mt-3">
          <label>Date of Birth</label>
            <br/>
            <input
              type="date"
              className="form-control mt-1"
              placeholder=" Select date of birth"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <br/>
            <input
              type="password"
              className="form-control mt-1"
              placeholder=" Enter password"
            />
          </div>
          <div className="form-group mt-3">
          <label>Emergency contact number</label>
            <br/>
            <input
              type="tel"
              className="form-control mt-1"
              placeholder=" Enter emergency contact"
            />
          </div>

          <br/>
          
          <div className="d-grid gap-2 mt-3">
          <center>
            <button backgroundColor='Green'>
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