import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const VideoCall = () => {
  const [localStream, setLocalStream] = useState(null);

  // Handle user media access (simplified)
  useEffect(() => { 
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // Get only video
      .then(stream => setLocalStream(stream))
      .catch(error => console.error('Error accessing user media:', error));
  }, []); 

  return (
    <div className="video-call-container d-flex h-100 w-100"> 
      {/* Main "remote" stream simulation */}
      <div className="dummy-video-container flex-grow-1 d-flex justify-content-center align-items-center bg-dark">
        {/* Optional 'Loading' or other placeholder message */}
        <p className="text-muted">Pretending to be connected...</p> 
      </div>

      {/* Small local stream preview */}
      <div className="local-video-container position-absolute bottom-0 right-0 m-3">
        {localStream && (
          <video
            ref={(videoEl) => (videoEl.srcObject = localStream)}
            autoPlay
            muted 
            className="local-video rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default VideoCall;
