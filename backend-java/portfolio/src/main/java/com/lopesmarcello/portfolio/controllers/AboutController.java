package com.lopesmarcello.portfolio.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lopesmarcello.portfolio.dtos.AboutResponseDTO;
import com.lopesmarcello.portfolio.dtos.AddTechnologyRequestDTO;
import com.lopesmarcello.portfolio.dtos.UpdateAboutRequestDTO;
import com.lopesmarcello.portfolio.dtos.UpdateLinkRequestDTO;
import com.lopesmarcello.portfolio.dtos.UpdateTechnologyRequestDTO;
import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.embeddables.Technology;
import com.lopesmarcello.portfolio.mappers.AboutMapper;
import com.lopesmarcello.portfolio.services.AboutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor
public class AboutController {

    private final AboutService service;

    @GetMapping("/")
    public ResponseEntity<AboutResponseDTO> getAbout() {
        AboutResponseDTO about = service.getAbout();
        return ResponseEntity.ok(about);
    }

    @PostMapping("/")
    public ResponseEntity<AboutResponseDTO> createAbout(@RequestBody UpdateAboutRequestDTO dto) {
        AboutResponseDTO responseDTO = service.createAbout(AboutMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/")
    public ResponseEntity<AboutResponseDTO> updateAbout(@RequestBody UpdateAboutRequestDTO dto) {
        AboutResponseDTO responseDTO = service.updateAbout(AboutMapper.toEntity(dto));
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/technologies")
    public ResponseEntity<Technology> addTechnology(@RequestBody AddTechnologyRequestDTO dto) {
        Technology technology = new Technology(dto.getName(), dto.getImageUrl());
        Technology saved = service.addTechnology(technology);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/technologies/{index}")
    public ResponseEntity<Technology> updateTechnology(
            @PathVariable int index,
            @RequestBody UpdateTechnologyRequestDTO dto) {
        Technology technology = new Technology(dto.getName(), dto.getImageUrl());
        Technology updated = service.updateTechnology(index, technology);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/technologies/{index}")
    public ResponseEntity<Void> removeTechnology(@PathVariable int index) {
        service.removeTechnology(index);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/links")
    public ResponseEntity<Link> addLink(@RequestBody UpdateLinkRequestDTO dto) {
        Link link = new Link(dto.getLabel(), dto.getUrl());
        Link saved = service.addLink(link);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/links/{index}")
    public ResponseEntity<Link> updateLink(
            @PathVariable int index,
            @RequestBody UpdateLinkRequestDTO dto) {
        Link link = new Link(dto.getLabel(), dto.getUrl());
        Link updated = service.updateLink(index, link);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/links/{index}")
    public ResponseEntity<Void> removeLink(@PathVariable int index) {
        service.removeLink(index);
        return ResponseEntity.noContent().build();
    }
}
