import React, { useState, useEffect } from "react";
import "./../../css/Patient/DoctorList.css";
import axios from "axios";
import config from "./../../Config";

function DoctorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [token, setToken] = useState("");
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [selectedAppointmentID, setselectedAppointmentID] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      const token = localStorage.getItem("token");
      setToken(token);

      try {
        // Make the GET request using axios
        const response = await axios.get(
          `${config.apiUrl}/api/v1/patient/view-hospitals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Since you are using axios, the response data can be directly accessed using response.data
        const data = response.data;
        if (Array.isArray(data)) {
          setHospitals(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const handleViewDoctors = async (hospitalId) => {
    setSelectedHospital(hospitalId); // Set the selected hospital ID

    const hospital = hospitals.find(
      (hospital) => hospital.hospital_id === hospitalId
    );
    if (hospital) {
      const email = hospital.email;

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

          // Update the hospitals state with the doctors data for the selected hospital
          setHospitals((prevHospitals) =>
            prevHospitals.map((prevHospital) => {
              if (prevHospital.hospital_id === hospitalId) {
                return {
                  ...prevHospital,
                  doctors: doctorsData, // Add doctors data to the specific hospital
                };
              }
              return prevHospital; // Return other hospitals unchanged
            })
          );
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
        const { slots, appointments } = response.data;
  
        // Get the current date
        const currentDate = new Date();
        
        // Include today's date in the filtered dates
        const dates = [];
        for (let i = 0; i < 8; i++) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() + i);
          dates.push(date);
        }
  
        // Filter slots and appointments to only include those within the next 7 days
        const filteredSlots = slots.filter((slot) => {
          const slotDate = new Date(slot[0], slot[1] - 1, slot[2]); // Convert slot date parts to a Date object
          return dates.some(date => date.toDateString() === slotDate.toDateString());
        });
  
        const filteredAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2]
          );
          return dates.some(date => date.toDateString() === appointmentDate.toDateString());
        });
  
        // Update state with filtered data
        setDoctorSlots(filteredSlots);
        setDoctorAppointments(filteredAppointments);
      } else {
        console.error("Failed to fetch doctor schedule");
      }
    } catch (error) {
      console.error("Error fetching doctor schedule:", error);
    }
  };
  

  const handleCellClick = (date, hour, minute = 0) => {
    if (isBookingMode) {
      // Ensure the slot is not locked before setting the selected slot
      const isLocked = lockedSlots.includes(`${date}_${hour}_${minute}`);
      if (!isLocked) {
        // Set the selected slot with the provided date, hour, and minute (defaulting minute to 0)
        setSelectedSlot({ date, hour, minute });
      }

      // Find the appointment for the selected slot and set the selected appointment ID
      const appointment = doctorAppointments.find((appointment) => {
        const [year, month, day] = date.split("-").map(Number);
        const [
          appointmentYear,
          appointmentMonth,
          appointmentDay,
          appointmentHour,
          appointmentMinute,
        ] = appointment.slot.map(Number);

        return (
          appointmentYear === year &&
          appointmentMonth === month &&
          appointmentDay === day &&
          appointmentHour === hour &&
          appointmentMinute === minute
        );
      });

      // Set the selected appointment ID if an appointment is found
      if (appointment) {
        setselectedAppointmentID(appointment.appointment_id);
      }
    }
  };

  const handleToggleBookingMode = () => {
    setIsBookingMode(!isBookingMode);
    setSelectedSlot(null);
  };

  const handleBookAppointment = async () => {
    if (selectedSlot && selectedDoctor) {
      setIsBooking(true); // Show loading state
  
      try {
        // Parse the date and time from the selected slot
        const slotDate = new Date(selectedSlot.date);
        const year = slotDate.getFullYear();
        const month = slotDate.getMonth() + 1; // Convert month to 1-based index
        const day = slotDate.getDate();
        const hour = selectedSlot.hour;
        
        // Filter existing appointments to count the number of patients booked in the selected slot
        const appointmentsForSlot = doctorAppointments.filter((appointment) => {
          const appointmentSlot = appointment.slot; // Format: [year, month, day, hour, minute]
          const appointmentYear = appointmentSlot[0];
          const appointmentMonth = appointmentSlot[1];
          const appointmentDay = appointmentSlot[2];
          const appointmentHour = appointmentSlot[3];
          
          // Compare year, month, day, and hour for the selected slot and existing appointments
          return (
            appointmentYear === year &&
            appointmentMonth === month &&
            appointmentDay === day &&
            appointmentHour === hour
          );
        });
        
        console.log(appointmentsForSlot);
        // Count the number of patients booked in the selected slot
        const bookedPatientCount = appointmentsForSlot.length;
  
        // Check if the slot is already at maximum capacity (3 patients)
        if (bookedPatientCount >= 3) {
          alert("The selected slot is already full. Please choose another slot.");
          return;
        }
  
        // Show a confirmation dialog with the number of patients already booked
        const confirmBooking = window.confirm(
          `Are you sure you want to book this appointment? ${bookedPatientCount} patient(s) have already booked appointments for this slot.`
        );
  
        // Proceed with booking if the user confirms
        if (confirmBooking) {
          // Format the slot for the API request
          const slotDate = new Date(selectedSlot.date);
            const year = slotDate.getFullYear();
            const month = String(slotDate.getMonth() + 1).padStart(2, '0'); // Convert month to 1-based index and ensure two digits
            const day = String(slotDate.getDate()).padStart(2, '0'); // Ensure two digits for day
            const hour = String(selectedSlot.hour).padStart(2, '0'); // Ensure two digits for hour

            // Format the slot for the API request
            const formattedSlot = {
                slot: `${year}-${month}-${day}T${hour}:00:00`,
                doctor_id: {
                    doctor_id: selectedDoctor,
                },
            };
          console.log(formattedSlot);
          // Make the POST request to book the appointment
          const response = await axios.post(
            `${config.apiUrl}/api/v1/patient/appointment`,
            formattedSlot,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          // Check if the booking was successful
          if (response.status === 200) {
            // Handle success
            alert("Appointment booked successfully");
  
            // Refresh the doctor's schedule
            handleViewSchedule({ doctor_id: selectedDoctor }, selectedHospital);
  
            // Reset state and booking mode
            setSelectedSlot(null);
            setIsBookingMode(false);
          } else {
            // Handle error response
            alert("Failed to book appointment");
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          alert(`Error booking appointment: ${error.response.data}`);
        } else {
          console.error("Error booking appointment:", error);
          alert("An unexpected error occurred while booking the appointment.");
        }
      } finally {
        setIsBooking(false); // Hide loading state
      }
    } else {
      alert("Please select a slot and doctor");
    }
  };
  
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAvailability = (slotsData) => {
    if (!slotsData) {
      return null;
    }
  
    // Organize slots by date
    const slotsByDate = {};
    slotsData.forEach((slot) => {
      const [year, month, day, hour, minute] = slot;
      const dateKey = `${year}-${month}-${day}`;
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({ hour, minute });
    });
  
    // Organize appointments by date and hour
    const appointmentsByDateTime = {};
    doctorAppointments.forEach((appointment) => {
      const [year, month, day, hour, minute] = appointment.slot;
      const dateTimeKey = `${year}-${month}-${day}-${hour}`;
      if (!appointmentsByDateTime[dateTimeKey]) {
        appointmentsByDateTime[dateTimeKey] = 0;
      }
      appointmentsByDateTime[dateTimeKey]++;
    });
  
    // Sort dates
    const sortedDates = Object.keys(slotsByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );
  
    // Render availability table
    return sortedDates.map((dateKey) => {
      const slotsForDate = slotsByDate[dateKey];
  
      return (
        <tr key={dateKey}>
          <td>{dateKey}</td>
          {Array.from({ length: 12 }, (_, index) => {
            const hour = 9 + index; // 1-hour slots from 9 AM to 8 PM
  
            // Check if the slot is available
            const numBooked = appointmentsByDateTime[`${dateKey}-${hour}`] || 0;
            const isAvailable = numBooked < 3;
  
            // Only render cells for available slots
            if (slotsForDate.some(slot => slot.hour === hour) && isAvailable) {
              const cellClass = "available-new clickable";
              const cellText = "Available";
  
              return (
                <td
                  key={index}
                  className={cellClass}
                  onClick={() => handleCellClick(dateKey, hour)}
                >
                  {cellText}
                </td>
              );
            }
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
      <h2 style={{ textAlign: "center" }}>Available Hospitals</h2>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital.hospital_id} className="hospital-item">
            <h3>{hospital.name}</h3>
            {/* Render doctors for the selected hospital */}
            {selectedHospital === hospital.hospital_id && hospital.doctors && (
              <ul>
                {hospital.doctors.map((doctor) => (
                  <li key={doctor.doctor_id}>
                    {doctor.first_name} {doctor.last_name}
                    {/* Display doctor's specialization if available */}
                    {doctor.specialization && (
                      <p>Specialization: {doctor.specialization}</p>
                    )}
                    {/* Button to view doctor's schedule */}
                    <button
                      style={{ margin: "5px" }}
                      className="doc-list-wala-button-new"
                      onClick={() =>
                        handleViewSchedule(doctor, hospital.hospital_id)
                      }
                    >
                      View Schedule
                    </button>
                    {/* Render doctor's availability table if selected */}
                    {selectedDoctor === doctor.doctor_id && (
                      <div>
                        <table className="availability-table-new">
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>Date</th>
                              {Array.from({ length: 12 }, (_, i) => i).map(
                                (index) => {
                                  const hour = 9 + index; // 1-hour slots from 9 AM to 8 PM
                                  return <th key={index}>{hour}:00</th>;
                                }
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {doctorSlots && renderAvailability(doctorSlots)}
                          </tbody>
                        </table>
                        {/* Buttons for booking mode */}
                        <button
                          style={{ margin: "5px" }}
                          className="doc-list-wala-button-new"
                          onClick={handleToggleBookingMode}
                        >
                          {isBookingMode ? "Go Back?" : "Book Appointment"}
                        </button>
                        {/* Button for locking slot */}
                        {selectedSlot && (
                          <div>
                            {isBooking ? (
                              <p>Booking appointment, please wait...</p>
                            ) : (
                              <button
                                style={{ margin: "5px" }}
                                className="doc-list-wala-button-new"
                                onClick={handleBookAppointment}
                              >
                                Lock Slot
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {/* Button to view doctors for the selected hospital */}
            <button
              style={{ margin: "10px" }}
              className="doc-list-wala-button-new"
              onClick={() => handleViewDoctors(hospital.hospital_id)}
            >
              View Doctors
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;
