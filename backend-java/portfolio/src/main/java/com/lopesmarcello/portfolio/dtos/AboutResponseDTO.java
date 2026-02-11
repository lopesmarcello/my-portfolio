package com.lopesmarcello.portfolio.dtos;

import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.embeddables.Technology;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutResponseDTO {
    private Long id;
    private String name;
    private String title;
    private String description;
    private String aboutText;
    private List<Technology> technologies;
    private List<Link> links;
}
