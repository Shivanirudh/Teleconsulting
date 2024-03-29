import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import "../../css/Doctor/ddashboard.css";

export default function UploadSchedule() {
  // State for schedule data
  const [schedule, setSchedule] = useState({});
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle editing mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle cell click (toggle availability)
  const handleCellClick = (date, time) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [date]: {
        ...prevSchedule[date],
        [time]: !prevSchedule[date][time],
      },
    }));
  };

  // Function to generate schedule for the next 7 days
  const generateScheduleForNext7Days = () => {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, index) => {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + index);
      return nextDate.toISOString().split('T')[0];
    });

    const timeslots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];

    const scheduleForNext7Days = next7Days.reduce((acc, date) => {
      acc[date] = timeslots.reduce((acc2, time) => {
        acc2[time] = false; // All cells grey (unavailable) in upload mode
        return acc2;
      }, {});
      return acc;
    }, {});

    return scheduleForNext7Days;
  };

  const handleUpload = () => {
    const newSchedule = generateScheduleForNext7Days(); // Generate schedule for next 7 days
    setSchedule(newSchedule); // Set the schedule state
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
          <h2>This weeks Schedule</h2>
          <table className="table table-bordered custom-box">
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
              {Object.entries(schedule).map(([date, timeslots]) => (
                <tr key={date}>
                  <th scope="row">{date}</th>
                  {Object.entries(timeslots).map(([time, available]) => (
                    <td
                      key={`${date}-${time}`}
                      className={available ? 'table-success bg-success text-white' : 'table-secondary'}
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
            <button type="button" className="btn btn-success custom-button2" onClick={handleUpload}>
              Upload New Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
