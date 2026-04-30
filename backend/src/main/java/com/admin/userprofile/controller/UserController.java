package com.admin.userprofile.controller;

import com.admin.userprofile.dto.AddressRequest;
import com.admin.userprofile.dto.UserUpdateRequest;
import com.admin.userprofile.model.Address;
import com.admin.userprofile.model.User;
import com.admin.userprofile.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable String id,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        return userService.updateUser(id, request)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<Address> addAddress(
        @PathVariable String userId,
        @Valid @RequestBody AddressRequest request
    ) {
        return userService.addAddress(userId, request)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Address> updateAddress(
        @PathVariable String userId,
        @PathVariable String addressId,
        @Valid @RequestBody AddressRequest request
    ) {
        return userService.updateAddress(userId, addressId, request)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
        @PathVariable String userId,
        @PathVariable String addressId
    ) {
        boolean deleted = userService.deleteAddress(userId, addressId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
