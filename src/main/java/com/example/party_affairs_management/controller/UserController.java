package com.example.party_affairs_management.controller;

import com.example.party_affairs_management.model.UserDomain;
import com.example.party_affairs_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserService userService;


    @RequestMapping("/add")
    public int insert(@RequestBody UserDomain record){
        return userService.insert(record);
    }
    @RequestMapping("/query")
    public List<UserDomain> selectUsers() {
     return  userService.selectUsers();
    }
    @ResponseBody
    @GetMapping("/all")
    public Object findAllUser(
            @RequestParam(name = "pageNum", required = false, defaultValue = "1")
                    int pageNum,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10")
                    int pageSize){
        return userService.findAllUser(pageNum,pageSize);
    }
}
