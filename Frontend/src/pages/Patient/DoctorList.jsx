import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';
import SearchBar from './../../components/Patient/SearchBar';

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
      if (slot === 'available') {
        className = 'available-new';
      } else if (slot === 'booked') {
        className = 'booked-new';
      } else if (slot === 'busy') {
        className = 'busy-new';
      }
      return (
        <td
          key={index}
          className={className}
          onClick={() => handleSlotClick(date, index)}
          style={{ cursor: isBookingMode && slot === 'available' ? 'pointer' : 'default' }}
        >
          {slot}
        </td>
      );
    });
  };

  const handleViewSchedule = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const handleSlotClick = (date, index) => {
    if (isBookingMode) {
      setSelectedSlot({ date, index });
    }
  };


  const handleLockAppointment = () => {
    if (selectedSlot) {
      const { date, index } = selectedSlot;
      console.log('Book appointment for date:', date, 'slot index:', index);
      setSelectedSlot(null);
      setIsBookingMode(false);
    }
  };

  const toggleBookingMode = () => {
    setIsBookingMode(!isBookingMode);
    setSelectedSlot(null); // Reset selected slot when toggling booking mode
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div>
                <table className="availability-table-new">
                  <thead>
                    <tr>
                      <th style={{ width: '150px' }}>Date</th>
                      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                        <th key={hour}>{hour}:00 - {hour + 1}:00</th>
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
                {selectedSlot && (
                  <button className= "doc-list-wala-button-new" onClick={handleLockAppointment}>Lock Appointment</button>
                )}
              </div>
            )}
            {selectedDoctor === doctor.id && (
              <button
                className="doc-list-wala-button-new"
                onClick={toggleBookingMode}
                disabled={selectedSlot !== null} // Disable button if a slot is already selected
              >
                {isBookingMode ? 'Cancel Booking' : 'Book Appointment'}
              </button>
            )}
            {selectedDoctor !== doctor.id && (
              <button
                className="doc-list-wala-button-new"
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
