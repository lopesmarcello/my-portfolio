package com.lopesmarcello.portfolio.entities

import jakarta.persistence.*


@Embeddable
data class Featured(
    val mainLink: String,
    val subLink1: String,
    val subLink2: String,
    val subLink3: String,
)

@Embeddable
data class Technology(
    val name: String,
    val imgUrl: String?
)

@Embeddable
data class Link(
    val description: String,
    val url: String
)

@Entity(name = "about")
data class AboutEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    val name: String,
    val title: String,
    val description: String,
    val about: String,

    @Embedded
    val featured: Featured,

    @ElementCollection
    val technologies: MutableList<Technology> = mutableListOf(),

    @ElementCollection
    val links: MutableList<Link> = mutableListOf(),
)