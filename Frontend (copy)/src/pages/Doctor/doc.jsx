import React, { useState } from 'react';
import '../../css/Doctor/dicum.css'
import SideNavbar from '../../components/Doctor/sidenavbar';
import TopNavigationBar from '../../components/Doctor/Navbar';

const Documents = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalListModalOpen, setHospitalListModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [consentApproved, setConsentApproved] = useState(false);
  const [doctorListModalOpen, setDoctorListModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const documents = [
    { id: 1, name: 'Patient Information.pdf', size: '2 MB', consent: false},
    { id: 2, name: 'Medical History.docx', size: '500 KB', consent: false },
    { id: 3, name: 'Latest Scans.zip', size: '10 MB', consent: true },
  ];

  const hospitals = [
    { id: 1, name: 'Joseph Hospital' },
    { id: 2, name: 'Kaweri' },
    { id: 3, name: 'Sanjeevni' },
    // Add more hospitals as needed
  ];

  const handleView = (document) => {
    setSelectedDocument(document);
    if (document.consent) {
      // Implement logic for viewing document
      console.log(`Viewing document: ${document.name}`);
    } else {
      alert('Wait until consent is approved.');
    }
  };

  const handleShare = (document) => {
    setSelectedDocument(document);
    setModalPosition({ top: event.clientY, left: event.clientX });
    setHospitalListModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchDoctors = (hospitalId) => {
    // Simulated data fetching, replace with actual API call
    // Assuming doctors are fetched based on hospital ID
    const dummyDoctors = [
      { id: 1, name: 'Dr. John Doe' },
      { id: 2, name: 'Dr. Jane Smith' },
      // Add more doctors as needed
    ];
    setDoctors(dummyDoctors);
  };
  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorListModalOpen(false);
    // Now you have both selectedHospital and selectedDoctor available for further processing
    console.log(`Selected hospital: ${selectedHospital.name}, Selected doctor: ${doctor.name}`);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleHospitalSelection = (hospital) => {
    setSelectedHospital(hospital);
    fetchDoctors(hospital.id);
    setDoctorListModalOpen(true);
    setHospitalListModalOpen(false);
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
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.name}</td>
                    <td>{document.size}</td>
                    <td>
                      <button onClick={() => handleView(document)}>View</button>
                      <button onClick={() => handleShare(document)}>Share</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
