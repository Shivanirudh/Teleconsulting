import React, { useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function UploadSchedule() {
  // Function to generate dates for the next 5 day
  const getNextDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Initial state for schedule grid
  const initialScheduleData = getNextDates().map(date => ({
    date,
    slots: Array.from({ length: 16 }, (_, index) => ({
      startTime: index,
      isClicked: false,
      isHovered: false,
    })),
  }));

  // State to manage the modal visibility and selected slot
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);

  // Function to handle hover on a slot
  const handleSlotHover = (date, slotIndex, isHovered) => {
    const updatedData = scheduleData.map(dateData => {
      if (dateData.date === date) {
        return {
          ...dateData,
          slots: dateData.slots.map((slot, index) =>
            index === slotIndex ? { ...slot, isHovered } : slot
          ),
        };
      }
      return dateData;
    });

    setScheduleData(updatedData);
  };

  // Function to handle click on a slot
  const handleSlotClick = (date, slotIndex) => {
    const updatedData = scheduleData.map(dateData => {
      if (dateData.date === date) {
        return {
          ...dateData,
          slots: dateData.slots.map((slot, index) =>
            index === slotIndex ? { ...slot, isClicked: !slot.isClicked, isHovered: false } : slot
          ),
        };
      }
      return dateData;
    });

    setScheduleData(updatedData);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Function to handle submitting the schedule
  const handleSubmitSchedule = () => {
    // Implement your logic for submitting the schedule
    // You can access the selected slots using the scheduleData state
    const selectedSlots = scheduleData.flatMap(dateData =>
      dateData.slots.filter(slot => slot.isClicked)
    );
    console.log('Selected Slots:', selectedSlots);

    // Reset the state or perform any additional actions as needed
    setScheduleData(initialScheduleData);
    setModalVisible(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Scheduler</h2>

      <table className="table table-bordered mx-auto">
        <thead>
          <tr>
            <th>Date</th>
            {scheduleData[0]?.slots.map((slot, index) => (
              <th key={index} className="text-center">
                {slot.startTime}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData.map(dateData => (
            <tr key={dateData.date}>
              <td className="font-weight-bold">{dateData.date}</td>
              {dateData.slots.map((slot, index) => (
                <td
                  key={`${dateData.date}-${slot.startTime}`}
                  className={`text-center ${
                    slot.isClicked ? 'bg-success' : slot.isHovered ? 'bg-warning' : 'bg-secondary'
                  }`}
                  onMouseEnter={() => handleSlotHover(dateData.date, index, true)}
                  onMouseLeave={() => handleSlotHover(dateData.date, index, false)}
                  onClick={() => handleSlotClick(dateData.date, index)}
                >
                  {/* Render nothing inside the cell */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleSubmitSchedule}>
          Upload Schedule
        </button>
      </div>

      {/* Modal for displaying selected slot details */}
      {selectedSlot && (
        <div className={`modal ${modalVisible ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: modalVisible ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selected Slot Details</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* You can display details of the selected slots here */}
                {selectedSlot && (
                  <>
                    <p>Date: {selectedSlot.date}</p>
                    <p>Time: {`${selectedSlot.startTime} - ${selectedSlot.endTime}`}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
