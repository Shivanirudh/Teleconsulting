import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import "../../css/Doctor/ddashboard.css";

export default function UploadSchedule() {
  // Define dummy schedule data
  const dummySchedule = [
    { date: '2024-04-01', availability: ['available', 'available', 'booked', 'available', 'busy', 'busy', 'booked', 'available', 'available', 'available', 'booked'] },
    { date: '2024-04-02', availability: ['booked','busy','available','busy','available','busy','busy','available','booked','booked','booked'] },
    { date: '2024-04-03', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy'] },
    { date: '2024-04-04', availability: ['available','available','busy','busy','busy','available','available','booked','available','busy','available'] },
    { date: '2024-04-05', availability: ['busy','booked','available','busy','available','busy','busy','available','booked','booked','busy'] },
    { date: '2024-04-06', availability: ['available','busy','booked','busy','available','available','busy','booked','available','available','busy'] },
    { date: '2024-04-07', availability: ['busy','booked','available','busy','available','available','busy','booked','available','available','busy'] }
  ];

  // State for schedule data
  const [schedule, setSchedule] = useState([]);

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize schedule with dummy data
    setSchedule(dummySchedule);
  }, []);

  // Function to toggle editing mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle cell click (toggle availability)
  const handleCellClick = (dateIndex, timeIndex) => {
    const updatedSchedule = [...schedule];
    const cellValue = updatedSchedule[dateIndex].availability[timeIndex];

    if (isEditing && cellValue !== 'booked') {
      updatedSchedule[dateIndex].availability[timeIndex] =
        cellValue === 'available' ? 'busy' : 'available';
      setSchedule(updatedSchedule);
    }
  };

  // Function to generate schedule table rows
  const generateScheduleRows = () => {
    return schedule.map((item, dateIndex) => (
      <tr key={item.date}>
        <th scope="row">{item.date}</th>
        {item.availability.map((availability, timeIndex) => (
          <td
            key={`${item.date}-${timeIndex}`}
            className={getClassForAvailability(availability)}
            onClick={() => handleCellClick(dateIndex, timeIndex)}
          ></td>
        ))}
      </tr>
    ));
  };

  // Function to get CSS class for cell based on availability
  const getClassForAvailability = (availability) => {
    switch (availability) {
      case 'available':
        return 'table-success bg-success text-white';
      case 'booked':
        return 'table-warning bg-warning text-dark';
      case 'busy':
        return 'table-danger bg-danger text-white';
      default:
        return '';
    }
  };

  // Function to handle upload new schedule
  const handleUpload = () => {
    const newSchedule = dummySchedule.map(item => ({
      ...item,
      availability: Array(item.availability.length).fill('busy')
    }));
    setSchedule(newSchedule);
    setIsEditing(true);
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
                <th>9:00 AM</th>
                <th>10:00 AM</th>
                <th>11:00 AM</th>
                <th>12:00 PM</th>
                <th>01:00 PM</th>
                <th>02:00 PM</th>
                <th>03:00 PM</th>
                <th>04:00 PM</th>
                <th>05:00 PM</th>
                <th>06:00 PM</th>
                <th>07:00 PM</th>
              </tr>
            </thead>
            <tbody>
              {generateScheduleRows()}
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
            <button type="button" className="btn btn-success custom-button2" onClick={handleUpload}>
              Upload New Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
