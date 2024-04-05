import React, { useState, useEffect } from 'react';
import './../../css/Patient/DoctorList.css';
import axios from 'axios';

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      const token = localStorage.getItem('token');
      setToken(token);
      try {
        const response = await fetch('http://localhost:8081/api/v1/patient/view-hospitals', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHospitals(data);
        } else {
          console.error('Failed to fetch hospitals');
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  const handleViewDoctors = async (hospitalId) => {
    setSelectedHospital(hospitalId);
    setSelectedDoctor(null);
    const hospital = hospitals.find((hospital) => hospital.id === hospitalId);
    if (hospital) {
      const email = hospital.email; // Extract hospital email
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/patient/list-doctors-hospital/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const doctorsData = response.data;
          setHospitals((prevHospitals) => {
            return prevHospitals.map((prevHospital) => {
              if (prevHospital.id === hospitalId) {
                return { ...prevHospital, doctors: doctorsData };
              } else {
                return prevHospital;
              }
            });
          });
        } else {
          console.error("Failed to fetch doctors for this hospital");
        }
      } catch (error) {
        console.error("Error fetching doctors for this hospital:", error);
      }
    }
  };
  
  const handleViewSchedule = async (doctor, hospitalId) => {
    const { doctor_id } = doctor;
    setSelectedDoctor(doctor_id);
    setIsBookingMode(false);
  
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/patient/list-doctors-schedule/${doctor_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        const slotsData = response.data.slots;
        const formattedSlots = transformSlotsData(slotsData);
        console.log(formattedSlots); // Log formatted slots


        setHospitals(prevHospitals => {
          return prevHospitals.map(prevHospital => {
            if (prevHospital.id === hospitalId) {
              return {
                ...prevHospital,
                doctors: prevHospital.doctors.map(prevDoctor => {
                  if (prevDoctor.id === doctor_id) {
                    const updatedDoctor = { ...prevDoctor, schedule: { slots: formattedSlots } };
                    renderAvailability(updatedDoctor.schedule.slots); // Pass formatted slots to renderAvailability
                    return updatedDoctor;
                  } else {
                    return prevDoctor;
                  }
                })
              };
            } else {
              return prevHospital;
            }
          });
        });
      } else {
        console.error('Failed to fetch doctor schedule');
      }
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
    }
  };
  
  const transformSlotsData = (slotsData) => {
    const formattedSlots = slotsData.map(slot => {
      const [year, month, day, hour, minute] = slot;
      return [year, month, day, hour, minute];
    });
    return formattedSlots;
  };  
  

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const renderAvailability = (slotsData) => {
    if (!slotsData) {
      return null;
    }
  
    const slotsByDate = {};
    slotsData.forEach(slot => {
      const [year, month, day, hour, minute] = slot;
      const dateKey = `${year}-${month}-${day}`;
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push([hour, minute]);
    });
  
    return Object.entries(slotsByDate).map(([date, slotsForDate]) => {
      return (
        <tr key={date}>
          <td>{date}</td>
          {Array.from({ length: 10 }, (_, i) => i).map((index) => {
            const hour = Math.floor(index * 0.75) + 9;
            const minute = (index * 45) % 60;
            const isAvailable = slotsForDate.some(slot => {
              return slot[0] === hour && slot[1] === minute;
            });
            return (
              <td
                key={index}
                className={isAvailable ? 'available-new clickable' : 'busy-new'}
                onClick={() => handleCellClick(date, hour, minute)}
              >
                {isAvailable ? 'Available' : 'Busy'}
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
                <ul>
                  {hospital.doctors?.map((doctor, idx) => (
                    <li key={idx}>
                      <h5>{doctor.first_name + " " + doctor.last_name}</h5>
                      <p>{doctor.specialization}</p>
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
                              {doctor.schedule && renderAvailability(doctor.schedule.slots)}
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
                        <button className='doc-list-wala-button-new busy-new' onClick={() => handleViewSchedule(doctor, hospital.id)}>
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
