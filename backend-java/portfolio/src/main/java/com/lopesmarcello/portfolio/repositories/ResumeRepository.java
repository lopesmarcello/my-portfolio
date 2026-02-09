package com.lopesmarcello.portfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lopesmarcello.portfolio.entities.ResumeEntity;

public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

}
