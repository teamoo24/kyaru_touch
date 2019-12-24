// enchant.js本体やクラスをエクスポートする
enchant();

const ASSETS = {
	// スタート画像を追加
	title_font : './img/title_font.png',
	// ゲームオーバー画像を追加
	end : './img/end.png',
	// キャルイメージ
	kyaru_title : './img/kyaru_all.png',
	// スタートボタン
	start_button : './img/start_button.png',
	// トマト画像
	tomato : './img/tomato.png',
	// エモーション画像を追加
	emotion : './img/emotion.png',
	// タイムアップ画像を追加
	timeup : './img/timeup.png',

	// 選択音
	se_ok : './sound/se/se_ok.mp3',
	// キャルクリック
	se_true : './sound/se/se_true.mp3',
	// 他のキャラクリック
	se_false : './sound/se/se_false.mp3',

	// メインメニュbgm
	bgm_mainmenu : './sound/bgm/bgm_mainmenu.mp3',
	// メインゲームbgm
	bgm_maingame : './sound/bgm/bgm_maingame.mp3'
}
const end_s = {
	x : 0,
	y : 0
}
const canvas = {
	width : 320,
	height : 320
}
const SCENE = {
	title:1,
	main_menu:2,
	main_game:3,
}
const start_s = {
	x:40,
	y:160,
	w:320,
}
const title = {
	x:40,
	y:40,
	w:236,
	h:96
}
const title_kyaru = {
	w: 287,
	h: 198
}
const start_button = {
	w:100,
	h:80
}
const tomato_s = {
	w:96,
	h:96
}

var se_ok, mainmenu_bgm, maingame_bgm, se_true, se_false;

SPEED = 2;

var End = enchant.Class.create(enchant.Sprite, {
	initialize : function() {
		// 「var player = new Sprite(,)」 = 「enchant.Sprite.call(this,,0)」 
		enchant.Sprite.call(this, 189, 97);

		this.image = game.assets['end']
		this.x = canvas.width/5;
		this.y = canvas.height/3;
	}
});
var Title = enchant.Class.create(enchant.Sprite,{
	initialize: function() {
		// 「var player = new Sprite(,)」 = 「enchant.Sprite.call(this,,0)」 
		enchant.Sprite.call(this, title.w, title.h);

		this.image = game.assets['title_font']
		this.x = title.x;
		this.y = title.y;
	}
});

var StartButton = enchant.Class.create(enchant.Sprite, {
	initialize: function() {
		enchant.Sprite.call(this, start_button.w, start_button.h);

		this.image = game.assets['start_button']
		this.x = start_button.w/10;
		this.y = canvas.height - start_button.h*2 + start_button.h/2;
	}
});

var Title_Kya = enchant.Class.create(enchant.Sprite, {
	initialize: function() {
		enchant.Sprite.call(this, title_kyaru.w, title_kyaru.h);

		this.image = game.assets['kyaru_title']
		this.x = canvas.width - title_kyaru.w+43;
		this.y = canvas.height - title_kyaru.h;
		this.frame = 0;
	},
	chage_frame: function(number) {
		this.frame = number;
	}
});

