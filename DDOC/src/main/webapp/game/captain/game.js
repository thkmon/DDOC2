
$(document).ready(function() {

});

$(window).load(function() {
	try {
		initGame();

		setInterval("doLoop()", 10);

	} catch (e) {
		alert(e);
	}
});

function initGame() {
	// 초기설정
	$("body").append("<div id='canvas'></div>");

	// 전체 크기 설정
	$("#canvas").css("width", g_width);
	$("#canvas").css("height", g_height);

	// 콘솔 설정
	g_sys = new Text("console", 0, g_height + 2, g_width, 150);

	// 배경 별을 배열 설정
	var star_x = 0;
	var star_y = 0;
	var star_movePoint = 0;
	for (var i = 0; i < 5; i++) {
		star_x = Math.floor(Math.random() * (g_width - 1));
		star_y = Math.floor(Math.random() * (g_height - 1));
		star_movePoint = Math.floor(Math.random() * 10);
		star_movePoint = (star_movePoint == 0) ? 1 : star_movePoint;

		// g_unit.star[i] = new Unit( "star", star_x, star_y, 1, 1, i );
		var starDiv = "<div class='star' style='left: " + star_x + "px; top: " + star_y + "px; width: 1px; height: 1px; position: absolute'></div>"
		g_starMoving[i] = star_movePoint;// 별의 속도 조절
		// g_unit.star[i].hp = star_movePoint;
		$("body").append(starDiv);
	}

	// 주인공 캐릭터 설정
	g_unit.man = new Unit("man", 0, 0, 10, 10);

	// 총알을 배열 설정
	g_unit.bullet = [];
	for (var i = 0; i < 10; i++) {
		g_unit.bullet[i] = new Unit("bullet", -100, 600, 10, 10, i);
	}

	// 적 캐릭터 설정
	initEnemy();

	// 게임 스코어 설정
	var scoreDiv = "<div id='scoreDiv' style='width: " + g_width + "px; position: relative; left: 0; top: 0; height: 20px; z-index: 4;'></div>";

	$("body").append(scoreDiv);
	$("#scoreDiv").html("score : 0" + " / " + g_scoreGoal);

	g_sys.print("기관장님, 적 함대가 몰려오는 길목입니다. 소탕을 부탁드립니다.");
	g_sys.print("모선의 방향 조정은 Z 키로 하시면 됩니다.");
	g_sys.print("모선의 에너지탄 발사는 X 키로 하시면 됩니다.");
	g_sys.print("무운을 빕니다.");
	g_sys.print("(아, 잠시 대기하시려면 P 키를 누르시면 됩니다.)");
	g_sys.print(" ");

	var commentDiv = "<div id='commentDiv' style='width: " + g_width + "px; position: absolute; left: 0; top: 660px; height: 20px;'></div>";
	$("body").append(commentDiv);
	$("#commentDiv").text("방향조정: Z  /  발사: X  /  정지: P");

	var zDiv = "<div id='zDiv' class='key' style='width: 350px; height: 350px; position: absolute; top: 680px; left: 0px;' onclick='pressZ()'></div>";
	$("body").append(zDiv);
	$("#zDiv").text("Z");

	var xDiv = "<div id='xDiv' class='key' style='width: 350px; height: 350px; position: absolute; top: 680px; left: 400px;' onclick='pressX()'></div>";
	$("body").append(xDiv);
	$("#xDiv").text("X");

	// 게임 시작
	g_pause = false;
}

var g_time = 0;
var g_totalTime = 3;
var g_starMoving = [];

