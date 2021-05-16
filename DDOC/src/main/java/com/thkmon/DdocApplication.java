package com.thkmon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ComponentScan 을 위해 파일 위치를 com.thkmon.ddoc 에서 com.thkmon 으로 이동시켰음.
@SpringBootApplication
public class DdocApplication {

	public static void main(String[] args) {
		SpringApplication.run(DdocApplication.class, args);
	}
}