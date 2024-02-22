
import React from 'react'


export default function PatientLogin() {
  return (
    <div className="container mt-5">
      <h2>Patient Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input type="text" className="form-control" id="userId" placeholder="Enter your User ID" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter your password" />
        </div>
        <div className="form-group">
          <p>Forgot Password? <span>(Link will be functional later)</span></p>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}