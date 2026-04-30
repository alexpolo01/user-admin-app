package com.admin.userprofile.service;

import com.admin.userprofile.dto.AddressRequest;
import com.admin.userprofile.dto.UserUpdateRequest;
import com.admin.userprofile.model.Address;
import com.admin.userprofile.model.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final Map<String, User> userStore = new ConcurrentHashMap<>();

    public UserService() {
        seedData();
    }

    private void seedData() {
        List<User> users = List.of(
            User.builder()
                .id("u1")
                .email("alex.morgan@acme.com")
                .firstName("Alex")
                .lastName("Morgan")
                .role("Admin")
                .status("Active")
                .addresses(new ArrayList<>(List.of(
                    Address.builder().id("a1").street("123 Maple Avenue").city("San Francisco").state("CA").zipCode("94102").country("USA").primary(true).build(),
                    Address.builder().id("a2").street("456 Oak Street").city("Oakland").state("CA").zipCode("94601").country("USA").primary(false).build()
                )))
                .build(),

            User.builder()
                .id("u2")
                .email("priya.sharma@acme.com")
                .firstName("Priya")
                .lastName("Sharma")
                .role("Editor")
                .status("Active")
                .addresses(new ArrayList<>(List.of(
                    Address.builder().id("a3").street("789 Pine Road").city("Austin").state("TX").zipCode("73301").country("USA").primary(true).build()
                )))
                .build(),

            User.builder()
                .id("u3")
                .email("jordan.lee@acme.com")
                .firstName("Jordan")
                .lastName("Lee")
                .role("Viewer")
                .status("Inactive")
                .addresses(new ArrayList<>(List.of(
                    Address.builder().id("a4").street("22 Harbor Drive").city("Seattle").state("WA").zipCode("98101").country("USA").primary(true).build(),
                    Address.builder().id("a5").street("8 Rainy Lane").city("Portland").state("OR").zipCode("97201").country("USA").primary(false).build(),
                    Address.builder().id("a6").street("300 Cascade Blvd").city("Bellevue").state("WA").zipCode("98004").country("USA").primary(false).build()
                )))
                .build(),

            User.builder()
                .id("u4")
                .email("sam.rivera@acme.com")
                .firstName("Sam")
                .lastName("Rivera")
                .role("Editor")
                .status("Active")
                .addresses(new ArrayList<>())
                .build(),

            User.builder()
                .id("u5")
                .email("claire.dubois@acme.com")
                .firstName("Claire")
                .lastName("Dubois")
                .role("Admin")
                .status("Active")
                .addresses(new ArrayList<>(List.of(
                    Address.builder().id("a7").street("10 Rue de la Paix").city("Paris").state("IDF").zipCode("75001").country("France").primary(true).build()
                )))
                .build()
        );

        users.forEach(u -> userStore.put(u.getId(), u));
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(userStore.values());
    }

    public Optional<User> getUserById(String id) {
        return Optional.ofNullable(userStore.get(id));
    }

    public Optional<User> updateUser(String id, UserUpdateRequest request) {
        User user = userStore.get(id);
        if (user == null) return Optional.empty();

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        return Optional.of(user);
    }

    public Optional<Address> addAddress(String userId, AddressRequest request) {
        User user = userStore.get(userId);
        if (user == null) return Optional.empty();

        if (request.isPrimary()) {
            user.getAddresses().forEach(a -> a.setPrimary(false));
        }

        Address address = Address.builder()
            .id("a" + UUID.randomUUID().toString().substring(0, 8))
            .street(request.getStreet())
            .city(request.getCity())
            .state(request.getState())
            .zipCode(request.getZipCode())
            .country(request.getCountry())
            .primary(request.isPrimary() || user.getAddresses().isEmpty())
            .build();

        user.getAddresses().add(address);
        return Optional.of(address);
    }

    public Optional<Address> updateAddress(String userId, String addressId, AddressRequest request) {
        User user = userStore.get(userId);
        if (user == null) return Optional.empty();

        return user.getAddresses().stream()
            .filter(a -> a.getId().equals(addressId))
            .findFirst()
            .map(address -> {
                if (request.isPrimary()) {
                    user.getAddresses().forEach(a -> a.setPrimary(false));
                }
                address.setStreet(request.getStreet());
                address.setCity(request.getCity());
                address.setState(request.getState());
                address.setZipCode(request.getZipCode());
                address.setCountry(request.getCountry());
                address.setPrimary(request.isPrimary());
                return address;
            });
    }

    public boolean deleteAddress(String userId, String addressId) {
        User user = userStore.get(userId);
        if (user == null) return false;
        return user.getAddresses().removeIf(a -> a.getId().equals(addressId));
    }
}
