package com.lopesmarcello.portfolio.DTOs

import com.lopesmarcello.portfolio.entities.AboutEntity
import com.lopesmarcello.portfolio.entities.Featured
import com.lopesmarcello.portfolio.entities.Link
import com.lopesmarcello.portfolio.entities.Technology

data class AboutRequestDTO(
    val name: String = "Marcello Lopes",
    val title: String,
    val description: String,
    val about: String,
    val featured: Featured,
    val technologies: List<Technology> = emptyList(),
    val links: List<Link> = emptyList()
)

fun AboutRequestDTO.toEntity(): AboutEntity {
    return AboutEntity(
        name = this.name,
        title = this.title,
        description = this.description,
        about = this.about,
        featured = this.featured,
        technologies = this.technologies.toMutableList(),
        links = this.links.toMutableList(),
        id = 1L
    )
}