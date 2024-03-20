package com.team25.telehealth.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hospital")
@EntityListeners(AuditingEntityListener.class)
public class Hospital extends BaseEntity {
    @Column(name = "hospital_id", unique = true, nullable = false)
    private String hospitalId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", unique = true, nullable = false)
    private String address;

    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNo;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "hospital")
    @JsonBackReference
    private List<Doctor> doctor;

    @OneToMany(mappedBy = "hospital")
    @JsonBackReference
    private List<Consent> consents;
}
