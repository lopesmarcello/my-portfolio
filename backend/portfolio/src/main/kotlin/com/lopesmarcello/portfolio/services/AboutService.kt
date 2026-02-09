package com.lopesmarcello.portfolio.services

import com.lopesmarcello.portfolio.entities.AboutEntity
import com.lopesmarcello.portfolio.repositories.AboutRepository
import org.springframework.stereotype.Service

@Service
class AboutService(
    private val repository: AboutRepository
) {

    fun getAbout(): AboutEntity? {
        return repository.findById(1L).orElse(null)
    }

    fun createAbout(about: AboutEntity): AboutEntity? {
        if (repository.existsById(1L)) {
            throw IllegalStateException("About already exists. Use PUT to update")
        }
        val aboutWithId = about.copy(id = 1L)
        return repository.save(aboutWithId)
    }

    fun updateAbout(about: AboutEntity): AboutEntity? {
        if (!repository.existsById(1L)) {
            throw IllegalStateException("About do not exist")
        }

        val aboutWithId = about.copy(id = 1L)
        return repository.save(aboutWithId)
    }


}