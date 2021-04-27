var Text = function(_clsName, _x, _y, _w, _h, _eq) {

	if (_x == null) {
		_x = 0;
	}
	if (_y == null) {
		_y = 0;
	}
	if (_w == null) {
		_w = 1;
	}
	if (_h == null) {
		_h = 1;
	}
	if (_eq == null) {
		_eq = "";
	}

	// 값 대입
	this.px = _x;
	this.py = _y;
	this.pw = _w;
	this.ph = _h;
	this.idName = _clsName;
	this.id = "#" + _clsName + _eq;
	this.removed = false;

	this.limLine = 7;
	this.curLine = 0;
	this.eq = _eq;

	var newDiv = "";
	newDiv = " <div id='" + _clsName + _eq + "' ";
	newDiv = newDiv + " class='" + _clsName + "' ";
	newDiv = newDiv + " style='left: " + _x + "px; ";
	newDiv = newDiv + " top: " + _y + "px; ";
	newDiv = newDiv + " width: " + _w + "px; ";
	newDiv = newDiv + " height: " + _h + "px; ";
	newDiv = newDiv + " position: absolute; ";

	newDiv = newDiv + " '></div>";

	$("body").append(newDiv);
}

Text.prototype.print = function(_msg) {
	var pre = $(this.id).html();
	if (this.curLine == 0) {
		this.curLine++;
		$(this.id).html(_msg);
		return true;
	}

	if (this.curLine == this.limLine) {
		var idx = pre.indexOf("<br>");
		pre = pre.substring(idx + 4);

		$(this.id).html(pre + "<br>" + _msg);

	} else {
		this.curLine++;
		$(this.id).html(pre + "<br>" + _msg);
	}
}