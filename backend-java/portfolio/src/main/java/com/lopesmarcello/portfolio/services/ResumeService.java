package com.lopesmarcello.portfolio.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.dtos.ReorderExperienceItemDTO;
import com.lopesmarcello.portfolio.dtos.ResumeResponseDTO;
import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;
import com.lopesmarcello.portfolio.entities.ResumeEntity;
import com.lopesmarcello.portfolio.mappers.ResumeMapper;
import com.lopesmarcello.portfolio.repositories.ExperienceRepository;
import com.lopesmarcello.portfolio.repositories.ResumeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository repository;
    private final ExperienceRepository experienceRepository;

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

    @Transactional
    public ExperienceEntity addExperience(ExperienceEntity experience) {
        ResumeEntity resume = repository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        experience.setResume(resume);
        return experienceRepository.save(experience);
    }

    @Transactional
    public void removeExperience(Long experienceId) {
        ExperienceEntity experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new EntityNotFoundException("Experience not found"));

        if (experience.getResume() == null || !experience.getResume().getId().equals(1L)) {
            throw new RuntimeException("Experience does not belong to resume ID 1");
        }

        experienceRepository.delete(experience);
    }

    @Transactional
    public ExperienceEntity updateExperience(Long experienceId, ExperienceEntity updatedExperience) {
        ExperienceEntity experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new EntityNotFoundException("Experience not found"));

        if (experience.getResume() == null || !experience.getResume().getId().equals(1L)) {
            throw new RuntimeException("Experience does not belong to resume ID 1");
        }

        experience.setCompanyName(updatedExperience.getCompanyName());
        experience.setDescription(updatedExperience.getDescription());
        experience.setStartDate(updatedExperience.getStartDate());
        experience.setEndDate(updatedExperience.getEndDate());
        experience.setDisplayOrder(updatedExperience.getDisplayOrder());

        return experienceRepository.save(experience);
    }

    @Transactional
    public List<ExperienceEntity> reorderExperiences(List<ReorderExperienceItemDTO> items) {
        List<ExperienceEntity> updated = new ArrayList<>();
        for (ReorderExperienceItemDTO item : items) {
            ExperienceEntity experience = experienceRepository.findById(item.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Experience not found: " + item.getId()));

            if (experience.getResume() == null || !experience.getResume().getId().equals(1L)) {
                throw new RuntimeException("Experience does not belong to resume ID 1");
            }

            experience.setDisplayOrder(item.getDisplayOrder());
            updated.add(experienceRepository.save(experience));
        }
        return updated;
    }

    @Transactional
    public Link updateLink(int index, Link updatedLink) {
        ResumeEntity resume = repository.findByIdWithLinks(1L)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (index < 0 || index >= resume.getLinks().size()) {
            throw new RuntimeException("Link index out of bounds");
        }

        Link link = resume.getLinks().get(index);
        link.setLabel(updatedLink.getLabel());
        link.setUrl(updatedLink.getUrl());

        repository.save(resume);
        return link;
    }
}
