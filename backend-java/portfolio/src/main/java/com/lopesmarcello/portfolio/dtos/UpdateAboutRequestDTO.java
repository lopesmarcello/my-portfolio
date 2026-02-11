package com.lopesmarcello.portfolio.dtos;

import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.embeddables.Technology;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAboutRequestDTO {
    private String name;
    private String title;
    private String description;
    private String aboutText;
    private List<Technology> technologies;
    private List<Link> links;
}
