package com.example.entity;

import javax.persistence.*;
import com.example.enums.FriendStatus;

@Entity
@Table(name="friend")
public class Friend {
	@Column(name="entryId")
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer entryId;
	private Integer userId1;
	private Integer userId2;
	@Enumerated(EnumType.STRING)
    private FriendStatus status;

	public Friend(){}
	public Friend(int entryId, int userId1, int userId2, FriendStatus status){
		this.entryId = entryId;
		this.userId1 = userId1;
		this.userId2 = userId2;
		this.status = status;
	}

	public int getEntryId(){
		return entryId;
	}
	public void setEntryId(int entryId){
		this.entryId = entryId;
	}

	public int getUserId1(){
		return userId1;
	}
	public void setUserId1(int userId1){
		this.userId1 = userId1;
	}

	public int getUserId2(){
		return userId2;
	}
	public void setUserId2(int userId2){
		this.userId2 = userId2;
	}

	public FriendStatus getStatus(){
		return status;
	}
	public void setStatus(FriendStatus status){
		this.status = status;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Friend other = (Friend) obj;
		if (userId1 == null) {
			if (other.userId1 != null)
				return false;
		} else if (!userId1.equals(other.userId1))
			return false;
		if (userId2 == null) {
			if (other.userId2 != null)
				return false;
		} else if (!userId2.equals(other.userId2))
			return false;
		if (status == null) {
			if (other.status != null)
				return false;
		} else if (!status.equals(other.status))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Friend{" +
				"userId1=" + userId1 +
				", userId2='" + userId2 + '\'' +
				", status='" + status + '\'' +
				'}';
	}
}