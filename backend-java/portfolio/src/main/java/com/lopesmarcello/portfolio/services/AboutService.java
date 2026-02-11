package com.lopesmarcello.portfolio.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.dtos.AboutResponseDTO;
import com.lopesmarcello.portfolio.embeddables.Link;
import com.lopesmarcello.portfolio.embeddables.Technology;
import com.lopesmarcello.portfolio.entities.AboutEntity;
import com.lopesmarcello.portfolio.mappers.AboutMapper;
import com.lopesmarcello.portfolio.repositories.AboutRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AboutService {
    private final AboutRepository repository;

    @Transactional(readOnly = true)
    public AboutResponseDTO getAbout() {
        AboutEntity about = getAboutEntity();
        return AboutMapper.toResponseDTO(about);
    }

    public AboutResponseDTO createAbout(AboutEntity entity) {
        Optional<AboutEntity> existingOpt = repository.findFirstByOrderByIdAsc();
        if (existingOpt.isPresent()) {
            return updateAbout(entity);
        }

        AboutEntity created = repository.save(entity);
        initializeCollections(created);
        return AboutMapper.toResponseDTO(created);
    }

    public AboutResponseDTO updateAbout(AboutEntity partial) {
        AboutEntity existing = repository.findFirstByOrderByIdAsc()
                .orElse(new AboutEntity());

        if (partial.getName() != null) {
            existing.setName(partial.getName());
        }

        if (partial.getTitle() != null) {
            existing.setTitle(partial.getTitle());
        }

        if (partial.getDescription() != null) {
            existing.setDescription(partial.getDescription());
        }

        if (partial.getAboutText() != null) {
            existing.setAboutText(partial.getAboutText());
        }

        if (partial.getTechnologies() != null && !partial.getTechnologies().isEmpty()) {
            existing.getTechnologies().clear();
            existing.getTechnologies().addAll(partial.getTechnologies());
        }

        if (partial.getLinks() != null && !partial.getLinks().isEmpty()) {
            existing.getLinks().clear();
            existing.getLinks().addAll(partial.getLinks());
        }

        AboutEntity saved = repository.save(existing);
        initializeCollections(saved);
        return AboutMapper.toResponseDTO(saved);
    }

    private void initializeCollections(AboutEntity about) {
        about.getTechnologies().size();
        about.getLinks().size();
    }

    public Technology addTechnology(Technology technology) {
        AboutEntity about = getAboutEntity();

        about.getTechnologies().add(technology);
        repository.save(about);
        return technology;
    }

    public void removeTechnology(int index) {
        AboutEntity about = getAboutEntity();

        if (index < 0 || index >= about.getTechnologies().size()) {
            throw new RuntimeException("Technology index out of bounds");
        }

        about.getTechnologies().remove(index);
        repository.save(about);
    }

    public Technology updateTechnology(int index, Technology technology) {
        AboutEntity about = getAboutEntity();

        if (index < 0 || index >= about.getTechnologies().size()) {
            throw new RuntimeException("Technology index out of bounds");
        }

        about.getTechnologies().set(index, technology);
        repository.save(about);
        return technology;
    }

    public Link addLink(Link link) {
        AboutEntity about = getAboutEntity();

        about.getLinks().add(link);
        repository.save(about);
        return link;
    }

    public void removeLink(int index) {
        AboutEntity about = getAboutEntity();

        if (index < 0 || index >= about.getLinks().size()) {
            throw new RuntimeException("Link index out of bounds");
        }

        about.getLinks().remove(index);
        repository.save(about);
    }

    public Link updateLink(int index, Link link) {
        AboutEntity about = getAboutEntity();

        if (index < 0 || index >= about.getLinks().size()) {
            throw new RuntimeException("Link index out of bounds");
        }

        about.getLinks().set(index, link);
        repository.save(about);
        return link;
    }

    private AboutEntity getAboutEntity() {
        AboutEntity about = repository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("About section not found"));

        // Initialize collections to avoid LazyInitializationException
        initializeCollections(about);

        return about;
    }
}
