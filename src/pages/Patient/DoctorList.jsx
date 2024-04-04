import React, { useState } from 'react';
import './../../css/Patient/DoctorList.css';

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDoctorTerm, setSearchDoctorTerm] = useState('');
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
              [2024, 4, 4, 12, 45],
              [2024, 4, 5, 15, 0],
              [2024, 4, 5, 12, 45]
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
              [2024, 4, 3, 11, 15],
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

  const filterDoctors = (doctors) => {
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchDoctorTerm.toLowerCase())
    );
  };

  const handleViewDoctors = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setSelectedDoctor(null);
    setIsScheduleCollapsed(false);
  };

  const handleViewSchedule = (doctorId) => {
    setSelectedDoctor(doctorId);
    setIsBookingMode(false);
  };

  const handleCellClick = (year, month, day, time) => {
    if (isBookingMode) {
      const isLocked = lockedSlots.includes(`${year}_${month}_${day}_${time}`);
      if (!isLocked) {
        setSelectedSlot({ year, month, day, time });
      }
    }
  };

  const handleLockSlot = () => {
    if (selectedSlot) {
      const slotKey = `${selectedSlot.year}_${selectedSlot.month}_${selectedSlot.day}_${selectedSlot.time}`;
      setLockedSlots([...lockedSlots, slotKey]);
      setSelectedSlot(null);
    }
  };

  const handleToggleBookingMode = () => {
    setIsBookingMode(!isBookingMode);
    setSelectedSlot(null);
  };

  const renderAvailability = (schedule) => {
    // Collect unique dates from slots
    const uniqueDates = [];
    schedule.slots.forEach(slot => {
      const [year, month, day] = slot;
      const formattedDate = `${day}-${month}-${year}`;
      if (!uniqueDates.includes(formattedDate)) {
        uniqueDates.push(formattedDate);
      }
    });

    // Render each date along with its availability
    return uniqueDates.map((date, dateIndex) => {
      const slotsForDate = schedule.slots.filter(slot => {
        const [slotYear, slotMonth, slotDay] = slot;
        const formattedDate = `${slotDay}-${slotMonth}-${slotYear}`;
        return formattedDate === date;
      });

      return (
        <tr key={dateIndex}>
          <td>{date}</td>
          {Array.from({ length: 10 }, (_, i) => i).map((index) => {
            const hour = Math.floor(index * 0.75) + 9;
            const minute = (index * 45) % 60;
            const formattedTime = `${hour < 10 ? '0' + hour : hour}:${minute === 0 ? '00' : minute}`;
            const isAvailable = slotsForDate.some(slot => {
              const [, , , slotHour, slotMinute] = slot;
              return slotHour === hour && slotMinute === minute;
            });
            const isLocked = lockedSlots.includes(`${slotsForDate[0][0]}_${slotsForDate[0][1]}_${slotsForDate[0][2]}_${formattedTime}`);

            // Check if the slot is locked
            const isBusy = isLocked ? true : !isAvailable;

            return (
              <td
                key={index}
                className={isBusy ? 'busy-new' : (isBookingMode && isAvailable ? 'available-new clickable' : 'available-new')}
                onClick={() => handleCellClick(slotsForDate[0][0], slotsForDate[0][1], slotsForDate[0][2], formattedTime)}
              >
                {isBookingMode && isAvailable && !isLocked && selectedSlot && selectedSlot.year === slotsForDate[0][0] && selectedSlot.month === slotsForDate[0][1] && selectedSlot.day === slotsForDate[0][2] && selectedSlot.time === formattedTime && 'Selected'}
                {isLocked && 'Locked'}
              </td>
            );
          })}
        </tr>
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
      <h2 style={{ textAlign: 'center' }}>Available Hospitals</h2>
      <ul>
        {filteredHospitals.map((hospital, index) => (
          <li key={index}>
            <h3>{hospital.name}</h3>
            {selectedHospital === hospital.id && (
              <>
                <h4>Doctors:</h4>
                <input
                  type="text"
                  placeholder="Search by Doctor Name..."
                  value={searchDoctorTerm}
                  onChange={(e) => setSearchDoctorTerm(e.target.value)}
                />
                <ul>
                  {filterDoctors(hospital.doctors).map((doctor, idx) => (
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
                              {doctor.schedule.slots && renderAvailability(doctor.schedule)}
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
