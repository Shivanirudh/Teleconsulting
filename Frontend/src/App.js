import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Navbar from "./components/Navbar";

import DoctorDashboard from "./Pages/Ddashboard";

import PreviousAppointments from "./Pages/Appointment";
import UploadSchedule from "./Pages/uploadschedule";
import SideNavbar from "./components/sidenavbar";
import Chats from "./Pages/ chats";
import Footer from "./components/footer";


function App() {
 
  return (
  

      <Router>

        <Navbar/>
        <SideNavbar/>
        
    
      <Routes>
     
        <Route exact path = "/ddashboard" element = {<DoctorDashboard/>}/>
        <Route exact path = "/ddashboard/appointment" element = {<PreviousAppointments/>}/>
        <Route exact path = "/ddashboard/upload"  element = {<UploadSchedule/>}/>
        <Route exact path="/ddashboard/chats"     element = {<Chats/>}/>
      </Routes>
      <Footer/>
      
        
      </Router>
    
        

  
  );
}

export default App;