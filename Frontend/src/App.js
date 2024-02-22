import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorLogin from './pages/DoctorLogin';
import PatienLogin from './pages/PatientLogin';
import Signup from './pages/Signup';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorEditDetails from './pages/Doctor/EditDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/doctorlogin" element={<DoctorLogin />} />
          <Route exact path="/patientlogin" element={<PatienLogin />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/adminlogin" element={<AdminLogin />} />
          <Route exact path="/admindashboard" element={<AdminDashboard />} />
          <Route exact path="/doctordashboard" element={<DoctorDashboard />} />
          <Route exact path="/doctoreditdetails" element={<DoctorEditDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
