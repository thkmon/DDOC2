package com.thkmon.login;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.thkmon.common.properties.OptionProperties;
import com.thkmon.common.util.JsonUtil;
import com.thkmon.common.util.StringUtil;

/**
 * 네이버 API를 사용해서 로그인 구현
 *
 */
@Service
public class LoginService {
	
	private String naverClientID = OptionProperties.NAVER_CLIENT_ID;
	private String naverClientSecret = OptionProperties.NAVER_CLIENT_SECRET;
	
	
	/**
	 * 네이버 로그인 URL 주소 가져오기
	 * 
	 * @param session
	 * @return
	 */
	public String getNaverLoginUrl(HttpSession session, HttpServletRequest request) {
		String clientId = naverClientID; // 애플리케이션 클라이언트 아이디값";
		String redirectURI = "";
		if (request.getRequestURL().indexOf("localhost") > -1) {
			redirectURI = StringUtil.encodeUTF8("http://localhost:8080/loginCallback");
		} else {
			redirectURI = StringUtil.encodeUTF8("http://ddoc.kr/loginCallback");
		}
		
		SecureRandom random = new SecureRandom();
		String state = new BigInteger(130, random).toString();

		StringBuffer apiURL = new StringBuffer();
		apiURL.append("https://nid.naver.com/oauth2.0/authorize?response_type=code");
		apiURL.append("&client_id=").append(clientId);
		apiURL.append("&redirect_uri=").append(redirectURI);
		apiURL.append("&state=").append(state);
		session.setAttribute("state", state);

		return apiURL.toString();
	}
	
	
	/**
	 * 네이버 로그인 콜백 결과로부터 사용자 아이디 가져오기
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public String getNaverUserIdFromLoginCallback(HttpServletRequest request) throws Exception {
		String naverUserId = "";
		
		String clientId = naverClientID; // 애플리케이션 클라이언트 아이디값";
		String clientSecret = naverClientSecret; // 애플리케이션 클라이언트 시크릿값";
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		String redirectURI = StringUtil.encodeUTF8("YOUR_CALLBACK_URL");
		
		StringBuffer apiURL = new StringBuffer();
		apiURL.append("https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&");
		apiURL.append("client_id=").append(clientId);
		apiURL.append("&client_secret=").append(clientSecret);
		apiURL.append("&redirect_uri=").append(redirectURI);
		apiURL.append("&code=").append(code);
		apiURL.append("&state=").append(state);
		
		String loginCallbackResult = get(apiURL.toString());
			
		String jsonString = loginCallbackResult;
		JSONObject jsonObj = JsonUtil.parseJsonObject(jsonString);
		String accessToken = JsonUtil.getString(jsonObj, "access_token");
		String refreshToken = JsonUtil.getString(jsonObj, "refresh_token");
		String tokenType = JsonUtil.getString(jsonObj, "token_type");
		String expiresIn = JsonUtil.getString(jsonObj, "expires_in");
			
		naverUserId = getNaverUserId(accessToken);
		return naverUserId;
	}
	
	
	/**
	 * 네이버 사용자 아이디 가져오기
	 * 
	 * @param accessToken
	 * @return
	 * @throws Exception
	 */
	private String getNaverUserId(String accessToken) throws Exception {
		String naverUserId = "";
		
		if (accessToken == null || accessToken.length() == 0) {
			return "";
		}
		
		String token = accessToken; // 네이버 로그인 접근 토큰;
		String header = "Bearer " + token; // Bearer 다음에 공백 추가

		String apiURL2 = "https://openapi.naver.com/v1/nid/me";

		Map<String, String> requestHeaders = new HashMap<>();
		requestHeaders.put("Authorization", header);
		String responseBody = get(apiURL2, requestHeaders);

		if (responseBody != null && responseBody.length() > 0) {
			JSONObject jsonObj = JsonUtil.parseJsonObject(responseBody);
			String resultcode = JsonUtil.getString(jsonObj, "resultcode");
			String message = JsonUtil.getString(jsonObj, "message");
			JSONObject responseObj = JsonUtil.getJsonObject(jsonObj, "response");
			String id = JsonUtil.getString(responseObj, "id");
			String nickname = JsonUtil.getString(responseObj, "nickname");
			String profileImage = JsonUtil.getString(responseObj, "profile_image");
			String email = JsonUtil.getString(responseObj, "email");
			String name = JsonUtil.getString(responseObj, "name");
			
			if (email != null && email.length() > 0 && email.indexOf("@naver.com") > -1) {
				String slice = email.substring(0, email.indexOf("@naver.com"));
				slice = slice.trim();
				if (slice != null && slice.length() > 0) {
					naverUserId = slice;
				}
			}
		}
		
		return naverUserId;
	}
	
	
	/**
	 * 특정 URL 에 대한 결과 responseBody 가져오기
	 * 네이버에서 제공한 소스코드 보완해서 사용
	 * 
	 * @param apiURL
	 * @return
	 * @throws Exception
	 */
	private String get(String apiURL) throws Exception {
		String result = "";
		
		HttpURLConnection con = null;
		BufferedReader bufferedReader = null;
		InputStreamReader inputStreamReader = null;
		InputStream inputStream = null;
		
		try {
			URL url = new URL(apiURL);
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			int responseCode = con.getResponseCode();
			
			if (responseCode == 200) { // 정상 호출
				inputStream = con.getInputStream();
				inputStreamReader = new InputStreamReader(inputStream);
				bufferedReader = new BufferedReader(inputStreamReader);
			} else { // 에러 발생
				inputStream = con.getErrorStream();
				inputStreamReader = new InputStreamReader(inputStream);
				bufferedReader = new BufferedReader(inputStreamReader);
			}
			
			String inputLine = "";
			StringBuffer res = new StringBuffer();
			while ((inputLine = bufferedReader.readLine()) != null) {
				res.append(inputLine);
			}
			
			if (responseCode == 200) {
				result = res.toString();
			}
			
		} catch (Exception e) {
			throw e;
			
		} finally {
			close(inputStream);
			close(inputStreamReader);
			close(bufferedReader);
			close(con);
		}
		
		return result;
	}
	
	
	/**
	 * 특정 URL 에 대한 결과 responseBody 가져오기
	 * 네이버에서 제공한 소스코드 보완해서 사용
	 * 
	 * @param apiUrl
	 * @param requestHeaders
	 * @return
	 * @throws Exception
	 */
	private String get(String apiUrl, Map<String, String> requestHeaders) throws Exception {
		String responseBody = "";
		
		HttpURLConnection con = null;
		InputStream inputStream = null;
		
		try {
			con = connect(apiUrl);
			con.setRequestMethod("GET");
			for (Map.Entry<String, String> header : requestHeaders.entrySet()) {
				con.setRequestProperty(header.getKey(), header.getValue());
			}

			int responseCode = con.getResponseCode();
			if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
				inputStream = con.getInputStream();
				responseBody = readBody(inputStream);
			} else { // 에러 발생
				inputStream = con.getErrorStream();
				responseBody = readBody(inputStream);
			}
			
		} catch (IOException e) {
			throw new RuntimeException("API 요청과 응답 실패", e);
			
		} finally {
			close(inputStream);
			close(con);
		}
		
