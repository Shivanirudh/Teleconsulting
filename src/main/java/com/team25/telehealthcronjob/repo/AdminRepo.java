package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<Admin, Integer> {
}
