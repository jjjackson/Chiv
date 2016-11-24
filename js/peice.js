function Peice (s) {
    this.scene = s;
	this.mesh = vmodel.clone("Peice"+peices.length);
	this.mesh.skeleton = vmodel.skeleton.clone("spooky"+peices.length);
	this.mesh.skeleton.peice = this;
	this.mesh.handleClick = this.handleClick;
	this.mesh.moves = 2;
	this.mesh.hp = 100;
	this.mesh.mp=100;
	this.mesh.cc=0;
	this.mesh.mc=0;
	this.mesh.att = 40;
	this.mesh.ranged = false;
	this.mesh.cleave = false;
	this.mesh.armour = 1;
	//myPeice.mesh.type = type;
    this.mesh.team = 1;
	this.mesh.turns = 0;
	this.mesh.peice = this;
	this.initialRotation = 0;
	this.currentX=0;
	this.currentY=0;
	//this.drawPeice(s,this);
	this.baseTurns = 2;
	this.moveX = new BABYLON.Animation("movementAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	this.moveZ = new BABYLON.Animation("movementAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
}
 
Peice.prototype.getInfo = function() {
    return this.team + ' ' + this.type + ' apple';
};
Peice.prototype.runAI = function() {
    console.log("ai running:"+this.mesh.position.x+','+this.mesh.position.z);
	var fear = this.calculateFear(this.mesh.position);
	
	if(fear[1]>fear[0]&&fear[1]/(fear[0]+0.01)<0.5){ //scared so run away
		console.log(fear);
		Map.peiceToMove = this.mesh;
		Map.highlightMany(this.mesh.position.x,this.mesh.position.z,this.mesh.turns);
		
		setTimeout(function(){
			var tops = [];
			for(var i=0;i<Map.tops.length;i++)if(Map.tops[i].material.name=='atth'||Map	.tops[i].material.name=='hili')tops.push(Map.tops[i]);
			var lowestFear=0;
			var lowetTop="";
			for(var i=0;i<tops.length;i++){
				var topFear=Map.peiceToMove.peice.calculateFear(tops[i].position);
				if(topFear[1]>lowestFear){
					lowestFear==topFear[1];
					lowetTop = tops[i];
				}
			}
			lowetTop.handleClick();
			console.log("running away!");
			Map.peiceToMove.peice.ContinueAI();
		}, 300);
		
		return;
	}
	Map.peiceToMove = this.mesh;
	Map.highlightMany(this.mesh.position.x,this.mesh.position.z,this.mesh.turns);
	setTimeout(function(){
		var tops = [];
		for(var i=0;i<Map.tops.length;i++)if(Map.tops[i].material.name=='atth'||Map.tops[i].material.name=='hili')tops.push(Map.tops[i]);
		var highestFear=99999;
		var highestTop="";
		var canAttack=[];
		for(var i=0;i<tops.length;i++){
			var topFear=Map.peiceToMove.peice.calculateFear(tops[i].position);
			if(topFear[1]<highestFear){
				highestFear=topFear[1];
				highestTop = tops[i];
				//console.log(topFear[1]);
			}
			if(tops[i].material==Map.mats['atth'])canAttack.push(tops[i]);
		}
		if(canAttack.length>0){//able to attack so do so
			var which= Math.floor(Math.random()*canAttack.length);
			console.log("attacking!!!");
			canAttack[which].handleClick();
			
			Map.peiceToMove.peice.ContinueAI();
			return;
		}
		console.log("moving to attack");
		if(highestTop!="")highestTop.handleClick();
		Map.peiceToMove.peice.ContinueAI();
	},300);
};
Peice.prototype.ContinueAI = function(){
	for(var i=peices.length-1;i>-1;i--)
		if(peices[i].mesh.team == currentTeam&& peices[i].mesh.turns>0){
			console.log("nextAI:"+i);
			peices[i].runAI();
			return;
		}
	turn();
}
Peice.prototype.calculateFear = function(pos){
	var friendlyD = 0;
	var enemyD=0;
	for(var i=0;i<peices.length;i++){
		if(peices[i]==this)continue;
		if(peices[i].mesh.team==this.mesh.team){
			friendlyD+=lineLength(pos.x,pos.z,peices[i].mesh.position.x,peices[i].mesh.position.z);
		}else{
			enemyD+=lineLength(pos.x,pos.z,peices[i].mesh.position.x,peices[i].mesh.position.z);
		}
	}
	return [friendlyD,enemyD];
}

lineLength = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};
Peice.prototype.handleClick = function(e) {
	console.log('clicked');
	if(this.myTop!=null && this.myTop.material.name=='atth'){
		this.myTop.handleClick(e);
	}else{
		Map.peiceToMove = this;
		Map.highlightMany(this.position.x,this.position.z,this.turns);
	}
};
Peice.prototype.resetTurns = function() {
	this.mesh.turns = parseInt(this.baseTurns);
};
Peice.prototype.killPeice = function() {
	this.mesh.dispose();
	this.weapon.dispose();
};

