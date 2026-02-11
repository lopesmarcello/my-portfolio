package com.lopesmarcello.portfolio.mappers;

import com.lopesmarcello.portfolio.dtos.AboutResponseDTO;
import com.lopesmarcello.portfolio.dtos.UpdateAboutRequestDTO;
import com.lopesmarcello.portfolio.entities.AboutEntity;

public class AboutMapper {

    public static AboutEntity toEntity(UpdateAboutRequestDTO dto) {
        AboutEntity entity = new AboutEntity();
        entity.setName(dto.getName());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setAboutText(dto.getAboutText());
        entity.setTechnologies(dto.getTechnologies());
        entity.setLinks(dto.getLinks());
        return entity;
    }

    public static AboutResponseDTO toResponseDTO(AboutEntity entity) {
        return AboutResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .aboutText(entity.getAboutText())
                .technologies(entity.getTechnologies())
                .links(entity.getLinks())
                .build();
    }
}
