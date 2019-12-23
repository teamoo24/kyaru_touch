// enchant.js本体やクラスをエクスポートする
enchant();

const ASSETS = {
	// スタート画像を追加
	start : './img/start.png',
	// ゲームオーバー画像を追加
	end : './img/end.png',
	// キャルイメージ
	kyaru_title : './img/kyaru_all.png',
	
	// 選択音
	se_ok : './sound/se/se_ok.mp3',
	// メインメニュbgm
	bgm_mainmenu : './sound/bgm/bgm_mainmenu.mp3'
}

const canvas = {
	width : 320,
	height : 320
}

const SCENE = {
	title:1,
	main_menu:2,
	main_game:3
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
	h:48
}

const title_kyaru = {
	w: 287,
	h: 198
}

var Title = enchant.Class.create(enchant.Sprite,{
	initialize: function() {
		// 「var player = new Sprite(,)」 = 「enchant.Sprite.call(this,,0)」 
		enchant.Sprite.call(this, title.w, title.h);

		this.image = game.assets['start']
		this.x = title.x;
		this.y = title.y;
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

var se_ok, mainmenu_bgm;

window.onload = function() {
	game = new Core(canvas.width, canvas.height)
	game.fps = 30;
	game.preload(ASSETS);
	game.onload = function(){
		se_ok = new SoundEffect();
		se_ok.set(game.assets['se_ok'],1)

		mainmenu_bgm = new Bgm()

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
				var main = new MainMenuScene();
		}
	}
});

var MainMenuScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		enchant.Scene.call(this);
		// 画面初期処理
		game.replaceScene(this);

		this.backgroundColor = "#fff"
		mainmenu_bgm.set(game.assets['bgm_mainmenu']);

		var title = new Title()
		var title_kya = new Title_Kya()
		var frame_num = 0;

		this.addEventListener(Event.ENTER_FRAME, function(){

			mainmenu_bgm.loop()

			this.addChild(title)

			if(this.age%10 == 0) {
				frame_num = this.age/10
			}

			title_kya.chage_frame(frame_num%5)
			this.addChild(title_kya)

			if(!mainmenu_bgm.isPlay) {
				mainmenu_bgm.play();
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