package com.team25.telehealth.voicevideo;

import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.model.Room;
import com.team25.telehealth.repo.AppointmentRepo;
import com.team25.telehealth.service.AppointmentService;
import com.team25.telehealth.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final AppointmentRepo appointmentRepo;
    private final AppointmentService appointmentService;
    private final DoctorService doctorService;

    Map<String, Room> rooms = new ConcurrentHashMap<>();

    private final SimpMessagingTemplate simpMessagingTemplate;


    @RequestMapping(value = "/videocall",method =  RequestMethod.GET)
    public String Index(){
        return "index";
    }

    @MessageMapping("/testServer")
    @SendTo("/topic/testServer")
    public String testServer(String test){
        System.out.println(test);
        return "Testing Successful";
    }

    @MessageMapping("/addUser")
    public void addUser(String user){
        JSONObject jsonObject = new JSONObject(user);
        String userId = jsonObject.get("userId").toString();
        String appointmentId = jsonObject.get("appointmentId").toString();
        String meetingId = jsonObject.get("meetingId").toString();
        String userType = jsonObject.get("userType").toString();

        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", appointmentId));

        if(appointment.getActive() && appointment.getMeetingLink().equals(meetingId)) {
            if (!rooms.containsKey(meetingId)) {
                rooms.put(meetingId, new Room(meetingId));
            }

            Room room = rooms.get(meetingId);

            if ((userType.equals("PATIENT") && appointment.getPatient().getPatientId().equals(userId))
                    || (userType.equals("DOCTOR") && appointment.getDoctor().getDoctorId().equals(userId))) {

                if(userType.equals("DOCTOR")) room.setCurrentDoctor(userId);
                else {
                    if(room.getCurrentPatient() == null
                            && room.getParticipants().isEmpty()
                            && !room.containsCompletedParticipant(userId)
                    ) room.setCurrentPatient(userId);
                    else if(!room.containsCompletedParticipant(userId)) room.addParticipant(userId);
                }

//                if (!rooms.get(meetingId).containsParticipant(userId)
//                        && !rooms.get(meetingId).exceedingMaxLimitOfParticipants()) {
//
//                    rooms.get(meetingId).addParticipant(userId);
//                    System.out.println("User Added Successfully");
//                }
            } else if(userType.equals("DOCTOR")) {
                Doctor doctor = doctorService.getDoctorByDoctorId(userId);
                if(doctor.getRole().equals(Role.SENIORDOCTOR)
                        && doctor.getHospital().getId() == appointment.getDoctor().getHospital().getId()
                        && room.getSeniorDoctor() == null
                ) {
                    room.setSeniorDoctor(userId);
                    System.out.println("User Added Successfully");
                }
            }

            for (String roomId : rooms.keySet()) {
                Room temp = rooms.get(roomId);
                System.out.println("Patient : " + temp.getCurrentPatient()
                        + " Doctor: " + temp.getCurrentDoctor()
                        + " Senior Doctor: " + temp.getSeniorDoctor()
                        + "\nAdditional Patient's list: ");
                for (String participants : room.getParticipants()) System.out.println(participants);
            }
        } else Error(5, userId);
    }

    @MessageMapping("/call")
    public void Call(String call){
        JSONObject jsonObject = new JSONObject(call);

        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if (rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                if(room.getCurrentDoctor() == null) {
                    Error(3, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentDoctor(),"/topic/call", "Called by someone else");
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/call", "Called by someone else");
                    }
                }
            } else if(room.getCurrentDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/call", "Called by someone else");
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/call", "Called by someone else");
                    }
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/call", "Called by someone else");
                    if(room.getCurrentDoctor() != null)
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getCurrentDoctor(),"/topic/call", "Called by someone else");

                }
            }
        } else Error(5, userId);

