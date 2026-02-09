package com.lopesmarcello.portfolio.mappers;

import com.lopesmarcello.portfolio.dtos.CreatePostRequestDTO;
import com.lopesmarcello.portfolio.dtos.CreatePostResponseDTO;
import com.lopesmarcello.portfolio.entities.PostEntity;

public class PostMapper {

    public static PostEntity toEntity(CreatePostRequestDTO dto) {
        PostEntity entity = new PostEntity();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setHeaderImageUrl(dto.getHeaderImageUrl());
        return entity;
    }

    public static CreatePostResponseDTO toResponseDTO(PostEntity entity) {
        CreatePostResponseDTO dto = new CreatePostResponseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setHeaderImageUrl(entity.getHeaderImageUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
