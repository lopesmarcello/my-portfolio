package com.lopesmarcello.portfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lopesmarcello.portfolio.entities.AboutEntity;

public interface AboutRepository extends JpaRepository<AboutEntity, Long> {
}
