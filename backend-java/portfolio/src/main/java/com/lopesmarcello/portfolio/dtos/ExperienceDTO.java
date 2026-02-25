package com.lopesmarcello.portfolio.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDTO {
    private Long id;
    private String companyName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer displayOrder;
}