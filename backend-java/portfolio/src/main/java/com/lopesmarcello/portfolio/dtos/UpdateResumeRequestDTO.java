package com.lopesmarcello.portfolio.dtos;

import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.entities.ExperienceEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResumeRequestDTO {
    private String fullName;
    private String title;
    private String email;
    private String phone;
    private String about;
    private List<Link> links;
    private List<ExperienceEntity> experiences;
}
