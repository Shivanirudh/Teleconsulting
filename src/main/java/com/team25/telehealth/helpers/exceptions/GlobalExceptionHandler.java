package com.team25.telehealth.helpers.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.crypto.IllegalBlockSizeException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex) {
        String message = ex.getMessage();
        return new ResponseEntity<String>(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NoSuchAlgorithmException.class)
    public ResponseEntity<?> noSuchAlgorithmException(NoSuchAlgorithmException ex) {
        return new ResponseEntity<String>("Encryption Algorithm Not Found",HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalBlockSizeException.class)
    public ResponseEntity<?> illegalBlockSizeException(IllegalBlockSizeException ex) {
        return new ResponseEntity<String>("Encryption Algorithm Failed due to block size",HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, String> res = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError)error).getField();
            String message = error.getDefaultMessage();
            res.put(fieldName, message);
        });

        return new ResponseEntity<Map<String, String>>(res, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return new ResponseEntity<>("Data integrity violation occurred: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
