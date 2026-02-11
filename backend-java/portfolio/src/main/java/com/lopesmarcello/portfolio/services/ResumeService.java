package com.lopesmarcello.portfolio.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.dtos.ResumeResponseDTO;
import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;
import com.lopesmarcello.portfolio.entities.ResumeEntity;
import com.lopesmarcello.portfolio.mappers.ResumeMapper;
import com.lopesmarcello.portfolio.repositories.ResumeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository repository;

    @Transactional
    public ResumeResponseDTO getResume() {
        Long resumeId = 1L;

        ResumeEntity resume = repository.findByIdBasic(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        List<ExperienceEntity> experiences = repository.findExperiencesByResumeId(resumeId);

        ResumeEntity resumeWithLinks = repository.findByIdWithLinks(resumeId).orElse(resume);
        List<Link> links = new ArrayList<>(resumeWithLinks.getLinks());

        return ResumeResponseDTO.builder()
                .id(resume.getId())
                .fullName(resume.getFullName())
                .email(resume.getEmail())
                .phone(resume.getPhone())
                .about(resume.getAbout())
                .title(resume.getTitle())
                .links(links)
                .experiences(experiences.stream()
                        .map(ResumeMapper::convertExperienceDTO).toList())
                .build();

    }

    @Transactional
    public ResumeResponseDTO createResume(ResumeEntity resume) {
        if (resume.getId() == null) {
            ResumeEntity saved = repository.save(resume);
            ResumeResponseDTO responseDTO = ResumeMapper.toResponseDTO(saved);
            return responseDTO;
        }

        ResumeEntity existing = repository.findById(resume.getId())
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));
        existing.setFullName(resume.getFullName());
        existing.setAbout(resume.getAbout());
        existing.setEmail(resume.getEmail());
        existing.setPhone(resume.getPhone());
        existing.setTitle(resume.getTitle());

        if (resume.getLinks() != null && !resume.getLinks().isEmpty()) {
            existing.getLinks().clear();
            existing.getLinks().addAll(resume.getLinks());
        }

        if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
            existing.getExperiences().clear();
            existing.getExperiences().addAll(resume.getExperiences());
        }

        ResumeEntity saved = repository.save(existing);
        ResumeResponseDTO responseDTO = ResumeMapper.toResponseDTO(saved);

        return responseDTO;
    }

    @Transactional
    public ResumeResponseDTO updateResume(ResumeEntity newResume) {
        ResumeEntity existing = repository.findByIdWithLinks(1L)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Initialize experiences collection within transaction
        existing.getExperiences().size();

        existing.setId(1L);
        existing.setFullName(newResume.getFullName());
        existing.setTitle(newResume.getTitle());
        existing.setEmail(newResume.getEmail());
        existing.setPhone(newResume.getPhone());
        existing.setAbout(newResume.getAbout());

        if (newResume.getLinks() != null && !newResume.getLinks().isEmpty()) {
            existing.getLinks().clear();
            existing.getLinks().addAll(newResume.getLinks());
        }

        if (newResume.getExperiences() != null && !newResume.getExperiences().isEmpty()) {
            existing.getExperiences().clear();
            existing.getExperiences().addAll(newResume.getExperiences());
        }

        ResumeEntity saved = repository.save(existing);
        ResumeResponseDTO responseDTO = ResumeMapper.toResponseDTO(saved);

        return responseDTO;
    }
}
