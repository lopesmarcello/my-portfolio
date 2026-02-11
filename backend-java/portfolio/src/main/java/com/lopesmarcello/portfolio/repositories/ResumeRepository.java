package com.lopesmarcello.portfolio.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lopesmarcello.portfolio.entities.ExperienceEntity;
import com.lopesmarcello.portfolio.entities.ResumeEntity;

public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

    @Query("SELECT r FROM ResumeEntity r WHERE r.id = :id")
    Optional<ResumeEntity> findByIdBasic(@Param("id") Long id);

    @Query("SELECT e FROM ExperienceEntity e WHERE e.resume.id = :resumeId ORDER BY e.startDate DESC")
    List<ExperienceEntity> findExperiencesByResumeId(@Param("resumeId") Long resumeId);

    @Query("SELECT r FROM ResumeEntity r LEFT JOIN FETCH r.links WHERE r.id = :id")
    Optional<ResumeEntity> findByIdWithLinks(@Param("id") Long id);

}
