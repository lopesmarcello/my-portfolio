package com.lopesmarcello.portfolio.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.entities.AboutEntity;
import com.lopesmarcello.portfolio.repositories.AboutRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AboutService {
    private final AboutRepository repository;

    public Optional<AboutEntity> getAbout() {
        return repository.findById(1L);
    }

    public AboutEntity createAbout(AboutEntity entity) {
        AboutEntity created = repository.save(entity);
        return created;
    }

    public AboutEntity updateAbout(AboutEntity partial) {
        AboutEntity existing = repository.findById(1L)
                .orElse(new AboutEntity());

        existing.setId(1L);

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

        return repository.save(existing);
    }
}
