window.onload = function() {
}


function convert2java_button_onclick() {
	
	try {
		var inputText = document.getElementById("input_area").value;
		inputText = highlightForJava(inputText);
		
		if (inputText != null) {
			inputText = replaceAll(inputText, "\r\n", "<br>");
			inputText = replaceAll(inputText, "\n", "<br>");
		}
	
		document.getElementById("output_area").innerText = inputText;
		document.getElementById("result_area").innerHTML = inputText;
	
	} catch (e) {
		alert(e);
	}
}


function convert2vba_button_onclick() {
	
	try {
		var inputText = document.getElementById("input_area").value;
		inputText = highlightForVBA(inputText);
		
		if (inputText != null) {
			inputText = replaceAll(inputText, "\r\n", "<br>");
			inputText = replaceAll(inputText, "\n", "<br>");
		}
	
		document.getElementById("output_area").innerText = inputText;
		document.getElementById("result_area").innerHTML = inputText;
		
	} catch (e) {
		alert(e);
	}
}


function convert2js_button_onclick() {
	
	try {
		var inputText = document.getElementById("input_area").value;
		inputText = highlightForJavaScript(inputText);
	
		if (inputText != null) {
			inputText = replaceAll(inputText, "\r\n", "<br>");
			inputText = replaceAll(inputText, "\n", "<br>");
		}
		
		document.getElementById("output_area").innerText = inputText;
		document.getElementById("result_area").innerHTML = inputText;
	
	} catch (e) {
		alert(e);
	}
}


function replaceAll(_str, _old, _new) {
	if (_str == null || _str.length == 0) {
		return "";
	}
	
	if (_old == null || _old.length == 0) {
		return _str;
	}
	
	if (_new == null) {
		_new = "";
	}
	
	var result = "";
	
	var oldLen = _old.length;
	var end = 0;
	
	var len = _str.length;
	for (var i=0; i<len; i++) {
		end = i + oldLen;
		if (end > len) {
			end = len;
		}
		
		if (_str.substring(i, end) === _old) {
			result += _new;
			i += oldLen - 1;
			continue;
		} else {
			result += _str.substring(i, i+1);
		}
	}
	
	return result;
}


function highlightForJava(_str) {
	if (_str == null || _str.length == 0) {
		return "";
	}
	
	var reservedList = [];
	reservedList[reservedList.length] = "package";
	reservedList[reservedList.length] = "import";
	
	reservedList[reservedList.length] = "class";
	reservedList[reservedList.length] = "interface";
	
	reservedList[reservedList.length] = "private";
	reservedList[reservedList.length] = "public";
	
	reservedList[reservedList.length] = "static";
	reservedList[reservedList.length] = "final";
	
	reservedList[reservedList.length] = "void";
	reservedList[reservedList.length] = "null";
	reservedList[reservedList.length] = "return";
	
	reservedList[reservedList.length] = "boolean";
	reservedList[reservedList.length] = "int";
	reservedList[reservedList.length] = "long";
	reservedList[reservedList.length] = "char";
	reservedList[reservedList.length] = "byte";

	reservedList[reservedList.length] = "for";
	
	reservedList[reservedList.length] = "if";
	reservedList[reservedList.length] = "else";
	reservedList[reservedList.length] = "else if";
	
	reservedList[reservedList.length] = "true";
	reservedList[reservedList.length] = "false";
	
	reservedList[reservedList.length] = "continue";
	reservedList[reservedList.length] = "break";
	
	reservedList[reservedList.length] = "new";
	
	reservedList[reservedList.length] = "throws";
	reservedList[reservedList.length] = "try";
	reservedList[reservedList.length] = "catch";
	reservedList[reservedList.length] = "finally";
	reservedList[reservedList.length] = "throw";
	
	var reservedLen = reservedList.length;
	
	var result = "";
	
	var bComment = false;
	var bMultiComment = false;
	var bDoubleQuote = false;
	
	var len = _str.length;
	for (var i=0; i<len; i++) {
		
		if (!bDoubleQuote && find(_str, i, "//")) {
			bComment = true;
			i++;
			
			result += "<span style=\"color: green;\">//";
			continue;
		}
		
		if (find(_str, i, "\r\n")) {
			// IE11
			if (bComment) {
				bComment = false;
				i++;
				
				result += "</span><br>";
				continue;
				
			} else {
				i++;
				
				result += "<br>";
				continue;
			}
		} else if (find(_str, i, "\n")) {
			// Chrome
			if (bComment) {
				bComment = false;
				
				result += "</span><br>";
				continue;
				
			} else {
				result += "<br>";
				continue;
			}
		}
		
		
		if (!bDoubleQuote && find(_str, i, "/*")) {
			bMultiComment = true;
			i++;
			
			result += "<span style=\"color: green;\">/*";
			continue;
		}
		
		if (bMultiComment && find(_str, i, "*/")) {
			bMultiComment = false;
			i++;
			
			result += "*/</span>";
			continue;
		}
		
		if (find(_str, i, "\t")) {
			result += "&nbsp;&nbsp;&nbsp;&nbsp;";
			continue;
		}
		
		if (find(_str, i, "<")) {
			result += "&lt;";
			continue;
		}
		
		if (find(_str, i, ">")) {
			result += "&gt;";
			continue;
		}
		
		// 쌍따옴표 앞의 연속된 역슬래시의 개수가 홀수이면 가짜따옴표다.
		if (findConsideringBackslash(_str, i, "\"")) {
			if (!bDoubleQuote) {
				bDoubleQuote = true;
				result += "<span style=\"color: blue;\">\"";
				continue;
			} else {
				bDoubleQuote = false;
				result += "\"</span>";
				continue;
			}
		}
		
		var ff = false;
		if (!bDoubleQuote && !bComment && !bMultiComment) {
			for (var k=0; k<reservedLen; k++) {
				if (find(_str, i, reservedList[k], true)) {
					result += "<span style=\"color: purple;\">" + reservedList[k] + "</span>";
					i += reservedList[k].length - 1;
					ff = true;
					break;
				}
			}
		}
		
		if (ff) {
			continue;
		}
		
		result += substring(_str, i, i+1);
	}
	
	return result;
}


