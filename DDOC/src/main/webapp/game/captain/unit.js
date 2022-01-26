var Unit = function(_clsName, _x, _y, _w, _h, _eq) {

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
	this.clsName = _clsName;
	this.id = "#" + _clsName + _eq;
	this.removed = false;
	this.eq = _eq;
	this.hp = 1;
	this.score = 1;

	var newDiv = "";
	newDiv = " <div id='" + _clsName + _eq + "' ";
	newDiv = newDiv + " class='" + _clsName + "' ";
	newDiv = newDiv + " style='left: " + _x + "px; ";
	newDiv = newDiv + " top: " + _y + "px; ";
	newDiv = newDiv + " width: " + _w + "px; ";
	newDiv = newDiv + " height: " + _h + "px; ";
	newDiv = newDiv + " position: absolute; ";

	newDiv = newDiv + " '></div>";

	$("#canvas").append(newDiv);

	this.backColor = $(this.id).eq(0).css("background-color");
}

Unit.prototype.addY = function addY(_i) {
	if (this.removed) {
		return false;
	}// 삭제시 무시
	this.py = parseInt(_i, 10) + parseInt(this.py, 10);

	$(this.id).eq(0).css("top", this.py);
}

Unit.prototype.addX = function addX(_i) {
	if (this.removed) {
		return false;
	}// 삭제시 무시
	// g_sys.print(this.px);
	this.px = parseInt(_i, 10) + parseInt(this.px, 10);
	$(this.id).eq(0).css("left", this.px);
}

Unit.prototype.setY = function setY(_i) {
	if (this.removed) {
		return false;
	}// 삭제시 무시
	this.py = _i
	$(this.id).eq(0).css("top", this.py);
}

Unit.prototype.setX = function setX(_i) {
	if (this.removed) {
		return false;
	}// 삭제시 무시
	this.px = _i
	$(this.id).eq(0).css("left", this.px);
}

Unit.prototype.getX = function getX(_cls) {
	// 삭제시 무시
	if (this.removed) {
		return -1;
	}

	return this.px;
}

Unit.prototype.getY = function getY(_cls) {
	// 삭제시 무시
	if (this.removed) {
		return -1;
	}

	return this.py;
}

Unit.prototype.remove = function remove() {
	// 삭제시 무시
	if (this.removed) {
		return -1;
	}
	
	this.removed = true;

	// $(this.id).eq(0).hide();
	$(this.id).eq(0).fadeOut('slow');
	$(this.id).eq(0).remove();

	// 점수 증가
	g_score = parseInt(g_score, 10) + parseInt(this.score, 10);
	$("#scoreDiv").text("score : " + g_score + " / " + g_scoreGoal);
}

// 이거 쓰면 느려..
/*
function getSum(_n1, _n2) {
	var sum = 0;

	_n1 = parseInt(_n1, 10);
	_n2 = parseInt(_n2, 10);
	sum = _n1 + _n2;

	return sum;
}
*/

Unit.prototype.crash = function crash() {
	$(this.id).eq(0).css("background-color", "white");
}

Unit.prototype.recoverColor = function recoverColor() {
	// 삭제시 무시
	if (this.removed) {
		return -1;
	}

	var currentCol = $(this.id).eq(0).css("background-color");
	// 현재컬러랑 다르면 돌려놓는다.
	if (this.backColor != currentCol) {
		$(this.id).eq(0).css("background-color", this.backColor);
	}
}

Unit.prototype.addHp = function addHp(_i) {
	this.hp = this.hp + _i;
	$(this.id).eq(0).text(this.hp);

	if (g_unit.enemy.hp <= 0) {
		// 삭제시 무시
		if (this.removed) {
			return false;
		}
		
		this.remove();

		if (g_score >= g_scoreGoal) {
			
			// 게임 종료 시 한 번만 출력하도록 처리
			if (!g_gameOver) {
				g_sys.print(" ");
				g_sys.print("Game Clear!");
				g_sys.print("기관장님, 마지막 적 함선을 폭파시켰다는 소식입니다. 축하드립니다!");
				g_sys.print("~ 플레이해주셔서 감사합니다 ~");
				// g_sys.print("2016년 8월 31일까지 아마추어 게임제작 대회가 열립니다. 주변 분들에게 홍보해주시는 것은 어떨까요?");
				// g_sys.print("똥똥배게임제작대회( ~ 2016년 8월 31일) : 누구나 참여 가능!");
			}
			
			g_gameOver = true;
			g_gameClear = true;
			
			return true;
		}

		if (g_msgNumber2 == 3) {
			g_sys.print("녀석을 우주 안드로메다로 보내버리셨군요. 잔인하십니다.");
		} else if (g_msgNumber2 == 2) {
			g_sys.print("한 마리 해치웠습니다. 한 마리 더 부탁해요!");
		} else if (g_msgNumber2 == 1) {
			g_sys.print("적이 흔적도 없이 사라져버렸네요. 궤멸시켜 버립시다.");
		} else {
			g_sys.print("적 함선 하나를 폭파시켰습니다. 바로 이 느낌이죠.");
		}
		
		g_msgNumber2++
		if (g_msgNumber2 == 4) {
			g_msgNumber2 = 0;
		}
	}
}