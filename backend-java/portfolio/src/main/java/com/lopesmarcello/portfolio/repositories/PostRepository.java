package com.lopesmarcello.portfolio.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lopesmarcello.portfolio.entities.PostEntity;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

    List<PostEntity> findAllByOrderByCreatedAtDesc();

}
