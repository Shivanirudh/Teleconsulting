package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token, Integer> {
    List<Token> findAllByExpiredOrRevoked(boolean expired, boolean revoked);
}
