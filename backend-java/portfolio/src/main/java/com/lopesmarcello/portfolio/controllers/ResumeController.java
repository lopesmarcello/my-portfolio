package com.lopesmarcello.portfolio.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lopesmarcello.portfolio.dtos.UpdateResumeRequestDTO;
import com.lopesmarcello.portfolio.entities.ResumeEntity;
import com.lopesmarcello.portfolio.mappers.ResumeMapper;
import com.lopesmarcello.portfolio.services.ResumeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService service;

    @GetMapping("/")
    public ResponseEntity<ResumeEntity> getResume() {
        ResumeEntity resume = service.getResume();
        return ResponseEntity.ok(resume);
    }

    @PostMapping("/")
    public ResponseEntity<ResumeEntity> createResume(@RequestBody UpdateResumeRequestDTO dto) {
        ResumeEntity created = service.createResume(ResumeMapper.toEntity(dto));

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/")
    public ResponseEntity<ResumeEntity> updateResume(@RequestBody UpdateResumeRequestDTO dto) {
        ResumeEntity updated = service.updateResume(ResumeMapper.toEntity(dto));
        return ResponseEntity.ok(updated);
    }

}
