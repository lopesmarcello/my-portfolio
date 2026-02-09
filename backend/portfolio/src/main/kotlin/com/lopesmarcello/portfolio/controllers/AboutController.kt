package com.lopesmarcello.portfolio.controllers

import com.lopesmarcello.portfolio.DTOs.AboutRequestDTO
import com.lopesmarcello.portfolio.DTOs.toEntity
import com.lopesmarcello.portfolio.entities.AboutEntity
import com.lopesmarcello.portfolio.services.AboutService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/about")
class AboutController(
    private val service: AboutService
) {
    @GetMapping
    fun getAbout(): ResponseEntity<AboutEntity> {
        val about = service.getAbout()
        return if (about != null) {
            ResponseEntity.ok(about)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createAbout(@RequestBody about: AboutRequestDTO): ResponseEntity<AboutEntity> {
        val about = service.createAbout(about.toEntity())
        return if (about != null) {
            ResponseEntity.ok().body(about);
        } else {
            ResponseEntity.unprocessableContent().build()
        }
    }

    @PutMapping
    fun updateAbout(@RequestBody about: AboutRequestDTO): ResponseEntity<AboutEntity> {
        val about = service.updateAbout(about.toEntity())
        return if (about != null) {
            ResponseEntity.ok().body(about);
        } else {
            ResponseEntity.unprocessableContent().build()
        }
    }
}