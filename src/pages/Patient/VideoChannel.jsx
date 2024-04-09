import React from 'react';
import '../../css/Patient/VideoChannel.css';

const VideoChannel = () => {
  return (
    <div className="video-chat-page">
      <div className="video-container">
        {/* Big video container for other side */}
        <div className="big-video">
          {/* Video stream of other side */}
          Big Video Placeholder
        </div>
        {/* Small video container for own video */}
        <div className="small-video">
          {/* Video stream of own video */}
          Small Video Placeholder
        </div>
      </div>
      <div className="info-container">
        <div className="doctor-details">
          {/* Small window of doctor details */}
          <h3>Doctor Details</h3>
          <p>Name: Dr. John Doe</p>
          <p>Specialization: Cardiologist</p>
          <p>Location: City, Country</p>
        </div>
        <div className="document-table">
          <h3>Document List</h3>
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Document 1</td>
                <td>
                  {/* Download button */}
                  <button className='rambo-but'>Download</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VideoChannel;
