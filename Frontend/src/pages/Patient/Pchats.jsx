import React, { useEffect } from "react";
import "../../css/Patient/Pchats.css";
import SockJS from "sockjs-client";
import useScript from "../../components/useScript";
import config from './../../Config'

const VideoChannel = () => {
  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
  );
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

  return (
    <div className="video-chat-page">
      <div className="video-container">
        {/* Big video container for other side */}
        <div className="big-video">
          <video id="remoteVideo" autoPlay></video>
        </div>

        {/* Small video container for own video */}
        <div className="small-video">
          <video id="localVideo" autoPlay muted></video>
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
                  <button className="rambo-but">Download</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
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
      </div>
    </div>
  );
};

export default VideoChannel;
