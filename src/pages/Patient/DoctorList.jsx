import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';
import SearchBar from './../../components/Patient/SearchBar';

function DoctorList() {
  // Dummy data for doctors
  const [searchTerm, setSearchTerm] = useState('');
  const doctors = [
    {
      name: 'Dr. John Doe',
      specialty: 'Cardiologist',
      availability: ['busy', 'booked', 'available', 'busy', 'available', 'available', 'busy', 'booked', 'available', 'available', 'available', 'booked', 'available', 'available'], // Sample availability for each hour
    },
    {
      name: 'Dr. Jane Smith',
      specialty: 'Dermatologist',
      availability: ['available', 'available', 'booked', 'available', 'busy', 'busy', 'booked', 'available', 'available', 'available', 'booked', 'busy', 'available', 'available'], // Sample availability for each hour
    },
    {
      name: 'Dr. Michael Brown',
      specialty: 'Pediatrician',
      availability: ['busy', 'busy', 'booked', 'busy', 'busy', 'busy', 'booked', 'available', 'available', 'booked', 'available', 'available', 'available', 'available'], // Sample availability for each hour
    },
  ];

  const renderAvailability = (availability) => {
    return availability.map((slot, index) => {
      let className = '';
      switch (slot) {
        case 'available':
          className = 'available-new';
          break;
        case 'booked':
          className = 'booked-new';
          break;
        case 'busy':
          className = 'busy-new';
          break;
        default:
          className = '';
      }
      return <td key={index} className={className}></td>;
    });
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isDoctorBusy = (doctor) => {
    return doctor.availability.some(slot => slot === 'busy'); // Check if any slot is busy
  };

  return (
    <div className="doctor-list-container-new">
      <SearchBar onSearch={setSearchTerm} />
      <h2 style={{textAlign: 'center'}}>Available Doctors</h2>
      <ul>
        {filteredDoctors.map((doctor, index) => (
          <li key={index}>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <table className="availability-table-new">
              <tbody>
                <tr>
                  <th>Time Slots</th>
                  {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                    <th key={hour}>{hour}:00 - {hour + 1}:00</th>
                  ))}
                </tr>
                <tr>
                  <td>Availability</td>
                  {renderAvailability(doctor.availability)}
                </tr>
              </tbody>
            </table>
            <button className={isDoctorBusy(doctor) ? 'doc-list-wala-button-new busy-new' : 'doc-list-wala-button-new'}>
              Book Appointment
            </button>
            <br></br>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;
