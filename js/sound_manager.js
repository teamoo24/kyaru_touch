//************************************************************************
//内容：音の再生(同一音の複数同時再生可能）
var SoundEffect = enchant.Class.create({
    //ファイルセット関数(引数：ファイル、オブジェクト作成数(※必ず1以上)）
    set: function(data, max){
        this.sound = [];//サウンドオブジェクト保存用
        this.count = 0;//カウント用初期化
        this.max = max;//同時再生最大数
        for(var i = 0; i < this.max; i++){
            this.sound[i] = data.clone();    
        }
    },
    //再生関数(クローンを順繰りに再生) 
    play: function(){
        this.sound[this.count++].play();
        if(this.count >= this.max){
            this.count = 0;
        }
    },
    //一時停止(現在一時停止はできるが、鳴っていた音だけを続きから再生することができていない)
    pause: function(){
        for(var i = 0; i < this.max; i++){
            this.sound[i].pause();
        }
    }
});
//************************************************************************
//内容：BGM再生(ループ再生）、一時停止、停止
var Bgm = enchant.Class.create({
    initialize: function(){
        this.data = null;
        this.isPlay = false;//プレイの状態フラグ
        this.isPuase = false;
    },
    //BGM用音楽ファイルのセット
    set: function(data){
        this.data = data;
    },
    //再生(再生のみに使う)
    play: function(){
        this.data.play();
        this.isPlay = true;
        if(this.data.src != undefined){//srcプロパティを持っている場合(スマホの場合)
            this.data.src.loop = true;
        }
    },
    //再生(ループ無しの再生)
    playNoLoop: function(){
        this.data.play();
        this.isPlay = true;
        if(this.data.src != undefined){//srcプロパティを持っている場合(スマホの場合)
            this.data.src.loop = false;
        }
    },
    //ループ再生(必ずループ内に記述すること) PCでのループ再生で使う
    loop: function(){
        if(this.isPlay == true && this.data.src == undefined){//再生中でsrcプロパティを持っていない場合(PC)
            this.data.play();
            this.isPuase = false;//ポーズ画面から戻った場合は自動的に再生を再開させる（ポーズ解除を作るのが面倒だから）
        }else if(this.isPuase){//スマホでポーズ画面から戻ったとき用
            this.data.play();
            this.data.src.loop = true;//ポーズするとfalseになるっぽい(確認はしていない)
            this.isPuase = false;
        }
    },
    //再生停止(曲を入れ替える前は,必ずstop()させる)
    stop: function(){
        if(this.data != null){
            if(this.isPuase){
                this.isPlay = false;
                this.isPuase = false;
                this.data.currentTime = 0;
            }else if(this.isPlay){//プレイ中か？
                this.data.stop();
                this.isPlay = false;
            }
        }
    },
    //一時停止（ポーズ画面などの一時的な画面の切り替え時に音を止めたいときのみ使う）
    pause: function(){
        if(this.data != null){
            this.data.pause();
            this.isPuase = true;
        }
    }
});

