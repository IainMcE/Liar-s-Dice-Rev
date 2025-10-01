package com.example.repository;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Friend;
import com.example.enums.FriendStatus;

public interface FriendRepository extends JpaRepository<Friend, Long>{
	public List<Friend> findByUserId1OrUserId2(int userId1, int userId2);
	public Optional<Friend> findByUserId1AndUserId2(int userId1, int userId2);
}