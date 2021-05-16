package com.thkmon.common.util;

import javax.servlet.http.HttpServletRequest;

public class PermUtil {
	public static boolean isAdmin(HttpServletRequest request) {
		if (request == null) {
			return false;
		}
		
		if (request.getSession() == null) {
			return false;
		}
		
		String naverUserId = StringUtil.parseString(request.getSession().getAttribute("naverUserId"));
		if (naverUserId != null && naverUserId.equals("bb_")) {
			return true;
		}
		
		return false;
	}
}