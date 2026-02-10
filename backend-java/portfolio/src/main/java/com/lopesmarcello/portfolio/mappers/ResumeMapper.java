package com.lopesmarcello.portfolio.mappers;

import com.lopesmarcello.portfolio.dtos.UpdateResumeRequestDTO;
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

}
