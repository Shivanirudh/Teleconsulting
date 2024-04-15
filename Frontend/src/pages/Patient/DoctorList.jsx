import React, { useState, useEffect } from 'react';
import './../../css/Patient/DoctorList.css';
import axios from 'axios';
import config from './../../Config'

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [token, setToken] = useState('');
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [selectedAppointmentID, setselectedAppointmentID] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      const token = localStorage.getItem('token');
      setToken(token);
      
      console.log(`${config.apiUrl}/api/v1/patient/view-hospitals`);
      
      try {
        // Make the GET request using axios
        const response = await axios.get(`${config.apiUrl}/api/v1/patient/view-hospitals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        // Since you are using axios, the response data can be directly accessed using response.data
        const data = response.data;
        console.log(data);
        if (Array.isArray(data)) {
          setHospitals(data);
      } else {
          console.error('Received data is not an array:', data);
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
          `${config.apiUrl}/api/v1/patient/list-doctors-hospital/${email}`,
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
        `${config.apiUrl}/api/v1/patient/list-doctors-schedule/${doctor_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const slotsData = response.data.slots;
        const slotsAppointments = response.data.appointments;
        setDoctorSlots(slotsData); // Update state with slots data
        setDoctorAppointments(slotsAppointments);
      } else {
        console.error('Failed to fetch doctor schedule');
      }
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
    }
  };

  const handleCellClick = (date, hour, minute) => {
    if (isBookingMode) {
      const isLocked = lockedSlots.includes(`${date}_${hour}_${minute}`);
      if (!isLocked) {
        setSelectedSlot({ date, hour, minute });
      } 

      const appointment = doctorAppointments.find(appointment => {
        const [year, month, day] = date.split('-').map(Number); // Parsing to numbers
        const [appointmentYear, appointmentMonth, appointmentDay, appointmentHour, appointmentMinute] = appointment.slot.map(Number); // Parsing to numbers
        return (
          appointmentYear === year &&
          appointmentMonth === month &&
          appointmentDay === day &&
          appointmentHour === hour &&
          appointmentMinute === minute
        );
      });
      // If appointment is found, extract appointment_id and set selectedAppointmentID
      if (appointment) {
        setselectedAppointmentID(appointment.appointment_id);
      } else {
        // Handle case when appointment is not found
        console.log('Appointment not found for the selected slot.');
      }
    }
  };
  

  const handleToggleBookingMode = () => {
    setIsBookingMode(!isBookingMode);
    setSelectedSlot(null);
  };

  

  const handleCancelAppointment = async () => {
      try {
  
        if (selectedAppointmentID) {
  
          const response = await axios.post(
            `${config.apiUrl}/api/v1/patient/cancel-appointment`,
            { appointment_id: selectedAppointmentID },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            }
          );
  
          if (response.status === 200) {
            console.log('Appointment canceled successfully');
            setSelectedSlot(null);
            setIsBookingMode(false);
          } else {
            console.error('Failed to cancel appointment');
          }
        } else {
          console.error('Appointment not found in doctorAppointments');
        }
      } catch (error) {
        console.error('Error canceling appointment:', error);
      }
  };
  


  const handleBookAppointment = async () => {
    if (selectedSlot && selectedDoctor) { 
      try {
        const slotDate = new Date(selectedSlot.date);
        const year = slotDate.getFullYear();
        const month = String(slotDate.getMonth() + 1).padStart(2, '0');
        const day = String(slotDate.getDate()).padStart(2, '0');
        const hour = String(selectedSlot.hour).padStart(2, '0');
        const minute = String(selectedSlot.minute).padStart(2, '0');
        
        const formattedSlot = {
            slot: `${year}-${month}-${day}T${hour}:${minute}:00`,
            doctor_id: {
              doctor_id: selectedDoctor
            }
        };
        console.log(formattedSlot);
        const response = await axios.post(
          `${config.apiUrl}/api/v1/patient/appointment`,
          formattedSlot,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
  
        if (response.status === 200) {
          // Handle success, maybe show a success message
          console.log('Appointment booked successfully');
          // Reset state to original state
          setSelectedSlot(null);
          setIsBookingMode(false);
        } else {
          // Handle error response
          console.error('Failed to book appointment');
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
      }
    } else {
      console.error('Please select a slot and doctor');
    }
  };
  
  

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    // Sort dates
    const sortedDates = Object.keys(slotsByDate).sort((a, b) => new Date(a) - new Date(b));

    return sortedDates.map((date) => {
      const slotsForDate = slotsByDate[date];
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
                onClick={() =>
                  handleCellClick(date, hour, minute)}
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
                      {selectedDoctor === doctor.doctor_id && (
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
                              {doctorSlots && renderAvailability(doctorSlots)}
                            </tbody>
                          </table>
                          <button className="doc-list-wala-button-new" onClick={handleToggleBookingMode}>
                            {isBookingMode ? 'Go Back?' : 'Book Appointment'}
                          </button>
                          {selectedSlot && (
                            <button className="doc-list-wala-button-new" onClick={handleBookAppointment}>
                              Lock Slot
                            </button>
                          )}
                          {selectedAppointmentID && (
                            <button className="doc-list-wala-button-new" onClick={handleCancelAppointment}>
                              Cancel Slot
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
