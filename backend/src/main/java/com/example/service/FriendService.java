package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import com.example.entity.Friend;
import com.example.repository.FriendRepository;
import com.example.enums.FriendStatus;

import java.util.Optional;

@Service
public class FriendService{
	@Autowired
	FriendRepository friendRepository;

	public Friend friendStatus(int id1, int id2){
		Optional<Friend> status1 = friendRepository.findByUserId1AndUserId2(id1, id2);
		Optional<Friend> status2 = friendRepository.findByUserId1AndUserId2(id2, id1);
		if(status1.isPresent()){
			return status1.get();
		}else if(status2.isPresent()){
			return status2.get();
		}else{
			return null;
		}
	}

	public List<Friend> friendList(int userId){
		return friendRepository.findByUserId1OrUserId2(userId, userId);
	}

	public Friend addFriend(Friend friend){
		System.out.println(friend);
		friend.setStatus(FriendStatus.PENDING);
		System.out.println(friend);
		return friendRepository.save(friend);
	}

	public Friend acceptFriend(Friend friend){
		friend.setStatus(FriendStatus.CONFIRMED);
		return friendRepository.save(friend);
	}

	public void removeFriend(Friend friend){
		friendRepository.delete(friend);
	}
}