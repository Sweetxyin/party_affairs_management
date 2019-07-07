package com.example.party_affairs_management;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.party_affairs_management.dao")
public class PartyAffairsManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PartyAffairsManagementApplication.class, args);
    }

}
