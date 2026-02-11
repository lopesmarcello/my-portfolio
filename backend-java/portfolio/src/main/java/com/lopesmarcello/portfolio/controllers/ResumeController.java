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
import com.lopesmarcello.portfolio.dtos.ResumeResponseDTO;
import com.lopesmarcello.portfolio.mappers.ResumeMapper;
import com.lopesmarcello.portfolio.services.ResumeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService service;

    @GetMapping("/")
    public ResponseEntity<ResumeResponseDTO> getResume() {
        ResumeResponseDTO resume = service.getResume();
        return ResponseEntity.ok(resume);
    }

    @PostMapping("/")
    public ResponseEntity<ResumeResponseDTO> createResume(@RequestBody UpdateResumeRequestDTO dto) {
        ResumeResponseDTO responseDTO = service.createResume(ResumeMapper.toEntity(dto));

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/")
    public ResponseEntity<ResumeResponseDTO> updateResume(@RequestBody UpdateResumeRequestDTO dto) {
        ResumeResponseDTO responseDTO = service.updateResume(ResumeMapper.toEntity(dto));
        return ResponseEntity.ok(responseDTO);
    }

}
