package com.lopesmarcello.portfolio.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String headerImageUrl;
    private LocalDateTime createdAt;
}