Peice.prototype.moveTo = function(x,y,after) {
	this.currentX = x;
	this.currentY=y;
	console.log("moving from"+this.mesh.position.x+","+this.mesh.position.z+"to "+x+","+y);
	this.mesh.animations = [];
	var keysX = []; 
	keysX.push({frame: 0,value: this.mesh.position.x});
	keysX.push({frame: 100,value: x});
	var keysZ = []; 
	keysZ.push({frame: 0,value: this.mesh.position.z});
	keysZ.push({frame: 100,value: y});
	this.moveX.setKeys(keysX);
	this.moveZ.setKeys(keysZ);
	this.mesh.animations.push(this.moveX);
	this.mesh.animations.push(this.moveZ);
	scene.beginAnimation(this.mesh, 0, 100, false,1,function(){
		if(typeof after != 'undefined'){after();}else this.target.rotation.y = this.target.peice.initialRotation;
	});
	if(this.mesh.skeleton!=null)this.mesh.skeleton.beginAnimation("run");
	this.mesh.rotation.y= angle(this.mesh.position.x,y,x,this.mesh.position.z)-Math.PI/2;

};
function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  return theta;
}

Peice.prototype.attackPeice = function(x,y,dmg,after) {
	console.log("attacking!!!");
	showNotice(dmg);
	this.mesh.rotation.y= angle(this.mesh.position.x,y,x,this.mesh.position.z)-Math.PI/2;
	this.mesh.skeleton.beginAnimation("att",0,1,function(){
		console.log("after  attacking!!!");
		if(typeof after != 'undefined'){after();}else this.target.peice.mesh.rotation.y = this.target.peice.initialRotation;
	});
	if(this.mesh.ranged){//if ranged then shoot an arrow at the unit!
	console.log("ranged attack!!!");
		this.arrow = arrowModel.createInstance(this.mesh.name+"arrow");
		this.arrow.position.x = this.mesh.position.x;
		this.arrow.position.z = this.mesh.position.z;
		this.arrow.position.y = this.mesh.position.y+1;
		this.arrow.rotation.y= angle(this.mesh.position.x,y,x,this.mesh.position.z)-Math.PI;//face the arrow in the right direction
		var keysX = []; 
		keysX.push({frame: 0,value: this.mesh.position.x});
		keysX.push({frame: 7,value: x});
		var keysZ = []; 
		keysZ.push({frame: 0,value: this.mesh.position.z});
		keysZ.push({frame: 7,value: y});
		this.moveX.setKeys(keysX);
		this.moveZ.setKeys(keysZ);
		this.arrow.animations.push(this.moveX);
		this.arrow.animations.push(this.moveZ);
		scene.beginAnimation(this.arrow, 0, 10, false,1,function(){
			this.target.dispose();
		});
	}
};


