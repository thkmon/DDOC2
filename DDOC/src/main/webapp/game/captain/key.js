$(window).load(function() {
	// 키입력
	$("body").on("keypress", function(e) {
		pressKey(e);
	});

});

var g_bulletNum = 0;

function pressKey(e) {

	var code = e.keyCode;

	if (code == 112) {
		// p key
		g_pause = !g_pause;

		if (g_pause) {
			g_sys.print("Game Pause");
		} else {
			g_sys.print("Game Restart");
		}
	}

	if (g_pause) {
		return false;
	}

	// g_sys.print(code);

	// enter key : 13
	// z key : 122

	if (code == 122) {
		// z key
		pressZ();
	}

	// space bar : 32
	// x key : 120

	if (code == 120) {
		// x key
		pressX();
	}
}

function pressZ() {
	if (!g_gameClear && g_gameOver) {
		g_sys.print("이제 미련을 버리세요, 기관장님. 그간 즐거웠습니다.");
		return false;
	}

	g_goDown = !g_goDown;
}

function pressX() {
	if (!g_gameClear && g_gameOver) {
		g_sys.print("어허! 조종간에서 손 떼세요.");
		return false;
	}

	initBullet(g_bulletNum);

	// 총알 증가
	if (g_bulletNum < 9) {
		g_bulletNum++;
	} else {
		g_bulletNum = 0;
	}
}