import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import PatientLogin from "./Pages/PatientLogin";
import Navbar from "./components/Navbar";
import DoctorLogin from "./Pages/DoctorLogin";
import Pdashboard from "./Pages/Pdashboard";
import DoctorDashboard from "./Pages/Ddashboard";
import SideNavbar from "./components/sidenavbar";
import PreviousAppointments from "./Pages/Appointment";
import UploadSchedule from "./Pages/uploadschedule";


function App() {
 
  return (
  
      <Router>
      <Navbar/>
      <SideNavbar/>
      <Routes>
     
        <Route exact path = "/" element = {<PatientLogin/>}/>
        <Route exact path = "/dlogin" element = {<DoctorLogin/>}/>
        <Route exact path = "/pdashboard" element = {<Pdashboard/>}/>
        <Route exact path = "/ddashboard" element = {<DoctorDashboard/>}/>
        <Route exact path = "/ddashboard/appointment" element = {<PreviousAppointments/>}/>
        <Route exact path = "/ddashboard/upload"  element = {<UploadSchedule/>}/>
      </Routes>
        
      </Router>
      
        

  
  );
}

export default App;