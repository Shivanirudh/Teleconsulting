import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/Patient/Pchats.css";
import SockJS from "sockjs-client";
import useScript from "../../components/useScript";
import config from "./../../Config";
import axios from "axios";



const VideoChannel = () => {
  const { state } = useLocation();
  let globalSelectedAppointment = null;

  // Initialize the global variable with the selected appointment from the state
  if (state && state.selectedAppointment) {
    globalSelectedAppointment = state.selectedAppointment;
  }

  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
  );

  // State variables
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queueMessage, setQueueMessage] = useState(null);

  const navigate = useNavigate();

  // Fetch the documents from the API
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const response = await axios.get(
        "http://localhost:8081/api/v1/patient/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocuments(response.data); // Update the state with the documents data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
  );
  useEffect(() => {
    // Initialize variables and elements
    console.log(globalSelectedAppointment);
    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");
    const localIdInp = document.getElementById("localId");
    const connectBtn = document.getElementById("connectBtn");
    const callBtn = document.getElementById("callBtn");
    const testConnection = document.getElementById("testConnection");
    const appointmentInput = document.getElementById("appointment");
    const meetingInput = document.getElementById("meeting");
    const userTypeInput = document.getElementById("userType");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const disconnectbutton = document.getElementById("disconnect-button");

    let localStream;
    let remoteStream;
    let localPeer;
    let localID;
    let stompClient;
    let userType;
    let meetingId;
    let appointmentId;

    const authToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtZS5wcmFzaGFudGpuQGdtYWlsLmNvbSIsImlhdCI6MTcxMjY1NjcyMiwiZXhwIjoxNzEyNzQzMTIyfQ.MnlOktvWFabiCHbeWNZX62Mfb_gnSSOey9YbGndlGAc";

    // ICE Server Configurations
    const iceServers = {
      iceServer: {
        urls: "stun:stun.l.google.com:19302",
      },
    };

    localPeer = new RTCPeerConnection(iceServers);

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream = stream;
        localVideo.srcObject = stream;
        // Access granted, stream is the webcam stream
      })
      .catch((error) => {
        // Access denied or error occurred
        console.log(error);
      });

      document.addEventListener("DOMContentLoaded", function() {
        var goBackButton = document.getElementById("go-back-button");
        goBackButton.addEventListener("click", function() {
            window.location.href = "http://localhost/patientdashboard";
        });
    });

    // Function to handle connecting to the WebSocket server
    const connectToWebSocket = () => {
      // Connect to Websocket Server
      const socket = new SockJS(`${config.apiUrl}/websocket`, {
        debug: false,
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      stompClient = window.Stomp.over(socket);
      console.log(globalSelectedAppointment['patient_id']['patient_id'] );
      localID = globalSelectedAppointment['patient_id']['patient_id'] ;
      appointmentId = globalSelectedAppointment['appointment_id'];
      meetingId = globalSelectedAppointment['meeting_link'];
      userType = "PATIENT";

      // localID = localIdInp.value || "P1";
      // appointmentId = appointmentInput.value || "AP1";
      // meetingId = meetingInput.value || "b62d0623-18b7-422d-bf53-b3473d88699f";
      // userType = userTypeInput.value || "PATIENT";

      stompClient.connect({}, (frame) => {
        // Subscribe to testing URL not very important
        stompClient.subscribe("/topic/testServer", function (test) {
          console.log("Received: " + test.body);
        });

        // Subscribe to '/user/{localID}/topic/call' topic
        stompClient.subscribe("/user/" + localID + "/topic/call", (call) => {
          localPeer.ontrack = (event) => {
            // Setting Remote stream in remote video element
            remoteVideo.srcObject = event.streams[0];
          };

          localPeer.onicecandidate = (event) => {
            if (event.candidate) {
              const candidate = {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.candidate,
              };
              stompClient.send(
                "/app/candidate",
                {},
                JSON.stringify({
                  meetingId: meetingId,
                  userId: localID,
                  candidate: candidate,
                })
              );
            }
          };

          // Adding audio and video local peer
          localStream.getTracks().forEach((track) => {
            localPeer.addTrack(track, localStream);
          });

          localPeer.createOffer().then((description) => {
            localPeer.setLocalDescription(description);
            stompClient.send(
              "/app/offer",
              {},
              JSON.stringify({
                meetingId: meetingId,
                userId: localID,
                offer: description,
              })
            );
          });
        });

        // Subscribe to the 'offer' topic
        stompClient.subscribe("/user/" + localID + "/topic/offer", (offer) => {
          const o = JSON.parse(offer.body).offer;
          localPeer.ontrack = (event) => {
            remoteVideo.srcObject = event.streams[0];
          };
          localPeer.onicecandidate = (event) => {
            if (event.candidate) {
              const candidate = {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.candidate,
              };
              stompClient.send(
                "/app/candidate",
                {},
                JSON.stringify({
                  meetingId: meetingId,
                  userId: localID,
                  candidate: candidate,
                })
              );
            }
          };

          // Adding audio and video local peer
          localStream.getTracks().forEach((track) => {
            localPeer.addTrack(track, localStream);
          });

          localPeer.setRemoteDescription(new RTCSessionDescription(o));
          localPeer.createAnswer().then((description) => {
            localPeer.setLocalDescription(description);
            stompClient.send(
              "/app/answer",
              {},
              JSON.stringify({
                meetingId: meetingId,
                userId: localID,
                answer: description,
              })
            );
          });
        });

        // Subscribe to the 'answer' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/answer",
          (answer) => {
            const o = JSON.parse(answer.body).answer;
            localPeer.setRemoteDescription(new RTCSessionDescription(o));
          }
        );

        // Subscribe to the 'candidate' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/candidate",
          (answer) => {
            const o = JSON.parse(answer.body).candidate;
            const iceCandidate = new RTCIceCandidate({
              sdpMLineIndex: o.label,
              candidate: o.id,
            });
            localPeer.addIceCandidate(iceCandidate);
          }
        );

        // Subscribe to the '/user/{localID}/topic/message' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/message",
          (message) => {
            const msg = JSON.parse(message.body).message;
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", "other-side");
            messageElement.textContent = msg;
            document.getElementById("messageBox").appendChild(messageElement);
          }
        );
        
        // Subscribe to the '/user/{localID}/topic/disconnect' topic
		stompClient.subscribe("/user/" + localID + "/topic/disconnect", () => {
			console.log('Received disconnection notification from server');
			// Close the WebSocket connection on patient's side
			stompClient.disconnect(() => {
				console.log('WebSocket connection closed due to disconnection of doctor');
			});
			navigate("/patientdashboard");
		});
		
		// Subscribe to the '/user/{localID}/topic/queueNumber' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/queueNumber",
          (message) => {
          	console.log(message.body);
  			setQueueMessage(message.body);
            const msg = JSON.parse(message.body).message;
            const messageElement = document.createElement("div");
            console.log(msg);
            //messageElement.classList.add("message", "other-side");
            messageElement.textContent = msg;
            document.getElementById("queue-number").appendChild(messageElement);
          }
        );

        // Send a message to add the user
        stompClient.send(
          "/app/addUser",
          {},
          JSON.stringify({
            userId: localID,
            appointmentId: appointmentId,
            meetingId: meetingId,
            userType: userType,
          })
        );
       
      });
    };
    
    

    // Handle the call button click event
    const handleCall = () => {
      stompClient.send(
        "/app/call",
        { Authorization: "Bearer " + authToken },
        JSON.stringify({
          meetingId: meetingId,
          userId: localID,
        })
      );
    };

    // Handle the test connection button click event
    const handleTestConnection = () => {
      stompClient.send(
        "/app/testServer",
        { Authorization: "Bearer " + authToken },
        "Testing Connectivity"
      );
    };

    // Handle send button click event
    const handleSend = () => {
      const myMessage = messageInput.value;
      if (myMessage) {
        stompClient.send(
          "/app/message",
          {},
          JSON.stringify({
            userId: localID,
            meetingId: meetingId,
            message: myMessage,
          })
        );
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "my-side");
        messageElement.textContent = myMessage;
        document.getElementById("messageBox").appendChild(messageElement);
        messageInput.value = "";
      }
    };
    
    // Handle disconnect button click event
    const handleDisconnect = () => {
    	stompClient.send(
		"/app/disconnect",
		{},
		JSON.stringify({
		  userId: localID,
		  meetingId: meetingId,
		})
	  );
	  stompClient.disconnect(() => {
		console.log('WebSocket connection closed');
	  });
	  
	  // Stop the local video stream
	  localStream.getTracks().forEach(track => {
		track.stop();
	  });

	  // Set the remote video source to null to stop streaming
	  remoteVideo.srcObject = null;
	  //Add navigate code
	  navigate("/patientdashboard");
    }

    // Event listeners
    connectBtn.addEventListener("click", connectToWebSocket);
    callBtn.addEventListener("click", handleCall);
    testConnection.addEventListener("click", handleTestConnection);
    sendBtn.addEventListener("click", handleSend);
    disconnectbutton.addEventListener("click", handleDisconnect);

    // Clean up function
    return () => {
      // Remove event listeners
      connectBtn.removeEventListener("click", connectToWebSocket);
      callBtn.removeEventListener("click", handleCall);
      testConnection.removeEventListener("click", handleTestConnection);
      sendBtn.removeEventListener("click", handleSend);
      disconnectbutton.removeEventListener("click", handleDisconnect);

      // Clean up other resources if necessary
    };
  }, []);

  return (
    <div className="video-chat-page">
    <div className="video-and-form-container">
      <div className="video-container">
        <div className="big-video">
          {/* Local video container */}
          <div className="local-video">
            <video id="localVideo" autoPlay muted></video>
          </div>
  
          {/* Remote video 1 container (on top of local video) */}
          <div className="remote-video">
            <video id="remoteVideo" autoPlay></video>
          </div>
  
          {/* Remote video 2 container (on top of local video) */}

        </div>
      </div>
      <div className="form-container">
<button id="connectBtn" class="custom-button">Connect</button>
<button id="callBtn" class="custom-button">Call</button>
<button id="testConnection" class="custom-button">Test Connection</button>
<button id="disconnect-button" class="custom-button">Disconnect</button>

      </div>
    </div>
  
    <div className="info-container">
      <div className="doctor-details">
        {/* Display doctor's name */}
        <h3>Doctor Details</h3>
        <p>
          Name: {globalSelectedAppointment.doctor_id.first_name}{" "}
          {globalSelectedAppointment.doctor_id.last_name}
        </p>
  
        {/* Display doctor's specialization */}
        <p>
          Specialization: {globalSelectedAppointment.doctor_id.specialization}
        </p>
  
        {/* Display hospital name */}
        <p>Hospital: {globalSelectedAppointment.doctor_id.hospital.name}</p>
      </div>
  	  <div id="queue-number">Queue Number: {queueMessage}</div>
      <div className="document-table">
        <h3>Documents</h3>
        <ul>
          {documents.map((document, index) => (
            <li key={index}>{document}</li>
          ))}
        </ul>
      </div>
  
      <div className="chat-window">
        {/* Chat window */}
        <h3>Chat</h3>
        <div id="messageBox"></div>
        <input
          type="text"
          id="messageInput"
          placeholder="Type your message here..."
        />
        <button className="custom-button" id="sendBtn">Send</button>
      </div>
    </div>
  </div>
    );
  
};

export default VideoChannel;
