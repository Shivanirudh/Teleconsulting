import React from 'react';

export default function DoctorLogin() {
  return (
    <div className="container mt-5">
      <h2>Doctor Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="doctorId">Doctor ID</label>
          <input type="text" className="form-control" id="doctorId" placeholder="Enter your Doctor ID" />
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
