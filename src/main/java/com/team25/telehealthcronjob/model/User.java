package com.team25.telehealthcronjob.model;

import com.team25.telehealthcronjob.entity.Admin;
import com.team25.telehealthcronjob.entity.Doctor;
import com.team25.telehealthcronjob.entity.Patient;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    private String id;
    private String email;
    private Long phoneNo;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User(Admin user) {
        this.id = user.getAdminId();
        this.email = user.getEmail();
        this.phoneNo = user.getPhoneNo();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    public User(Patient user) {
        this.id = user.getPatientId();
        this.email = user.getEmail();
        this.phoneNo = user.getPhoneNo();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    public User(Doctor user) {
        this.id = user.getDoctorId();
        this.email = user.getEmail();
        this.phoneNo = user.getPhoneNo();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