var Tomato = enchant.Class.create(enchant.Sprite, {
	// 「initialize」メソッド(コンストラクタ)
	initialize: function(x,y,is_over,scene) {
		// 継承元をコール
		enchant.Sprite.call(this, tomato_s.w, tomato_s.h);
		// スプライトの画像に「tomato.png」を設定する
		this.image = game.assets['tomato']
		this.x = x; //x座標
		this.y = y; //y座標
		this.frame = rand(3); // フレーム番号
		this.tick = 0 //経過時間
		
		// 「enterframe」イベントリスナ
		this.addEventListener(Event.ENTER_FRAME, function(){
			// 1秒間で実行する処理
			if(game.frame % game.fps == 0) {
				// 経過秒数をカウントする
				this.tick++;
				// 2秒経過したなら、「remove」メソッドを実行する
				if (this.tick>SPEED) this.remove(scene)
			}
		});

		// 「touchstart」イベントリスナ
		this.addEventListener(Event.TOUCH_END, function(){
			// ゲームオーバーではないとき
			if(!is_over) {
				// 赤いトマト（フレーム番号が「2」）にタッチ
				if (this.frame == 2) {
					game.score += 1; // スコア + 10点	
					se_true.play()
				}

				// 黄色いトマト(フレーム番号が「1」)にタッチ
				if (this.frame == 1) {
					game.score -= 1; // スコア - 1点
					se_false.play()
				}

				// 緑色いトマト(フレーム番号が「0」)にタッチ
				if (this.frame == 0) {
					game.score -= 1; // スコア - 1点
					se_false.play()
				}

				// 「remove」メソッドを実行し、シーンから削除
				this.remove(scene);
			}
		});
		scene.addChild(this)
	},
	remove: function(scene) {
		// このスプライトをシーンから削除
		scene.removeChild(this)
		// このスプライトを削除
		delete this;
	}
});

window.onload = function() {
	game = new Core(canvas.width, canvas.height)
	game.fps = 30;
	game.score = 0;
	game.timelimit = 30;
	game.high_score = parseInt(localStorage.getItem("best_hatsune")) || game.score;

	game.preload(ASSETS);
	game.onload = function(){
		se_ok = new SoundEffect();
		se_ok.set(game.assets['se_ok'],1)

		mainmenu_bgm = new Bgm()
		maingame_bgm = new Bgm()

		system = new System();
		system.changeScene(SCENE.title)
	}
	game.start();
}

var System = enchant.Class.create({
	initialize: function() {
		this.rootScene;
	},
	// シーン切り替え
	changeScene: function(sceneNumber) {
		switch (sceneNumber) {
			case SCENE.title:
				var title = new TitleScene();
				// statements_1
				break;
			case SCENE.main_menu:
				var main_menu = new MainMenuScene();
				break;
			case SCENE.main_game:
				var main_game = new MainGameScene();
		}
	}
});

var ResultScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
		// 画面初期処理
		game.replaceScene(this);

		this.backgroundColor = "#fff"
	}
})

var MainGameScene = enchant.Class.create(enchant.Scene,{
	initialize: function(){
		enchant.Scene.call(this);
		// 画面初期処理
		game.replaceScene(this);

		var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);

		se_true = new SoundEffect();
		se_true.set(game.assets['se_true'],9)

		se_false = new SoundEffect();
		se_false.set(game.assets['se_false'],9)

		maingame_bgm.set(game.assets['bgm_maingame']);

		this.backgroundColor = "#fff"

		// 引数はラベル表示位置のxy座標
		var scoreLabel = new ScoreLabel(160,0);
		// スコアの初期値
		scoreLabel.score = 0;
		// イージング表示なしに設定する
		scoreLabel.easing = 0;
		screen.addChild(scoreLabel);

		// 制限時間(残り時間)のフォントで表示するラベルを作成する
		// 引数はラベル表示位置のxy座標
		var timeLabel = new MutableText(10,0)

		// 表示する文字列の初期設定
		timeLabel.text ='TIME:' + game.timelimit;
		screen.addChild(timeLabel)

		var is_bgm_play = true;
		var is_over = false;
		var end = new End();

		this.addEventListener(Event.ENTER_FRAME, function(){

			maingame_bgm.loop()

			if(!maingame_bgm.isPlay && is_bgm_play) {
				maingame_bgm.play();
			}

			// スコアを更新数
			scoreLabel.score = game.score;

			if (game.frame % game.fps == 0) {
				// 制限時間を１秒ずつカウントダウンする
				if (game.timelimit <= 0) {
					// 制限時間が「0」ならタイムアップの画像を表示して終了
					is_over = true;
				} else {
					game.timelimit --;
				}
				timeLabel.text ='TIME:' + game.timelimit;
			}

			// ランダム(「10」か「20」か「30」フレーム毎に)にトマトのスプライトを作成する
			if (game.frame % ((rand(3)+1)*10) == 0) {
				// 表示位置のxy座標は0~320(32ピクセル刻み)の範囲でランダム
				var tomato = new Tomato(rand((canvas.width/tomato_s.w)-1)*tomato_s.w + 16,rand((canvas.height/tomato_s.h)-1)*tomato_s.h + 16,is_over,screen)
			}

			if(is_over) {
				screen.addChild(end)
				this.from = this.age;
			}

		});
	}
});

var MainMenuScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
		// 画面初期処理
		game.replaceScene(this);

		this.backgroundColor = "#fff"

		var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);

		mainmenu_bgm.set(game.assets['bgm_mainmenu']);

		var title = new Title()
		var title_kya = new Title_Kya()
		var start_button = new StartButton()

		var frame_num = 0;
		var is_bgm_play = true;

		var high_score = new MutableText(title.x,title.y/4)

		high_score.text ='High Score: ' + game.high_score;

		screen.addChild(high_score)

		screen.addChild(title)
		screen.addChild(start_button)

		var isStartPushed = false;

		var from;

		start_button.addEventListener(Event.TOUCH_END, function() {
			if(!isStartPushed) {
				isStartPushed = !isStartPushed;
			}
			if(is_bgm_play) {
				is_bgm_play = !is_bgm_play
			}
			mainmenu_bgm.stop()
			se_ok.play();//効果音

			// this.age:スプライトを書きだして何フレーム動いたか
			from = this.age;
		});

		// フェードアウト用のオブジェクト
		var fade_out = new FadeOut(canvas.width, canvas.height, "#fff")

		this.addEventListener(Event.ENTER_FRAME, function(){

			mainmenu_bgm.loop()

			if(this.age%10 == 0) {
				frame_num = this.age/10
			}

			title_kya.chage_frame(frame_num%5)
			screen.addChild(title_kya)

			if(!mainmenu_bgm.isPlay && is_bgm_play) {
				mainmenu_bgm.play();
			}

			if(isStartPushed) {
				if(start_button.visible) {
					start_button.visible = !start_button.visible
				} else {
					start_button.visible = !start_button.visible
				}
				if(this.age - from > 20){//20フレーム後にフェードアウト
					fade_out.start(screen);
				}
			}

			if(fade_out.do(0.1)){//trueが帰ってきたらフェードアウト後の処理へ
				removeChildren(this);//子要素を削除
				system.changeScene(SCENE.main_game);
			}
		});
	}
});

var TitleScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
		// 画面初期処理
		game.replaceScene(this);

		this.backgroundColor = "black";//背景色

		var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        var start_button = new MutableText(canvas.width/6, canvas.height/2, start_s.w);

		start_button.setText("Touch to start")

		screen.addChild(start_button);

		// スタートボタンの押下チェック
		var isStartPushed = false;
		this.addEventListener(Event.TOUCH_END,function(e){
			if(!isStartPushed) {
				isStartPushed = !isStartPushed;
			}
			se_ok.play();//効果音

			// this.age:スプライトを書きだして何フレーム動いたか
			this.from = this.age;
		});

		// フェードアウト用のオブジェクト
		var fade_out = new FadeOut(canvas.width, canvas.height, "#fff")

		// タイトル画面シーンのループ
		this.addEventListener(Event.ENTER_FRAME, function(){
			if(isStartPushed) {
				if(start_button.visible) {
					start_button.visible = !start_button.visible
				} else {
					start_button.visible = !start_button.visible
				}
				if(this.age - this.from > 20){//20フレーム後にフェードアウト
					fade_out.start(screen);
				}
			}

			if(fade_out.do(0.1)){//trueが帰ってきたらフェードアウト後の処理へ
				removeChildren(this);//子要素を削除
				system.changeScene(SCENE.main_menu);
			}
		});
	}
});