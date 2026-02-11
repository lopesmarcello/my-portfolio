package com.lopesmarcello.portfolio.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLinkRequestDTO {
    private String label;
    private String url;
}
