var day = -12345678909876;
var firstDay = -12345678909876;
var speed = 1;
var events = [];
var todo=[];
var bbuild=[];
var abuild=[];
var sbuild=[];
var bboff=0;
var aboff=0;
var sboff=0;
var tbuild=[];
var tboff=0;
var gold = 5;
var wood = 6;
var metal = 7;
var food = 8;
var villagers = 20;
var birthrate= 1/30;//one every month
var deathrate=0;
var totalDays=0;
var woodsmen = 3;
var goldMiners = 4;
var metalMiners = 3;
var farmers = 5;
var soliders = 5;
var workerupgrades =1;
var workPerDayPerWorker = 0.07;
var foodPerVillager=0.007;
var townHallLVL= 1;
var barracksLVL=1;
var archeryLVL=0;
var stableLVL=0;
var churchLVL=0;
var currentCam="IsoMetric";
var blacksmithLVL=0;
var names=['Scottie','Marylyn','Drew','Nereida','Marissa','Rubin','Xavier','Nada','Ja','Ossie','Brant','Delsie','Malissa','Lupe','Tyron','Elidia','Tiera','Monnie','Mellissa','Juliette','Eliseo','Curtis','Sherry','Danette','Noe','Dennis','Shelia','Wayne','Ramon','Hermina','Myrtle','Florene','Dwight','Terese','Paris','Cleveland','William','Esperanza','Sherill','Geralyn','Linwood','Delbert','Lenny','Levi','Alonzo','Luke','Weldon','Janell','Rodger','Theo','Judson','Rashad','Edwin','Dorian','Azzie','Julio','Grace','Sherrill','Silas','Arie','Jerrell','Catarina','Jessie','Palma','Eleanora','Dottie','Hobert','Eugenia','Ryan','Verna','Nicky','Claudine','Hyman','Analisa','Eunice','Nikole','Elliot','Niesha','Malik','Jacquelin','Len','Elizabeth','Felice','Judie','Rolando','Enoch','Sondra','','Diego','Cathrine','Nguyet','Toshia','Ahmed','Juliann','Loni','Lakesha','Annamaria','Devin','Lavina','Maricela','Sade','Maryanna','Lonny','Cecila','Aldo','Eduardo','Maxwell','Darwin','Hiram','Kandi','Mariano','Ellyn','Joan','Zoila','Kathline','Kasi','Sherell','Cameron','Winnifred','Clifton','Brady','Lita','Bev','Twana','Sang','Wei','Belle','Melba','Richie','Carey','Kori','Daryl','Fernando','Merrill','Bert','Kenton','Shayne','Alice','Doloris','Haywood','Sheridan','Elliott','Willene','Deane','Alfred','Lyda','Edison','Ezequiel','Irena'];

