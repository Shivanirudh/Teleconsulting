package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.HospitalIdGenerator;
import com.team25.telehealth.mappers.HospitalMapper;
import com.team25.telehealth.repo.HospitalRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.w3c.dom.html.HTMLOptGroupElement;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class HospitalService {
    private final HospitalMapper hospitalMapper;
    private final HospitalRepo hospitalRepo;
    private final EntityManager entityManager;
    private final HospitalIdGenerator hospitalIdGenerator;

    public Hospital getHospitalByEmail(String email) {
        return hospitalRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "email", email));
    }

    private boolean isDuplicateHospital(Hospital hospital) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Hospital> query = cb.createQuery(Hospital.class);
        Root<Hospital> root = query.from(Hospital.class);

        Predicate predicate = cb.or(
                cb.equal(root.get("name"), hospital.getName()),
                cb.equal(root.get("address"), hospital.getAddress()),
                cb.equal(root.get("phoneNo"), hospital.getPhoneNo()),
                cb.equal(root.get("email"), hospital.getEmail())
        );

        query.where(predicate);
        TypedQuery<Hospital> typedQuery = entityManager.createQuery(query);

        var count = typedQuery.getResultList();

        return !count.isEmpty();
    }

    public ResponseEntity<?> addHospital(Principal principal, HospitalDTO hospitalDTO) {
        Hospital hospital = hospitalMapper.toEntity(hospitalDTO);
        if(isDuplicateHospital(hospital)) {
            return ResponseEntity.badRequest().body("Email, Phone number, address, Name should be unique");
        }
        hospital.setHospitalId(hospitalIdGenerator.generateNextId());
        hospital.setActive(true);
        hospitalRepo.save(hospital);
        return ResponseEntity.ok("Hospital Created Successfully");
    }

    public Hospital findByHospitalId(String hospitalId) {
        return hospitalRepo.findByHospitalId(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", hospitalId));
    }

    public Hospital findHospitalByDoctor(Doctor doctor) {
        return hospitalRepo.findByDoctor(doctor)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "Doctor Id", doctor.getId().toString()));
    }

    public ResponseEntity<?> updateHospital(Principal principal, HospitalDTO hospitalDTO){
        Hospital hospital = getHospitalByEmail(principal.getName());

        if(hospitalDTO.getName() != null)
            hospital.setName(hospitalDTO.getName());
        if(hospitalDTO.getAddress() != null)
            hospital.setAddress(hospitalDTO.getAddress());

        hospitalRepo.save(hospital);
        return ResponseEntity.ok("Hospital updated Successfully");
    }

    public ResponseEntity<?> deleteHospital(Principal principal){
        Hospital hospital = getHospitalByEmail(principal.getName());
        hospital.setActive(false);
        hospitalRepo.save(hospital);
        return ResponseEntity.ok("Hospital deleted Successfully");
    }

    public List<HospitalDTO> listHospitals(Principal principal){
        return hospitalMapper.toDTOList(hospitalRepo.getAllByActive(true));
    }
}
