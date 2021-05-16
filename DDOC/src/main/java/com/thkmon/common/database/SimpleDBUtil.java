package com.thkmon.common.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class SimpleDBUtil {
	
	
	public static Connection getConnection(String dbUrl, int dbPort, String dbName, String dbUser, String dbPassword) {
		Connection conn = null;
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			
			String jdbcUrl = makeJdbcUrl(dbUrl, dbPort, dbName);
			
			// 데이터베이스 커넥션 생성
			conn = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
			conn.setAutoCommit(false);
			
		} catch (SQLException e) {
			e.printStackTrace();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return conn;
	}
	
	
	public static String makeJdbcUrl(String dbUrl, int dbPort, String dbName) {
		String jdbcUrl = "jdbc:mysql://" + dbUrl + ":" + dbPort + "/" + dbName + "?"
				+ "userUnicode=true&characterEncoding=utf8"
				+ "&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC"
				
				// Sun Nov 13 07:50:57 KST 2016 WARN: Establishing SSL connection without server's identity verification is not recommended.
				// According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set.
				// For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'.
				// You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
				
				+ "&useSSL=true";
		
		return jdbcUrl;
	}
	
	
	public static void close(PreparedStatement pst) {
		try {
			if (pst != null) {
				pst.close();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		} finally {
			pst = null;
		}
	}
	
	
	public static void rollbackAndClose(Connection conn) {
		
		try {
			if (conn != null) {
				conn.rollback();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		}
		
		try {
			if (conn != null) {
				conn.close();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		} finally {
			conn = null;
		}
	}
	
	
	public static void rollbackOnly(Connection conn) {
		
		try {
			if (conn != null) {
				conn.rollback();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		}
	}
	
	
	public static void commitAndClose(Connection conn) {
		
		try {
			if (conn != null) {
				conn.commit();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		}
		
		try {
			if (conn != null) {
				conn.close();
			}
			
		} catch (SQLException e) {
		} catch (Exception e) {
		} finally {
			conn = null;
		}
	}
}