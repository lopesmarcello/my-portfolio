package com.lopesmarcello.portfolio.entities;

import java.util.ArrayList;
import java.util.List;

import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.embeddables.Technology;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "about")
public class AboutEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String aboutText;

    @ElementCollection
    @CollectionTable(name = "about_technologies", joinColumns = @JoinColumn(name = "about_id"))
    private List<Technology> technologies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "about_links", joinColumns = @JoinColumn(name = "about_id"))
    private List<Link> links = new ArrayList<>();

}
