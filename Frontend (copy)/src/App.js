import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Navbar from "./components/Navbar";

import DoctorDashboard from "./Pages/Ddashboard";

import PreviousAppointments from "./Pages/Appointment";
import UploadSchedule from "./Pages/uploadschedule";
import SideNavbar from "./components/sidenavbar";
import Chats from "./Pages/ chats";
import VideoCall from "./Pages/meeting";
import Login from "./Pages/login/login";
import DoctorLogin from "./Pages/login/dlogin";
import PatientLogin from "./pages/PatientLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDoctor from "./pages/Admin/AdminDoctor";
import AdminPatient from "./pages/Admin/AdminPatient";
import Dashboard from "./pages/Patient/Dashboard";


function App() {
 
  return ( 
    <div className="App">
  

      <Router>

        <Navbar/>
        <SideNavbar/>
        
    
      <Routes>
        <Route exact path="/" element = {<Login/>}/>
        <Route exact path="/dlogin" element = {<DoctorLogin/>}/>
        <Route exact path = "/plogin" element = {<PatientLogin/>}/>
        <Route exact path = "/alogin" element = {<AdminLogin/>}/>
        <Route exact path = "/ddashboard" element = {<DoctorDashboard/>}/>
        <Route exact path = "/adashboard" element = {<AdminDashboard/>}/>
        <Route exact path = "/pdashboard" element = {<Dashboard/>}/>
        <Route exact path = "/admindoctor" element = {<AdminDoctor/>}/>
        <Route exact path = "/adminpatient" element = {<AdminPatient/>}/>
        <Route exact path = "/ddashboard/appointment" element = {<PreviousAppointments/>}/>
        <Route exact path = "/ddashboard/upload"  element = {<UploadSchedule/>}/>
        <Route exact path="/ddashboard/chats"     element = {<Chats/>}/>
        <Route exact path = "/meeting"            element = {<VideoCall/>}/>

      </Routes>
      
      
        
      </Router>
    
        
</div>
  
  );
}

export default App;