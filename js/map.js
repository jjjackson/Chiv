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
		if(t.material.name=='dirt')return;
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
	,hlsur:function(t,m){
		if(typeof t== 'undefined' || m<0)return;
		//console.log(t.material.name);
		if((t.material == Map.mats['hili'] || t.material == Map.mats['atth'])&&parseInt(t.turns)>=m)return;
		if(t.position.y==2.5||t.position.y==1)m = parseInt(m)-1;
		Map.highlighttop(t,m);
		//if((t.material != Map.mats['hili'] || t.material != Map.mats['atth']))return;//
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
	,handleClick:function(e){
		if(!Map.active)return;//dont do anything if the game is over!
		if((this.material==Map.mats['hili'] || this.material==Map.mats['atth'] )&& Map.peiceToMove!=""){//move the peice to this square
			var p = Map.peiceAt(this.position.x,this.position.z); 
			if(p!=false){ //attack the peice
				var dmg = Map.peiceToMove.att;
				dmg = dmg * p.mesh.armour +Map.littleRandom()*5;
				if(p.mesh.position.y>Map.peiceToMove.position.y)dmg = dmg * 0.7; //if attacking up hill then reduce damage
				if(p.mesh.cc!=null){
					if(Math.random()<parseFloat(p.mesh.cc)){
						dmg = Math.random()>p.mesh.cc;
						showNotice("Critical Attack!");
					}
				}
				if(p.mesh.mc!=null){
					if(Math.random()<parseFloat(p.mesh.mc)){
						dmg = 0;
						showNotice("Attack Missed!");
					}
				}
				if(p.sheild!=null){
					if(p.sheild.name.charAt(0)=='s'){//small sheild
						if(Math.random()>0.9){
							dmg=0;
							showNotice("Attack Blocked!");
						}
						if(Math.random()>0.7){
							dmg=dmg*0.5;
							showNotice("Attack Deflected!");
						}
						
					}
					if(p.sheild.name.charAt(0)=='l'){//small sheild
						if(Math.random()>0.8){
							dmg=0;
							showNotice("Attack Blocked!");
						}
						if(Math.random()>0.6){
							dmg=dmg*0.5;
							showNotice("Attack Deflected!");
						}
					}
				}
				p.mesh.hp -= dmg;
				if(Map.peiceToMove.cleave==true){
					var op = Map.peiceAt(p.mesh.position.x+1,p.mesh.position.z);
					var op2 = Map.peiceAt(p.mesh.position.x-1,p.mesh.position.z);
					var op3 = Map.peiceAt(p.mesh.position.x,p.mesh.position.z-1);
					var op4 = Map.peiceAt(p.mesh.position.x,p.mesh.position.z+1);
					if(op!=false && op.mesh.team !=Map.peiceToMove.team){op.mesh.hp -= dmg*0.3;if(op.mesh.hp<=0)op.killPeice();}
					if(op2!=false && op2.mesh.team !=Map.peiceToMove.team){op2.mesh.hp -= dmg*0.3;if(op2.mesh.hp<=0)op2.killPeice();}
					if(op3!=false && op3.mesh.team !=Map.peiceToMove.team){op3.mesh.hp -= dmg*0.3;if(op3.mesh.hp<=0)op3.killPeice();}
					if(op4!=false && op4.mesh.team !=Map.peiceToMove.team){op4.mesh.hp -= dmg*0.3;if(op4.mesh.hp<=0)op4.killPeice();}
				}
				//console.log("attacked for "+dmg);
				var aa;
				if(p.mesh.hp<=0){//death has occured!
					for(var i=0;i<peices.length;i++)if(peices[i].mesh.position==p.mesh.position) peices.splice(i--,1);
					//if(!Map.peiceToMove.ranged)Map.peiceToMove.position = p.mesh.position;
					var aa;
					if(!Map.peiceToMove.ranged)aa=function(){Map.peiceToMove.peice.moveTo(p.mesh.position.x,p.mesh.position.z);}//if the unit is not ranged then they must move into the place of killed unit
					p.killPeice();
					showNotice("Player "+Map.peiceToMove.team+" Kills A Unit");
					var sols = document.getElementById('soilderTable').rows;
					for(var i=1;i<sols.length;i++){
						if(sols[i].children[0].innerHTML == Map.peiceToMove.name)sols[i].children[1].innerHTML = (parseInt(sols[i].children[1].innerHTML)+10);//named unit gettign exp
						if(sols[i].children[0].innerHTML == p.mesh.name)retireSol(sols[i].children);//your unit dieing :(
					}
				}
				af =  function(){
					Map.peiceToMove.peice.attackPeice(p.mesh.position.x,p.mesh.position.z,"Player "+Map.peiceToMove.team+" Attacks Player "+p.mesh.team+" for "+dmg,aa);
				}//run the attack animation;
				if(lineLength(p.mesh.position.x,p.mesh.position.z,Map.peiceToMove.position.x,Map.peiceToMove.position.z)>1.9 && !Map.peiceToMove.ranged){//not next to the peice
					console.log("moving");
					var mm = 0;
					var t2 = Map.tops.indexOf(this);
					var t1 = "";
					for(var i=-1;i<2;i++)
						for(var j=-1;j<2;j++){
							var tp = Map.tops[t2+Map.mapData.length*i+j];
							if(typeof tp != 'undefined' && tp.material.name=='hili')t1=tp;
						}
					if(t1!=""){
						Map.peiceToMove.peice.moveTo(t1.position.x,t1.position.z,af);
						//Map.peiceToMove.position.x = t1.position.x;
						//Map.peiceToMove.position.z = t1.position.z;
						//Map.peiceToMove.position.y = t1.position.y+0.06;
						Map.peiceToMove.myTop = this;
					}else{
						console.log("cant find free spot!");
					}
				}else{//attack without moving
					if(typeof af !='undefined')af();
				}
				
			}else{//simply move the peice
				Map.peiceToMove.peice.moveTo(this.position.x,this.position.z);
				//Map.peiceToMove.position.x = this.position.x;
				//Map.peiceToMove.position.z = this.position.z;
				//Map.peiceToMove.position.y = this.position.y+0.06;
				Map.peiceToMove.myTop = this;
			}
			Map.peiceToMove.turns = parseInt(this.turns);
			var vteam=peices[0].mesh.team;
			var vmultiTeam=false;
			for(var i=0;i<peices.length;i++) //check for victory conditions
				if(peices[i].mesh.team!=vteam)vmultiTeam=true;
			if(vmultiTeam==false){//game over
				gameEnd();
			}
		}else{
			console.log("unselecting");
		}
		Map.deHighlight();
	}
	,getStartPos:function(team){
		if(typeof Map.startPos[team-1]=='undefined'){//no team startpos so generate a new starting position 
			
			if(Map.startPos.length==0)Map.startPos.push(parseInt(Map.mapData.length/(-2))+Math.abs(Map.littleRandom())+","+
				Map.littleRandom());
			if(Map.startPos.length==1)Map.startPos.push(Map.mapData.length/2-1-Math.abs(Map.littleRandom())+","+
				Map.littleRandom());
			if(Map.startPos.length==2)Map.startPos.push(Map.littleRandom()+","+
				(parseInt(Map.mapData[0].length/(-2))+Math.abs(Map.littleRandom())));
			if(Map.startPos.length==3)Map.startPos.push(Map.littleRandom()+","+
				(Map.mapData[0].length/2-Math.abs(Map.littleRandom())));
			
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
						y+j<=Map.mapData[0].length/-2||y+j>=Map.mapData[0].length/2 )continue; //cant place outside the map
					if(Map.mapData[Map.mapData.length/2+(parseInt(x)+parseInt(i))][Map.mapData[0].length/2+(parseInt(y)+parseInt(j))]=='r'||Map.mapData[Map.mapData.length/2+(parseInt(x)+parseInt(i))][Map.mapData[0].length/2+(parseInt(y)+parseInt(j))]=='t')continue; // cant place in a tree or a rock!
					if(Map.peiceAt((parseInt(x)+parseInt(i)),(parseInt(y)+parseInt(j)))==false)return [(parseInt(x)+parseInt(i)),(parseInt(y)+parseInt(j))]; //cant place occupied spot
				}
		return false;
	}
	,peiceAt:function(x,y){
		//console.log("looking for peice at "+x+","+y);
		for(var i=0;i<peices.length;i++){
			if(peices[i].currentX==x && peices[i].currentY==y) return peices[i];
		}
		return false;
	}
	,topAt:function(x,y){
		//console.log("looking for peice at "+x+","+y);
		//for(var i=0;i<peices.length;i++){
		//	if(peices[i].mesh.position.x==x && peices[i].mesh.position.z==y) return peices[i];
		//}
		//return Map.Tops[x+Map.mapData.length/2+Map.mapData.length*Map.mapDatap[0].length/2+y*Map.mapData[0].length];
		for(var i=0;i<Map.tops.length;i++)if(Map.tops[i].x==x&& Map.tops[i].z==y)return Map.tops[i];
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
					case 'r':
						Map.drawRock(scene,i,j);
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
	,drawRock:function(scene,x,y){
		var box = BABYLON.Mesh.CreateBox("box", 1, scene);
		box.position.x = x;
		box.position.z = y;
		box.material = Map.mats['dirt'];
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
		box.position.y = 1.05;
		box.scaling.x = 0.85;
		box.scaling.z = 0.85;
		box.scaling.z = 0.85;
		if(typeof rockModel =='undefined')Map.makeRock();
		var rock = rockModel.createInstance("rock@"+x+","+y);
		rock.position.x = x;
		rock.position.z = y;
		rock.position.y = 1.95;
		rock.rotation.y=Math.random()*Math.PI*2;
	}
	,makeRock:function(){
		console.log("making a rock!!!");
		rockModel = new BABYLON.Mesh("blank", scene);
		var pos = [-1.2881,-0.5201,0.4294,-0.8772,-0.8765,0.8815,-1,-1,0.3333,0.5127,-0.5683,1.2881,0.9003,-0.8851,0.8815,0.3333,-1,1,1.413,-0.5924,-0.4294,0.9003,-0.8851,-0.8815,1,-1,-0.3333,-0.3877,-0.5442,-1.2881,-0.8772,-0.8765,-0.8815,-0.3333,-1,-1,0.3333,-1,0.3333,1,-1,0.3333,1.2229,0.4154,-0.4294,1.0777,-0.4704,-1.0472,-0.8932,0.731,-0.8972
,-0.4206,0.24,-1.2881,-0.4747,0.8702,-1,-1.1236,0.1523,0.4294,-1.0179,-0.4796,1.0472,0.899,0.3697,1.0492,0.2825,0.3277,1.2881,-0.981,0.1481,-1.0492,0.245,1.3824,-0.7843,0.7927,1.2843,-0.3333,0.2108,1.5327,-0.3333,-0.8932,0.731,0.8972,-1.1084,0.6631,0.3333,0.6038,1.1196,0.8972,0.159,1.0772,1,0.6038,1.1196,-0.8972,-0.3606,1.272,0.7881,-0.5988,1.4144,0.3333
,-0.3289,1.4538,0.3333,-0.6127,1.1945,-0.7843,-0.3606,1.272,-0.7881,-0.6127,1.1945,0.7843,0.245,1.3824,0.7843,-0.0041,1.3583,0.7881,-0.3877,-0.5442,1.2881,-0.3333,-1,1,0.5127,-0.5683,-1.2881,0.3333,-1,-1,-0.3333,-1,0.3333,0.2825,0.3277,-1.2881,0.899,0.3697,-1.0492,0.159,1.0772,-1,-0.981,0.1481,1.0492,-0.4206,0.24,1.2881,-0.4747,0.8702,1
,0.2108,1.5327,0.3333,-0.0591,1.4933,0.3333,-0.0041,1.3583,-0.7881,-1.2881,-0.5201,-0.4294,-1.0179,-0.4796,-1.0472,-1,-1,-0.3333,1.413,-0.5924,0.4294,1.0777,-0.4704,1.0472,0.3333,-1,-0.3333,1.2229,0.4154,0.4294,-1.1236,0.1523,-0.4294,0.7927,1.2843,0.3333,-1.1084,0.6631,-0.3333,-0.5988,1.4144,-0.3333,-0.3289,1.4538,-0.3333,-0.3333,-1,-0.3333,-0.0591,1.4933,-0.3333
];
		var norms=[-0.9689,-0.1511,0.1957,-0.4778,-0.7373,0.4776,-0.4881,-0.8625,0.1332,0.214,-0.2791,0.9361,0.4265,-0.7731,0.4694,0.1102,-0.8779,0.466,0.9319,-0.2843,-0.225,0.4265,-0.7731,-0.4694,0.3765,-0.9189,-0.1172,-0.1814,-0.2729,-0.9448,-0.4778,-0.7373,-0.4776,-0.1361,-0.866,-0.4811,0.0257,-0.9993,0.0255,0.3765,-0.9189,0.1172,0.9209,0.3135,-0.2316,0.68,-0.1509,-0.7175,-0.7084,0.3894,-0.5886
,-0.2054,0.1834,-0.9613,-0.2226,0.4166,-0.8814,-0.9765,0.1446,0.1596,-0.7027,-0.179,0.6885,0.6302,0.2558,0.733,0.1329,0.2035,0.97,-0.7494,0.1404,-0.647,0.1498,0.8149,-0.5598,0.6805,0.7103,-0.1796,0.1227,0.9816,-0.1463,-0.7084,0.3894,0.5886,-0.9422,0.3032,0.1425,0.4944,0.5541,0.6697,0.0065,0.4609,0.8874,0.4944,0.5541,-0.6697,-0.2016,0.7405,0.641,-0.5097,0.8438,0.1678
,-0.1521,0.9734,0.1715,-0.4944,0.6486,-0.5787,-0.2016,0.7405,-0.641,-0.4944,0.6486,0.5787,0.1498,0.8149,0.5598,-0.129,0.7924,0.5961,-0.1814,-0.2729,0.9448,-0.1361,-0.866,0.4811,0.214,-0.2791,-0.9361,0.1102,-0.8779,-0.466,-0.028,-0.9992,0.0281,0.1329,0.2035,-0.97,0.6302,0.2558,-0.733,0.0065,0.4609,-0.8874,-0.7494,0.1404,0.647,-0.2054,0.1834,0.9613,-0.2226,0.4166,0.8814
,0.1227,0.9816,0.1463,-0.143,0.9782,0.1503,-0.129,0.7924,-0.5961,-0.9689,-0.1511,-0.1957,-0.7027,-0.179,-0.6885,-0.4881,-0.8625,-0.1332,0.9319,-0.2843,0.225,0.68,-0.1509,0.7175,0.0257,-0.9993,-0.0255,0.9209,0.3135,0.2316,-0.9765,0.1446,-0.1596,0.6805,0.7103,0.1796,-0.9422,0.3032,-0.1425,-0.5097,0.8438,-0.1678,-0.1521,0.9734,-0.1715,-0.028,-0.9992,-0.0281,-0.143,0.9782,-0.1503
];
		var uvs = [0.3677,0.4288,0.2993,0.3802,0.3533,0.3938,0.1593,0.4968,0.1624,0.5131,0.1965,0.4467,0.2294,0.6844,0.3056,0.6392,0.2534,0.5923,0.4378,0.6164,0.4425,0.5063,0.4102,0.5394,0.2506,0.4944,0.1993,0.5446,0.244,0.8036,0.3054,0.7194,0.445,0.7193,0.4404,0.7178,0.4211,0.7767,0.355,0.5303,0.2967,0.4103,0.1489,0.6674,0.177,0.5982,0.4641,0.6463,0.3482,0.8834
,0.2694,0.8795,0.3142,0.8685,0.2993,0.591,0.3616,0.606,0.184,0.7554,0.2099,0.7089,0.3297,0.8837,0.2671,0.7106,0.3224,0.7441,0.3016,0.7697,0.4142,0.7938,0.3951,0.8234,0.2868,0.6816,0.2208,0.7712,0.2397,0.749,0.2286,0.4321,0.2478,0.3964,0.3685,0.6811,0.3589,0.5897,0.302,0.4441,0.3862,0.7825,0.3193,0.8175,0.3723,0.8519,0.2937,0.4962,0.2311,0.5336
,0.2587,0.6336,0.2601,0.8208,0.2808,0.7952,0.3677,0.8617,0.4374,0.4902,0.4668,0.5601,0.4074,0.4415,0.1597,0.623,0.1353,0.5696,0.3048,0.542,0.1743,0.7422,0.4248,0.5917,0.2152,0.8318,0.4158,0.6537,0.3765,0.7918,0.3558,0.8173,0.3561,0.4917,0.335,0.8429];
		var ind = [0,1,2,3,4,5,6,7,8,9,10,11,12,4,13,14,15,6,16,17,18,19,20,0,21,3,22,23,9,17,24,25,26,27,19,28,29,22,30,31,14,25,32,33,34,35,18,36,37,28
,33,38,30,39,40,1,20,40,5,41,42,7,15,9,43,42,1,44,2,41,12,44,31,45,46,18,45,47,48,40,20,22,40,49,46,42,15,45,9,42,27,49,48,50,22,49,51,39,52,39
,34,52,24,47,31,36,47,53,37,50,27,32,30,50,54,10,55,0,56,54,57,4,58,6,13,57,59,7,43,12,8,59,60,58,21,14,57,60,61,55,23,19,54,61,38,62,29,26,62,51
,16,61,23,28,61,63,29,60,21,62,14,60,36,64,35,34,64,65,35,63,16,33,63,64,10,66,11,2,66,56,66,43,11,44,59,66,26,53,24,51,67,26,53,65,36,52,65,67,0,20
,1,3,58,4,6,15,7,9,55,10,12,5,4,14,46,15,16,23,17,19,48,20,21,58,3,23,55,9,24,31,25,27,48,19,29,21,22,31,46,14,32,37,33,35,16,18,37,27,28,38
,29,30,40,41,1,40,3,5,42,43,7,9,11,43,1,41,44,41,5,12,31,47,45,18,17,45,48,49,40,22,3,40,46,45,42,45,17,9,27,50,49,50,30,22,51,38,39,39,32,34
,24,53,47,36,18,47,37,32,50,32,39,30,54,56,10,0,2,56,57,13,4,6,8,13,59,8,7,12,13,8,60,57,58,14,6,57,61,54,55,19,0,54,38,51,62,26,25,62,16,63
,61,28,19,61,29,62,60,62,25,14,36,65,64,34,33,64,35,64,63,33,28,63,10,56,66,2,44,66,66,59,43,44,12,59,26,67,53,51,52,67,53,67,65,52,34,65];
		var vertexData = new BABYLON.VertexData();
		vertexData.positions = pos;
		vertexData.indices = ind;
		vertexData.normals = norms;
		vertexData.uvs = uvs;
		vertexData.applyToMesh(rockModel, 1);
		var materialSphere1 = new BABYLON.StandardMaterial("rocktex", scene);
		materialSphere1.diffuseTexture = new BABYLON.Texture("models/rock.jpg", scene);
		rockModel.material = materialSphere1;
		rockModel.scaling = new BABYLON.Vector3(0.3,0.3,0.3);
	}
	,loadMap:function(data,w,h){
		console.log("loading map");
	}
}