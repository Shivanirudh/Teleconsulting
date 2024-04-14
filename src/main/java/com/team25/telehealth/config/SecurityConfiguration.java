package com.team25.telehealth.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static com.team25.telehealth.model.Permission.*;
import static com.team25.telehealth.model.Role.*;
import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .requiresChannel(channel ->
                        channel.anyRequest().requiresSecure()
                )
                .authorizeHttpRequests(req ->
                        req.requestMatchers("/api/v1/auth/**")
                                .permitAll()
                                .requestMatchers("/videocall").permitAll()
                                .requestMatchers("/websocket/**").permitAll()
                                .requestMatchers("/api/v1/admin/**").hasRole(ADMIN.name())
                                .requestMatchers(GET, "/api/v1/admin/**").hasAuthority(ADMIN_READ.name())
                                .requestMatchers(POST, "/api/v1/admin/**").hasAuthority(ADMIN_CREATE.name())
                                .requestMatchers(PUT, "/api/v1/admin/**").hasAuthority(ADMIN_UPDATE.name())
                                .requestMatchers(DELETE, "/api/v1/admin/**").hasAuthority(ADMIN_DELETE.name())
                                .requestMatchers("/api/v1/doctor/**").hasAnyRole(DOCTOR.name(), SENIORDOCTOR.name())
                                .requestMatchers(GET, "/api/v1/doctor/**").hasAnyAuthority(DOCTOR_READ.name(), SENIOR_ALL.name())
                                .requestMatchers(POST, "/api/v1/doctor/**").hasAnyAuthority(DOCTOR_CREATE.name(), SENIOR_ALL.name())
                                .requestMatchers(PUT, "/api/v1/doctor/**").hasAnyAuthority(DOCTOR_UPDATE.name(), SENIOR_ALL.name())
                                .requestMatchers(DELETE, "/api/v1/doctor/**").hasAnyAuthority(DOCTOR_DELETE.name(), SENIOR_ALL.name())
                                .requestMatchers("/api/v1/patient/**").hasAnyRole(PATIENT.name())
                                .requestMatchers(GET, "/api/v1/patient/**").hasAnyAuthority(PATIENT_READ.name())
                                .requestMatchers(POST, "/api/v1/patient/**").hasAnyAuthority(PATIENT_CREATE.name())
                                .requestMatchers(PUT, "/api/v1/patient/**").hasAnyAuthority(PATIENT_UPDATE.name())
                                .requestMatchers(DELETE, "/api/v1/patient/**").hasAnyAuthority(PATIENT_DELETE.name())
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                );

        return  http.build();
    }
}
