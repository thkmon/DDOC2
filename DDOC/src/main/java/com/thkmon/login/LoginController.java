package com.thkmon.login;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {
	
	@Autowired
	private LoginService loginService = null;
	
	
	@RequestMapping(value = "/login")
	public String login(HttpSession session, HttpServletRequest request) {
		String loginUrl = loginService.getNaverLoginUrl(session, request);
		return "redirect:" + loginUrl;
	}
	
	
	@RequestMapping(value = "/loginCallback")
	public String loginCallback(HttpServletRequest request) {
		String naverUserId = "";
		try {
			naverUserId = loginService.getNaverUserIdFromLoginCallback(request);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("naverUserId ; " + naverUserId);
		if (naverUserId != null && naverUserId.length() > 0) {
			request.getSession().setAttribute("naverUserId", naverUserId);
		}
		
		return "redirect:index.jsp";
	}
}
