package com.lopesmarcello.portfolio.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddExperienceRequestDTO {
    private String companyName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer displayOrder;
}
