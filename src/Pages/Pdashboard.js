import React from 'react';

export default function PatientDashboard() {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Side - List of Colorful Buttons */}
        <div className="col-md-3">
          <div className="list-group">
            <button type="button" className="list-group-item list-group-item-action btn-primary">Video/Audio Channel</button>
            <button type="button" className="list-group-item list-group-item-action btn-success mt-2">Upload Documents</button>
            <button type="button" className="list-group-item list-group-item-action btn-warning mt-2">Previous Appointments</button>
            <button type="button" className="list-group-item list-group-item-action btn-info mt-2">Permission of Documents</button>
            <button type="button" className="list-group-item list-group-item-action btn-danger mt-2">Follow-ups</button>
          </div>
        </div>

        {/* Main Content - Colorful Search Bars */}
        <div className="col-md-9">
          <h2>Patient Dashboard</h2>
          
          {/* Search by Hospital */}
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search by Hospital" aria-label="Search by Hospital" aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button className="btn btn-outline-primary" type="button">Search</button>
            </div>
          </div>

          {/* Search by Disease */}
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search by Disease" aria-label="Search by Disease" aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button className="btn btn-outline-success" type="button">Search</button>
            </div>
          </div>

          {/* Search by Doctor */}
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search by Doctor" aria-label="Search by Doctor" aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button className="btn btn-outline-warning" type="button">Search</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
