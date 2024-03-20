package com.team25.telehealth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BloodGroup {
    A_POSITIVE("A+"),
    A_NEGATIVE("A-"),
    B_POSITIVE("B+"),
    B_NEGATIVE("B-"),
    O_POSITIVE("O+"),
    O_NEGATIVE("O-"),
    AB_POSITIVE("AB+"),
    AB_NEGATIVE("AB-");

    private final String value;
}
