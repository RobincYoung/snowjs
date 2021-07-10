//https://github.com/RobincYoung/snowjs
var snowjs={
	color:"#99ccff",
	charlist:[],
	farr:[],
	carr:[],//canvases
	xdir:-15,//change periodicaly
	ydir:1,
	initfl:function(){
		this.carr=[];
		let fonts=Array("serif", "sans-serif", "cursive", "Helvetica, Arial, sans-serif", "monospace","Courier, monospace","Times, Times New Roman, Georgia, serif","Twemoji Mozilla,-apple-system, BlinkMacSystemFont, Segoe UI, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif");;
		this.charlist.forEach(function(char,id,charlist){
			for (i=1;i<7;i++){
				let fi=Math.floor(Math.random() * fonts.length);
				snowjs.cnv.font="normal 400 "+16*i+"px "+fonts[fi];
				let dims = snowjs.cnv.measureText(char);
				var newc = document.createElement('canvas');
				newc.width=dims.width;
				newc.height=dims.actualBoundingBoxAscent + dims.actualBoundingBoxDescent;
				let contx = newc.getContext("2d");
				contx.fillStyle = snowjs.color;
				contx.font="normal 400 "+16*i+"px "+fonts[fi];
				contx.fillText(char,0,dims.actualBoundingBoxAscent);
				
				//contx.beginPath();
				//contx.rect(0, 0, newc.width, newc.height);
				//contx.stroke();
				if(dims.width*(dims.actualBoundingBoxAscent + dims.actualBoundingBoxDescent)==0){continue}
				snowjs.carr.push({cnv:newc, s:i, w:dims.width, h:dims.actualBoundingBoxAscent + dims.actualBoundingBoxDescent});
			}
		});
		snowjs.carr.sort(function(a,b){if (a.scale<b.scale){return -1} if (a.scale>b.scale){return 1}return 0});
		//firefox workaround for: https://bugzilla.mozilla.org/show_bug.cgi?id=1692791
		//draws solid circle
		if (snowjs.carr.length==0){
			var c = document.createElement('canvas');
			c.width=10;
			c.height=10;
			var ctx = c.getContext("2d");
			ctx.fillStyle = snowjs.color;
			ctx.beginPath();
			ctx.arc(5, 5, 5, 0, 2 * Math.PI);
			ctx.fill();
			snowjs.carr.push({cnv:c, s:2, w:10, h:10});
		}
	},
	init:function(charas="❄️,❄,❅,❆",delay=500,yspeed=30,colour="#99ccff"){//create canvas
		this.ydir=yspeed;
		this.color=colour;
		if(!CSS.supports("pointer-events","none")){alert("warning: low flying unicode is blocking your clicks, please update your browser.")}
		c = document.createElement('canvas');
		c.id = "snowlayer";
		c.re = function(){this.width=window.innerWidth;this.height=window.innerHeight;};//calculate canvas size from screen size
		c.re();
		c.style.position = "fixed";
		c.style.top="0";
		c.style.left="0";
		c.style.right="0";
		c.style.bottom="0";
		c.style.zIndex="10";
		c.style.pointerEvents="none";
		document.body.appendChild(c);
		this.celm = c;
		this.cnv = this.celm.getContext("2d");
		this.charlist=charas.split(",");
		this.cnv.fillStyle = this.color;
		
		//create snowflakes
		this.initfl();
		
		setInterval(function(){snowjs.fadd()},delay);
		addEventListener("resize",this.resize);
		this.draw();
		setTimeout(snowjs.changedir1,(Math.random() * 10)*1000);
	},
	//flake: x, y, scale, char, width, height
	addbool:true,//dont add flakes when not in focus
	fadd:function(){//called to add flake
		if (this.addbool){this.addbool=false;}else{return;}
		var cari=Math.floor(Math.random() * this.carr.length);
		var randchar=this.carr[cari];
		var scale = randchar.s;
		var randx=Math.floor(Math.random() * this.cnv.canvas.width )+(0-randchar.w) ;
		var randy=0-randchar.h;
		var flake= {
			x:randx,
			y:randy,
			scale:scale,
			cari:cari,
			width:randchar.w,
			height:randchar.h,
			wave:0
		};
		this.farr.push(flake);
	},
	fmove:function(val,index,arr){//called on each flake
		val.x=val.x+(this.xdir*val.scale*0.01);
		val.y=val.y+(this.ydir*val.scale*0.01);
		//check colision with walls
		if (val.x<(0-val.width)){val.x=this.cnv.canvas.width;}//too far left
		if (val.x>this.cnv.canvas.width){val.x=(0-val.width);}//too far right
		val.wave+=Math.random()*0.1;
		this.farr[index]=val;
	},
	fdraw:function(f,index,arr){//called on each flake
		this.cnv.drawImage(this.carr[f.cari].cnv, f.x+(Math.sin(f.wave)*f.scale*1.2), f.y);
	},
	draw:function(){
		this.addbool=true;
		//position loop
		this.xdir=Math.max(-30, Math.min((this.xdir+this.wchange),30));
		this.farr.forEach(function(a,b,c){snowjs.fmove(a,b,c)});
		this.farr=this.farr.filter(function(flake){
			if (flake.y>snowjs.cnv.canvas.height+flake.height){return false}
			return true;
		});
		
		//draw loop
		this.cnv.clearRect(0, 0, this.cnv.canvas.width, this.cnv.canvas.height);
		this.farr.forEach(function(a,b,c){snowjs.fdraw(a,b,c)});
		
		//call each frame
		requestAnimationFrame(function(){snowjs.draw()});
	},
	resize:function(){//set value of: canvas size
		snowjs.celm.re();
		//snowjs.initfl();
	},
	wchange:0,
	changedir1:function(){//no "this"
		snowjs.wchange=(Math.random()-0.5)*4;
		setTimeout(function(){
			snowjs.wchange=0;
			setTimeout(snowjs.changedir1,(Math.random() * 10)*1000);
		}, 500);
	}
}
