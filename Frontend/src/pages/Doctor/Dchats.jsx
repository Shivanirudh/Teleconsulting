// DocChat.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import SockJS from "sockjs-client";
import "../../css/Doctor/Dchats.css";
import useScript from "../../components/useScript";
import config from './../../Config'
import axios from "axios";


const DocChat = () => {
  const { state } = useLocation();
  let globalSelectedAppointment = null;

  if (state && state.selectedAppointment) {
    globalSelectedAppointment = state.selectedAppointment;
  }
  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
  );

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consents, setConsents] = useState([]);

  const navigate = useNavigate();
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      fetch(`http://localhost:8081/api/v1/doctor/fetch-files/${globalSelectedAppointment.patient_id.patient_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setDocuments(data);
      })
      .catch((error) => console.error('Error fetching documents:', error));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsents = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/consent`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setConsents(data);
      })
      .catch((error) => console.error('Error fetching consents:', error));
  };

  useEffect(() => {
    fetchDocuments();
    fetchConsents();
  }, []);

  useEffect(() => {
    // Initialize variables and elements
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
    const nextbutton = document.getElementById("next-button");

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

      // localID = localIdInp.value || "D1";
      // appointmentId = appointmentInput.value || "AP1";
      // meetingId = meetingInput.value || "b62d0623-18b7-422d-bf53-b3473d88699f";
      // userType = userTypeInput.value || "DOCTOR";

      console.log(globalSelectedAppointment['doctor_id']['doctor_id'] );
      localID = globalSelectedAppointment['doctor_id']['doctor_id']  ;
      appointmentId = globalSelectedAppointment['appointment_id'];
      meetingId = globalSelectedAppointment['meeting_link'];
      userType = "DOCTOR";

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
          console.log(o);
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
			// Close the WebSocket connection on doctor's side
			stompClient.disconnect(() => {
				console.log('WebSocket connection closed due to disconnection of doctor');
			});
			//window.location.reload();
			//console.log('WebSocket connection closed due to disconnection of doctor');
			navigate("/ddashboard");
		});
		
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
        
		// Subscribe to the '/user/{localID}/topic/queueNumber' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/queueNumber",
          (message) => {
            const msg = JSON.parse(message.body).message;
            const messageElement = document.createElement("div");
            //messageElement.classList.add("message", "other-side");
            messageElement.textContent = msg;
            document.getElementById("queue-number").appendChild(messageElement);
          }
        );
        
        // Subscribe to the '/user/{localID}/topic/next' topic
		stompClient.subscribe("/user/" + localID + "/topic/next", (message) => {
		  // Handle the message received from the server (notification about next patient)
		  const msg = JSON.parse(message.body).message;
		  console.log("Notification about next patient:", msg);
		  
		});
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
	  
	  navigate("/ddashboard");
    }
    
    // Handle next button click event
    const handleNextPatient = () => {
	  stompClient.send(
		"/app/next",
		{},
		JSON.stringify({
		  userId: localID,
		  meetingId: meetingId,
		})
	  );
	};

    // Event listeners
    connectBtn.addEventListener("click", connectToWebSocket);
    callBtn.addEventListener("click", handleCall);
    testConnection.addEventListener("click", handleTestConnection);
    sendBtn.addEventListener("click", handleSend);
    disconnectbutton.addEventListener("click", handleDisconnect);
	nextbutton.addEventListener("click", handleNextPatient);
	
    // Clean up function
    return () => {
      // Remove event listeners
      connectBtn.removeEventListener("click", connectToWebSocket);
      callBtn.removeEventListener("click", handleCall);
      testConnection.removeEventListener("click", handleTestConnection);
      sendBtn.removeEventListener("click", handleSend);
      disconnectbutton.removeEventListener("click", handleDisconnect);
	  nextbutton.removeEventListener("click", handleNextPatient);
      // Clean up other resources if necessary
    };
  }, []);

  const handleUploadPrescription = (prescriptionData) => {
    console.log("Prescription Data:", prescriptionData);
    fetch("https://example.com/uploadPrescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prescriptionData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Prescription uploaded successfully");
        } else {
          console.error("Failed to upload prescription");
        }
      })
      .catch((error) => {
        console.error("Error uploading prescription:", error);
      });
  };

  const handleConsent = (documentName) => {
    alert(`Consent requested for document: ${documentName}`);
  };

  const handleView= (documentName) => {
    // event.preventDefault();
    // Simulate download for demonstration (replace with actual download logic)
    // setSelectedDocument(documentName);

    var reqID = null;
    consents.forEach((consent) => {
      if(consent.patient_id.patient_id === globalSelectedAppointment.patient_id.patient_id && documentName === consent.document_name){
        reqID = consent.consent_id;
      }
    });
    if(!reqID){
      alert("You do not have access to this document. Please request consent");
    }
    else{
      
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/v1/doctor/consent/${reqID}/patient/${globalSelectedAppointment.patient_id.patient_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          console.log(fileURL);
          // Triggering download directly
          // const link = document.createElement('a');
          // link.href = fileURL;
          // link.setAttribute('download', documentName);
          // document.body.appendChild(link);
          // link.click();

          // Open file in new tab
          window.open(fileURL, '_blank');
          // Cleanup
          URL.revokeObjectURL(fileURL);
        })
        .catch((error) => console.error('Error fetching document:', error));
    }
  };

  const handleAskConsent = (event, choice, documentName) => {
    var reqBody = {
      "document_name": documentName,
      "patient_id": {
          "patient_id": `${globalSelectedAppointment.patient_id.patient_id}`
      },
      "doctor_id": {
          "doctor_id":`${globalSelectedAppointment.doctor_id.doctor_id}`
      }
    }
    
      // Simulate sending consent request based on choice (replace with actual logic)
      console.log(`Sending consent request for "${documentName}"`);

      const token = localStorage.getItem('token');
      fetch('http://localhost:8081/api/v1/doctor/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(reqBody)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert(`Consent requested for ${documentName}`);
      })
      .catch((error) => console.error('Error requesting consent:', error));
    }
  // };


  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <SideNavbar />
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
              </div>
            </div>
            <div className="form-container">
              <button id="connectBtn" className="custom-button">
                Connect
              </button>
              <button id="callBtn" className="custom-button">
                Call
              </button>
              <button id="testConnection" className="custom-button">
                Test Connection
              </button>
              <button id="next-button" className="custom-button">
               Next Patient
              </button>
              <button id="disconnect-button" className="custom-button">
               Disconnect
              </button>
            </div>
          </div>
  
          <div className="info-container">
            <div className="doctor-details">
              {/* Display doctor's name */}

              <h3>Patient Details</h3>
                <p>Name: {globalSelectedAppointment.patient_id.first_name + ' ' + globalSelectedAppointment.patient_id.last_name}</p>
                <p>Age: {globalSelectedAppointment.patient_id.age}</p>
                <p>Gender: {globalSelectedAppointment.patient_id.gender}</p>
            </div>
  			<div id="queue-number"></div>
            <div className="document-table">
              <h3>Documents</h3>
              <ul>
                {documents.map((document, index) => (
                  <li key={index}>
                    {document}
                    <div>
                      <button className="custom-button" onClick={() => handleView(document)}>View</button>
                      <button className="custom-button" onClick={() => handleAskConsent(document)}>Request Consent</button>
                    </div>
                  </li>
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
              <button className="custom-button" id="sendBtn">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

export default DocChat;
