import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';
import SearchBar from './../../components/Patient/SearchBar';
import { Link } from 'react-router-dom';

function DoctorList() {
  // Dummy data for doctors
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State to track the selected doctor

  const doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialty: 'Cardiologist',
      schedule: [
        { date: '2024-04-01', availability: ['busy', 'booked', 'available', 'busy', 'available', 'available', 'busy', 'booked', 'available', 'available','busy','booked'] },
        { date: '2024-04-02', availability: ['booked','busy','available','busy','available','busy','busy','available','booked','booked','booked','booked'] },
        { date: '2024-04-03', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-04', availability: ['available','available','busy','busy','busy','available','available','booked','available','busy','available','available'] },
        { date: '2024-04-05', availability: ['busy','booked','available','busy','available','busy','busy','available','booked','booked','busy','booked'] },
        { date: '2024-04-06', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-07', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','booked'] }
      ]
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialty: 'Dermatologist',
      schedule: [
        { date: '2024-04-01', availability: ['available', 'available', 'booked', 'available', 'busy', 'busy', 'booked', 'available', 'available', 'available', 'booked', 'busy'] },
        { date: '2024-04-02', availability: ['booked','busy','available','busy','available','busy','busy','available','booked','booked','booked','booked'] },
        { date: '2024-04-03', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-04', availability: ['available','available','busy','busy','busy','available','available','booked','available','busy','available','available'] },
        { date: '2024-04-05', availability: ['busy','booked','available','busy','available','busy','busy','available','booked','booked','busy','booked'] },
        { date: '2024-04-06', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-07', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','booked'] }
      ]
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      specialty: 'Pediatrician',
      schedule: [
        { date: '2024-04-01', availability: ['busy', 'busy', 'booked', 'busy', 'busy', 'busy', 'booked', 'available', 'available', 'booked', 'available', 'available'] },
        { date: '2024-04-02', availability: ['booked','busy','available','busy','available','busy','busy','available','booked','booked','booked','booked'] },
        { date: '2024-04-03', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-04', availability: ['available','available','busy','busy','busy','available','available','booked','available','busy','available','available'] },
        { date: '2024-04-05', availability: ['busy','booked','available','busy','available','busy','busy','available','booked','booked','busy','booked'] },
        { date: '2024-04-06', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy','available'] },
        { date: '2024-04-07', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','booked'] }
      ]
    },
  ];

  const renderAvailability = (availability, date) => {
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

      return (
        <td key={index} className={className}>
          <div>
            {slot === 'available' && (
              <Link
                to="#"
                onClick={() => handleBookAppointment(date)}
                className="book-link0101" // Add a class for styling
                style={{
                  color: 'lightblue', // Set color to light blue
                }}
              >
                Book
              </Link>
            )}
          </div>
        </td>
      );
    });
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isDoctorBusy = (doctor) => {
    return doctor.schedule.some((day) => day.availability.includes('busy')); // Check if any slot is busy
  };

  const handleViewSchedule = (doctorId) => {
    setSelectedDoctor(doctorId); // Set the selected doctor ID
  };

  const handleBookAppointment = (date) => {
    // Implement booking appointment logic here
    console.log('Book appointment for date:', date);
  };

  return (
    <div className="doctor-list-container-new">
      <SearchBar onSearch={setSearchTerm} />
      <h2 style={{ textAlign: 'center' }}>Available Doctors</h2>
      <ul>
        {filteredDoctors.map((doctor, index) => (
          <li key={index}>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            {selectedDoctor === doctor.id && (
              <table className="availability-table-new">
                <thead>
                  <tr>
                    <th style={{ width: '150px' }}>Date</th>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <th key={hour}>
                        {hour}:00 - {hour + 1}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctor.schedule.map((day, idx) => (
                    <tr key={idx}>
                      <td>{day.date}</td>
                      {renderAvailability(day.availability, day.date)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedDoctor !== doctor.id && (
              <button
                className={
                  isDoctorBusy(doctor)
                    ? 'doc-list-wala-button-new busy-new'
                    : 'doc-list-wala-button-new'
                }
                onClick={() => handleViewSchedule(doctor.id)}
              >
                View Schedule
              </button>
            )}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;