//        if(rooms.containsKey(meetingId)) {
//            if(!rooms.get(meetingId).getParticipants().contains(userId)) return;
//            for(String user: rooms.get(meetingId).getParticipants()) {
//                if(!user.equals(userId))
//                    simpMessagingTemplate
//                            .convertAndSendToUser(user,"/topic/call", "Called by someone else");
//            }
//        }

    }

    @MessageMapping("/offer")
    public void Offer(String offer){
        JSONObject jsonObject = new JSONObject(offer);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if (rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                if(room.getCurrentDoctor() == null) {
                    Error(3, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentDoctor(),"/topic/offer", offer);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/offer", offer);
                    }
                }
            } else if(room.getCurrentDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/offer", offer);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/offer", offer);
                    }
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/offer", offer);
                    if(room.getCurrentDoctor() != null)
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getCurrentDoctor(),"/topic/offer", offer);

                }
            }
        } else Error(5, userId);

//        if(rooms.containsKey(meetingId)) {
//            if(!rooms.get(meetingId).getParticipants().contains(userId)) return;
//            for(String user: rooms.get(meetingId).getParticipants()) {
//                if(!user.equals(userId))
//                    simpMessagingTemplate
//                            .convertAndSendToUser(user,"/topic/offer",offer);
//            }
//        }

    }

    @MessageMapping("/answer")
    public void Answer(String answer){
        JSONObject jsonObject = new JSONObject(answer);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if (rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                if(room.getCurrentDoctor() == null) {
                    Error(3, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentDoctor(),"/topic/answer", answer);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/answer", answer);
                    }
                }
            } else if(room.getCurrentDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/answer", answer);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/answer", answer);
                    }
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/answer", answer);
                    if(room.getCurrentDoctor() != null)
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getCurrentDoctor(),"/topic/answer", answer);

                }
            }
        } else Error(5, userId);

//        if(rooms.containsKey(meetingId)) {
//            if(!rooms.get(meetingId).getParticipants().contains(userId)) return;
//            for(String user: rooms.get(meetingId).getParticipants()) {
//                if(!user.equals(userId))
//                    simpMessagingTemplate
//                            .convertAndSendToUser(user,"/topic/answer",answer);
//            }
//        }
    }
    @MessageMapping("/candidate")
    public void Candidate(String candidate){
        JSONObject jsonObject = new JSONObject(candidate);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if (rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                if(room.getCurrentDoctor() == null) {
                    Error(3, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentDoctor(),"/topic/candidate", candidate);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/candidate", candidate);
                    }
                }
            } else if(room.getCurrentDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/candidate", candidate);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/candidate", candidate);
                    }
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/candidate", candidate);
                    if(room.getCurrentDoctor() != null)
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getCurrentDoctor(),"/topic/candidate", candidate);

                }
            }
        } else Error(5, userId);

//        if(rooms.containsKey(meetingId)) {
//            if(!rooms.get(meetingId).getParticipants().contains(userId)) return;
//            for(String user: rooms.get(meetingId).getParticipants()) {
//                if(!user.equals(userId))
//                    simpMessagingTemplate
//                            .convertAndSendToUser(user,"/topic/candidate",candidate);
//            }
//        }
    }

    @MessageMapping("/message")
    public void Message(String message) {
        JSONObject jsonObject = new JSONObject(message);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if (rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                if(room.getCurrentDoctor() == null) {
                    Error(3, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentDoctor(),"/topic/message", message);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/message", message);
                    }
                }
            } else if(room.getCurrentDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/message", message);
                    if(room.getSeniorDoctor()!=null) {
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getSeniorDoctor(),"/topic/message", message);
                    }
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                if(room.getCurrentPatient() == null) {
                    Error(4, userId);
                } else {
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/message", message);
                    if(room.getCurrentDoctor() != null)
                        simpMessagingTemplate
                                .convertAndSendToUser(room.getCurrentDoctor(),"/topic/message", message);

                }
            }
        } else Error(5, userId);

