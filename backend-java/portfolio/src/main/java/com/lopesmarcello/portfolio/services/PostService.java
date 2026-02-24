package com.lopesmarcello.portfolio.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.entities.PostEntity;
import com.lopesmarcello.portfolio.repositories.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository repository;

    public List<PostEntity> listPosts() {
        return repository.findAll();
    }

    public Optional<PostEntity> getPost(Long id) {
        return repository.findById(id);
    }

    public PostEntity createPost(PostEntity post) {
        PostEntity created = repository.save(post);
        return created;
    }

    public void deletePost(Long id) {
        repository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        repository.deleteById(id);
    }

    public PostEntity updatePostPatch(Long id, PostEntity partialPost) {
        PostEntity existingPost = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (partialPost.getTitle() != null) {
            existingPost.setTitle(partialPost.getTitle());
        }

        if (partialPost.getContent() != null) {
            existingPost.setContent(partialPost.getContent());
        }

        if (partialPost.getHeaderImageUrl() != null) {
            existingPost.setHeaderImageUrl(partialPost.getHeaderImageUrl());
        }

        return repository.save(existingPost);
    }
}
