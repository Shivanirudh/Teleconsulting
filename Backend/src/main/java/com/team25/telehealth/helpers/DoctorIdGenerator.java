package com.team25.telehealth.helpers;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class DoctorIdGenerator implements CustomIdGenerator {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public String generateNextId() {
        Integer latestId = entityManager.createQuery("SELECT MAX(e.id) FROM Doctor e", Integer.class).getSingleResult();
        int nextId = (latestId != null) ? latestId + 1 : 1;
        return "D" + nextId;
    }
}
