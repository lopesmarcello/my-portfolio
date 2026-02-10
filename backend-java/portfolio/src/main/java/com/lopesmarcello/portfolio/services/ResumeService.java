package com.lopesmarcello.portfolio.services;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.entities.ResumeEntity;
import com.lopesmarcello.portfolio.repositories.ResumeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository repository;

    public ResumeEntity getResume() {
        return repository.findByIdWithDetails(1L).orElse(new ResumeEntity());
    }

    @Transactional
    public ResumeEntity createResume(ResumeEntity resume) {
        if (resume.getId() == null) {
            return repository.save(resume);
        }

        ResumeEntity existing = repository.findByIdWithDetails(resume.getId())
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));
        existing.setFullName(resume.getFullName());
        existing.setAbout(resume.getAbout());
        existing.setEmail(resume.getEmail());
        existing.setPhone(resume.getPhone());
        existing.setTitle(resume.getTitle());

        return repository.save(existing);
    }

    public ResumeEntity updateResume(ResumeEntity newResume) {
        ResumeEntity existing = repository.findByIdWithDetails(1L)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
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

        return repository.save(existing);
    }

    @Transactional
    public ResumeEntity getResume(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

}
