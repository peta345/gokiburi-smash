// forked from ponta_room's "origin" http://jsdo.it/ponta_room/0viF
    // omazinai
    enchant();
    
    // teisu
    var SCREEN_WIDTH = 320;
    var SCREEN_HEIGHT = 320;
	var BUG_MAX_NUM = 10;
	var	BUG_WIDTH = 32; // BUGS WIDTH
	var BUG_HEIGHT = 32; // BUGS HEIGHT
	var BUG_SPEED = 4;
	var BUG_MOVE_TIME = 30;
	var BUG_WAIT_TIME = 30;
    
    // IMAGE
	var FIELD_IMAGE = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter03/floor.png";
	var GOKIBURI_IMAGE = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter03/bug.png";
	// アセットリスト　
	var ASSETS = [
		FIELD_IMAGE, GOKIBURI_IMAGE,
	];

    var game = null;
    
    var randfloat = function(min,max){
        return Math.random()*(max-min)+min;
    };
    
    window.onload = function(){
        //game object
        game  = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
		//画像の読み込み
		game.preload(ASSETS);
        
        //GAME START SETTING
        game.onload = function(){
            var scene = game.rootScene;
            scene.backgroundColor = "black";

			// 背景を生成
			var bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
			bg.image = game.assets[FIELD_IMAGE];
			scene.addChild(bg);

			//虫の数をセット
			game.bugNum = BUG_MAX_NUM;

			//虫の生成
			for (var i=0; i<BUG_MAX_NUM; ++i){
				var gokiburi = new Gokiburi();
				gokiburi.moveTo(randfloat(0, SCREEN_WIDTH-BUG_WIDTH), randfloat(0, SCREEN_HEIGHT-BUG_HEIGHT));
				scene.addChild(gokiburi);

			}

			//シーン更新時の処理
			scene.onenterframe = function(){
				//clear chexk
				if(game.bugNum <= 0){
					//game endx
					var time = Math.floor(game.frame/game.fps);
					var msg = time + "秒でクリアしました！";
					alert(msg);
					this.onenterframe = null;
				}
			};
        };
        
        game.start();
        
    };

var Gokiburi = Class.create(Sprite, {
	initialize: function(){
		Sprite.call(this, BUG_WIDTH, BUG_HEIGHT);
		this.image = game.assets[GOKIBURI_IMAGE];
		this.rotation = randfloat(0,360);
		this.timer = randfloat(0, BUG_MOVE_TIME);
		//移動処理をセット
		this.update = this.move;
	},

	//移動処理
	move: function(){
		//向いている方向に移動
		var angle = (this.rotation+270)*Math.PI/180;
		this.x += Math.cos(angle) * BUG_SPEED;
		this.y += Math.sin(angle) * BUG_SPEED;

		// FRAME ANIMATION
		this.frame = 1 - this.frame;

		// 待ちモードに切り替える
		if(this.timer > BUG_MOVE_TIME){
			this.timer = 0;
			this.update = this.wait;
		}
	},

	// 待ち処理
	wait : function(){
        console.log("fuga");
		//移動モードに切り替え
		if(this.timer  > BUG_WAIT_TIME){
			this.rotation = randfloat(0,360);
			this.timer = 0;
			this.update = this.move;
		}
	},
	
	//削除まち
	destroyWait: function(){
		this.opacity = 1- (this.timer/BUG_WAIT_TIME);
		if(this.timer > BUG_WAIT_TIME){
			this.parentNode.removeChild(this);
		}
	},
	//更新処理
	onenterframe: function(){
		//更新処理実行
		this.update();

		//timer reload
		this.timer += 1;
		
		//画面から出ないようにする
		var left = 0;
		var right = SCREEN_WIDTH - this.width;
		var top = 0;
		var bottom = SCREEN_HEIGHT - this.height;

		if(left>this.x) this.x = left;
		else if(right<this.x) this.x = right;
		if(top>this.y) this.y = top;
		else if(bottom<this.y) this.y = bottom;
	},
	// タッチ開始処理
	ontouchstart: function(){
		this.timer = 0;
		this.frame = 2;
		this.update = this.destroyWait;
		this.ontouchstatrt = null;
		game.bugNum -= 1;
	},
});
