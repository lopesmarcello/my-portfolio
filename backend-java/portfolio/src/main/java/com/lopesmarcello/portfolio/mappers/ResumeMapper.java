package com.lopesmarcello.portfolio.mappers;

import com.lopesmarcello.portfolio.dtos.UpdateResumeRequestDTO;

import java.util.List;

import com.lopesmarcello.portfolio.dtos.ExperienceDTO;
import com.lopesmarcello.portfolio.dtos.ResumeResponseDTO;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;
import com.lopesmarcello.portfolio.entities.ResumeEntity;

public class ResumeMapper {
    public static ResumeEntity toEntity(UpdateResumeRequestDTO dto) {
        ResumeEntity entity = new ResumeEntity();
        entity.setFullName(dto.getFullName());
        entity.setTitle(dto.getTitle());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setAbout(dto.getAbout());
        entity.setLinks(dto.getLinks());
        entity.setExperiences(dto.getExperiences());

        return entity;
    }

    public static ResumeResponseDTO toResponseDTO(ResumeEntity entity) {
        List<ExperienceEntity> experiences = entity.getExperiences();

        return ResumeResponseDTO.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .about(entity.getAbout())
                .title(entity.getTitle())
                .links(entity.getLinks())
                .experiences(experiences.stream().map(ResumeMapper::convertExperienceDTO).toList())
                .build();
    }

    public static ExperienceDTO convertExperienceDTO(ExperienceEntity entity) {
        return ExperienceDTO.builder()
                .id(entity.getId())
                .companyName(entity.getCompanyName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .displayOrder(entity.getDisplayOrder())
                .build();

    }
}
