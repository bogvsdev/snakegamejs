(function(window, document){
var 
	COLS=60, ROWS = 30,

	EMPTY = 0, SNAKE = 1, FOOD = 2, WALL = 3, BONUS = 4,

	UP = 1, RIGHT = 2, DOWN = 3, LEFT = 4,

	KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN  = 40,

	game, grid, snake, canvas, ctx, frames, keystate, score, inter, 
	results = JSON.parse(localStorage.getItem('results')) || [], 
	shw = true, currSpeed, 
	defaultSpeed = 50,
	lengs = [2,3,4,5,6,7];

game = {
	init:function(){
		this.main();
	},
	loop:function(){
		game.update.call(this)
		game.draw.call(this);
	},
	main:function(){
		var self = this;
		canvas = document.createElement("canvas");
		canvas.width = COLS*20;
		canvas.height = ROWS*20;

		ctx = canvas.getContext('2d');

		ctx.font = "12px Open Sans";
		document.querySelector('.wrap').appendChild(canvas);
		frames = 0;

		keystate = {};
		document.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
		});
		document.addEventListener("keyup", function(evt) {
			delete keystate[evt.keyCode];
		});
		document.querySelector('#results').addEventListener("click", function(evt) {
			self.showResult(shw);
		});

		this.preinit();
	},
	preinit:function(){
		grid.init(EMPTY, COLS, ROWS);

		score = 0;
		
		var sp = {x:Math.floor(COLS/3),y:Math.floor(ROWS/2)};
		snake.init(UP, sp.x, sp.y, defaultSpeed);
		grid.set(SNAKE, sp.x, sp.y);
		this.changeSpeed(snake.speed);

		this.setFood();
	},
	update:function(){
		var self = game;
		frames++;
		if(frames%5==0){

			var nx = snake.last.x,
			ny = snake.last.y;

			if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
			snake.direction = LEFT;
			}
			if (keystate[KEY_UP] && snake.direction !== DOWN) {
				snake.direction = UP;
			}
			if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
				snake.direction = RIGHT;
			}
			if (keystate[KEY_DOWN] && snake.direction !== UP) {
				snake.direction = DOWN;
			}
				
			switch(snake.direction){
				case UP:
					ny--;
				break;
				case RIGHT:
					nx++;
				break;
				case DOWN:
					ny++;
				break;
				case LEFT:
					nx--;
				break;
			}
			if (nx<0) {
				nx = grid.width-1;
			}
			if (nx > grid.width-1) {
				nx = 0;
			}
			if (ny > grid.height-1) {
				ny = 0;
			}
			if (ny < 0) {
				ny = grid.height-1;
			}

			if(grid.get(nx,ny)==FOOD){
				game.setFood();
				
				if(score>=5)
					game.setWall();

				if(score%2==0){
					snake.speed+=20;
					game.changeSpeed(snake.speed);
				}
				score++;

			}
			else if(grid.get(nx, ny)==BONUS){
				game.removeWalls();
				score+=2;
			}
			else if(grid.get(nx, ny)==SNAKE || grid.get(nx, ny)==WALL){
				game.saveResult();
				shw = true;
				return game.showResult(shw);
			}
			else{	

			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			}
			grid.set(SNAKE, nx, ny);
			snake.insert(nx, ny);
		}
	},
	changeSpeed:function(speed){
		clearInterval(inter);
		inter = setInterval(this.loop, 1000/speed);
	},
	setFood:function(){
		var empty = [];
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				if(grid.get(x,y)===EMPTY){
					empty.push({x:x,y:y});
				}
			}
		}
		var r = empty[Math.round(Math.random()*(empty.length - 1))];
		grid.set(FOOD, r.x,r.y);

		if(score%5===0){
			this.setBonus();
		}
	},

	setBonus:function(){
		var empty = [];
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				if(grid.get(x,y)===EMPTY){
					empty.push({x:x,y:y});
				}

				if(grid.get(x,y)===BONUS){
					grid.set(EMPTY, x, y);
				}
			}
		}
		var r = empty[Math.round(Math.random()*(empty.length - 1))];
		grid.set(BONUS, r.x,r.y);
	},
	setWall:function (){
		var empty = [];
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				if(grid.get(x,y)===EMPTY){
					empty.push({x:x,y:y});
				}
			}
		}
		var rendom_len = lengs[Math.round(Math.random()*(lengs.length - 1))];
		var ren = Math.round(Math.random()*(empty.length - 1));

		for (var i = 0; i < rendom_len; i++) {
			var item = (empty[ren+i]==undefined)?empty[ren-i]:empty[ren+i];
			if(rendom_len%2==0){
					grid.set(WALL, empty[ren].x,item.y);
			}
			else{
				grid.set(WALL, item.x,empty[ren].y);
			}
		};

	},
	removeWalls:function(){
		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				if(grid.get(x,y)===WALL){
					grid.set(EMPTY, x,y);
				}
			}
		}
	},
	draw:function(){
		var tw = canvas.width/grid.width,
		th = canvas.height/grid.height;

		for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < grid.height; y++) {
				switch (grid.get(x, y)) {
					case EMPTY:
						ctx.fillStyle = "#E4F7FF";
						break;
					case SNAKE:
						ctx.fillStyle = "#0ff";
						break;
					case FOOD:
						ctx.fillStyle = "#f00";
						break;
					case WALL:
						ctx.fillStyle = "#0F0";
						break;
					case BONUS:
						ctx.fillStyle = "#00F";
						break;
				}
				ctx.fillRect(x*tw, y*th, tw, th);
			}
		}
		ctx.fillStyle = "#000";
		ctx.fillText('Score: '+score, 20, 20);
	},
	saveResult:function(){
		var name = prompt('Good job! Lets save your result. What is your name?');
		if(name!=null){
			results.push({name: name, score: score});
			localStorage.setItem('results', JSON.stringify(results));
			this.preinit();
		}
	},
	showResult:function(state){
		var restable = document.getElementById('restable');
		if(state){
			document.querySelector('#results').innerHTML = 'Hide results';
			restable.style.display = 'block';
			var txt="<h2>Results</h2>";
			var data = JSON.parse(localStorage.getItem('results')) || 'No data';
			if(data!='No data') {
				data.forEach(function(el){
					txt+='<span>Name: '+el.name+'. Score: '+el.score+'</span><br />';
				});
			}else{
				txt = data;
			}
			restable.innerHTML = txt;
			this.pauseGame(true);
		}else {
			document.querySelector('#results').innerHTML = 'Show results';
			restable.style.display = 'none';
			this.pauseGame(false);
		}
		shw = !shw;
	},
	pauseGame:function(state){
		currSpeed = snake.speed;
		if(state){ 
			clearInterval(inter);
		}else{
			this.changeSpeed(currSpeed);
		}
	}
};

grid = {
	width: null,
	height: null,
	_grid:null,

	init:function(def,c,r){
		this.width = c;
		this.height = r;

		this._grid = [];
		for (var x = 0; x < c; x++) {
			this._grid.push([]);
			for (var y = 0; y < r; y++) {
				this._grid[x].push(def);
			}
		}
	},
	set:function(val, x, y){
		this._grid[x][y] = val;
	},
	get:function(x,y){
		return this._grid[x][y];
	}
};

snake = {
	direction:null,
	last:null,
	_queue: null,
	speed: null,
	init:function(direction, x, y,speed){
		this.direction = direction;
		this.speed = speed;
		this._queue = [];
		this.insert(x,y);
	},
	insert:function(x,y){
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	remove:function(){
		return this._queue.pop();
	}
};

game.init();

})(window, this.document);