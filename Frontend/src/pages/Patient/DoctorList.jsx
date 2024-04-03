import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';
import SearchBar from './../../components/Patient/SearchBar';

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);

  const hospitals = [
    {
      id: 1,
      name: 'Hospital A',
      doctors: [
        {
          id: 1,
          name: 'Dr. John Doe',
          specialty: 'Cardiologist',
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
        {
          id: 2,
          name: 'Dr. Jane Smith',
          specialty: 'Dermatologist',
          schedule: [
            { date: '2024-04-01', availability: ['busy', 'busy', 'booked', 'busy', 'busy', 'busy', 'booked', 'available', 'available', 'booked', 'available', 'available'] },
            { date: '2024-04-02', availability: ['booked','busy','available','busy','available','busy','busy','available','booked','booked','booked','booked'] },
            { date: '2024-04-03', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy','available'] },
            { date: '2024-04-04', availability: ['available','available','busy','busy','busy','available','available','booked','available','busy','available','available'] },
            { date: '2024-04-05', availability: ['busy','booked','available','busy','available','busy','busy','available','booked','booked','busy','booked'] },
            { date: '2024-04-06', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy','available'] },
            { date: '2024-04-07', availability: ['busy','booked','booked','busy','available','available','busy','booked','available','available','busy','booked'] }
          ]
        },
      ]
    },
    {
      id: 2,
      name: 'Hospital B',
      doctors: [
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
        // Add more doctors for Hospital B if needed
      ]
    },
    // Add more hospitals if needed
  ];

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDoctors = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setSelectedDoctor(null);
  };

  const handleViewSchedule = (doctorId) => {
    setSelectedDoctor(doctorId);
    setIsBookingMode(false);
  };

  const handleCellClick = (date, index) => {
    if (isBookingMode) {
      const isGreen = hospitals[selectedHospital - 1].doctors[selectedDoctor - 1].schedule.filter((x) => x.date === date)[0].availability[index] === 'available';
      if (!lockedSlots.includes(`${date}_${index}`) && isGreen) {
        setSelectedSlot({ date, index });
      }
    }
  };

  const handleLockSlot = () => {
    if (selectedSlot) {
      const slotKey = `${selectedSlot.date}_${selectedSlot.index}`;
      setLockedSlots([...lockedSlots, slotKey]);
      setSelectedSlot(null);
    }
  };

  const handleToggleBookingMode = () => {
    setIsBookingMode(!isBookingMode);
    setSelectedSlot(null);
  };

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
      const slotKey = `${date}_${index}`;
      const isLocked = lockedSlots.includes(slotKey);
      return (
        <td
          key={index}
          className={isBookingMode && slot === 'available' && !isLocked ? 'available-new clickable' : className}
          onClick={() => handleCellClick(date, index)}
        >
          {isBookingMode && slot === 'available' && !isLocked && selectedSlot && selectedSlot.date === date && selectedSlot.index === index && 'Selected'}
          {isLocked && 'Locked'}
        </td>
      );
    });
  };

  const isDoctorBusy = (doctor) => {
    return doctor.schedule.some(day => day.availability.includes('busy'));
  };

  return (
    <div className="doctor-list-container-new">
      <SearchBar onSearch={setSearchTerm} />
      <h2 style={{textAlign: 'center'}}>Available Hospitals</h2>
      <ul>
        {filteredHospitals.map((hospital, index) => (
          <li key={index}>
            <h3>{hospital.name}</h3>
            {selectedHospital === hospital.id && (
              <>
                <h4>Doctors:</h4>
                <ul>
                  {hospital.doctors.map((doctor, idx) => (
                    <li key={idx}>
                      <h5>{doctor.name}</h5>
                      <p>{doctor.specialty}</p>
                      {selectedDoctor === doctor.id && (
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
                      )}
                      {selectedDoctor !== doctor.id && (
                        <button className={isDoctorBusy(doctor) ? 'doc-list-wala-button-new busy-new' : 'doc-list-wala-button-new'} onClick={() => handleViewSchedule(doctor.id)}>
                          View Schedule
                        </button>
                      )}
                      <br />
                    </li>
                  ))}
                </ul>
                {selectedDoctor && (
                  <button className="doc-list-wala-button-new" onClick={handleToggleBookingMode}>
                    {isBookingMode ? 'Cancel Booking' : 'Book Appointment'}
                  </button>
                )}
                {selectedSlot && (
                  <button className="doc-list-wala-button-new" onClick={handleLockSlot}>
                    Lock Slot
                  </button>
                )}
              </>
            )}
            {selectedHospital !== hospital.id && (
              <button className="doc-list-wala-button-new" onClick={() => handleViewDoctors(hospital.id)}>
                View Doctors
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