function moveTime() {
	document.getElementById('fps').innerHTML=typeof engine !='undefined'?Math.floor(engine.getFps()):0;
	setTimeout(moveTime, 1000);
	for(var i=0;i<peices.length;i++){
	  peices[i].mesh.position.y=Map.mapData[Math.ceil(peices[i].mesh.position.x-0.5)+Map.mapData.length/2][Math.ceil(peices[i].mesh.position.z-0.5)+Map.mapData[0].length/2]=='g'?1.56:
			Map.mapData[Math.ceil(peices[i].mesh.position.x-0.5)+Map.mapData.length/2][Math.ceil(peices[i].mesh.position.z-0.5)+Map.mapData[0].length/2]=='h'?2.06:
			Map.mapData[Math.ceil(peices[i].mesh.position.x-0.5)+Map.mapData.length/2][Math.ceil(peices[i].mesh.position.z-0.5)+Map.mapData[0].length/2]=='m'?2.56:1.06;
	}
	if(window.location.hash=="")return;
    day += 1000*60*60*24*speed;
	if(events.length<=todo.length)
		events.push(day+1000*60*60*24*Math.floor(Math.random()*50+30));//every 50 or so days another village attacks
	totalDays +=speed;
	gold+=goldMiners*workPerDayPerWorker*speed*workerupgrades;
	wood+=woodsmen*workPerDayPerWorker*speed*workerupgrades;
	metal+=metalMiners*workPerDayPerWorker*speed*workerupgrades;
	food+=farmers*workPerDayPerWorker*speed*workerupgrades -foodPerVillager*speed*villagers -foodPerVillager*speed*soliders; 
	if(food<0){
		villagers--;
		food+=20;
	}
	bboff=bboff+1*speed;
	updateETA("SmithTable");
	updateETA("ArcheryTable");
	updateETA("StableTable");
	tboff=tboff+1*speed;
	updateTETA();
	if(gold>999)gold==999;
	if(wood>999)wood==999;
	if(metal>999)metal==999;
	if(food>999)food==999;
	villagers+=birthrate*speed -deathrate*speed;
	for(var i=0;i<document.getElementsByClassName("goldDisplay").length;i++){
		document.getElementsByClassName("goldDisplay")[i].innerHTML=Math.floor(gold);
		document.getElementsByClassName("woodDisplay")[i].innerHTML=Math.floor(wood);
		document.getElementsByClassName("metalDisplay")[i].innerHTML=Math.floor(metal);
		document.getElementsByClassName("foodDisplay")[i].innerHTML=Math.floor(food);
		document.getElementsByClassName("villagerDisplay")[i].innerHTML=Math.floor(villagers);
		document.getElementsByClassName("soilderDisplay")[i].innerHTML=Math.floor(soliders);
	}
	document.getElementById('UnemployedDisplay').innerHTML = Math.floor(villagers-(woodsmen+goldMiners+soliders+metalMiners+farmers));
	document.getElementById('dayCounter').innerHTML = (new Date(day)).toDateString();
	for(var i=0;i<events.length;i++){
		if(events[i]<day){
			console.log("event trggered!");
			if(typeof todo[events[i]]=='undefined'){//no todo so must be a village attack
				window.location.hash="";
				if(typeof loadGame !='undefined')loadGame();
				events.splice(i,1);
				break;
			}
			if(todo[events[i]]=='bth'){//town hall got upgraded
				showNotice("Town Hall Upgrade Complete!");
				townHallLVL++;
				document.getElementById('thcost').innerHTML = "Max LVL!";
				document.getElementById('thlvl').innerHTML = "Town Hall lvl:"+townHallLVL;
				document.getElementById('thcost').onclick = "";
			}
			if(todo[events[i]]=='bba'){//barracks got upgraded
				showNotice("Barracks Upgrade Complete!");
				barracksLVL++;
				document.getElementById('bacost').innerHTML = barracksLVL>4?"Max LVL!":
					'<img src="img/wood.png" alt="wood"/>'+(100*(barracksLVL+1))+
					'<br><img src="img/metal.png" alt="metal"/>'+(150*(barracksLVL+1))+
					'<br><img src="img/gold.png" alt="gold"/>'+(150*(barracksLVL+1))+'</td>';
				document.getElementById('balvl').innerHTML = "Barracks lvl:"+barracksLVL;
				if(barracksLVL>4)document.getElementById('bacost').onclick = "";
				paintActive();//update max active units
			}
			if(todo[events[i]]=='bar'){//archery got upgraded
				showNotice("Archery Range "+(archeryLVL==0?"Construction":"Upgrade")+" Complete!");
				document.getElementById('archery_range').parentNode;//todo set attrabue to archery range
				document.getElementById('archery_range').parentNode.parentNode.href = "#apop";
				document.getElementById('archery_range').parentNode.parentNode.parentNode.className = 
					document.getElementById('archery_range').parentNode.parentNode.parentNode.className.replace(" soon","");
				archeryLVL++;
				document.getElementById('arcost').innerHTML = archeryLVL>2?"Max LVL!":
					'<img src="img/wood.png" alt="wood"/>'+(100*(archeryLVL+1))+
					'<br><img src="img/metal.png" alt="metal"/>'+(150*(archeryLVL+1))+
					'<br><img src="img/gold.png" alt="gold"/>'+(150*(archeryLVL+1))+'</td>';
				document.getElementById('arlvl').innerHTML = "Barracks lvl:"+archeryLVL;
				if(archeryLVL>2)document.getElementById('arcost').onclick = "";
				paintActive();//update max active units
			}
		}
	}
    
}
addSoilder();
addSoilder();
addSoilder();
addSoilder();
addSoilder();

