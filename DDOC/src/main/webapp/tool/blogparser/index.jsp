<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.thkmon.common.util.PermUtil"%>
<%
	if (!PermUtil.isAdmin(request)) {
		return;
	}
%>
<!DOCTYPE html>
<html>
<head>
	<title>DDOC</title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
    <link href="/css/base.css" rel="stylesheet">
    
    <script type="text/javascript" src="/js/jquery.js"></script>
    <script type="text/javascript">
    	function onclick_button_insert() {
    		$.ajax({
    			url : "/tool/blogparser/insert",
    			headers : {
    				"access-type" : "AJAX"
    			},
    			type : "POST",
    			dataType : "text",
    			cache : false,
    			data : $.param({
    			}, true),
    			success : function(result) {
    				alert("result : " + result);
    			},
    			error : function(e) {
    				alert("error : " + e);
    				return false;
    			}
    		});
    	}
    	
    	
		function onclick_button_update() {
			var postNo = $("#input_update").val();
			
			$.ajax({
    			url : "/tool/blogparser/update",
    			headers : {
    				"access-type" : "AJAX"
    			},
    			type : "POST",
    			dataType : "text",
    			cache : false,
    			data : $.param({
    				postNo : postNo
    			}, true),
    			success : function(result) {
    				alert("result : " + result);
    			},
    			error : function(e) {
    				alert("error : " + e);
    				return false;
    			}
    		});
    	}
    </script>
</head>
<body>
	<h1>BBBlogParser</h1>
	<br>
	<br>
		<p>
			최근 게시물 인서트&nbsp;<input type="button" id="button_insert" value="실행" onclick="onclick_button_insert();">
		</p>
	<br>
	<br>
		<p>
			업데이트&nbsp;<input type="text" id="input_update" />&nbsp;<input type="button" id="button_update" value="실행" onclick="onclick_button_update();">
		</p>
	<br>
	<br>
</body>
</html>