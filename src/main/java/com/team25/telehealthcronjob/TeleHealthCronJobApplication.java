package com.team25.telehealthcronjob;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableScheduling
public class TeleHealthCronJobApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeleHealthCronJobApplication.class, args);
	}

}
