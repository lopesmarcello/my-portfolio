package com.lopesmarcello.portfolio.repositories

import com.lopesmarcello.portfolio.entities.AboutEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AboutRepository : JpaRepository<AboutEntity, Long>