		return responseBody;
	}
	
	
	/**
	 * HttpURLConnection 객체 얻기
	 * 네이버에서 제공한 소스코드 보완해서 사용
	 * 
	 * @param apiUrl
	 * @return
	 */
	private HttpURLConnection connect(String apiUrl) {
		HttpURLConnection con = null;
		
		try {
			URL url = new URL(apiUrl);
			con = (HttpURLConnection) url.openConnection();
			
		} catch (MalformedURLException e) {
			close(con);
			throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
			
		} catch (IOException e) {
			close(con);
			throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
		}
		
		return con;
	}
	
	
	/**
	 * responseBody 읽기
	 * 네이버에서 제공한 소스코드 보완해서 사용
	 * 
	 * @param body
	 * @return
	 */
	private String readBody(InputStream body) {
		StringBuilder responseBody = new StringBuilder();
		
		InputStreamReader streamReader = null;
		BufferedReader lineReader = null;
		
		try {
			streamReader = new InputStreamReader(body);
			lineReader = new BufferedReader(streamReader);

			String line;
			while ((line = lineReader.readLine()) != null) {
				responseBody.append(line);
			}

		} catch (IOException e) {
			throw new RuntimeException("API 응답을 읽는데 실패했습니다.", e);
		} finally {
			close(lineReader);
			close(streamReader);
		}
		
		return responseBody.toString();
	}
	
	
	/**
	 * 객체 닫기
	 * 
	 * @param con
	 */
	private void close(HttpURLConnection con) {
		try {
			if (con != null) {
				con.disconnect();
			}
		} catch (NullPointerException e) {
		} catch (Exception e) {
		} finally {
			con = null;
		}
	}
	
	
	/**
	 * 객체 닫기
	 * 
	 * @param obj
	 */
	private void close(InputStream obj) {
		try {
			if (obj != null) {
				obj.close();
			}
		} catch (NullPointerException e) {
		} catch (Exception e) {
		} finally {
			obj = null;
		}
	}
	
	
	/**
	 * 객체 닫기
	 * 
	 * @param obj
	 */
	private void close(BufferedReader obj) {
		try {
			if (obj != null) {
				obj.close();
			}
		} catch (NullPointerException e) {
		} catch (Exception e) {
		} finally {
			obj = null;
		}
	}
	
	
	/**
	 * 객체 닫기
	 * 
	 * @param obj
	 */
	private void close(InputStreamReader obj) {
		try {
			if (obj != null) {
				obj.close();
			}
		} catch (NullPointerException e) {
		} catch (Exception e) {
		} finally {
			obj = null;
		}
	}
}