import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/Doctor/dicum.css'
import SideNavbar from '../../components/Doctor/sidenavbar';
import TopNavigationBar from '../../components/Doctor/Navbar';

const Documents = () => {
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalListModalOpen, setHospitalListModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [consentApproved, setConsentApproved] = useState(false);
  const [doctorListModalOpen, setDoctorListModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const docId = searchParams.get('docId');

  const [documents, setDocuments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [consents, setConsents] = useState([]);
  // const documents = [
  //   { id: 1, name: 'Patient Information.pdf', size: '2 MB', consent: false},
  //   { id: 2, name: 'Medical History.docx', size: '500 KB', consent: false },
  //   { id: 3, name: 'Latest Scans.zip', size: '10 MB', consent: true },
  // ];

  // const hospitals = [
  //   { id: 1, name: 'Joseph Hospital' },
  //   { id: 2, name: 'Kaweri' },
  //   { id: 3, name: 'Sanjeevni' },
  //   // Add more hospitals as needed
  // ];

  useEffect(() => {
    // Fetch booked appointments from API
    fetchDocuments();
    fetchHospitals();
    fetchConsents();
  }, []);


  const fetchDocuments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/fetch-files/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setDocuments(data);
      })
      .catch((error) => console.error('Error fetching documents:', error));
  };

  const fetchHospitals = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/view-hospitals`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setHospitals(data);
      })
      .catch((error) => console.error('Error fetching hospitals:', error));
  };

  const fetchConsents = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/consent`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setConsents(data);
      })
      .catch((error) => console.error('Error fetching consents:', error));
  };

  const handleView= (documentName) => {
    // event.preventDefault();
    // Simulate download for demonstration (replace with actual download logic)
    setSelectedDocument(documentName);

    var reqID = null;
    consents.forEach((consent) => {
      if(consent.patient_id.patient_id === id && documentName === consent.document_name){
        reqID = consent.consent_id;
      }
    });
    if(!reqID){
      alert("You do not have access to this document. Please request consent");
    }
    else{
      
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/v1/doctor/consent/${reqID}/patient/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          console.log(fileURL);
          // Triggering download directly
          // const link = document.createElement('a');
          // link.href = fileURL;
          // link.setAttribute('download', documentName);
          // document.body.appendChild(link);
          // link.click();

          // Open file in new tab
          window.open(fileURL, '_blank');
          // Cleanup
          URL.revokeObjectURL(fileURL);
        })
        .catch((error) => console.error('Error fetching document:', error));
    }
  };

  const handleShare = (document, event) => {
    setSelectedDocument(document);
    setModalPosition({ top: event.clientY, left: event.clientX });
    setHospitalListModalOpen(true);
  };

  const handleAskConsent = (event, documentName) => {
    // event.preventDefault();
    const { clientX, clientY } = event;
    setSelectedDocument(documentName);
    setModalPosition({ top: clientY, left: clientX });
    setConsentModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleHospitalSelection = (hospital) => {
    setSelectedHospital(hospital);
    fetchDoctors(hospital.id);
    setDoctorListModalOpen(true);
    setHospitalListModalOpen(false);
  };

  const fetchDoctors = (hospitalEmail) => {
    // Simulated data fetching, replace with actual API call
    // Assuming doctors are fetched based on hospital ID
    // const dummyDoctors = [
    //   { id: 1, name: 'Dr. John Doe' },
    //   { id: 2, name: 'Dr. Jane Smith' },
    //   // Add more doctors as needed
    // ];

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/list-doctors-hospital/${hospitalEmail}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setDoctors(data);
      })
      .catch((error) => console.error('Error fetching doctors:', error));

    // setDoctors(dummyDoctors);
  };
  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorListModalOpen(false);
    // Now you have both selectedHospital and selectedDoctor available for further processing
    console.log(`Selected hospital: ${selectedHospital.name}, Selected doctor: ${doctor.name}`);
    var reqBody = {
      "document_name": selectedDocument,
      "patient_id": {
          "patient_id": `${id}`
      },
      "doctor_id": {
          "doctor_id":"D1"
      }
    }
    reqBody.doctor_id.doctor_id = selectedDoctor.doctor_id;

    console.log(`Sending consent request for "${selectedDocument}"`);

      const token = localStorage.getItem('token');
      fetch('http://localhost:8081/api/v1/doctor/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(reqBody)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert(`Consent requested for ${selectedDocument}`);
      })
      .catch((error) => console.error('Error requesting consent:', error));
  };

  const handleConsentChoice = (event, choice, documentName) => {
    var reqBody = {
      "document_name": documentName,
      "patient_id": {
          "patient_id": `${id}`
      },
      "doctor_id": {
          "doctor_id":"D1"
      }
    }
    if (choice === 'otherHospitals') {
      // setHospitalListModalOpen(true);
      setSelectedDocument(documentName);
      console.log(event, choice, documentName);
      setModalPosition({ top: event.clientY, left: event.clientX });
      setHospitalListModalOpen(true);
      // reqBody.doctor_id.doctor_id = selectedHospital.hospital_id;
    } else {
      setConsentModalOpen(false);
      setSelectedDocument(null);
      reqBody.doctor_id.doctor_id = docId;
    // }

      // Simulate sending consent request based on choice (replace with actual logic)
      console.log(`Sending consent request for "${documentName}" for ${choice}`);

      const token = localStorage.getItem('token');
      fetch('http://localhost:8081/api/v1/doctor/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(reqBody)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert(`Consent requested for ${documentName}`);
      })
      .catch((error) => console.error('Error requesting consent:', error));
    }
  };

  return (
    <div className='dashboard-container'>
      <TopNavigationBar />
      <div className='dashboard-content'>
        <SideNavbar />
        <div className='main-content'>
          <div className="documents">
            <h2>Documents</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  {/* <th>Size</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document}</td>
                    {/* <td>{document.size}</td> */}
                    <td>
                      <button onClick={() => handleView(document)}>View</button>
                      <button onClick={(event) => handleAskConsent(event, document)}>Request Consent</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {console.log(consentModalOpen)}
            {consentModalOpen && (
              console.log(selectedDocument),
              <div className="consent-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
                <h3>Grant Access</h3>
                <p>You are requesting access to "{selectedDocument}".</p>
                <button onClick={(event) => handleConsentChoice(event, 'self', selectedDocument)}>For Myself</button>
                <button onClick={(event) => handleConsentChoice(event, 'otherHospitals', selectedDocument)}>For Doctor of other hospital</button>
                <button onClick={() => setConsentModalOpen(false)}>Cancel</button>
              </div>
            )}
            {hospitalListModalOpen && (
              <div className="hospital-list-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
                <h3>Select Hospital</h3>
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <ul>
                  {filteredHospitals.map((hospital) => (
                    <li key={hospital.id}>
                      <button onClick={() => handleHospitalSelection(hospital)}>{hospital.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {doctorListModalOpen && (
              <div className="hospital-list-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
                <h3>Select Doctor</h3>
                <ul>
                  {doctors.map((doctor) => (
                    <li key={doctor.id}>
                      <button onClick={() => handleDoctorSelection(doctor)}>{doctor.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;