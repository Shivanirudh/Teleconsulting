import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">E-Consultation</Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