function highlightForJavaScript(_str) {
	if (_str == null || _str.length == 0) {
		return "";
	}
	
	var reservedList = [];
	reservedList[reservedList.length] = "var";
	reservedList[reservedList.length] = "const";
	reservedList[reservedList.length] = "let";
	
	reservedList[reservedList.length] = "function";
//	reservedList[reservedList.length] = "private";
//	reservedList[reservedList.length] = "public";
	
//	reservedList[reservedList.length] = "void";
//	reservedList[reservedList.length] = "null";
	reservedList[reservedList.length] = "return";
	
//	reservedList[reservedList.length] = "boolean";
//	reservedList[reservedList.length] = "int";
//	reservedList[reservedList.length] = "long";
//	reservedList[reservedList.length] = "char";
//	reservedList[reservedList.length] = "byte";

	reservedList[reservedList.length] = "for";
	
	reservedList[reservedList.length] = "if";
	reservedList[reservedList.length] = "else";
	reservedList[reservedList.length] = "else if";
	
	reservedList[reservedList.length] = "true";
	reservedList[reservedList.length] = "false";
	
//	reservedList[reservedList.length] = "continue";
//	reservedList[reservedList.length] = "break";
	
	reservedList[reservedList.length] = "new";
	
//	reservedList[reservedList.length] = "throws";
	reservedList[reservedList.length] = "try";
	reservedList[reservedList.length] = "catch";
	reservedList[reservedList.length] = "finally";
	reservedList[reservedList.length] = "throw";
	
	var reservedLen = reservedList.length;
	
	var result = "";
	
	var bComment = false;
	var bMultiComment = false;
	var bDoubleQuote = false;
	
	var len = _str.length;
	for (var i=0; i<len; i++) {
		
		if (!bDoubleQuote && find(_str, i, "//")) {
			bComment = true;
			i++;
			
			result += "<span style=\"color: green;\">//";
			continue;
		}
		
		if (find(_str, i, "\r\n")) {
			// IE11
			if (bComment) {
				bComment = false;
				i++;
				
				result += "</span><br>";
				continue;
				
			} else {
				i++;
				
				result += "<br>";
				continue;
			}
		} else if (find(_str, i, "\n")) {
			// Chrome
			if (bComment) {
				bComment = false;
				
				result += "</span><br>";
				continue;
				
			} else {
				result += "<br>";
				continue;
			}
		}
		
		
		if (!bDoubleQuote && find(_str, i, "/*")) {
			bMultiComment = true;
			i++;
			
			result += "<span style=\"color: green;\">/*";
			continue;
		}
		
		if (bMultiComment && find(_str, i, "*/")) {
			bMultiComment = false;
			i++;
			
			result += "*/</span>";
			continue;
		}
		
		if (find(_str, i, "\t")) {
			result += "&nbsp;&nbsp;&nbsp;&nbsp;";
			continue;
		}
		
		if (find(_str, i, "<")) {
			result += "&lt;";
			continue;
		}
		
		if (find(_str, i, ">")) {
			result += "&gt;";
			continue;
		}
		
		// 쌍따옴표 앞의 연속된 역슬래시의 개수가 홀수이면 가짜따옴표다.
		if (findConsideringBackslash(_str, i, "\"")) {
			if (!bDoubleQuote) {
				bDoubleQuote = true;
				result += "<span style=\"color: blue;\">\"";
				continue;
			} else {
				bDoubleQuote = false;
				result += "\"</span>";
				continue;
			}
		}
		
		var ff = false;
		if (!bDoubleQuote && !bComment && !bMultiComment) {
			for (var k=0; k<reservedLen; k++) {
				if (find(_str, i, reservedList[k], true)) {
					result += "<span style=\"color: purple;\">" + reservedList[k] + "</span>";
					i += reservedList[k].length - 1;
					ff = true;
					break;
				}
			}
		}
		
		if (ff) {
			continue;
		}
		
		result += substring(_str, i, i+1);
	}
	
	return result;
}


