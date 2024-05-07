import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorLogin from './pages/DoctorLogin';
import PatienLogin from './pages/PatientLogin';
import Signup from './pages/Patient/PatientSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDoctor from './pages/Admin/AdminDoctor';
import AdminPatient from './pages/Admin/AdminPatient';
import PatientDashboard from './pages/Patient/Dashboard';
import PatientEditDetails from './pages/Patient/EditDetails';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Ddashboard from './pages/Doctor/Ddashboard';
import PreviousAppointments from './pages/Doctor/Appointment';
import UploadSchedule from './pages/Doctor/uploadschedule';
import EditDetails from './pages/Doctor/EditDetails';
import PrivateRoutes from './components/PrivateRoutes';
import PForgotPassword from './pages/Patient/PForgotPassword';
import DForgotPassword from './pages/Doctor/DForgotPassword';
import AForgotPassword from './pages/Admin/AForgotPassword';
import AdminHospital from './pages/Admin/AdminHospital';
import PConsent from './pages/Patient/Consent';
import Patientchat from './pages/Patient/Pchats.jsx'
import Doctorchat from './pages/Doctor/Dchats.jsx'
import DocumentsPage from './pages/Doctor/doc';
import PatientDetails from './pages/Doctor/patientdetails';
import Dashboard from './pages/Doctor/dasnew.jsx';
import AllAppointments from './pages/Doctor/AllAppointments.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />        /
          <Route exact path="/doctorlogin" element={<DoctorLogin />} />
          <Route exact path="/patientlogin" element={<PatienLogin />} />
          <Route exact path="/aboutus" element={<Aboutus />} />
          <Route exact path="/contactus" element={<Contactus />} />
          <Route exact path="/patientsignup" element={<Signup />} />
          <Route exact path="/adminlogin" element={<AdminLogin />} />
          <Route exact path="/pforgotpassword" element={<PForgotPassword />} />
          <Route exact path="/aforgotpassword" element={<AForgotPassword />} />
          <Route exact path="/dforgotpassword" element={<DForgotPassword />} />
          
         

          <Route element={<PrivateRoutes tokenType="admin" />} >
            {/* Admin Routes */}
            <Route exact path="/admindashboard" element={<AdminDashboard />} />
            <Route exact path="/admindoctor" element={<AdminDoctor />} />
            <Route exact path="/adminpatient" element={<AdminPatient />} />
            <Route exact path="/adminhospital" element={<AdminHospital />} />
          </Route>
          <Route element={<PrivateRoutes tokenType="patient" />} >
            {/* Patient Routes */}
            <Route exact path="/patientdashboard" element={<PatientDashboard />} />
            <Route exact path="/patienteditdetails" element={<PatientEditDetails />} />
            <Route exact path="/pconsent" element={<PConsent />} />
            <Route exact path="/pchats" element={<Patientchat />} />
          </Route>
          <Route element={<PrivateRoutes tokenType="doctor" />} >
            {/* Doctor Routes */}
            <Route exact path = "/ddashboard"  element ={<Dashboard/>}/>
            <Route exact path = "/ddashboard/appointment" element = {<PreviousAppointments/>}/>
            <Route exact path = "/ddashboard/upload"  element = {<UploadSchedule/>}/>
            <Route exact path = "/deditdetails"     element = {<EditDetails/>}/>
            <Route exact path="/dchats" element={<Doctorchat />} />
            <Route exact path="/ddashboard/AllAppointments" element={<AllAppointments />} />
            <Route exact path="/doc" element = {<DocumentsPage/>}/>
            <Route exact path= "/details"           element = {<PatientDetails/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;