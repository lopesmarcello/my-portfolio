package com.lopesmarcello.portfolio.dtos;

import java.util.ArrayList;
import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateResumeResponseDTO {
    private Long id;
    private String fullName;
    private String title;
    private String email;
    private String phone;
    private String about;
    private List<Link> links = new ArrayList<>();
    private List<ExperienceEntity> experiences = new ArrayList<>();
    private Long version;
}