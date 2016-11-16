	var canvas = document.getElementById("render-canvas");
    var engine = new BABYLON.Engine(canvas,true);
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-12, 12, -12), scene);
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 20, 10), scene);
	camera.attachControl(canvas);
	camera.rotation.x=0.8;
	camera.rotation.y = 0.9;
	var peices = [];
	var teams = [];
	var currentTeam = 1;
	Map.mapData =  [['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','h','g','g','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','m','h','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','h','h','g','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','g','w','w'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','w','w','w'],
					['g','g','w','g','g','g','w','w','g','g','g','g','w','w','g','g'],
					['w','w','w','w','w','w','w','w','w','g','g','w','w','g','g','g'],
					['g','g','g','w','w','w','g','g','w','w','w','w','g','g','g','g'],
					['g','g','g','g','w','g','g','g','g','w','w','g','g','g','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','h','h','g','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','m','h','h','g'],
					['g','h','h','g','g','g','g','g','g','g','g','h','h','h','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','h','h','g','g'],
					['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g']];
	Map.drawMap(scene);
	Map.reward=[100,100,100,100,4];
	teams = [1,2];
	for(var i=0;i<10;i++){
		var p = new Peice();
		p.mesh.team = i<5?1:2;
		var sp = Map.getStartPos(p.mesh.team);
		p.mesh.position.x = sp[0];
		p.mesh.position.z = sp[1];
		p.mesh.position.y = Map.mapData[sp[0]+Map.mapData.length/2][sp[1]+Map.mapData[0].length/2]=='g'?2.1:
			Map.mapData[sp[0]+Map.mapData.length/2][sp[1]+Map.mapData[0].length/2]=='h'?2.6:
			Map.mapData[sp[0]+Map.mapData.length/2][sp[1]+Map.mapData[0].length/2]=='m'?3.4:1.5;

		peices.push( p);
	}
	
	function turn(){
		var nt = teams.indexOf(currentTeam)+2;
		if (nt>teams.length)nt=1;
		currentTeam=nt;
		for(var i=0;i<peices.length;i++){
			peices[i].mesh.turns = peices[i].mesh.team==nt?peices[i].baseTurns:0;
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
	function tryTurn(){
		if(currentTeam!=1){
			showNotice("Not your turn yet!");
		}else{
			turn();
		}
		
	}
	function tryRun(){
		if(currentTeam!=1){
			showNotice("Not your turn");
			return;
		}
		
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
		}else{
			food-=Map.reward[0];
			showNotice("Raiders made off with "+Map.reward[0]+" food";
			wood-=Map.reward[1];
			showNotice("Raiders made off with "+Map.reward[1]+" wood";
			gold-=Map.reward[2;
			showNotice("Raiders made off with "+Map.reward[1]+" gold";
			metal-=Map.reward[3];
			showNotice("Raiders made off with "+Map.reward[1]+" metal";
			villagers-=Map.reward[4];
			showNotice("Raiders captured "+Map.reward[1]+" villagers";
			var cc=20;
			while(villagers<woodsmen+goldMiners+metalMiners+farmers){
				cc--;
				if(cc<0){console.log("inv Loop Break!!!");"break;
				if(Math.random()>0.75){farmers--;continue;}
				if(Math.random()>0.75){woodsmen--;continue;}
				if(Math.random()>0.75){goldMiners--;continue;}
				if(Math.random()>0.75){metalMiners--;continue;}
			}
		}
	}
	
	//turn();
	document.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key === 13) { // 13 is enter
		  tryTurn();	
		}
	});

    

    var t = 0;
    var renderLoop = function () {
        if(window.location.hash=="#")scene.render();
		document.getElementById('fps').innerHTML=engine.getFps();
		
    };
    //engine.runRenderLoop(renderLoop);
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