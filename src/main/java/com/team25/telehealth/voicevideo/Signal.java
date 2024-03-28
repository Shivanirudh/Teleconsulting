package com.team25.telehealth.voicevideo;

import lombok.Data;

@Data
public class Signal {
    private final String type;
    private final String data;

    public Signal(String type, String data) {
        this.type = type;
        this.data = data;
    }

}
