package com.lopesmarcello.portfolio.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderExperienceItemDTO {
    private Long id;
    private Integer displayOrder;
}
