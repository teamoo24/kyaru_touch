// enchant.js本体やクラスをエクスポートする
enchant();

// スタート画像を追加
const start = './img/start.png'
// ゲームオーバー画像を追加
const end = './img/end.png'

const canvas = {
	width : 320,
	height : 320
}

const start_s = {
	x:40,
	y:260,
	w:230,
	h:50
}

var Start_Button = enchant.Class.create(enchant.Sprite,{
	initialize: function(x,y,w,h) {
		// 「var player = new Sprite(,)」 = 「enchant.Sprite.call(this,,0)」 
		enchant.Sprite.call(this, w,h);

		this.image = game.assets[start]
		this.x = start_s.x;
		this.y = start_s.y;

		this.addEventListener(Event.TOUCH_END, function(e) {
			game.rootScene.removeChild(this)
		});
	}
});

window.onload = function() {
	game = new Core(canvas.width, canvas.heigt)
	game.fps = 30;
	game.preload(start, end);
	game.onload = function(){
		var start_button = new Start_Button(start_s.x,start_s.y,start_s.w,start_s.h);
		game.rootScene.addChild(start_button);
	}
	game.start();
}