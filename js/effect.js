//内容：画面のフェードアウト
var FadeOut = enchant.Class.create(enchant.Sprite, {
    initialize: function(w, h, color) {
        enchant.Sprite.call(this, w, h);
        
        // Surface作成
        var bg = new Surface(w, h);
        bg.context.fillStyle = color;
        bg.context.fillRect(0, 0, w, h);
        // Sprite作成
        Sprite.call(this, w, h);
        this.image = bg;
        this.x = 0;
        this.y = 0;
        this.opacity = 0;
        this.isStart = false;
    },
    //フェードアウト開始初期処理(引数にシーンが必要)
    start: function(scene){
        if(!this.isStart){
            scene.addChild(this);
            this.isStart = true;
        }
    },
    //実行処理(先にstart()で初期処理しないと作動しない)
    do: function(speed){//引数：フェードアウトの速さ0.01~0.5(大きいほど速い)
        if(this.isStart){
            this.opacity += speed;
            if(this.opacity >= 1){//終わったらtrueを返す
                return true;
            }
            return false;
        }
    },
    stop: function(){
        this.isStart = false;
        this.opacity = 0;
    }
});

//内容:シーン内の子要素を全削除関数
function removeChildren(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}