function doLoop() {

	// 정지 상태라면 루프 돌지 않음.
	if (g_pause) {
		return;
	}

	// 배경 별 이동시키기
	for (var i = 0; i < 5; i++) {
		var oldLeft = $(".star").eq(i).css("left");
		var newLeft = parseInt(oldLeft, 10) - parseInt(g_starMoving[i], 10);

		if (newLeft < 0) {
			$(".star").eq(i).css("left", g_width - 1);
		} else {
			$(".star").eq(i).css("left", newLeft);
		}
	}

	// 최상단 또는 최하단 벽에 부딪쳤는지 여부
	var isWallClash = false;
	
	// 주인공 캐릭터 이동
	if (g_goDown) {
		g_unit.man.addY(3);

		if (g_unit.man.py + g_unit.man.ph > g_height) {
			g_goDown = !g_goDown;
			isWallClash = true;
			// minusScore();
		}

	} else {
		g_unit.man.addY(-3);

		if (g_unit.man.py < 0) {
			g_goDown = !g_goDown;
			isWallClash = true;
			// minusScore();
		}
	}
	
	if (isWallClash && !g_gameOver) {
		if (g_msgNumber1 == 3) {
			g_sys.print("혹시 멀미약 갖고 계신가요?");
		} else if (g_msgNumber1 == 2) {
			g_sys.print("모선의 움직임이 불안정합니다. 똑바로 몰란 말이야!");
		} else if (g_msgNumber1 == 1) {
			g_sys.print("핸들 꽉 잡으세요!");
		} else {
			g_sys.print("기관장님, 모선이 흔들리고 있습니다. 운전에 유의해주세요.");
		}
		
		g_msgNumber1++
		if (g_msgNumber1 == 4) {
			g_msgNumber1 = 0;
		}
	}

	// 시간 증가 (적 이동 느리게 하기 위해서)
	g_time++;
	if (g_time == g_totalTime) {
		g_time = 0;
	}

	// 적 색상 돌려놓기
	g_unit.enemy.recoverColor();

	// 적 이동
	if (g_time == 0 && !g_gameOver) { // 시간이 0일때만 이동=> 느리게 이동시키기.

		if (g_unit.enemy.removed) {
			initEnemy();
		}
		g_unit.enemy.addX(-1);

		if (g_unit.enemy.px == 50) {
			g_sys.print("기관장님, 적 함선이 지나갑니다! 아무래도 가망이 없는 건가요?");
		} else if (g_unit.enemy.px == 100) {
			g_sys.print("기관장님, 적 함선이 포위망을 빠져나가고 있습니다. 이대로 보내실겁니까!");
		} else if (g_unit.enemy.px == 400) {
			g_sys.print("기관장님, 적 함선이 중간 라인을 넘었다는 소식입니다.");
		} else if (g_unit.enemy.px == 25) {
			g_sys.print("으아아아! 적 함선이! 함선 하나가! 지금!");
		} else if (g_unit.enemy.px == 0) {
			g_sys.print("흐이이익!");
			g_unit.man.remove();
			g_sys.print("Game Over");
			g_sys.print("기관장님, 그간 즐거웠습니다. 이제 제가 기관장으로 승진하는군요. 안녀엉.");
			g_gameOver = true;
		}
	}

	// 총알 이동
	var bx = 0;
	for (var i = 0; i < 10; i++) {
		bx = g_unit.bullet[i].getX();
		if (bx > 0 && bx < g_width - 10) {
			g_unit.bullet[i].addX(10);

		} else if (bx >= g_width - 10) {
			g_unit.bullet[i].setX(-100);
		}

		// 총알과 적의 충돌처리
		if (checkCrash(g_unit.bullet[i], g_unit.enemy)) {
			// g_sys.print( " Bullet " + i + " is crashed. " );
			g_unit.bullet[i].setX(-100);
			g_unit.enemy.crash();
			g_unit.enemy.addHp(-1);
		}
	}
}

// 총알 초기화
// _num번째 총알을 주인공 앞에 위치시킨다.
function initBullet(_num) {
	if (g_unit.bullet[_num].getX() < 0) {
		g_unit.bullet[_num].setX(g_unit.man.getX() + 11);
		g_unit.bullet[_num].setY(g_unit.man.getY());
	}
}

// 충돌처리 함수
// 다른거 필요없고 사각형 2개 충돌처리하자.
function checkCrash(_unit1, _unit2) {
	return checkCrashByVal(_unit1.px, _unit1.py, _unit1.pw, _unit1.ph, _unit2.px, _unit2.py, _unit2.pw, _unit2.ph);
}

function checkCrashByVal(_x1, _y1, _w1, _h1, _x2, _y2, _w2, _h2) {
	if (_x1 + _w1 >= _x2 && _x1 <= _x2 + _w2) {
		if (_y1 + _h1 >= _y2 && _y1 <= _y2 + _h2) {
			return true;
		}
	}
	return false;
}

// 적을 초기화
function initEnemy() {
	// 적 크기 설정
	if (g_unit.enemy != null) {
		g_unit.enemy.removed = false;
	}

	var enemy_width = 150;
	var enemy_height = 80;

	var enemy_y = Math.floor(Math.random() * (g_height - enemy_height));

	// 적의 hp 설정
	g_unit.enemy = new Unit("enemy", g_width - enemy_width, enemy_y, enemy_width, enemy_height);
	var enemy_hp = Math.floor(Math.random() * 30);
	g_unit.enemy.hp = enemy_hp;

	// 점수를 hp만큼 배분 => 점수는 무조건 적 하나당 10점으로 설정
	// g_unit.enemy.score = g_unit.enemy.hp;
	g_unit.enemy.score = 10;

	// 점수 초기화 (점수 표시를 위해 hp에 0을 더함.)
	g_unit.enemy.addHp(0);
}

// 양 사이드에 부딪쳐도 점수 마이너스하지 않도록 주석처리
/*
function minusScore() {
	g_score = parseInt(g_score, 10) - 1;
	$("#scoreDiv").text("score : " + g_score + " / " + g_scoreGoal);
}
*/