function highlightForVBA(_str) {
	if (_str == null || _str.length == 0) {
		return "";
	}
	
	var reservedList = [];
	reservedList[reservedList.length] = "Call";
	reservedList[reservedList.length] = "End";
	
	reservedList[reservedList.length] = "Sub";
	reservedList[reservedList.length] = "Dim";
	reservedList[reservedList.length] = "Function";
	
	reservedList[reservedList.length] = "Exit";
	
	reservedList[reservedList.length] = "For";
	reservedList[reservedList.length] = "As";
	reservedList[reservedList.length] = "Input";
	reservedList[reservedList.length] = "Output";
	reservedList[reservedList.length] = "Append";
	
	reservedList[reservedList.length] = "On";
	reservedList[reservedList.length] = "Error";
	reservedList[reservedList.length] = "GoTo";
	
	reservedList[reservedList.length] = "Open";
	reservedList[reservedList.length] = "Close";
	
	reservedList[reservedList.length] = "Do";
	reservedList[reservedList.length] = "While";
	reservedList[reservedList.length] = "Not";
	reservedList[reservedList.length] = "Loop";
	
	reservedList[reservedList.length] = "Line";

	var reservedLen = reservedList.length;
	
	var result = "";
	
	var bComment = false;
	var bDoubleQuote = false;
	
	var len = _str.length;
	for (var i=0; i<len; i++) {
		
		if (!bComment && find(_str, i, "'")) {
			bComment = true;
			
			result += "<span style=\"color: green;\">'";
			continue;
		}
		
		if (find(_str, i, "\r\n")) {
			// IE11
			if (bComment) {
				bComment = false;
				i++;
				
				result += "</span><br>";
				continue;
				
			} else {
				i++;
				
				result += "<br>";
				continue;
			}
		} else if (find(_str, i, "\n")) {
			// Chrome
			if (bComment) {
				bComment = false;
				
				result += "</span><br>";
				continue;
				
			} else {
				result += "<br>";
				continue;
			}
		}
		
		if (find(_str, i, "\t")) {
			result += "&nbsp;&nbsp;&nbsp;&nbsp;";
			continue;
		}
		
		if (find(_str, i, " ")) {
			result += "&nbsp;";
			continue;
		}
		
		if (find(_str, i, "<")) {
			result += "&lt;";
			continue;
		}
		
		if (find(_str, i, ">")) {
			result += "&gt;";
			continue;
		}
		
		var ff = false;
		if (!bDoubleQuote && !bComment) {
			for (var k=0; k<reservedLen; k++) {
				if (find(_str, i, reservedList[k], true)) {
					result += "<span style=\"color: blue;\">" + reservedList[k] + "</span>";
					i += reservedList[k].length - 1;
					ff = true;
					break;
				}
			}
		}
			
		if (ff) {
			continue;
		}
		
		result += substring(_str, i, i+1);
	}
	
	return result;
}


// _str 문자열의 _idx 위치에 _text 문자가 위치하는지 찾기
function find(_str, _idx, _text, _bSeperate) {
	if (_str == null || _str.length == 0) {
		return false;
	}
	
	if (_text == null || _text.length == 0) {
		return false;
	}
	
	if (substring(_str, _idx, _idx + _text.length) == _text) {
		if (_bSeperate != null && _bSeperate == true) {
			var before = substring(_str, _idx - 1, _idx);
			var after = substring(_str, _idx + _text.length, _idx + _text.length + 1);
			
			if ((before.length == 0 || before == " " || before == "\t" || before == ")" || before == "\r" || before == "\n" || before == ";") &&
				(after.length == 0 || after == " " || after == "\t" || after == "(" || after == "\r" || after == "\n" || after == ";")) {
				return true;
			} else {
				return false;
			}
			
		} else {
			return true;
		}
	}
	
	return false;
}


// 역슬래시를 고려해서 _str 문자열의 _idx 위치에 _text 문자가 위치하는지 찾기
// 찾은 _text 문자 앞에 역슬래시 개수가 홀수인 경우 false를 리턴하기
// 역슬래시로 escape 처리를 하는 쌍따옴표 등 찾기에 적합한 함수임
function findConsideringBackslash(_str, _idx, _text) {
	if (_str == null || _str.length == 0) {
		return false;
	}
	
	if (_text == null || _text.length == 0) {
		return false;
	}
	
	if (substring(_str, _idx, _idx + _text.length) == _text) {
		
		var serialUnslashCount = 0;
		for (var i=_idx-1; i>=0; i--) {
			if (substring(_str, i, i+1) == "\\") {
				serialUnslashCount++;
			} else {
				break;
			}
		}
		
		if (serialUnslashCount == 0 || serialUnslashCount % 2 == 0) {
			return true;
		} else {
			return false;
		}
		
	} else {
		return false;
	}
}


// 오류가 발생하지 않는 서브스트링
function substring(_str, _b, _e) {
	if (_str == null || _str.length == 0) {
		return "";
	}
	
	if (_b < 0) {
		_b = 0;
	}
	
	var len = _str.length;
	if (_e > len) {
		_e = len;
	}
	
	return _str.substring(_b, _e);
}