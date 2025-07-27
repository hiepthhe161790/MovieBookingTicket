package com.example.jav_projecto1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JavProjecto1Application {

	public static final Logger logger = LoggerFactory.getLogger(JavProjecto1Application.class);


	public static void main(String[] args) {
		SpringApplication.run(JavProjecto1Application.class, args);
		logger.info("Application started successfully");
	}

	// @Bean
	// CommandLineRunner runner(runRespiratory runrespiratory)
	// {
	// 	return args -> {
	// 		Run run = new Run(1,"First Run",  LocalcDateTime.now(),LocalDateTime.now().plusHours(2), 69, Location.OUTDOOR);
	// 		logger.info("Run:" + run);
	// 		runrespiratory.create(run);
	// 	};
	// }

}
