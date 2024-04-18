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

      localID = localIdInp.value || "P203";
      appointmentId = appointmentInput.value || "AP1";
      meetingId = meetingInput.value || "21db0f8f-36f0-4a92-84a0-a099660137aa";
      userType = userTypeInput.value || "PATIENT";

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

    // Event listeners
    connectBtn.addEventListener("click", connectToWebSocket);
    callBtn.addEventListener("click", handleCall);
    testConnection.addEventListener("click", handleTestConnection);
    sendBtn.addEventListener("click", handleSend);

    // Clean up function
    return () => {
      // Remove event listeners
      connectBtn.removeEventListener("click", connectToWebSocket);
      callBtn.removeEventListener("click", handleCall);
      testConnection.removeEventListener("click", handleTestConnection);
      sendBtn.removeEventListener("click", handleSend);

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
        <div className="main-content">
          <div className="do-chat-page-abc123">
            <div className="video-container-xyz789">
              <div className="big-video-123abc">
                <video id="remoteVideo" autoPlay></video>
              </div>
              <div className="small-video-456def">
                <video id="localVideo" autoPlay muted></video>
              </div>
            </div>

            <div className="info-container-ghi321">
              <div className="patient-details-jkl654">
                <h3>Patient Details</h3>
                <p>Name: {globalSelectedAppointment.patient_id.first_name + ' ' + globalSelectedAppointment.patient_id.last_name}</p>
                <p>Age: {globalSelectedAppointment.patient_id.age}</p>
                <p>Gender: {globalSelectedAppointment.patient_id.gender}</p>
              </div>
              <div className="document-table-mno987">
                <h3>Document List</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>View</th>
                      <th>Request Consent</th>
                    </tr>
                  </thead>
                  <tbody>
                  {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document}</td>
                    {/* <td>{document.size}</td> */}
                    <td>
                      <button onClick={() => handleView(document)}>View</button>
                      <button onClick={(event) => handleAskConsent(event, document)}>Request Consent</button>
                    </td>
                  </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="chat-window">
                {/* Chat window */}
                <h3>Chat</h3>
                <div id="messageBox">Chat messages Placeholder</div>
                <input
                  type="text"
                  id="messageInput"
                  placeholder="Type your message here..."
                />
                <button id="sendBtn">Send</button>
              </div>
              <div className="upload-prescription-pqr159">
                <button
                  className="upload-btn-stu753"
                  onClick={() =>
                    handleUploadPrescription({
                      appointment_id: "AP255",
                      symptoms:
                        "Patient complains of persistent cough, fatigue, and fever for the past week.",
                      medicines_and_dosage:
                        "Antibiotic -> Take 1 tablet every 12 hours for 7 days. \n Cough syrup -> Take 10ml three times a day as needed for cough.",
                      advice:
                        "Get plenty of rest, drink fluids, and avoid exposure to cold weather. If symptoms worsen or persist after completion of antibiotics, schedule a follow-up appointment.",
                    })
                  }
                >
                  Upload Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <input
          type="text"
          name="localId"
          id="localId"
          placeholder="Enter Your ID"
        />
        <input
          type="text"
          name="appointment"
          id="appointment"
          placeholder="Enter Appointment ID"
        />
        <input
          type="text"
          name="meeting"
          id="meeting"
          placeholder="Enter meeting Link"
        />
        <input
          type="text"
          name="userType"
          id="userType"
          placeholder="Enter userType ID"
        />
        <button id="connectBtn">Connect</button>
        <button id="callBtn">call</button>
        <button id="testConnection">Test Connection</button>
      </div>
    </div>
  );
};

export default DocChat;