//music stuff!
myAudio = new Audio('sounds/main.ogg'); 
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();
myAudio.volume = 0.3;
moveTime();
function musicPause(){
	if(myAudio.paused){
		document.getElementById('musicButton').className="musicButton";
		myAudio.play();
	}else {
		document.getElementById('musicButton').className="musicButton noMusic";
		myAudio.pause();
	}
}


function addWorker(type){
	console.log('adding'+type);
	if((woodsmen+goldMiners+soliders+metalMiners+farmers)-villagers<=-1){ //can only add if there are unused workers
		if(type=='farmer')farmers++;
		if(type=='woodsmen')woodsmen++;
		if(type=='goldMiner')goldMiners++;
		if(type=='metalMiner')metalMiners++;
		if(type=='solider'){
			soliders++;
			addSoilder();
		}
	}
	updateWorkers();
}

function removeWorker(type){
	console.log('removing'+type);
	if(type=='farmer')farmers--;
	if(type=='woodsmen')woodsmen--;
	if(type=='goldMiner')goldMiners--;
	if(type=='metalMiner')metalMiners--;
	//if(type=='solider')soliders--;
	updateWorkers();
}
function updateWorkers(){
	document.getElementById('farmersDisplay').innerHTML = farmers;
	document.getElementById('woodsmenDisplay').innerHTML = woodsmen;
	document.getElementById('metalMinersDisplay').innerHTML = metalMiners;
	document.getElementById('goldMinersDisplay').innerHTML = goldMiners;
	document.getElementById('soildersDisplay').innerHTML = soliders;
	document.getElementById('UnemployedDisplay').innerHTML = Math.floor(villagers-(woodsmen+goldMiners+soliders+metalMiners+farmers));
}
function upgradeBuilding(type){
	if(tbuild.length==0)tboff=0;
	
	if(type=='th'&&wood>200&&metal>100&&gold>300){ //upgrade the town hall;
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=200;
		metal-=100;
		gold-=300;
		showNotice("Town Hall Building!");
		showNotice("Estimated build time 4 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+25)]);
		return;
	}
	if(type=='ba'&&wood>100*(barracksLVL+1)&&metal>150*(barracksLVL+1)&&gold>150*(barracksLVL+1)){
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=100*(barracksLVL+1);
		metal-=150*(barracksLVL+1);
		gold-=150*(barracksLVL+1);
		showNotice("Barracks "+(barracksLVL>0?"Upgrading":"Building"));
		showNotice("Estimated build time 2 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+12)]);
		return;
	}
	if(type=='ar'&&wood>300*(archeryLVL+1)&&metal>100*(archeryLVL+1)&&gold>200*(archeryLVL+1)){
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=300*(archeryLVL+1);
		metal-=100*(archeryLVL+1);
		gold-=200*(archeryLVL+1);
		showNotice("Archery Range "+(archeryLVL>0?"Upgrading":"Building"));
		showNotice("Estimated build time 3 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+19)]);
		return;
	}
	if(type=='st'&&wood>200*(stableLVL+1)&&metal>150*(stableLVL+1)&&gold>250*(stableLVL+1)){
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=200*(stableLVL+1);
		metal-=150*(stableLVL+1);
		gold-=250*(stableLVL+1);
		showNotice("Stable "+(stableLVL>0?"Upgrading":"Building"));
		showNotice("Estimated build time 3 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+19)]);
		return;
	}
	if(type=='ch'&&wood>400*(churchLVL+1)&&metal>150*(churchLVL+1)&&gold>450*(churchLVL+1)){
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=400*(churchLVL+1);
		metal-=150*(churchLVL+1);
		gold-=450*(churchLVL+1);
		showNotice("Church "+(churchLVL>0?"Upgrading":"Building"));
		showNotice("Estimated build time 3 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+19)]);
		return;
	}
	if(type=='bl'&&wood>150*(blacksmithLVL+1)&&metal>150*(blacksmithLVL+1)&&gold>100*(blacksmithLVL+1)){
		document.getElementById(type+'cost').onclick = "";
		document.getElementById(type+'cost').innerHTML = "Upgrading...";
		wood-=150*(blacksmithLVL+1);
		metal-=150*(blacksmithLVL+1);
		gold-=100*(blacksmithLVL+1);
		showNotice("Black Smith "+(blacksmithLVL>0?"Upgrading":"Building"));
		showNotice("Estimated build time 3 weeks");
		tbuild.push([type,Math.floor(Math.random()*4+19)]);
		return;
	}
	showNotice("Not enough resources!");
}
function updateTETA(){
	var runningTotal=tboff*-1;
	for(var i=0;i<tbuild.length;i++){
		runningTotal+=parseInt(tbuild[i][1]);
		if(runningTotal<=0){
			tboff=0;
			var ele = tbuild.shift();
			showNotice("Town Hall has finished upgrading the "+(ele[0]=="th"?"Town Hall":ele[0]=='ba'?"Barracks":ele[0]=="ar"?"Archery Range":
				ele[0]=="bl"?"Black Smith":ele[0]=='ch'?"Chruch":"Stable"));
			var costs = document.getElementById(ele[0]+'cost');
			var lvls = document.getElementById(ele[0]+"lvl");
			if(ele[0]=="th"){
				costs.innerHTML="Max Lvl!";
				townHallLVL++;
				lvls.innerHTML="Town Hall lvl:2";
			}
			if(ele[0]=="ba"){
				barracksLVL++;
				costs.innerHTML=barracksLVL>4?"Max Lvl!":('<img src="img/wood.png" alt="wood">'+(barracksLVL+1)*100+
				'<br><img src="img/metal.png" alt="metal">'+(barracksLVL+1)*150+
				'<br><img src="img/gold.png" alt="gold">'+(barracksLVL+1)*150+"</td>");
				if(barracksLVL<5)costs.onclick = function(){upgradeBuilding("ba");};
				lvls.innerHTML="Barracks lvl:"+barracksLVL;
			}
			if(ele[0]=="ar"){
				archeryLVL++;
				document.getElementsByClassName('archery')[0].className = document.getElementsByClassName('archery')[0].className.replace("soon","");
				document.getElementById('archery_range').parentNode.attributes[0].value="Archery Range";
				document.getElementById('archery_range').parentNode.parentNode.href="#apop";
				costs.innerHTML=archeryLVL>2?"Max Lvl!":('<img src="img/wood.png" alt="wood">'+(archeryLVL+1)*300+
				'<br><img src="img/metal.png" alt="metal">'+(archeryLVL+1)*100+
				'<br><img src="img/gold.png" alt="gold">'+(archeryLVL+1)*200+"</td>");
				if(archeryLVL<3)costs.onclick = function(){upgradeBuilding("ar");};
				lvls.innerHTML="Archery lvl:"+archeryLVL;
			}
			if(ele[0]=="bl"){
				blacksmithLVL++;
				document.getElementsByClassName('blacksmith')[0].className = document.getElementsByClassName('blacksmith')[0].className.replace("soon","");
				document.getElementById('blacksmith').parentNode.attributes[0].value="Black Smith";
				document.getElementById('blacksmith').parentNode.parentNode.href="#kpop";
				costs.innerHTML=blacksmithLVL>2?"Max Lvl!":('<img src="img/wood.png" alt="wood">'+(blacksmithLVL+1)*150+
				'<br><img src="img/metal.png" alt="metal">'+(blacksmithLVL+1)*150+
				'<br><img src="img/gold.png" alt="gold">'+(blacksmithLVL+1)*100+"</td>");
				if(blacksmithLVL<3)costs.onclick = function(){upgradeBuilding("bl");};
				lvls.innerHTML="Black Smith lvl:"+blacksmithLVL;
			}
			if(ele[0]=="st"){
				stableLVL++;
				document.getElementsByClassName('stable')[0].className = document.getElementsByClassName('stable')[0].className.replace("soon","");
				document.getElementById('stable').parentNode.attributes[0].value="Stable";
				document.getElementById('stable').parentNode.parentNode.href="#spop";
				costs.innerHTML=stableLVL>2?"Max Lvl!":('<img src="img/wood.png" alt="wood">'+(stableLVL+1)*200+
				'<br><img src="img/metal.png" alt="metal">'+(stableLVL+1)*150+
				'<br><img src="img/gold.png" alt="gold">'+(stableLVL+1)*250+"</td>");
				if(stableLVL<3)costs.onclick = function(){upgradeBuilding("st");};
				lvls.innerHTML="Stable lvl:"+stableLVL;
			}
			if(ele[0]=="ch"){
				churchLVL++;
				document.getElementsByClassName('church')[0].className = document.getElementsByClassName('church')[0].className.replace("soon","");
				document.getElementById('church').parentNode.attributes[0].value="Church";
				document.getElementById('church').parentNode.parentNode.href="#cpop";
				costs.innerHTML=churchLVL>1?"Max Lvl!":('<img src="img/wood.png" alt="wood">'+(churchLVL+1)*400+
				'<br><img src="img/metal.png" alt="metal">'+(churchLVL+1)*150+
				'<br><img src="img/gold.png" alt="gold">'+(churchLVL+1)*450+"</td>");
				if(churchLVL<2)costs.onclick = function(){upgradeBuilding("st");};
				lvls.innerHTML="Church lvl:"+churchLVL;
			}
			i=-1;
		}
	}
}
function loadMissionDetails(mission){
	document.getElementById('missionDiscription').innerHTML = "Clear the mines...<br><br><br><br>";
}
function addSoilder(){
	var row = document.getElementById('soilderTable').insertRow(-1);
	var namecell = row.insertCell(0);
	namecell.innerHTML = (names[Math.floor(Math.random()*names.length)]);
	var XPcell = row.insertCell(1);
	XPcell.innerHTML = 0;
	XPcell=row.insertCell(2);
	XPcell.innerHTML = "<img src='img/fist.png'></img>";
	XPcell=row.insertCell(3);
	XPcell.innerHTML = "<img src='img/bare.png'></img>";
	XPcell=row.insertCell(4);
	XPcell.innerHTML = "<img src='img/fist.png'></img>";
	XPcell=row.insertCell(5);
	XPcell.innerHTML = "<div class='updown' onclick='moveRow(event)'>&uArr;</div><div class='updown' onclick='moveRow(event)'>&dArr;</div><div class='retiresol' onclick='retireSol(event)'>&times;</div>";
	paintActive();
}
function sTableClick(e){
	var cell=e.target;
	if(cell.tagName=="IMG")cell = cell.parentNode;
	var popupPicker=document.getElementById('objAssign');
	//console.log(e.clientX+","+e.clientY);
	popupPicker.style.top=e.clientY+"px";
	popupPicker.style.left=e.clientX+"px";
	popupPicker.innerHTML="";
	popupPicker.xy=cell.cellIndex+","+cell.parentNode.rowIndex;
	popupPicker.style.opacity=1;
	if(cell.cellIndex==2||cell.cellIndex==4)popupPicker.innerHTML+="<img src='img/fist.png'></img>";
	if(cell.cellIndex==3)popupPicker.innerHTML+="<img src='img/bare.png'></img>";
	var objectsTable = document.getElementById('armoryTable');
	for(var i=1;i<objectsTable.rows.length;i++){
		if(parseInt(objectsTable.rows[i].children[2].innerHTML)>0){//object availiable
			if(cell.cellIndex==2){//weapons!
				if(objectsTable.rows[i].children[0].innerHTML=="Long Bow")popupPicker.innerHTML+="<img src='img/lbow.png' title='Long Bow'></img>";
				if(objectsTable.rows[i].children[0].innerHTML=="Bow")popupPicker.innerHTML+="<img src='img/bow.png' title='Bow'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Cross Bow")popupPicker.innerHTML+="<img src='img/cbow.png' title='Cross Bow'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Bronze Sword")popupPicker.innerHTML+="<img src='img/bsword.png' title='Bronze Sword'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Iron Sword")popupPicker.innerHTML+="<img src='img/isword.png' title='Iron Sword'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Long Sword")popupPicker.innerHTML+="<img src='img/lsword.png' title='Long Sword'></img>";	
			}
			if(cell.cellIndex==3){//armor!
				if(objectsTable.rows[i].children[0].innerHTML=="Light Armor")popupPicker.innerHTML+="<img src='img/larmor.png' title='Light Armor'></img>";
				if(objectsTable.rows[i].children[0].innerHTML=="Meduim Armor")popupPicker.innerHTML+="<img src='img/marmor.png' title='Meduim Armor'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Heavy Armor")popupPicker.innerHTML+="<img src='img/harmor.png' title='Heavy Armor'></img>";	
			}
			if(cell.cellIndex==4){//others!
				if(objectsTable.rows[i].children[0].innerHTML=="Small Shield")popupPicker.innerHTML+="<img src='img/sshield.png' title='Small Shield'></img>";
				if(objectsTable.rows[i].children[0].innerHTML=="Large Shield")popupPicker.innerHTML+="<img src='img/lshield.png' title='Large Shield'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Horse")popupPicker.innerHTML+="<img src='img/horse.png' title='Horse'></img>";	
			}
		}
	}
	//console.log(e.target.cellIndex);
	//console.log(e.target.parentNode.rowIndex);
}
function bTableClick(e){
	var cell = e.target;
	var table = cell.parentNode.parentNode.parentNode.id;
	if(cell.tagName!='TD')cell= cell.parentNode;//incase they click a images
	if(cell.cellIndex==0||cell.cellIndex==1){//fill detailed info
		document.getElementById(table+'d').children[0].innerHTML="<tr><th>Item Description</th></tr>"+
			"<tr><td>"+cell.parentNode.children[1].innerHTML+"</td></tr>"+
			"<tr><td>XP needed:"+cell.parentNode.children[4].innerHTML+"</td></tr>"+
			"<tr><td>Benifits:"+cell.parentNode.children[2].innerHTML+"</td></tr>"+
			"<tr><td>Drawbacks:"+cell.parentNode.children[3].innerHTML+"</td></tr>";
	}
	if(cell.cellIndex==6){//clicked buy
		var cost=cell.innerText.split(",");
		var reqLvl=parseInt(cell.parentNode.children[5].innerText.split(' ').pop());
		reqLvl = (reqLvl+' '=='NaN '?1:reqLvl);
		
		if(wood>parseInt(cost[0])&&metal>parseInt(cost[1])&&gold>parseInt(cost[2])&& reqLvl<=blacksmithLVL){//they have the resources
			if(bbuild.length==0)bboff=0;
			bbuild.push([cell.parentNode.children[1].innerHTML,(3+parseInt(cell.parentNode.children[4].innerHTML)*0.03)]);
			wood-=parseInt(cost[0]);
			metal-=parseInt(cost[1]);
			gold-=parseInt(cost[2]);
			updateETA(table);
		}else{
			showNotice("Not enough resources");
		}
	}
	if(cell.cellIndex==7){//clicked sell
		if(parseInt(cell.parentNode.children[8].innerText)>0){
			var cost=parseInt(cell.innerText);
			gold+=cost;
			cell.parentNode.children[8].innerHTML=(parseInt(cell.parentNode.children[8].innerText)-1);
			var rows = document.getElementById('armoryTable').children[0].children;
			for (var j=1;j<rows.length;j++){
				if(rows[j].children[0].innerHTML==cell.parentNode.children[1].innerText){
					rows[j].children[1].innerHTML = parseInt(rows[j].children[1].innerHTML)-1;
					rows[j].children[2].innerHTML = parseInt(rows[j].children[2].innerHTML)-1;
				}
			}
		}else{
			showNotice("None Left To Sell");
		}
		
	}
}
function updateETA(table){
	var ins = "<tr><th>Item</th><th>ETA</th><th>Cancel</th></tr>";
	var runningTotal=bboff*-1;
	if(table=="ArcheryTable")runningTotal=aboff*-1;
	if(table=="StableTable")runningTotal=sboff*-1;
	document.getElementById(table+'l').children[0].innerHTML="";
	var list = bbuild;
	if(table=="archeryTable")list=abuild;
	if(table=="stableTable")list=sbuild;
	for(var i=0;i<list.length;i++){
		runningTotal+=parseInt(list[i][1]);
		ins+="<tr><td>"+list[i][0]+"</td><td>"+(runningTotal)+ " days</td><td><div class='retiresol' onclick='cancelBuild(event)'>X</div></td></tr>";
		if(runningTotal<=0){
			bboff=0;
			var ele = list.shift();
			showNotice("You have finished building a "+ele[0]);
			var rows = document.getElementById(table).children[0].children;
			for (var j=1;j<rows.length;j++){
				if(rows[j].children[1].innerHTML==ele[0])
					rows[j].children[8].innerHTML = parseInt(rows[j].children[8].innerHTML)+1;
			}
			var rows = document.getElementById('armoryTable').children[0].children;
			var found = false;
			for (var j=1;j<rows.length;j++){
				if(rows[j].children[0].innerHTML==ele[0]){
					rows[j].children[1].innerHTML = parseInt(rows[j].children[1].innerHTML)+1;
					rows[j].children[2].innerHTML = parseInt(rows[j].children[2].innerHTML)+1;
					found = true;
				}
			}
			if(!found){
				document.getElementById('armoryTable').children[0].innerHTML = 
					document.getElementById('armoryTable').children[0].innerHTML+
					"<tr><td>"+ele[0]+"</td><td>1</td><td>1</td></tr>";
			}
			i=-1;
		}
	}
	document.getElementById(table+'l').children[0].innerHTML=ins;
	//console.log(ins);
}
function cancelBuild(event){
	console.log(event.target.parentNode.parentNode);
}
function assignObject(t){
	var popupPicker=document.getElementById('objAssign');
	popupPicker.style.opacity=1;
	popupPicker.innerHTML="";
	var ico=t.target.cloneNode();
	var soilderTable = document.getElementById('soilderTable');
	
	var newcell=soilderTable.rows[parseInt(popupPicker.xy.split(",")[1])].children[parseInt(popupPicker.xy.split(",")[0])];
	var objectsTable = document.getElementById('armoryTable');
	if(newcell.innerHTML!=""){
		var oldTitle=newcell.children[0].title;
		if(oldTitle!=""){
			for(var i=1;i<objectsTable.rows.length;i++){
				if(objectsTable.rows[i].children[0].innerHTML==oldTitle)
					objectsTable.rows[i].children[2].innerHTML=parseInt(objectsTable.rows[i].children[2].innerHTML)+1;
			}
		}
	}
	newcell.innerHTML ="";
	newcell.appendChild(ico);
	
	if(ico.title!=""){
		for(var i=1;i<objectsTable.rows.length;i++){
			if(objectsTable.rows[i].children[0].innerHTML==ico.title)
				objectsTable.rows[i].children[2].innerHTML=parseInt(objectsTable.rows[i].children[2].innerHTML)-1;
		}
	}
}
function paintActive(){
	var rows = document.getElementById('soilderTable').children[0].children;
	for(var i=1;i<rows.length;i++)
		rows[i].className=i<barracksLVL+5?"activeSol":"";
	
}

