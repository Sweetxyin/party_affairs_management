package com.example.party_affairs_management.controller;

import com.example.party_affairs_management.model.UserDomain;
import com.example.party_affairs_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value = "/login")
public class LoginController {
    @Autowired
    private UserService userService;

    @RequestMapping("/toLogin")
    public ModelAndView toLogin(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("login");
        return modelAndView;
    }
    @RequestMapping("/index")
    public ModelAndView toindex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("index");
        return modelAndView;
    }
}
