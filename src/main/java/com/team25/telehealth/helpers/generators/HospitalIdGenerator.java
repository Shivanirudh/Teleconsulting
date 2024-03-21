package com.team25.telehealth.helpers.generators;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class HospitalIdGenerator implements CustomIdGenerator{
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public String generateNextId() {
        Integer latestId = entityManager.createQuery("SELECT MAX(e.id) FROM Hospital e", Integer.class).getSingleResult();
        int nextId = (latestId != null) ? latestId + 1 : 1;
        return "H" + nextId;
    }
}