function retireSol(e){
	var sol = e;
	if(typeof e.target != 'undefined'){
		sol=e.target.parentNode.parentNode.children;
		if(parseInt(sol[1].innerHTML)>0)if(!window.confirm("Are you sure you want to retire a experienced unit?"))return;
	}
	var objectsTable = document.getElementById('armoryTable');
	for(var c=2;c<5;c++){ //return all items to armory
		var oldTitle=sol[c].children[0].title;
		if(oldTitle!=""){
			for(var i=1;i<objectsTable.rows.length;i++){
				if(objectsTable.rows[i].children[0].innerHTML==oldTitle)
					objectsTable.rows[i].children[2].innerHTML=parseInt(objectsTable.rows[i].children[2].innerHTML)+1;
			}
		}
	}
	var row = document.getElementById('honourTable').insertRow(-1);
	var namecell = row.insertCell(0);
	namecell.innerHTML = sol[0].innerHTML;
	sol[0].parentNode.parentNode.removeChild(sol[0].parentNode);
	soliders--;
	document.getElementById('soildersDisplay').innerHTML = soliders;
	document.getElementById('UnemployedDisplay').innerHTML = Math.floor(villagers-(woodsmen+goldMiners+soliders+metalMiners+farmers));
	paintActive();
}
function moveRow(e){
	var row = e.target.parentNode.parentNode;
	var nrow = document.getElementById('soilderTable').insertRow(row.rowIndex+(e.target.innerHTML=="⇑"?-1:2));
	nrow.innerHTML = row.innerHTML;
	row.parentNode.removeChild(row);
	paintActive();
}
function getSol(name){
	var objectsTable = document.getElementById('armoryTable');
	if(name!=""){
		for(var i=1;i<objectsTable.rows.length;i++){
			if(objectsTable.rows[i].children[0].innerHTML==name)return objectsTable.rows[i].children;
		}
	}
		
}
function changeCamera(e){
	if(currentCam=="Free"){
		currentCam="IsoMetric";
		camera.position = new BABYLON.Vector3(-12, 12, -12);
		camera.rotation = new BABYLON.Vector3(0.73,0.8,0);
	}else if(currentCam=="Top"){
		currentCam="Free";
		camera.position = new BABYLON.Vector3(-3,3,-6);
		camera.rotation = new BABYLON.Vector3(0.1,0.6,0);
	}else if(currentCam=="Chess"){
		currentCam="Top";
		camera.position = new BABYLON.Vector3(0,30,0);
		camera.rotation = new BABYLON.Vector3(Math.PI/2,Math.PI/2,0);
	}else if(currentCam=="IsoMetric"){
		currentCam="Chess";
		camera.position = new BABYLON.Vector3(-12, 18, 0);
		camera.rotation = new BABYLON.Vector3(1, Math.PI/2, 0);
	}
	showNotice("Camera changed to "+currentCam);
}

function showNotice(text){
	var otherNotices=document.getElementsByClassName('noticeBox');
	for(var i=0;i<otherNotices.length;i++){
		otherNotices[i].style.bottom=((otherNotices.length-i)*30 +10)+"px";
	}
	if(otherNotices.length>10)otherNotices[0].parentNode.removeChild(otherNotices[0]);
	var iDiv = document.createElement('div');
	iDiv.className = 'noticeBox visible';
	iDiv.innerHTML= text;
	document.getElementById('noticeLog').appendChild(iDiv);
	setTimeout(function(){ iDiv.className='noticeBox hidden' }, 5000); //reset the notice bar
}