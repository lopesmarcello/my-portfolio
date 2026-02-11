package com.lopesmarcello.portfolio.dtos;

import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResumeResponseDTO {
    private Long id;
    private String fullName;
    private String title;
    private String email;
    private String phone;
    private String about;
    private List<Link> links;
    private List<ExperienceDTO> experiences;
    private Long version;
}