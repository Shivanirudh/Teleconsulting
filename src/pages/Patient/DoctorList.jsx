import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(false);

  const hospitals = [
    {
      id: 1,
      name: 'Hospital 1',
      doctors: [
        {
          id: 1,
          name: 'Dr. John Doe',
          specialty: 'Cardiologist',
          schedule: {
            slots: [
              [2024, 4, 1, 11, 15],
              [2024, 4, 3, 15, 45],
              [2024, 4, 4, 15, 0],
              [2024, 4, 2, 15, 45],
              [2024, 4, 5, 15, 0]
            ]
          },
          appointments: []
        },
        {
          id: 2,
          name: 'Dr. Jane Smith',
          specialty: 'Dermatologist',
          schedule: {
            slots: [
              [2024, 4, 1, 11, 15],
              [2024, 4, 3, 15, 45],
              [2024, 4, 4, 15, 0],
              [2024, 4, 2, 15, 45],
              [2024, 4, 5, 15, 0]
            ]
          },
          appointments: []
        }
      ]
    }
  ];

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDoctors = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setSelectedDoctor(null);
    setIsScheduleCollapsed(false);
  };

  const handleViewSchedule = (doctorId) => {
    setSelectedDoctor(doctorId);
    setIsBookingMode(false);
  };

  const handleCellClick = (date, index) => {
    if (isBookingMode) {
      const selectedHospitalData = hospitals.find(hospital => hospital.id === selectedHospital);
      if (selectedHospitalData) {
        const selectedDoctorData = selectedHospitalData.doctors.find(doctor => doctor.id === selectedDoctor);
        if (selectedDoctorData) {
          const isGreen = selectedDoctorData.schedule.slots.find(slot => {
            const [year, month, day, hour, minute] = slot;
            return year === date.getFullYear() && month === date.getMonth() + 1 && day === date.getDate() && Math.floor(index * 0.75) + 9 === hour && (index * 45) % 60 === minute;
          });
          if (isGreen && !lockedSlots.includes(`${date}_${index}`)) {
            setSelectedSlot({ date, index });
          }
        }
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

  const renderAvailability = (schedule, date) => {
    // Create a map to check if a specific slot is available
    const availableSlotsMap = {};
    schedule.slots.forEach(slot => {
      const [year, month, day, hour, minute] = slot;
      const slotKey = `${year}-${month}-${day}_${hour}_${minute}`;
      availableSlotsMap[slotKey] = true;
    });

    // Generate the time slots for the day
    const slots = Array.from({ length: 10 }, (_, i) => {
      const hour = Math.floor(i * 0.75) + 9;
      const minute = (i * 45) % 60;
      const slotKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${hour}_${minute}`;
      return availableSlotsMap[slotKey] ? 'available' : 'busy';
    });

    // Render each slot with appropriate class
    return slots.map((slot, index) => {
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

  return (
    <div className="doctor-list-container-new">
      <div className="search-form">
        <input
          type="text"
          placeholder="Search by Hospital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
                        <>
                          <table className="availability-table-new">
                            <thead>
                              <tr>
                                <th style={{ width: '150px' }}>Date</th>
                                {Array.from({ length: 10 }, (_, i) => i).map((index) => {
                                  const hour = Math.floor(index * 0.75) + 9;
                                  const minute = (index * 45) % 60;
                                  return (
                                    <th key={index}>
                                      {hour < 10 ? '0' + hour : hour}:{minute === 0 ? '00' : minute}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {doctor.schedule.slots.map((slot, idx) => (
                                <tr key={idx}>
                                  <td>{`${slot[2]}-${slot[1]}-${slot[0]}`}</td>
                                  {renderAvailability(doctor.schedule, new Date(slot[0], slot[1] - 1, slot[2]))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button className="doc-list-wala-button-new" onClick={handleToggleBookingMode}>
                            {isBookingMode ? 'Cancel Booking' : 'Book Appointment'}
                          </button>
                          {selectedSlot && (
                            <button className="doc-list-wala-button-new" onClick={handleLockSlot}>
                              Lock Slot
                            </button>
                          )}
                        </>
                      )}
                      {selectedDoctor !== doctor.id && (
                        <button className='doc-list-wala-button-new busy-new' onClick={() => handleViewSchedule(doctor.id)}>
                          View Schedule
                        </button>
                      )}
                      <br />
                    </li>
                  ))}
                </ul>
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
