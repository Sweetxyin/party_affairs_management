package com.example.party_affairs_management.dao;

import com.example.party_affairs_management.model.UserDomain;

import java.util.List;

public interface UserDao {

    int insert(UserDomain record);



    List<UserDomain> selectUsers();
}
