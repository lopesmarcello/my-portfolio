package com.lopesmarcello.portfolio.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lopesmarcello.portfolio.dtos.CreatePostRequestDTO;
import com.lopesmarcello.portfolio.dtos.CreatePostResponseDTO;
import com.lopesmarcello.portfolio.entities.PostEntity;
import com.lopesmarcello.portfolio.mappers.PostMapper;
import com.lopesmarcello.portfolio.services.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService service;

    @GetMapping("/")
    public ResponseEntity<List<PostEntity>> listPosts() {
        List<PostEntity> found = service.listPosts();
        if (found.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(found);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<PostEntity>> getPost(@PathVariable Long id) {
        Optional<PostEntity> found = service.getPost(id);
        if (found.isPresent()) {
            return ResponseEntity.ok(found);
        }
        return ResponseEntity.notFound().build();

    }

    @PostMapping("/")
    public ResponseEntity<CreatePostResponseDTO> createPost(@RequestBody @Valid CreatePostRequestDTO dto) {
        PostEntity entity = PostMapper.toEntity(dto);
        PostEntity saved = service.createPost(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(PostMapper.toResponseDTO(saved));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostEntity> updatePost(
            @PathVariable Long id,
            @RequestBody PostEntity partialPost) {
        PostEntity updated = service.updatePostPatch(id, partialPost);
        return ResponseEntity.ok(updated);
    }

}