//        if(rooms.containsKey(meetingId)) {
//            if(!rooms.get(meetingId).getParticipants().contains(userId)) return;
//            for(String user: rooms.get(meetingId).getParticipants()) {
//                if(!user.equals(userId))
//                    simpMessagingTemplate
//                            .convertAndSendToUser(user,"/topic/message",message);
//            }
//        }
    }

    @MessageMapping("/next")
    public void NextPatient(String message) {
        JSONObject jsonObject = new JSONObject(message);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if(rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentDoctor().equals(userId)) {
                room.addCompletedParticipant(room.getCurrentPatient());
                room.setCurrentPatient(null);
                if(!room.getParticipants().isEmpty()) {
                    room.setCurrentPatient(room.getParticipants().get(0));
                    room.getParticipants().remove(0);
                    simpMessagingTemplate
                            .convertAndSendToUser(room.getCurrentPatient(),"/topic/next",message);
                } else {
                    Error(0, userId);
                }
            } else if(room.getSeniorDoctor().equals(userId)) {
                Error(1, userId);
            } else {
                Error(2, userId);
            }
        } else Error(5, userId);
    }

    @MessageMapping("/disconnect")
    public void Disconnect(String user) {
        JSONObject jsonObject = new JSONObject(user);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();
        if(rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(room.getCurrentPatient().equals(userId)) {
                room.addCompletedParticipant(userId);
                room.setCurrentPatient(null);
                if(room.getSeniorDoctor() != null)
                    Error(8, room.getSeniorDoctor());
                if(room.getCurrentDoctor() != null)
                    Error(8, room.getCurrentDoctor());
            } else if(room.getCurrentDoctor().equals(userId)) {
                room.setCurrentDoctor(null);
                for(String u : room.getParticipants()) {
                    Error(7, u);
                }
                rooms.remove(meetingId);
            } else if(room.getSeniorDoctor().equals(userId)) {
                room.setSeniorDoctor(null);
                if(room.getCurrentPatient() != null)
                    Error(6, room.getCurrentPatient());;
                if(room.getCurrentDoctor() != null)
                    Error(6, room.getCurrentDoctor());
            }
        } else Error(5, userId);
    }

    @MessageMapping("/queueNumber")
    public void QueueNumber(String user) {
        JSONObject jsonObject = new JSONObject(user);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();
        if(rooms.containsKey(meetingId)) {
            Room room = rooms.get(meetingId);
            if(userId.equals(room.getCurrentPatient())) {
                simpMessagingTemplate
                        .convertAndSendToUser(userId,"/topic/queueNumber","You are the current patient");
            } else if(room.getParticipants().contains(userId)) {
                int number = room.getParticipants().indexOf(userId) + 1;
                simpMessagingTemplate
                        .convertAndSendToUser(userId,"/topic/queueNumber","Your number is " + number);
            }
        } else Error(5, userId);
    }

    @MessageMapping("/error")
    public void Error(int num, String user) {
        String message = null;
        switch(num) {
            case 0: message = "NO_MORE_PATIENTS";
                break;
            case 1: message = "ILLEGAL_ACTION_SENIOR_DOCTOR";
                break;
            case 2: message = "ILLEGAL_ACTION_PATIENT";
                break;
            case 3: message = "DOCTOR_NOT_PRESENT";
                break;
            case 4: message = "PATIENT_NOT_PRESENT";
                break;
            case 5: message = "MEETING_ID_OR_APPOINTMENT_WRONG";
                break;
            case 6: message = "SENIOR_DOCTOR_DISCONNECTED";
                break;
            case 7: message = "DOCTOR_DISCONNECTED";
                break;
            case 8: message = "PATIENT_DISCONNECTED";
                break;
            default: message = "SOMETHING_WENT_WRONG";
                break;
        }
        simpMessagingTemplate
                .convertAndSendToUser(user,"/topic/error", message);
    }
}
