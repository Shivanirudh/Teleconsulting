package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token, Integer> {
    @Query("""
    select t from Token t where t.userId = :id and (t.expired=false or t.revoked = false)
    """)
    List<Token> findByUserId(String id);

    Optional<Token> findByToken(String token);
}
