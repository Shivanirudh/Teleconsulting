package com.team25.telehealthcronjob.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;

import static com.team25.telehealthcronjob.model.Permission.*;

@RequiredArgsConstructor
public enum Role {
    PATIENT(Set.of(
            PATIENT_READ,
            PATIENT_UPDATE,
            PATIENT_CREATE,
            PATIENT_DELETE
    )),
    DOCTOR(Set.of(
            DOCTOR_READ,
            DOCTOR_UPDATE,
            DOCTOR_CREATE,
            DOCTOR_DELETE
    )),
    SENIORDOCTOR(Set.of(
            DOCTOR_READ,
            DOCTOR_UPDATE,
            DOCTOR_CREATE,
            DOCTOR_DELETE,
            SENIOR_ALL
    )),
    ADMIN(Set.of(
            ADMIN_READ,
            ADMIN_UPDATE,
            ADMIN_CREATE,
            ADMIN_DELETE,
            DOCTOR_READ,
            DOCTOR_CREATE,
            DOCTOR_UPDATE,
            DOCTOR_DELETE,
            PATIENT_READ,
            PATIENT_UPDATE,
            PATIENT_DELETE
    ))
    ;

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = new java.util.ArrayList<>(getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        return authorities;
    }
}
