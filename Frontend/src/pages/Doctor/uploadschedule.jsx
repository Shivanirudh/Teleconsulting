import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import "../../css/Doctor/ddashboard.css";
import config from '../../Config';

export default function UploadSchedule() {
  // Function to generate time slots with 45-minute intervals

  const generateTimeSlots = () => {
    const startTime = 9 * 60; // 9:00 AM in minutes
    const endTime = 19 * 60 ; // 5:15 PM in minutes
    const interval = 60; // 45 minutes interval
    const timeSlots = [];

    for (let i = startTime; i <= endTime; i += interval) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes === 0 ? '00' : minutes}`;
      timeSlots.push(formattedTime);
    }

    return timeSlots;
  };

  // const [request_body, setRequestBody] = useState(() => new Set());

  const [requestBody, setRequestBody] = useState([]);


  // Dummy schedule data (replace with your actual data source)
  // const dummySchedule = {
  //   "slots": [
  //     [2024, 4, 5, 11, 15],
  //     [2024, 4, 6, 15, 45],
  //     [2024, 4, 7, 15, 0],
  //     [2024, 4, 6, 15, 45],
  //     [2024, 4, 5, 15, 0]
  //   ],
  //   "appointments": [
  //     { id: 1, datetime: [2024,4,5,9,0], patientName: 'John Doe' },
  //     { id: 2, datetime: [2024,4,6,10,30], patientName: 'somebody someone' },
  //     { id: 3, datetime: [2024,4,7,11,15], patientName: 'Alice Smith' },
  //     { id: 5, datetime: [2024,4,6,9,0], patientName: 'John Doe' },
  //   ]
  // };


  const fetchData = async () => {
    try{
      // Retrieve token from local storage
      const token = localStorage.getItem('token');

      // Make API request to fetch appointments
      const response = await fetch(`${config.apiUrl}/api/v1/doctor/schedule`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      // console.log(JSON.stringify(data, null, 2));
      return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return null;
  }
  };

  const updateSchedule = async (slotData) => {
    try{
      // Retrieve token from local storage
      const token = localStorage.getItem('token');
      console.log(slotData);
      const content = {
        "slot":slotData,
      }
      console.log(content);
      console.log(JSON.stringify(content));
      // console.log(JSON.stringify(body, null, 2));
      // Make API request to fetch appointments
      const response = await fetch(`${config.apiUrl}/api/v1/doctor/schedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Add quotes around the header value
        },
        body: JSON.stringify(content),
        
      });

      if (!response.ok) {
        throw new Error('Failed to update appointments');
      }
      console.log(response.ok);
      // console.log(response.json());
      const data = await response.message;
      console.log(response.status);
      console.log(data);
      // console.log(JSON.stringify(data, null, 2));
      // return data;
  } catch (error) {
    console.error('Error updating appointments:', error);
    // return null;
  }
  };

  const initialSchedule = () => {
    console.log(1);
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() + index);
      return date.toLocaleDateString('en-US');
    });

    const timeSlots = generateTimeSlots();

    const schedule = next7Days.reduce((acc, date) => {
      acc[date] = timeSlots.reduce((acc2, time) => {
        acc2[time] = [false, 0]; // All slots initially unavailable
        return acc2;
      }, {});
      return acc;
    }, {});
    fetchData().then((data) => {
      console.log(1.5);
      // console.log(JSON.stringify(data, null, 2));
      // This code will run after fetchData is completed
      console.log(data.slots.length);
      data.slots.forEach(slot => {
        const [year, month, day, hour, minute] = slot;
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minute === 0 ? '00' : minute}`;
        if (schedule[formattedDate] && schedule[formattedDate][formattedTime] !== undefined) {
          schedule[formattedDate][formattedTime] = [true, 0]; // Set slot to available
        }
        let d = new Date(year, month-1, day, hour, minute);
        let sdate = d.toISOString();
        sdate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
        sdate = sdate.slice(0, 16) + ':00';
        
        // console.log(slot, sdate);
        // request_body.push(sdate);
        // console.log("pre", sdate, requestBody);
        setRequestBody(prevState => [...prevState, sdate]);
        // console.log("post", requestBody);
        // addItem(sdate);
        // console.log("slot", requestBody.length);
        // }
      });
      // console.log(requestBody);
      console.log('fetchData slots completed');
      console.log(data.appointments.length)
      data.appointments.forEach(appointment => {
        const [year, month, day, hour, minute] = appointment.slot;
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minute === 0 ? '00' : minute}`;
        if (schedule[formattedDate] && schedule[formattedDate][formattedTime] !== undefined) {
          schedule[formattedDate][formattedTime][0] = 'appointment'; // Set appointment slot
          schedule[formattedDate][formattedTime][1] += 1; 
        }
        let d = new Date(year, month-1, day, hour, minute);
        let sdate = d.toISOString();
        sdate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
        sdate = sdate.slice(0, 16) + ':00';

        // console.log(appointment.slot, sdate);
        // request_body.push(sdate);
        // console.log("pre", sdate, requestBody);
        setRequestBody(prevState => [...prevState, sdate]);
        // console.log("post", requestBody);
        // addItem(sdate);
        // console.log("appointment", requestBody.length);

        // }
      });
      // setRequestBody([...new Set(request_body)]);
      console.log('fetchData completed');
      // console.log(requestBody.length, requestBody);
      setSchedule(schedule);

    }).catch((error) => {
      console.log(2);
      console.error('Error in fetchData:', error);
    });
    // console.log(JSON.stringify(dummySchedule, null, 2));
    // console.log(JSON.stringify(schedule, null, 2));

    // return schedule;
    console.log(3);
  };

  // State for schedule data
  const [schedule, setSchedule] = useState(null);
  

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);

  // State for showing saving data
  const [showSavingIndicator, setShowSavingIndicator] = useState(false);

  // Function to toggle editing mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle cell click (toggle availability)
  const handleCellClick = (date, time) => {
    console.log(requestBody);
    if (isEditing) {
      if (schedule[date][time][0] === true) {
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          [date]: {
            ...prevSchedule[date],
            [time]: [false, 0],
          },
        }));
        // dup = [...request_body];
        let d = new Date(date + ' ' + time);
        let sdate = d.toISOString();
        sdate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
        sdate = sdate.slice(0, 16) + ':00';

        console.log(sdate);
        setRequestBody(requestBody.filter(item => item !== sdate));
        // removeItem(sdate);
      } else if(schedule[date][time][0] === false){
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          [date]: {
            ...prevSchedule[date],
            [time]: [true, 0],
          },
        }));
        // dup = [...request_body];
        let d = new Date(date + ' ' + time);
        let sdate = d.toISOString();
        sdate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
        sdate = sdate.slice(0, 16) + ':00';

        setRequestBody(prevState => [...prevState, sdate]);
        // removeItem(sdate);
      }
      else {
        const confirmed = window.confirm('You are about to cancel an appointment. Are you sure?');
        if (confirmed) {
          setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [date]: {
              ...prevSchedule[date],
              [time]: [false, 0],
            },
          }));
          // var dup = [...request_body];
          let d = new Date(date + ' ' + time);
          let sdate = d.toISOString();
          sdate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
          sdate = sdate.slice(0, 16) + ':00';

          console.log(sdate);
          setRequestBody(requestBody.filter(item => item !== sdate));
        }
      }
      console.log(requestBody);
      console.log(requestBody.length);
    }
  };

  // Function to generate empty schedule (for upload mode)
  // const generateEmptySchedule = () => {
  //   const next7Days = Object.keys(schedule);
  //   const timeSlots = generateTimeSlots();

  //   const emptySchedule = next7Days.reduce((acc, date) => {
  //     acc[date] = timeSlots.reduce((acc2, time) => {
  //       acc2[time] = false; // All slots initially unavailable
  //       return acc2;
  //     }, {});
  //     return acc;
  //   }, {});

  //   return emptySchedule;
  // };

  // const handleUpload = () => {
  //   setSchedule(generateEmptySchedule()); // Reset schedule to empty for upload
  //   setIsEditing(true); // Enable editing mode for upload
  // };

  // // Function to simulate saving the schedule (replace with actual logic)
  const handleSubmit = async () => {
    // alert('Saving schedule...');
    setShowSavingIndicator(true);

    // Replace with your actual saving logic (e.g., API call)
    // This example simulates a successful save after 2 seconds
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(requestBody);
    console.log(requestBody.length);
    updateSchedule(requestBody).then(() => {
      // console.log(data);
      console.log('updateSchedule success');
    }).catch((error) => {
      console.error('Error in updateSchedule:', error);
    });
    setShowSavingIndicator(false);

    setIsEditing(false); // Reset edit mode after successful save
  };

  useEffect(() => {
    initialSchedule();
  }, []);


  return (
    <div className='dashboard-container'>
      <Navbar />
      <div className= 'dashboard-content'>
        <SideNavbar />
        <div className="main-content">
          <h2>This week's Schedule</h2>
          {showSavingIndicator && (
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                zIndex: '9999',
              }}
            >
              Saving...
            </div>
          )}
            {schedule == null ? <div>Loading...</div> :
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
                // console.log(date, JSON.stringify(timeslots, null, 2)),
                // console.log(request_body),
                <tr key={date}>
                  <th scope="row">{date}</th>
                  {Object.entries(timeslots).map(([time, availability]) => (
                    // console.log(date, time, {timeslots}, timeslots, availability, {availability}, timeslots[time]),
                    <td
                      key={`${date}-${time}`}
                      className={
                        availability[0] === true ? 'table-success bg-success text-white' :
                        availability[0] === 'appointment' ? 'table-danger bg-danger text-white' :
                        'table-secondary bg-secondary'
                      }
                      onClick={() => (isEditing ? handleCellClick(date, time) : null)}
                    >
                      {isEditing ? '' : time} <br></br>
                      Cnt: { availability[1] }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          }

          <button type="button" className="btn btn-primary custom-button" onClick={handleEdit}>
            {isEditing ? 'Cancel' : 'Edit Schedule'}
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
