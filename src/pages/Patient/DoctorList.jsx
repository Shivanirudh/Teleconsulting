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
        const { slots, appointments } = response.data;

        // Get the current date
        const currentDate = new Date();

        // Calculate the end date (7 days from the current date)
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + 7);

        // Filter slots and appointments to only include those within the current day + next 7 days
        const filteredSlots = slots.filter((slot) => {
          const slotDate = new Date(slot[0], slot[1] - 1, slot[2]); // Convert slot date parts to a Date object
          return slotDate >= currentDate && slotDate <= endDate;
        });

        const filteredAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2]
          );
          return appointmentDate >= currentDate && appointmentDate <= endDate;
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

  const handleCellClick = (date, hour, minute) => {
    if (isBookingMode) {
      const isLocked = lockedSlots.includes(`${date}_${hour}_${minute}`);
      if (!isLocked) {
        setSelectedSlot({ date, hour, minute });
      }

      const appointment = doctorAppointments.find((appointment) => {
        const [year, month, day] = date.split("-").map(Number); // Parsing to numbers
        const [
          appointmentYear,
          appointmentMonth,
          appointmentDay,
          appointmentHour,
          appointmentMinute,
        ] = appointment.slot.map(Number); // Parsing to numbers
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
        const slotDate = new Date(selectedSlot.date);
        const year = slotDate.getFullYear();
        const month = String(slotDate.getMonth() + 1).padStart(2, "0");
        const day = String(slotDate.getDate()).padStart(2, "0");
        const hour = String(selectedSlot.hour).padStart(2, "0");
        const minute = String(selectedSlot.minute).padStart(2, "0");

        const formattedSlot = {
          slot: `${year}-${month}-${day}T${hour}:${minute}:00`,
          doctor_id: {
            doctor_id: selectedDoctor,
          },
        };

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

        if (response.status === 200) {
          // Handle success, maybe show a success message
          alert("Appointment booked successfully");

          // Call handleViewSchedule function again to refresh the schedule
          handleViewSchedule({ doctor_id: selectedDoctor }, selectedHospital);

          // Reset state to original state
          setSelectedSlot(null);
          setIsBookingMode(false);
        } else {
          // Handle error response
          alert("Failed to book appointment");
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
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

    // Organize appointments by date
    const appointmentsByDate = {};
    doctorAppointments.forEach((appointment) => {
      const [year, month, day, hour, minute] = appointment.slot;
      const dateKey = `${year}-${month}-${day}`;
      if (!appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey] = [];
      }
      appointmentsByDate[dateKey].push({
        hour,
        minute,
        appointmentId: appointment.appointment_id,
      });
    });

    // Sort dates
    const sortedDates = Object.keys(slotsByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Render availability table
    return sortedDates.map((dateKey) => {
      const slotsForDate = slotsByDate[dateKey];
      const appointmentsForDate = appointmentsByDate[dateKey] || [];

      return (
        <tr key={dateKey}>
          <td>{dateKey}</td>
          {Array.from({ length: 10 }, (_, index) => {
            const hour = Math.floor(index * 0.75) + 9;
            const minute = (index * 45) % 60;

            // Check if the slot is available
            const isAvailable = slotsForDate.some(
              (slot) => slot.hour === hour && slot.minute === minute
            );

            // Check if the slot is booked
            const appointment = appointmentsForDate.find(
              (app) => app.hour === hour && app.minute === minute
            );

            // Determine the cell class and text
            let cellClass;
            let cellText;

            if (appointment) {
              // If the slot is booked
              cellClass = "booked";
              cellText = "Booked";
            } else if (isAvailable) {
              // If the slot is available
              cellClass = "available-new clickable";
              cellText = "Available";
            } else {
              // If the slot is busy
              cellClass = "busy-new";
              cellText = "Busy";
            }

            return (
              <td
                key={index}
                className={cellClass}
                onClick={() => handleCellClick(dateKey, hour, minute)}
              >
                {cellText}
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
      <h2 style={{ textAlign: "center" }}>Available Hospitals</h2>
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
                                <th style={{ width: "150px" }}>Date</th>
                                {Array.from({ length: 10 }, (_, i) => i).map(
                                  (index) => {
                                    const hour = Math.floor(index * 0.75) + 9;
                                    const minute = (index * 45) % 60;
                                    return (
                                      <th key={index}>
                                        {hour < 10 ? "0" + hour : hour}:
                                        {minute === 0 ? "00" : minute}
                                      </th>
                                    );
                                  }
                                )}
                              </tr>
                            </thead> 
                            <tbody>
                              {doctorSlots && renderAvailability(doctorSlots)}
                            </tbody>
                          </table>
                          <button style={{margin:'5px'}}
                            className="doc-list-wala-button-new"
                            onClick={handleToggleBookingMode}
                          >
                            {isBookingMode ? "Go Back?" : "Book Appointment"}
                          </button>
                          {selectedSlot && (
                            <div>
                              {isBooking ? (
                                <p>Booking appointment, please wait...</p>
                              ) : (
                                <button style={{margin:'5px'}}
                                  className="doc-list-wala-button-new"
                                  onClick={handleBookAppointment}
                                >
                                  Lock Slot
                                </button>
                                
                              )}
                            </div>
                          )}
                        </>
                      )}
                      
                      {selectedDoctor !== doctor.id && (
                        <button style={{margin:'5px'}}
                          className="doc-list-wala-button-new busy-new"
                          onClick={() =>
                            handleViewSchedule(doctor, hospital.id)
                          }
                        >
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
              <button
                className="doc-list-wala-button-new"
                onClick={() => handleViewDoctors(hospital.id)}
              >
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
