package com.lopesmarcello.portfolio.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lopesmarcello.portfolio.dtos.UpdateResumeRequestDTO;
import com.lopesmarcello.portfolio.dtos.AddExperienceRequestDTO;
import com.lopesmarcello.portfolio.dtos.ExperienceDTO;
import com.lopesmarcello.portfolio.dtos.ReorderExperienceItemDTO;
import com.lopesmarcello.portfolio.dtos.ResumeResponseDTO;
import com.lopesmarcello.portfolio.dtos.UpdateExperienceRequestDTO;
import com.lopesmarcello.portfolio.dtos.UpdateLinkRequestDTO;
import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;
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

    @PostMapping("/experiences")
    public ResponseEntity<ExperienceDTO> addExperience(@RequestBody AddExperienceRequestDTO dto) {
        ExperienceEntity experience = new ExperienceEntity();
        experience.setCompanyName(dto.getCompanyName());
        experience.setDescription(dto.getDescription());
        experience.setStartDate(dto.getStartDate());
        experience.setEndDate(dto.getEndDate());
        experience.setDisplayOrder(dto.getDisplayOrder());

        ExperienceEntity saved = service.addExperience(experience);
        ExperienceDTO responseDTO = ResumeMapper.convertExperienceDTO(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<Void> removeExperience(@PathVariable Long id) {
        service.removeExperience(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<ExperienceDTO> updateExperience(
            @PathVariable Long id,
            @RequestBody UpdateExperienceRequestDTO dto) {
        ExperienceEntity experience = new ExperienceEntity();
        experience.setCompanyName(dto.getCompanyName());
        experience.setDescription(dto.getDescription());
        experience.setStartDate(dto.getStartDate());
        experience.setEndDate(dto.getEndDate());
        experience.setDisplayOrder(dto.getDisplayOrder());

        ExperienceEntity updated = service.updateExperience(id, experience);
        ExperienceDTO responseDTO = ResumeMapper.convertExperienceDTO(updated);

        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/experiences/reorder")
    public ResponseEntity<List<ExperienceDTO>> reorderExperiences(
            @RequestBody List<ReorderExperienceItemDTO> items) {
        List<ExperienceEntity> updated = service.reorderExperiences(items);
        List<ExperienceDTO> responseDTOs = updated.stream()
                .map(ResumeMapper::convertExperienceDTO)
                .toList();
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/links/{index}")
    public ResponseEntity<Link> updateLink(
            @PathVariable int index,
            @RequestBody UpdateLinkRequestDTO dto) {
        Link link = new Link(dto.getLabel(), dto.getUrl());
        Link updated = service.updateLink(index, link);

        return ResponseEntity.ok(updated);
    }

}
