	var canvas = document.getElementById("render-canvas");
    var engine = new BABYLON.Engine(canvas,true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-12, 12, -12), scene);
    //var light = new BABYLON.PointLight("light", new BABYLON.Vector3(100, 200, 100), scene);
	var l2 = new BABYLON.HemisphericLight("l2",new BABYLON.Vector3(0,1,0),scene);
	l2.specular = new BABYLON.Color3(0.2,0.2,0.2);
	camera.attachControl(canvas);
	camera.rotation.x=0.73;
	camera.rotation.y = 0.8;
	camera.inertia=0.1;
	camera.speed=2;
	var peices = [];
	var teams = [];
	var currentTeam = 1;
	var firstTime = true;
	var vmodel;
	var bowModel;
	var arrowModel;
	var swordModel;
	var rockModel;
	var sheildModel;
	var heavyHModel;
	
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;
	skybox.infiniteDistance = true;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	
	BABYLON.SceneLoader.ImportMesh("Cube.001","models/", "villager.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		vmodel = newMeshes[0];
		vmodel.skeleton = skeletons[0];
		vmodel.scaling.x=0.3;
		vmodel.scaling.y=0.3;
		vmodel.scaling.z=0.3;
	});
	BABYLON.SceneLoader.ImportMesh("Cube","models/", "bow.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		bowModel = newMeshes[0];
		bowModel.scaling.x=0.05;
		bowModel.scaling.y=0.05;
		bowModel.scaling.z=0.05;
		bowModel.rotation.x=Math.PI/2;
		bowModel.rotation.y=-1.1;
		bowModel.position.z=-0.1;
		bowModel.position.y=0.3;
	});
	BABYLON.SceneLoader.ImportMesh("arrow","models/", "arrow.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		arrowModel = newMeshes[0];
		arrowModel.scaling = new BABYLON.Vector3(0.7,0.7,0.7);
	});
	BABYLON.SceneLoader.ImportMesh("Helm","models/", "hevyHeml.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		heavyHModel = newMeshes[0];
		//heavyHModel.position.y=7;
		heavyHModel.scaling = new BABYLON.Vector3(1,1,1.07);
		heavyHModel.position = new BABYLON.Vector3(0.15,-0.75,0);
	});
	BABYLON.SceneLoader.ImportMesh("sword","models/", "sword.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		swordModel = newMeshes[0];
		swordModel.position.y=0.3;
		swordModel.position.x=0.3;
		swordModel.rotation.z=Math.PI/2;
		swordModel.scaling = new BABYLON.Vector3(0.4,0.4,0.4);
	});
	BABYLON.SceneLoader.ImportMesh("Circle","models/", "sheild.babylon", scene, function (newMeshes, particleSystems, skeletons) {
		sheildModel = newMeshes[0];
		sheildModel.position.z=0.3;
		sheildModel.position.y=-3;
		sheildModel.rotation.z=Math.PI/2;
		sheildModel.scaling = new BABYLON.Vector3(1.4,1.4,1.4);
	});
	var lightArmorMat = new BABYLON.StandardMaterial("lightArmorMat", scene);
	lightArmorMat.diffuseTexture = new BABYLON.Texture("models/lightArmor.png", scene);
	var meduimArmorMat = new BABYLON.StandardMaterial("meduimArmorMat", scene);
	meduimArmorMat.diffuseTexture = new BABYLON.Texture("models/meduimArmor.png", scene);
	var heavyArmorMat = new BABYLON.StandardMaterial("heavyArmorMat", scene);
	heavyArmorMat.diffuseTexture = new BABYLON.Texture("models/heavyArmor.png", scene);

	Map.mapData =  [['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','h','g','g','g'],
					['g','h','h','g','g','g','g','g','g','r','g','h','m','h','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','h','h','g','g','g'],
					['g','g','g','g','r','g','g','g','g','g','g','g','g','g','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','g','w','w'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','w','w','w'],
					['g','g','w','g','g','g','w','w','g','g','g','g','w','w','g','g'],
					['w','w','w','w','w','w','w','w','w','g','g','w','w','g','g','g'],
					['g','g','g','w','w','w','g','g','w','w','w','w','g','g','g','g'],
					['g','g','g','g','w','g','g','g','g','w','w','g','g','g','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','h','h','g','g'],
					['g','h','h','g','g','g','g','g','r','g','g','h','m','h','h','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','h','h','g','g'],
					['g','g','g','r','g','g','g','g','g','g','g','g','h','h','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g']];
	Map.drawMap(scene);
	
	

	
	function loadGame(s){
		for(var i=0;i<peices.length;i++)peices[i].killPeice();//get rid of the last game peices
		peices=[];
		Map.startPos=[];
		Map.reward=[100,100,100,100,4];
		teams = [1,2];
		var ens = 3+townHallLVL+(Map.littleRandom()+Map.littleRandom()+Map.littleRandom()+Map.littleRandom()-1)/5;
		var playerfear=0;
		var sols = document.getElementById('soilderTable').rows;
		for(var i=0;i<soliders+ens;i++){
			var p = new Peice(s);
			p.mesh.team = i<soliders&&i<(4+townHallLVL)?1:2;
			p.mesh.turns = p.mesh.team==currentTeam?p.baseTurns:0;
			var sp = Map.getStartPos(p.mesh.team);
			p.mesh.position.x=parseFloat(Map.startPos[p.mesh.team-1].split(",")[0]);
			p.mesh.position.z=parseFloat(Map.startPos[p.mesh.team-1].split(",")[1]);
			
			p.moveTo(sp[0],sp[1]);
			p.mesh.rotation.y=p.mesh.team==1?Math.PI/2*3:Math.PI/2;
			p.initialRotation = p.mesh.rotation.y;
			p.mesh.name=i<soliders?sols[i+1].children[0].innerHTML:"enemyName";
			if(i<soliders && sols[i+1].children[2].children[0].title!=""){//sol has weapon
				if(sols[i+1].children[2].children[0].title=="Bow"){
					p.mesh.ranged = true;
					p.weapon = bowModel.createInstance("bow"+peices.length);
					p.mesh.att=50;
					p.mesh.cc = 0.01;
					p.mesh.mc = 0.1;
					playerfear+=4;
				}
				if(sols[i+1].children[2].children[0].title=="Cross Bow"){
					p.mesh.ranged = true;
					p.weapon = bowModel.createInstance("bow"+peices.length);
					p.mesh.att=60;
					p.mesh.cc = 0.05;
					p.mesh.mc=0.15;
					playerfear+=6;
				}
				if(sols[i+1].children[2].children[0].title=="Long Bow"){
					p.mesh.ranged = true;
					p.weapon = bowModel.createInstance("bow"+peices.length);
					p.mesh.att=120;
					p.mesh.cc = 0.05;
					p.mesh.mc = 0.01;
					playerfear+=10;
				}
				if(sols[i+1].children[2].children[0].title=="Bronze Sword"){
					p.weapon = swordModel.createInstance("sword"+peices.length);
					p.mesh.att=60;
					p.mesh.mc = 0.1;
					playerfear+=2;
				}
				if(sols[i+1].children[2].children[0].title=="Iron Sword"){
					p.weapon = swordModel.createInstance("sword"+peices.length);
					p.mesh.att=90;
					p.mesh.mc = 0.05;
					playerfear+=4;
				}
				if(sols[i+1].children[2].children[0].title=="Long Sword"){
					p.weapon = swordModel.createInstance("sword"+peices.length);
					p.mesh.att=150;
					p.mesh.mc = 0.01;
					p.mesh.cleave = true;
					playerfear+=6;
				}
				p.weapon.attachToBone(p.mesh.skeleton.bones[15], p.mesh);
			}
			if(i<soliders && sols[i+1].children[4].children[0].title!=""){//sol has sheild
				if(sols[i+1].children[4].children[0].title=="Small Shield"){
					p.sheild = sheildModel.createInstance("sheild"+peices.length);
					p.sheild.position.y=0;
					playerfear+=2;
				}
				if(sols[i+1].children[4].children[0].title=="Large Shield"){
					p.sheild = sheildModel.createInstance("lsheild"+peices.length);
					p.sheild.position.y=0;
					playerfear+=6;
				}
				p.sheild.attachToBone(p.mesh.skeleton.bones[11], p.mesh);
			}
			if(i<soliders && sols[i+1].children[3].children[0].title!=""){//sol has armor
				if(sols[i+1].children[3].children[0].title=="Light Armor"){
					p.mesh.material = lightArmorMat;
					p.mesh.armour=0.75;
					playerfear+=2;
				}
				if(sols[i+1].children[3].children[0].title=="Meduim Armor"){
					p.mesh.material = meduimArmorMat;
					p.mesh.armour=0.66;
					playerfear+=4;
				}
				if(sols[i+1].children[3].children[0].title=="Heavy Armor"){
					p.mesh.material = heavyArmorMat;
					p.mesh.armour=0.5;
					p.baseTurns--;
					p.helm = heavyHModel.createInstance("hhelm"+peices.length);
					p.helm.attachToBone(p.mesh.skeleton.bones[7], p.mesh);
					p.helm.position.y = 0.75;
					playerfear+=6;
				}
			}
			
			if(i>=soliders){//fit out the enemy
				var lvl = (playerfear/(ens+1))+Map.littleRandom()-1;
				if(lvl>9){
					p.mesh.material = heavyArmorMat;
					p.mesh.armour=0.5;
					p.baseTurns-=0.9;
					p.helm = heavyHModel.createInstance("hhelm"+peices.length);
					p.helm.attachToBone(p.mesh.skeleton.bones[7], p.mesh);
					p.helm.position.y = 0.75;
					lvl -=4;
				}else if(lvl>7){
					p.mesh.material = meduimArmorMat;
					p.mesh.armour=0.66;
					lvl -=3;
				}else if(lvl>5){
					p.mesh.material = lightArmorMat;
					p.mesh.armour=0.75;
					lvl -=2;
				}
				if(lvl>4){ //heavily armed
					if(Math.random()>0.75){
						p.mesh.ranged = true;
						p.weapon = bowModel.createInstance("bow"+peices.length);
						p.mesh.att=120;
						p.mesh.cc = 0.05;
						p.mesh.mc = 0.01;
					}else if(Math.random()>0.65){
						p.weapon = swordModel.createInstance("sword"+peices.length);
						p.mesh.att=150;
						p.mesh.mc = 0.01;
						p.mesh.cleave = true;
					}else if(Math.random()>0.5){
						p.mesh.ranged = true;
						p.weapon = bowModel.createInstance("bow"+peices.length);
						p.mesh.att=60;
						p.mesh.cc = 0.05;
						p.mesh.mc=0.15;
					}else{
						p.weapon = swordModel.createInstance("sword"+peices.length);
						p.mesh.att=90;
						p.mesh.mc = 0.05;
						playerfear+=4;
					}
				}else if(lvl>1){
					if(Math.random()>0.85){//crossbow
						p.mesh.ranged = true;
						p.weapon = bowModel.createInstance("bow"+peices.length);
						p.mesh.att=60;
						p.mesh.cc = 0.05;
						p.mesh.mc=0.15;
					}else if(Math.random()>0.75){//iron sword
						p.weapon = swordModel.createInstance("sword"+peices.length);
						p.mesh.att=90;
						p.mesh.mc = 0.05;
					}else if(Math.random()>0.5){//bow
						p.mesh.ranged = true;
						p.weapon = bowModel.createInstance("bow"+peices.length);
						p.mesh.att=50;
						p.mesh.cc = 0.01;
						p.mesh.mc = 0.1;
					}else{// bronze sword
						p.weapon = swordModel.createInstance("sword"+peices.length);
						p.mesh.att=60;
						p.mesh.mc = 0.1;
					}
				}
				if(p.weapon!=null)p.weapon.attachToBone(p.mesh.skeleton.bones[15], p.mesh);
			}
			Map.active = true;
			//console.log(sp);
			//p.mesh.position.y = 1.56:
			//	Map.mapData[sp[0]+Map.mapData.length/2][sp[1]+Map.mapData[0].length/2]=='h'?2.06:
			//	Map.mapData[sp[0]+Map.mapData.length/2][sp[1]+Map.mapData[0].length/2]=='m'?2.56:1.06;

			peices.push( p);
		}
		showNotice("Your village is under attack!");
		if(firstTime){
			showNotice("Click on a peice, then move it to a valid(blue) square");
			firstTime = false;
		}
	}
	scene.executeWhenReady(function () {
		vmodel.position.y=-1000;
		loadGame(scene);
	});
	
	
	function turn(){
		var nt = teams.indexOf(currentTeam)+2;
		if (nt>teams.length)nt=1;
		currentTeam=nt;
		for(var i=0;i<peices.length;i++){
			peices[i].aiRuns=0;
			peices[i].mesh.turns = peices[i].mesh.team==nt?peices[i].baseTurns:0;
			if(peices[i].mesh.position.y!=1.56&&peices[i].mesh.armour==0.5)peices[i].mesh.turns++;//make sure heavy armour units dont get stuck in the river
		}
		if(currentTeam!=1){
			for(var i=peices.length-1;i>-1;i--)
				if(peices[i].mesh.team == currentTeam&&peices[i].mesh.turns>0){
					console.log("first ai kickoff");
					peices[i].runAI();
					break;
				}
		}
		
	}
	scene.registerBeforeRender(function () {
	  
	});
	function tryTurn(){
		if(currentTeam!=1){
			showNotice("Not your turn yet!");
		}else{
			turn();
		}
		
	}
	function gameEnd(){
		var vteam=peices[0].mesh.team;
		var vmultiTeam=false;
		for(var i=0;i<peices.length;i++) //check for victory conditions
			if(peices[i].mesh.team!=vteam)vmultiTeam=true;
		if(vmultiTeam==true){//user ran away
			vteam=2;
			if(Map.mapType!='defend'){
				for(var i=peices.length-1;i>0;i--){
					if(peices[i].mesh.team==1){
						var sol= getSol(peices[i].name);
						if(Math.random>0.9){//10% chance that you loose this peice by running away
							sol[0].parentNode.parentNode.removeChild(sol[0].parentNode);//ourright kill unit with no items recovered
							showNotice(peices[i].name +" was killed in the retreat");
						}
						peices.splice(i,1);
					}
				}
			}
		}
		showNotice("Game Over!");
		console.log("Game over!");
		showNotice("Player "+vteam+" has won!");
		showNotice(vteam==1?"Victory!":"You have been defeated!");
		console.log(vteam+" has Won!!!");
		Map.active=false;
		window.location.hash="vpop";
		if(soliders<5)setTimeout(function(){ showNotice("You should train some more soldiers") }, 5000); //reset the notice bar
		document.getElementById('victoryOrDefeat').innerHTML=vteam==1?"Victory!":"Defeat!";
		var res = document.getElementById('gameresults');
		res.innerHTML=vteam==1?"":"Raiders have looted your village!<br>";
		var vd = vteam==1?1:-1;
		for(var i=0;i<Map.reward.length;i++){
			if(Map.reward[i]!='')res.innerHTML+= Map.rewardType[i]+":"+(vd*parseInt(Map.reward[i]))+"<br>";
		}
		food+=Map.reward[0]*vd;
		wood+=Map.reward[1]*vd;
		gold+=Map.reward[2]*vd;
		metal+=Map.reward[3]*vd;
		villagers+=Map.reward[4]*vd;
		if(food<0)food=0;
		if(wood<0)wood=0;
		if(metal<0)metal=0;
		if(gold<0)gold=0;
		if(villagers<0)villagers=0;
		var cc=20;
		while(villagers<(woodsmen+goldMiners+metalMiners+farmers+soliders)){
			cc--;
			if(cc<0){console.log("inv Loop Break!!!");break;}
			if(Math.random()>0.75){farmers--;continue;}
			if(Math.random()>0.75){woodsmen--;continue;}
			if(Math.random()>0.75){goldMiners--;continue;}
			if(Math.random()>0.75){metalMiners--;continue;}
		}
		
	}
	
	function tryRun(){
		if(currentTeam!=1){
			showNotice("Not your turn");
			return;
		}
		gameEnd();
	}
	
	turn();
	document.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key === 13) { // 13 is enter
		  tryTurn();	
		}
	});

    

    var t = 0;
    var renderLoop = function () {
        if(window.location.hash=="")
			scene.render();
    };
    engine.runRenderLoop(renderLoop);
	window.addEventListener('resize', function() {
		engine.resize();
		console.log(camera);
	});
	window.addEventListener("click", function () {
	    //We try to pick an object
	   var pickResult = scene.pick(scene.pointerX, scene.pointerY);
	   //console.log(
	   if(pickResult.pickedMesh!=null&&typeof pickResult.pickedMesh.handleClick!='undefined')
		pickResult.pickedMesh.handleClick(pickResult); 
	});