package com.lopesmarcello.portfolio.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lopesmarcello.portfolio.entities.ResumeEntity;

public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

    @Query("SELECT r FROM ResumeEntity r " +
            "LEFT JOIN FETCH r.experiences " +
            "LEFT JOIN FETCH r.links " +
            "WHERE r.id = :id")
    Optional<ResumeEntity> findByIdWithDetails(@Param("id") Long id);

}
