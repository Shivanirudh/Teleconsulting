package com.team25.telehealth.voicevideo;

import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.model.Room;
import com.team25.telehealth.repo.AppointmentRepo;
import com.team25.telehealth.service.AppointmentService;
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

    Map<String, Room> rooms = new ConcurrentHashMap<>();

    private final SimpMessagingTemplate simpMessagingTemplate;


    @RequestMapping(value = "/videocall",method =  RequestMethod.GET)
    public String Index(){
        return "index";
    }

    @MessageMapping("/testServer")
    @SendTo("/topic/testServer")
    public String testServer(String Test){
        System.out.println("Testing Server");
        return Test;
    }

    @MessageMapping("/addUser")
    public void addUser(String user){
        System.out.println("Adding User");

        JSONObject jsonObject = new JSONObject(user);
        String userId = jsonObject.get("userId").toString();
        String appointmentId = jsonObject.get("appointmentId").toString();
        String meetingId = jsonObject.get("meetingId").toString();
        String userType = jsonObject.get("userType").toString();

        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", appointmentId));
        if(appointment.getMeetingLink().equals(meetingId)) {
            if (!rooms.containsKey(meetingId)) {
                rooms.put(meetingId, new Room(meetingId));
            }
            if ((userType.equals("PATIENT") && appointment.getPatient().getPatientId().equals(userId))
                    || (userType.equals("DOCTOR") && appointment.getDoctor().getDoctorId().equals(userId))) {

                if (!rooms.get(meetingId).containsParticipant(userId)
                        && !rooms.get(meetingId).exceedingMaxLimitOfParticipants()) {

                    rooms.get(meetingId).addParticipant(userId);
                    System.out.println("User Added Successfully");

                }
            }
            for (String roomId : rooms.keySet()) {
                Room room = rooms.get(roomId);
                for (String participants : room.getParticipants()) System.out.println(participants);
            }
        }
    }

    @MessageMapping("/call")
    public void Call(String call){
        System.out.println("Call function called");
        JSONObject jsonObject = new JSONObject(call);
//        System.out.println("Calling to: "+jsonObject.get("callTo")+" Call from "+jsonObject.get("callFrom"));
//        System.out.println("Calling to class: "+jsonObject.get("callTo").getClass()+" Call from class "+jsonObject.get("callFrom").getClass());

        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if(rooms.containsKey(meetingId)) {
            for(String user: rooms.get(meetingId).getParticipants()) {
                if(!user.equals(userId))
                    simpMessagingTemplate
                            .convertAndSendToUser(user,"/topic/call", "Called by someone else");
            }
        }

        System.out.println("ended call function");
    }

    @MessageMapping("/offer")
    public void Offer(String offer){

        System.out.println("Offer Came");
        JSONObject jsonObject = new JSONObject(offer);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if(rooms.containsKey(meetingId)) {
            for(String user: rooms.get(meetingId).getParticipants()) {
                if(!user.equals(userId))
                    simpMessagingTemplate
                            .convertAndSendToUser(user,"/topic/offer",offer);
            }
        }

        System.out.println("Offer Sent");
    }

    @MessageMapping("/answer")
    public void Answer(String answer){
        System.out.println("Answer came");
        System.out.println(answer);
        JSONObject jsonObject = new JSONObject(answer);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if(rooms.containsKey(meetingId)) {
            for(String user: rooms.get(meetingId).getParticipants()) {
                if(!user.equals(userId))
                    simpMessagingTemplate
                            .convertAndSendToUser(user,"/topic/answer",answer);
            }
        }

        System.out.println("Answer Sent");
    }
    @MessageMapping("/candidate")
    public void Candidate(String candidate){
        System.out.println("Candidate came");
        JSONObject jsonObject = new JSONObject(candidate);
        String meetingId = jsonObject.get("meetingId").toString();
        String userId = jsonObject.get("userId").toString();

        if(rooms.containsKey(meetingId)) {
            for(String user: rooms.get(meetingId).getParticipants()) {
                if(!user.equals(userId))
                    simpMessagingTemplate
                            .convertAndSendToUser(user,"/topic/candidate",candidate);
            }
        }
        System.out.println("Candidate Sent");
    }

}
