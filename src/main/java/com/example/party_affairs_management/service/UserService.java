package com.example.party_affairs_management.service;

import com.example.party_affairs_management.model.UserDomain;
import com.github.pagehelper.PageInfo;
import java.util.List;
public interface UserService {

    int insert(UserDomain record);

    List<UserDomain> selectUsers();

    PageInfo<UserDomain> findAllUser(int pageNum, int pageSize);
}
