import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import "../../css/Doctor/ddashboard.css";

export default function UploadSchedule() {
  // Function to generate time slots with 45-minute intervals
  const generateTimeSlots = () => {
    const startTime = 9 * 60; // 9:00 AM in minutes
    const endTime = 17 * 60 + 15; // 5:15 PM in minutes
    const interval = 45; // 45 minutes interval
    const timeSlots = [];

    for (let i = startTime; i <= endTime; i += interval) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes === 0 ? '00' : minutes}`;
      timeSlots.push(formattedTime);
    }

    return timeSlots;
  };

  // Dummy schedule data (replace with your actual data source)
  const dummySchedule = {
    "slots": [
      [2024, 4, 5, 11, 15],
      [2024, 4, 6, 15, 45],
      [2024, 4, 7, 15, 0],
      [2024, 4, 6, 15, 45],
      [2024, 4, 5, 15, 0]
    ],
    "appointments": [
      { id: 1, datetime: [2024,4,5,9,0], patientName: 'John Doe' },
      { id: 2, datetime: [2024,4,6,10,30], patientName: 'somebody someone' },
      { id: 3, datetime: [2024,4,7,11,15], patientName: 'Alice Smith' },
      { id: 5, datetime: [2024,4,6,9,0], patientName: 'John Doe' },
    ]
  };

  const initialSchedule = () => {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() + index);
      return date.toLocaleDateString('en-US');
    });

    const timeSlots = generateTimeSlots();

    const schedule = next7Days.reduce((acc, date) => {
      acc[date] = timeSlots.reduce((acc2, time) => {
        acc2[time] = false; // All slots initially unavailable
        return acc2;
      }, {});
      return acc;
    }, {});

    dummySchedule.slots.forEach(slot => {
      const [year, month, day, hour, minute] = slot;
      const date = new Date(year, month - 1, day);
      const formattedDate = date.toLocaleDateString('en-US');
      const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minute === 0 ? '00' : minute}`;
      if (schedule[formattedDate] && schedule[formattedDate][formattedTime] !== undefined) {
        schedule[formattedDate][formattedTime] = true; // Set slot to available
      }
    });

    dummySchedule.appointments.forEach(appointment => {
      const [year, month, day, hour, minute] = appointment.datetime;
      const date = new Date(year, month - 1, day);
      const formattedDate = date.toLocaleDateString('en-US');
      const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minute === 0 ? '00' : minute}`;
      if (schedule[formattedDate] && schedule[formattedDate][formattedTime] !== undefined) {
        schedule[formattedDate][formattedTime] = 'appointment'; // Set appointment slot
      }
    });

    return schedule;
  };

  // State for schedule data
  const [schedule, setSchedule] = useState(initialSchedule());

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle editing mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle cell click (toggle availability)
  const handleCellClick = (date, time) => {
    if (isEditing) {
      if (schedule[date][time] === 'appointment') {
        const confirmed = window.confirm('You are about to cancel an appointment. Are you sure?');
        if (confirmed) {
          setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [date]: {
              ...prevSchedule[date],
              [time]: false,
            },
          }));
        }
      } else {
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          [date]: {
            ...prevSchedule[date],
            [time]: !prevSchedule[date][time],
          },
        }));
      }
    }
  };

  // Function to generate empty schedule (for upload mode)
  const generateEmptySchedule = () => {
    const next7Days = Object.keys(schedule);
    const timeSlots = generateTimeSlots();

    const emptySchedule = next7Days.reduce((acc, date) => {
      acc[date] = timeSlots.reduce((acc2, time) => {
        acc2[time] = false; // All slots initially unavailable
        return acc2;
      }, {});
      return acc;
    }, {});

    return emptySchedule;
  };

  const handleUpload = () => {
    setSchedule(generateEmptySchedule()); // Reset schedule to empty for upload
    setIsEditing(true); // Enable editing mode for upload
  };

  // Function to simulate saving the schedule (replace with actual logic)
  const handleSubmit = async () => {
    alert('Saving schedule...');

    // Replace with your actual saving logic (e.g., API call)
    // This example simulates a successful save after 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsEditing(false); // Reset edit mode after successful save
  };

  return (
    <div className='dashboard-container'>
      <Navbar />
      <div className= 'dashboard-content'>
        <SideNavbar />
        <div className="main-content">
          <h2>This week's Schedule</h2>
          <table className="table table-bordered custom-box khus">
            <thead>
              <tr>
                <th></th>
                {generateTimeSlots().map(time => (
                  <th key={time}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(schedule).map(([date, timeslots]) => (
                <tr key={date}>
                  <th scope="row">{date}</th>
                  {Object.entries(timeslots).map(([time, availability]) => (
                    <td
                      key={`${date}-${time}`}
                      className={
                        availability === true ? 'table-success bg-success text-white' :
                        availability === 'appointment' ? 'table-danger bg-danger text-white' :
                        'table-secondary bg-secondary'
                      }
                      onClick={() => (isEditing ? handleCellClick(date, time) : null)}
                    >
                      {isEditing ? '' : time}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" className="btn btn-primary custom-button" onClick={handleEdit}>
            {isEditing ? 'Cancel Edit' : 'Edit Schedule'}
          </button>
          {isEditing ? (
            <button type="button" className="btn btn-primary custom-button" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <div/>)}
        </div>
      </div>
    </div>
  );
}
