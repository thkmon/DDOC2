package com.thkmon.common.properties;

import java.util.HashMap;

import com.thkmon.common.util.PropertiesUtil;
import com.thkmon.common.util.StringUtil;

public class OptionProperties {
	public static final HashMap<String, String> optionProperties = PropertiesUtil.readPropertiesFile("/home/ec2-user/config/option.properties");
	
	public static final String DB_URL = optionProperties.get("db_url");
	public static final int DB_PORT = StringUtil.parseInt(optionProperties.get("db_port"));
	public static final String DB_NAME = optionProperties.get("db_name");
	
	public static final String DB_USER = optionProperties.get("db_user");
	public static final String DB_PASSWORD = optionProperties.get("db_password");
	
	public static final String FTP_URL = optionProperties.get("ftp_url");
	public static final int FTP_PORT = StringUtil.parseInt(optionProperties.get("ftp_port"));
	public static final String FTP_USER = optionProperties.get("ftp_user");
	public static final String FTP_PASSWORD = optionProperties.get("ftp_password");
	public static final String FTP_UPLOAD_DIR = optionProperties.get("ftp_upload_dir");
	public static final String SERVER_TEMP_DIR = optionProperties.get("server_temp_dir");
	
	public static final String NAVER_CLIENT_ID = optionProperties.get("naver_client_id");
	public static final String NAVER_CLIENT_SECRET = optionProperties.get("naver_client_secret");
}