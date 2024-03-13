// DoctorList.js
import React from 'react';
import'../doctorlist.css';

function DoctorList({ searchTerm }) {
  // Dummy data for doctors
  const doctors = [
    {
      name: 'Dr. John Doe',
      specialty: 'Cardiologist',
      availability: [
        true, true, true, false, false, true, true, false, true, true, true, false, true, true // Sample availability for each hour
      ],
    },
    {
      name: 'Dr. Jane Smith',
      specialty: 'Dermatologist',
      availability: [
        false, false, true, false, true, true, false, false, true, true, false, false, true, true // Sample availability for each hour
      ],
    },
    {
      name: 'Dr. Michael Brown',
      specialty: 'Pediatrician',
      availability: [
        true, true, false, true, true, true, false, false, false, true, true, true, true, true // Sample availability for each hour
      ],
    },
  ];

  const renderAvailability = (availability) => {
    return availability.map((slot, index) => (
      <td key={index} className={slot ? 'available' : 'booked'}></td>
    ));
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctor-list-container">
      <h2>Available Doctors</h2>
      <ul>
        {filteredDoctors.map((doctor, index) => (
          <li key={index}>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <table className="availability-table">
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
            <button>Book Appointment</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;