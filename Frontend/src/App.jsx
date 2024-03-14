import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorLogin from './pages/DoctorLogin';
import PatienLogin from './pages/PatientLogin';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDoctor from './pages/Admin/AdminDoctor';
import AdminPatient from './pages/Admin/AdminPatient';
import PatientDashboard from './pages/Patient/Dashboard';
import PatientEditDetails from './pages/Patient/EditDetails';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import PrivateRoutes from './components/PrivateRoutes';
import DoctorDashboard from "./pages/Doctor/Ddashboard";
import PreviousAppointments from "./pages/Doctor/Appointment";
import UploadSchedule from "./pages/Doctor/uploadschedule";
import Chats from "./pages/Doctor/ chats";
import JoinMeeting from "./pages/Doctor/JoinMeeting";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/doctorlogin" element={<DoctorLogin />} />
          <Route exact path="/patientlogin" element={<PatienLogin />} />
          <Route exact path="/aboutus" element={<Aboutus />} />
          <Route exact path="/contactus" element={<Contactus />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/adminlogin" element={<AdminLogin />} />
          <Route element = {<PrivateRoutes/>}>
            <Route exact path = "/ddashboard" element = {<DoctorDashboard/>}/>
            <Route exact path = "/ddashboard/appointment" element = {<PreviousAppointments/>}/>
            <Route exact path = "/ddashboard/upload"  element = {<UploadSchedule/>}/>
            <Route exact path="/ddashboard/chats"     element = {<Chats/>}/>
            <Route exact path="/ddashboard/join-meetings"     element = {<JoinMeeting/>}/>
            <Route exact path="/admindashboard" element={<AdminDashboard />} />
            <Route exact path="/admindoctor" element={<AdminDoctor />} />
            <Route exact path="/adminpatient" element={<AdminPatient />} />
            <Route exact path="/patientdashboard" element={<PatientDashboard />} />
            <Route exact path="/patienteditdetails" element={<PatientEditDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
