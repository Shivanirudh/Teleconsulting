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
        `${config.apiUrl}/api/v1/patient/files`,
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
    const seniorDoctorVideo = document.getElementById("seniorVideo");
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
    const queuebutton = document.getElementById("queue-button");

    let localStream;
    let remoteStream;
    let localPeer;
    let localID;
    let stompClient;
    let userType;
    let meetingId;
    let appointmentId;
    let seniorDoctorPeer;
    let seniorDoctorRemoteStream;
    let seniorRemoteDescription = false;

    const authToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtZS5wcmFzaGFudGpuQGdtYWlsLmNvbSIsImlhdCI6MTcxMjY1NjcyMiwiZXhwIjoxNzEyNzQzMTIyfQ.MnlOktvWFabiCHbeWNZX62Mfb_gnSSOey9YbGndlGAc";

    // ICE Server Configurations
    const iceServers = {
      iceServer: {
        urls: "stun:stun.l.google.com:19302",
      },
    };

    localPeer = new RTCPeerConnection(iceServers);
    seniorDoctorPeer = new RTCPeerConnection(iceServers);

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

    document.addEventListener("DOMContentLoaded", function () {
      var goBackButton = document.getElementById("go-back-button");
      goBackButton.addEventListener("click", function () {
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
      console.log(globalSelectedAppointment['patient_id']['patient_id']);
      localID = globalSelectedAppointment['patient_id']['patient_id'];
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

          console.log(call);
          const userId = call.body;
          console.log(userId);



          if (userId === globalSelectedAppointment["doctor_id"]["doctor_id"]) {
            console.log("Call from normal doctor");
            if (localPeer.connectionState !== "connected") {
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
                if (track.sender == null)
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
            }
          }
          else {
            console.log("Call from senior doctor");

            seniorDoctorPeer.onconnectionstatechange = (event) => {
              console.log("Connection state changed:", seniorDoctorPeer.connectionState);
              if (seniorDoctorPeer.connectionState === 'failed')
                seniorDoctorPeer.restartIce();
            };
            seniorDoctorPeer.ontrack = (event) => {
              // Setting Remote stream in remote video element
              seniorDoctorVideo.srcObject = event.streams[0];
            };
            console.log("Senior doctor");
            seniorDoctorPeer.onicecandidate = (event) => {
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
            // Adding audio and video senior doctor peer
            localStream.getTracks().forEach((track) => {
              if (track.sender == null)
                seniorDoctorPeer.addTrack(track, localStream);
            });
            seniorDoctorPeer.createOffer().then((description) => {
              seniorDoctorPeer.setLocalDescription(description);
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
          }


        });

        // Subscribe to the seniorDoctorCall topic
        stompClient.subscribe("/user/" + localID + "/topic/seniorDoctorCall", (call) => {
          console.log(call);
          const userId = call.body;
          console.log(userId);
          
          console.log("Call from senior doctor");

            seniorDoctorPeer.onconnectionstatechange = (event) => {
              console.log("Connection state changed:", seniorDoctorPeer.connectionState);
              if (seniorDoctorPeer.connectionState === 'failed')
                seniorDoctorPeer.restartIce();
            };
            seniorDoctorPeer.ontrack = (event) => {
              // Setting Remote stream in remote video element
              seniorDoctorVideo.srcObject = event.streams[0];
            };

            seniorDoctorPeer.onicecandidate = (event) => {
              if (event.candidate) {
                const candidate = {
                  type: "candidate",
                  label: event.candidate.sdpMLineIndex,
                  id: event.candidate.candidate,
                };
                stompClient.send(
                  "/app/seniorDoctorCandidate",
                  {},
                  JSON.stringify({
                    meetingId: meetingId,
                    userId: localID,
                    candidate: candidate,
                    receiverId: userId,
                  })
                );
              }
            };
            // Adding audio and video senior doctor peer
            localStream.getTracks().forEach((track) => {
              if (track.sender == null)
                seniorDoctorPeer.addTrack(track, localStream);
            });
            seniorDoctorPeer.createOffer().then((description) => {
              seniorDoctorPeer.setLocalDescription(description);
              stompClient.send(
                "/app/seniorDoctorOffer",
                {},
                JSON.stringify({
                  meetingId: meetingId,
                  userId: localID,
                  offer: description,
                  receiverId: userId,
                })
              );
            });

        });

        // Subscribe to the 'offer' topic
        stompClient.subscribe("/user/" + localID + "/topic/offer", (offer) => {
          const o = JSON.parse(offer.body);
          console.log(o);



          if (o.userId === globalSelectedAppointment["doctor_id"]["doctor_id"]) {
            console.log("Offer from normal doctor");

            if (localPeer.connectionState !== "connected") {

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
                if (track.sender == null)
                  localPeer.addTrack(track, localStream);
              });
              localPeer.setRemoteDescription(new RTCSessionDescription(o.offer));
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
            }
          }
          else {
            console.log("Offer from senior doctor");

            seniorDoctorPeer.onconnectionstatechange = (event) => {
              console.log("Connection state changed:", seniorDoctorPeer.connectionState);
              if (seniorDoctorPeer.connectionState === 'failed')
                seniorDoctorPeer.restartIce();
            };

            seniorDoctorPeer.ontrack = (event) => {
              seniorDoctorVideo.srcObject = event.streams[0];
            };
            seniorDoctorPeer.onicecandidate = (event) => {
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

            localStream.getTracks().forEach((track) => {
              if (track.sender == null) {
                const clonedTrack = track.clone();
                seniorDoctorPeer.addTrack(clonedTrack, localStream);
              }
              else {
                console.log(track);
                console.log("Track sender available");
              }
            });
            seniorDoctorPeer.setRemoteDescription(new RTCSessionDescription(o.offer));
            seniorDoctorPeer.createAnswer().then((description) => {
              seniorDoctorPeer.setLocalDescription(description);
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
          }

        });

        // Subscribe to the seniorDoctorOffer topic
        stompClient.subscribe("/user/" + localID + "/topic/seniorDoctorOffer", (offer) => {
          const o = JSON.parse(offer.body);
          console.log(o.offer);
          // Handle the message received from the server (notification about next patient)
          console.log("Offer from senior doctor for patient");

            seniorDoctorPeer.onconnectionstatechange = (event) => {
              console.log("Connection state changed:", seniorDoctorPeer.connectionState);
              if (seniorDoctorPeer.connectionState === 'failed')
                seniorDoctorPeer.restartIce();
            };

            seniorDoctorPeer.ontrack = (event) => {
              seniorDoctorVideo.srcObject = event.streams[0];
            };
            seniorDoctorPeer.onicecandidate = (event) => {
              if (event.candidate) {
                const candidate = {
                  type: "candidate",
                  label: event.candidate.sdpMLineIndex,
                  id: event.candidate.candidate,
                };
                stompClient.send(
                  "/app/seniorDoctorCandidate",
                  {},
                  JSON.stringify({
                    meetingId: meetingId,
                    userId: localID,
                    candidate: candidate,
                    receiverId: o.userId,
                  })
                );
              }
            };


            localStream.getTracks().forEach((track) => {
              if (track.sender == null) {
                seniorDoctorPeer.addTrack(track, localStream);
              }
            });
            seniorDoctorPeer.setRemoteDescription(new RTCSessionDescription(o.offer));
            seniorDoctorPeer.createAnswer().then((description) => {
              seniorDoctorPeer.setLocalDescription(description);
              stompClient.send(
                "/app/seniorDoctorAnswer",
                {},
                JSON.stringify({
                  meetingId: meetingId,
                  userId: localID,
                  answer: description,
                  receiverId: o.userId,
                })
              );
            });

        });

        // Subscribe to the 'answer' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/answer",
          (answer) => {
            const o = JSON.parse(answer.body);
            console.log(o);
            if (o.userId === globalSelectedAppointment["doctor_id"]["doctor_id"]) {
              console.log("Answer from normal doctor");

              if (localPeer.connectionState !== "connected") {
                localPeer.setRemoteDescription(new RTCSessionDescription(o.answer));
                console.log("Local peer remote description set");
              }
            }
            else {
              console.log("Answer from senior doctor");
              console.log(seniorDoctorPeer.signallingState, seniorDoctorPeer.connectionState);
              if (!seniorRemoteDescription && seniorDoctorPeer.signalingState !== "stable") {
                seniorDoctorPeer.setRemoteDescription(new RTCSessionDescription(o.answer));
                console.log("Senior doctor peer remote description set");
                seniorRemoteDescription = true;
              }
            }
          }
        );

        // Subscribe to the 'seniorDoctorAnswer' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/seniorDoctorAnswer",
          (answer) => {
            const o = JSON.parse(answer.body);
            console.log(o);

            console.log("Answer from senior doctor");
            console.log(seniorDoctorPeer.signallingState, seniorDoctorPeer.connectionState);
            seniorDoctorPeer.setRemoteDescription(new RTCSessionDescription(o.answer));
            console.log("Senior doctor peer remote description set");
          }
        );

        // Subscribe to the 'candidate' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/candidate",
          (answer) => {
            const o = JSON.parse(answer.body);
            const iceCandidate = new RTCIceCandidate({
              sdpMLineIndex: o.candidate.label,
              candidate: o.candidate.id,
            });
            if (o.userId === globalSelectedAppointment["doctor_id"]["doctor_id"]) {
              if (localPeer.connectionState !== "connected") {
                if (localPeer.currentRemoteDescription)
                  localPeer.addIceCandidate(iceCandidate);
              }
            }
            else
              if (seniorDoctorPeer.currentRemoteDescription)
                seniorDoctorPeer.addIceCandidate(iceCandidate);
          }
        );

        // Subscribe to the 'seniorDoctorCandidate' topic
        stompClient.subscribe(
          "/user/" + localID + "/topic/seniorDoctorCandidate",
          (answer) => {
            const o = JSON.parse(answer.body);
            const iceCandidate = new RTCIceCandidate({
              sdpMLineIndex: o.candidate.label,
              candidate: o.candidate.id,
            });
            if (seniorDoctorPeer.currentRemoteDescription)
              seniorDoctorPeer.addIceCandidate(iceCandidate);
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
        //stompClient.subscribe("/user/" + localID + "/topic/disconnect", () => {
        //	console.log('Received disconnection notification from server');
        // Close the WebSocket connection on patient's side
        //	stompClient.disconnect(() => {
        //		console.log('WebSocket connection closed due to disconnection of doctor');
        //	});
        //	navigate("/patientdashboard");
        //});

        // Subscribe to the '/user/{localID}/topic/error' topic
        stompClient.subscribe("/user/" + localID + "/topic/error", (message) => {
          //console.log('Received disconnection notification from server');
          // Close the WebSocket connection on patient's side
          console.log(message);
          switch (message.body) {
            case "ILLEGAL_ACTION_PATIENT":
              alert(message);
              break;
            case "DOCTOR_NOT_PRESENT":
              // Stop the local video stream
              localStream.getTracks().forEach(track => {
                track.stop();
              });

              // Set the remote video source to null to stop streaming
              remoteVideo.srcObject = null;
              if (stompClient.connected)
                stompClient.disconnect();
              console.log('WebSocket connection closed due to disconnection of doctor');
              if (localPeer)
                localPeer.close();
              console.log("Peer to peer connection closed");
              navigate("/patientdashboard");
              break;
            case "MEETING_ID_OR_APPOINTMENT_WRONG":
              alert(message);
              break;
            case "SENIOR_DOCTOR_DISCONNECTED":
              seniorDoctorVideo.srcObject = null;
              if (seniorDoctorPeer) {
                seniorDoctorPeer.close();
                console.log("Senior doctor to patient connection closed");
              }
              //seniorDoctorPeer = null;
              break;
            case "DOCTOR_DISCONNECTED":
              // Stop the local video stream
              localStream.getTracks().forEach(track => {
                track.stop();
              });

              // Set the remote video source to null to stop streaming
              remoteVideo.srcObject = null;
              if (stompClient.connected)
                stompClient.disconnect();
              console.log('WebSocket connection closed due to disconnection of doctor');
              if (localPeer) {
                localPeer.close();
                console.log("Peer to peer connection closed");
              }
              navigate("/patientdashboard");
              window.location.reload();
              break;
            default:
              alert("SOMETHING_WENT_WRONG");
              break;
          }
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

        // Subscribe to the '/user/{localID}/topic/next' topic
        stompClient.subscribe("/user/" + localID + "/topic/next", (message) => {
          // Handle the message received from the server (notification about next patient)
          const msg = JSON.parse(message.body).message;
          console.log(message);
          console.log(message.body.messageId);
          console.log("Notification about next patient:", msg);

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

        // Send a message to get queue number
        //stompClient.send(
        //  "/app/queueNumber",
        //  {},
        //  JSON.stringify({
        //    userId: localID,
        //    meetingId: meetingId,
        //  })
        //);

      });
    };

    //connectToWebSocket();

    //if (window.Stomp) {
    // Stomp library is already loaded, proceed with WebSocket connection
    //  connectToWebSocket();
    //} else {
    // Stomp library is not yet loaded, wait for it to load
    // You can use a setTimeout or other mechanism to check again after a delay
    //  setTimeout(() => {
    //	if (window.Stomp) {
    //	  connectToWebSocket();
    //	} else {
    //	  console.error('Stomp library failed to load.');
    // Handle error or retry mechanism here
    //	}
    //  }, 1000); // Adjust the delay as needed
    //}

    // Handle the call button click event
    const handleCall = () => {
      localPeer = new RTCPeerConnection(iceServers);
      seniorDoctorPeer = new RTCPeerConnection(iceServers);
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
      stompClient.disconnect();

      console.log('WebSocket connection closed');

      if (localPeer) {
        localPeer.close();
        console.log("Patient to doctor connection closed");
      }
      if (seniorDoctorPeer) {
        seniorDoctorPeer.close();
        console.log("Patient to senior doctor connection closed");
      }
      console.log(localStream);
      // Stop the local video stream
      localStream.getTracks().forEach(track => {
        track.stop();
      });

      // Set the remote video source to null to stop streaming
      remoteVideo.srcObject = null;
      seniorDoctorVideo.srcObject = null;
      //Add navigate code
      navigate("/patientdashboard");
      window.location.reload();
    }

    const handleQueue = () => {
      stompClient.send(
        "/app/queueNumber",
        {},
        JSON.stringify({
          userId: localID,
          meetingId: meetingId,
        })
      );
      //window.location.reload();
    }


    // Event listeners
    connectBtn.addEventListener("click", connectToWebSocket);
    callBtn.addEventListener("click", handleCall);
    testConnection.addEventListener("click", handleTestConnection);
    sendBtn.addEventListener("click", handleSend);
    disconnectbutton.addEventListener("click", handleDisconnect);
    queuebutton.addEventListener("click", handleQueue);

    // Clean up function
    return () => {
      // Remove event listeners
      connectBtn.removeEventListener("click", connectToWebSocket);
      callBtn.removeEventListener("click", handleCall);
      testConnection.removeEventListener("click", handleTestConnection);
      sendBtn.removeEventListener("click", handleSend);
      disconnectbutton.removeEventListener("click", handleDisconnect);
      queuebutton.addEventListener("click", handleQueue);

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
            <div className="remote-video">
              <video id="seniorVideo" autoPlay></video>
            </div>
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
        <div id="queue-number">
          Queue Number: {queueMessage}<br></br>
          <button id="queue-button" class="custom-button">Get queue number</button>
        </div>
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