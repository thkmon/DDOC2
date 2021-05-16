package com.thkmon.blogparser;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.thkmon.common.util.PermUtil;

@Controller
public class BlogParserController {
	
	
	@Autowired
	private BlogParserService blogParserService = null;
	
	
	@RequestMapping(value = "/tool/blogparser", method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView index(HttpServletRequest request) {
		if (!PermUtil.isAdmin(request)) {
			return new ModelAndView("noperm.jsp");
		}
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("tool/blogparser/index.jsp");
		return mav;
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/tool/blogparser/insert", method = {RequestMethod.GET, RequestMethod.POST})
	public String insert(HttpServletRequest request) {
		if (!PermUtil.isAdmin(request)) {
			return "0";
		}
		
		System.out.println("/tool/blogparser/insert");
		
		String result = "0";
		
		try {
			if (blogParserService.insertRecentPosts()) {
				result = "1";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/tool/blogparser/update", method = {RequestMethod.GET, RequestMethod.POST})
	public String update(HttpServletRequest request, @RequestParam String postNo) {
		if (!PermUtil.isAdmin(request)) {
			return "0";
		}
		
		System.out.println("/tool/blogparser/update");
		
		String result = "0";
		
		try {
			if (postNo != null && postNo.length() > 0) {
				if (blogParserService.updateOnePost(postNo)) {
					result = "1";
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	
	
}