var Map = {
	mapName: ""
	,mapData:[[]]
	,mats:[]
	,tops:[]
	,peiceToMove:""
	,startPos:[]
	,rewardType:['Food','Wood','Gold','Metal','Slaves liberated']
	,reward:[]
	,mapType:'defend'
	,active:true
	,highlight:function(x,y,t){
		var n = Map.mapData.length*Map.mapData[0].length/2+parseInt(x)*Map.mapData.length+parseInt(y)+Map.mapData[0].length/2;
		var mesh = Map.tops[n];
		var mat = Map.mats['hili'];
		if(Map.peiceAt(x,y)!=false)mat=Map.mats['atth'];
		mesh.material=mat;
		mesh.turns = parseInt(t);
	}
	,highlighttop:function(t,m){
		//console.log("sd");
		var mat = Map.mats['hili'];
		var ap = Map.peiceAt(t.position.x,t.position.z);
		if(ap!=false){
			if(ap.mesh.team== currentTeam)return;//you cant attack your own team
			mat=Map.mats['atth'];
			m = 0;
		}
		t.material=mat;
		t.turns = parseInt(m);
	}
	,highlightMany:function(x,y,d){
		Map.deHighlight();
		if(d<1)return;
		//var sometop=[];
		 Map.hlsur(Map.tops[Map.mapData.length*Map.mapData[0].length/2+Map.mapData[0].length/2+x*Map.mapData.length+y],parseInt(d))	;
		//for(var i=0;i<altop.length;i++)if(altop[i].material.name=='atth' || altop[i].material.name=='hihi')sometop.push(altop[i]);
		//return sometop;
		
		//var l = Map.getSurrounding(x,y,d+1,[]);
		//for(var i = 0;i<l.length;i++)Map.highlight(l[i].split(",")[0],l[i].split(",")[1],l[i].split(",")[2]);
	}
	,hlsur(t,m){
		if(typeof t== 'undefined' || m<0)return;
		if((t.material == Map.mats['hili'] || t.material == Map.mats['atth'])&&parseInt(t.turns)>=m)return;
		if(t.position.y==2.5||t.position.y==1)m = parseInt(m)-1;
		Map.highlighttop(t,m);
		var allTops=[t];
		for(var i=-1;i<2;i++)
			for(var j=-1;j<2;j++){
				var nt = Map.tops[Map.tops.indexOf(t)+i*Map.mapData.length+j];
				if(typeof nt== 'undefined') 
					continue;
				if (nt.position.z == t.position.z+1 ||nt.position.z == t.position.z-1 ||nt.position.z == t.position.z)
					allTops.concat(Map.hlsur(nt,parseInt(m)-1));
			}
		return allTops;
	}
	,getSurrounding(x,y,d,list){
		//console.log(x+","+y+","+d);
		if(list.indexOf(x+","+y)!=-1 || d<1 ||x>Map.mapData.length/2||
			x<-Map.mapData.length/2||y>Map.mapData[0].length/2||y<-Map.mapData[0].length/2
			)return list;
		if(Map.mapData[x+Map.mapData.length/2][y+Map.mapData[0].length/2]=='m'||
			Map.mapData[x+Map.mapData.length/2][y+Map.mapData[0].length/2]=='w')d--; //double distance for water or mountains or other units
		if(d>0)list.push(x+","+y+","+d);	
		if(Map.peiceAt(x,y)!=false &&!(Map.peiceToMove.position.x==x && Map.peiceToMove.position.z==y))d=0;
		if(d>0){
			d--;
			if(parseInt(x)-1>Map.mapData.length/-2){
				list = Map.getSurrounding(x-1,y-1,d,list);
				list = Map.getSurrounding(x-1,y,d,list);
				list = Map.getSurrounding(x-1,y+1,d,list);
			}
			list = Map.getSurrounding(x,y-1,d,list);
			list = Map.getSurrounding(x,y+1,d,list);
			if(parseInt(x)+1<Map.mapData.length/2){
				list = Map.getSurrounding(x+1,y-1,d,list);
				list = Map.getSurrounding(x+1,y,d,list);
				list = Map.getSurrounding(x+1,y+1,d,list);
			}
		}
		return list;
	}
	,handleClick:function(e){
		if(!Map.active)return;//dont do anything if the game is over!
		if((this.material==Map.mats['hili'] || this.material==Map.mats['atth'] )&& Map.peiceToMove!=""){//move the peice to this square
			var p = Map.peiceAt(this.position.x,this.position.z); 
			if(p!=false){ //attack the peice
				var dmg = Map.peiceToMove.att;
				dmg = dmg * p.mesh.armour;
				p.mesh.hp -= dmg;
				console.log("attacked for "+dmg);
				
				if(p.mesh.hp<=0){//death has occured!
					for(var i=0;i<peices.length;i++)if(peices[i].mesh.position==p.mesh.position) peices.splice(i--,1);
					if(!Map.peiceToMove.ranged)Map.peiceToMove.position = p.mesh.position;
					p.mesh.dispose();
				}else{//no death so just move to the next square
					console.log("moving");
					var mm = 0;
					var t2 = Map.tops.indexOf(this);
					var t1 = "";
					for(var i=-1;i<2;i++)
						for(var j=-1;j<2;j++){
							var tp = Map.tops[t2+Map.mapData.length*i+j];
							if(tp.material.name=='hili')t1=tp;
						}
					if(t1!=""){
						Map.peiceToMove.position.x = t1.position.x;
						Map.peiceToMove.position.z = t1.position.z;
						Map.peiceToMove.position.y = t1.position.y+0.5;
					}else{
						console.log("cant find free spot!");
					}
				}
			}else{//simply move the peice
				Map.peiceToMove.position.x = this.position.x;
				Map.peiceToMove.position.z = this.position.z;
				Map.peiceToMove.position.y = this.position.y+0.6;
			}
			Map.peiceToMove.turns = parseInt(this.turns);
			var vteam=peices[0].mesh.team;
			var vmultiTeam=false;
			for(var i=0;i<peices.length;i++) //check for victory conditions
				if(peices[i].mesh.team!=vteam)vmultiTeam=true;
			if(vmultiTeam==false){//game over
				console.log("Game over!");
				console.log(vteam+" has Won!!!");
				Map.active=false;
				window.location.hash="vpop";
				if(vteam!=1){//victory
					document.getElementById('victoryOrDefeat').innerHTML="Victory!";
					var res = document.getElementById('gameresults').innerHTML;
					res="";
					for(var i=0;i<Map.reward.legth;i++){
						if(Map.reward[i]!='')res+= Map.rewardType[i]+":"+Map.reward[i]+"<br>";
					}
					food+=Map.reward[0];
					wood+=Map.reward[1];
					gold+=Map.reward[2];
					metal+=Map.reward[3];
					villagers+=Map.reward[4];
					
				}else{//defeat
					document.getElementById('victoryOrDefeat').innerHTML="Defeat";
					tryRun();
				}
				for(var i=0;i<peices.length;i++){//update soldiers page
					if(peices[i].team==1){
						
					}
				}
			}
		}else{
			console.log("unselecting");
		}
		Map.deHighlight();
	}
	,getStartPos:function(team){
		if(typeof Map.startPos[team-1]=='undefined'){//no team startpos so generate a new starting position 
			if(Map.startPos.length==0)Map.startPos.push(Map.littleRandom()+","+
				(parseInt(Map.mapData[0].length/(-2))+Math.abs(Map.littleRandom())));
			if(Map.startPos.length==1)Map.startPos.push(Map.littleRandom()+","+
				(Map.mapData[0].length/2-Math.abs(Map.littleRandom())));
			if(Map.startPos.length==2)Map.startPos.push(Map.mapData.length/(-2)+Math.abs(Map.littleRandom())+","+
				Map.littleRandom());
			if(Map.startPos.length==3)Map.startPos.push(Map.mapData.length/2-Math.abs(Map.littleRandom())+","+
				Map.littleRandom());
			
		}
		return Map.freeSpaceAround(Map.startPos[team-1].split(',')[0],Map.startPos[team-1].split(',')[1]);
		
	}
	,littleRandom:function(){
		return Math.random()>0.6?0:
			Math.random()>0.85?1:
			Math.random()>0.85?-1:
			Math.random()>0.75?2:
			Math.random()>0.75?-2:
			Math.random()>0.5?3:
			Math.random()>0.5?-3:0;
	}
	,freeSpaceAround:function(x,y){
		x = parseInt(x);
		y = parseInt(y);
		if(Map.peiceAt(x,y)==false && x<=Map.mapData.length/2&&x>=Map.mapData.length/-2&&
						y<Map.mapData[0].length/2&&y>=Map.mapData[0].length/-2)return [x,y];
		var max = 2;
		var min = -1;
		for (var k=-1;k>-4;k--)
			for(var i=k;i<k*-1+1;i++)
				for(var j=k;j<k*-1+1;j++){
					if((i==0&&j==0)||x+i<=-Map.mapData.length/2||x+i>=Map.mapData.length/2||
						y+j<=Map.mapData[0].length/-2||y+j>=Map.mapData[0].length/2 )continue;
					if(Map.peiceAt((parseInt(x)+parseInt(i)),(parseInt(y)+parseInt(j)))==false)return [(parseInt(x)+parseInt(i)),(parseInt(y)+parseInt(j))];
				}
		return false;
	}
	,peiceAt:function(x,y){
		//console.log("looking for peice at "+x+","+y);
		for(var i=0;i<peices.length;i++){
			if(peices[i].mesh.position.x==x && peices[i].mesh.position.z==y) return peices[i];
		}
		return false;
	}
	,deHighlight:function(){
		Map.peiceToMove=="";
		for(var i=0;i<Map.tops.length;i++)
			if(Map.tops[i].material == Map.mats['hili'] ||Map.tops[i].material == Map.mats['atth']){
				Map.tops[i].material = Map.tops[i].position.y==1?Map.mats['water']:Map.tops[i].position.y==2.5?Map.mats['rock']:Map.mats['grass'];
				Map.tops[i].turns = 999;
			}
	}	
	,drawMap: function(scene){
		console.log("drawing map");
		var grass = new BABYLON.StandardMaterial("material", scene);
		grass.diffuseColor = new BABYLON.Color3(0.22, 0.55, 0.22);
		grass.name='grass';
		Map.mats['grass']=grass;
		var dirt = new BABYLON.StandardMaterial("material", scene);
		dirt.diffuseColor = new BABYLON.Color3(0.54, 0.25, 0.07);
		dirt.name='dirt';
		Map.mats['dirt']=dirt;
		var water = new BABYLON.StandardMaterial("material", scene);
		water.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.65);
		water.alpha = 0.5;
		water.name='water';
		Map.mats['water']=water;
		var rock = new BABYLON.StandardMaterial("material", scene);
		rock.diffuseColor = new BABYLON.Color3(0.65, 0.65, 0.65);
		rock.name='rock';
		Map.mats['rock']=rock;
		var hili = new BABYLON.StandardMaterial("material", scene);
		hili.diffuseColor = new BABYLON.Color3(0.1, 0.65, 0.65);
		hili.name='hili';
		Map.mats['hili']=hili;
		var atth = new BABYLON.StandardMaterial("material", scene);
		atth.diffuseColor = new BABYLON.Color3(0.9, 0.25, 0.25);
		atth.name='atth';
		Map.mats['atth']=atth;
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x -= 0.5;
		box.position.z -= 0.5;
		box.position.y = 0.5;
		box.scaling.z =Map.mapData[0].length;
		box.scaling.x =Map.mapData.length;
		
		box.material = dirt;
		
    
		for(var i=Map.mapData.length/-2;i<Map.mapData.length/2;i++){
			for(var j=Map.mapData[0].length/-2;j<Map.mapData[0].length/2;j++){
				switch(Map.mapData[i+Map.mapData.length/2][j+Map.mapData.length/2]) {
					case 'w':
						Map.drawWater(scene,i,j);
						break;
					case 'g':
						Map.drawPlain(scene,i,j);
						break;
					case 'h':
						Map.drawHill(scene,i,j);
						break;
					case 'm':
						Map.drawMountain(scene,i,j);
						break;
					default:
						
				}				
			}
		}		
		
	}
	,drawWater:function(scene,x,y){
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['water'];
		box.position.y = 1;
		box.scaling.y = 0.15;
		box.handleClick=Map.handleClick;
		Map.tops.push(box);
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['dirt'];
		box.position.y = 0.45;
	}
	,drawPlain:function(scene,x,y){
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['grass'];
		box.position.y = 1.5;
		box.scaling.y = 0.15;
		box.scaling.x = 0.95;
		box.scaling.z = 0.95;
		Map.tops.push(box);
		box.handleClick=Map.handleClick;
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['dirt'];
		box.position.y = 0.95;
		box.scaling.x = 0.85;
		box.scaling.z = 0.85;
		box.scaling.z = 0.85;
	}
	,drawHill:function(scene,x,y){
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['grass'];
		box.position.y = 2;
		box.scaling.y = 0.15;
		box.scaling.x = 0.95;
		box.scaling.z = 0.95;
		Map.tops.push(box);
		box.handleClick=Map.handleClick;
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['dirt'];
		box.position.y = 1.45;
		box.scaling.x = 0.85;
		box.scaling.z = 0.85;
		box.scaling.z = 0.85;
	}
	,drawMountain:function(scene,x,y){
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['rock'];
		box.position.y = 2.5;
		box.scaling.y = 0.15;
		box.scaling.x = 0.95;
		box.scaling.z = 0.95;
		Map.tops.push(box);
		box.handleClick=Map.handleClick;
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['dirt'];
		box.position.y = 1.95;
		box.scaling.x = 0.85;
		box.scaling.z = 0.85;
		box.scaling.z = 0.85;
	}
	,loadMap:function(data,w,h){
		console.log("loading map");
	}
}