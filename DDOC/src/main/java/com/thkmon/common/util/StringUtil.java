package com.thkmon.common.util;

import java.net.URLEncoder;

public class StringUtil {

	public static int parseInt(String str) {
		return parseInt(str, 0);
	}
	
	
	public static int parseInt(String str, int defaultValue) {
		if (str == null) {
			return defaultValue;
		}

		int result = defaultValue;

		try {
			result = Integer.parseInt(str);
		} catch (Exception e) {
			result = defaultValue;
		}
		
		return result;
	}
	
	public static String encodeUTF8(String str) {
		if (str == null || str.length() == 0) {
			return "";
		}
		
		String result = "";
		
		try {
			result = URLEncoder.encode(str, "UTF-8");
		} catch (Exception e) {
			result = "";
		}
		
		return result;
	}
	
	public static String parseString(Object obj) {
		if (obj == null) {
			return "";
		}

		String result = "";
		
		try {
			result = String.valueOf(obj);
			
			if (result == null) {
				result = "";
			}
			
		} catch (Exception e) {
			result = "";
		}
		
		return result;
	}
}