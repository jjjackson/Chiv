var day = -12345678909876;
var speed = 1;
var events = [];
var gold = 100;
var wood = 50;
var metal = 50;
var food = 100;
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
var blacksmithLVL=0;
var names=['Scottie','Marylyn','Drew','Nereida','Marissa','Rubin','Xavier','Nada','Ja','Ossie','Brant','Delsie','Malissa','Lupe','Tyron','Elidia','Tiera','Monnie','Mellissa','Juliette','Eliseo','Curtis','Sherry','Danette','Noe','Dennis','Shelia','Wayne','Ramon','Hermina','Myrtle','Florene','Dwight','Terese','Paris','Cleveland','William','Esperanza','Sherill','Geralyn','Linwood','Delbert','Lenny','Levi','Alonzo','Luke','Weldon','Janell','Rodger','Theo','Judson','Rashad','Edwin','Dorian','Azzie','Julio','Grace','Sherrill','Silas','Arie','Jerrell','Catarina','Jessie','Palma','Eleanora','Dottie','Hobert','Eugenia','Ryan','Verna','Nicky','Claudine','Hyman','Analisa','Eunice','Nikole','Elliot','Niesha','Malik','Jacquelin','Len','Elizabeth','Felice','Judie','Rolando','Enoch','Sondra','','Diego','Cathrine','Nguyet','Toshia','Ahmed','Juliann','Loni','Lakesha','Annamaria','Devin','Lavina','Maricela','Sade','Maryanna','Lonny','Cecila','Aldo','Eduardo','Maxwell','Darwin','Hiram','Kandi','Mariano','Ellyn','Joan','Zoila','Kathline','Kasi','Sherell','Cameron','Winnifred','Clifton','Brady','Lita','Bev','Twana','Sang','Wei','Belle','Melba','Richie','Carey','Kori','Daryl','Fernando','Merrill','Bert','Kenton','Shayne','Alice','Doloris','Haywood','Sheridan','Elliott','Willene','Deane','Alfred','Lyda','Edison','Ezequiel','Irena'];

function moveTime() {
	if(window.location.hash=="#")return;
    day += 1000*60*60*24*speed;
	totalDays +=speed;
	gold+=goldMiners*workPerDayPerWorker*speed*workerupgrades;
	wood+=woodsmen*workPerDayPerWorker*speed*workerupgrades;
	metal+=metalMiners*workPerDayPerWorker*speed*workerupgrades;
	food+=farmers*workPerDayPerWorker*speed*workerupgrades -foodPerVillager*speed*villagers -foodPerVillager*speed*soliders; 
	if(food<0){
		villagers--;
		food+=20;
	}
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
	document.getElementById('dayCounter').innerHTML = (new Date(day)).toDateString()
    setTimeout(moveTime, 1000);
}
moveTime();
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
//myAudio.play();


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
	if(type=='th'&&wood>200&&metal>100&&gold>300){ //upgrade the town hall;
		townHallLVL=2;
		document.getElementById('thlvl').innerHTML = "Town Hall lvl:2";
		document.getElementById('thcost').innerHTML = "Max LVL!";
		document.getElementById('thcost').onclick = "";
		wood-=200;
		metal-=100;
		gold-=300;
		showNotice("Town Hall Upgraded!");
		return;
	}
	if(type=='ba'&&wood>100*(barracksLVL+1)&&metal>150*(barracksLVL+1)&&gold>150*(barracksLVL+1)){
		barracksLVL++;
		document.getElementById('balvl').innerHTML = "Barracks lvl:"+barracksLVL;
		if(barracksLVL>4)document.getElementById('bacost').onclick = "";
		wood-=100*barracksLVL;
		metal-=150*barracksLVL;
		gold-=150*barracksLVL;
		document.getElementById('bacost').innerHTML = barracksLVL>4?"Max LVL!":
		'<img src="img/wood.png" alt="wood"/>'+(100*(barracksLVL+1))+'<br><img src="img/metal.png" alt="metal"/>'+(150*(barracksLVL+1))+'<br><img src="img/gold.png" alt="gold"/>'+(150*(barracksLVL+1))+'</td>';
		showNotice("Barracks Upgraded!");
		return;
	}
	if(type=='ar'&&wood>300*(archeryLVL+1)&&metal>100*(archeryLVL+1)&&gold>200*(archeryLVL+1)){
		archeryLVL++;
		document.getElementById('arlvl').innerHTML = "Archery lvl:"+archeryLVL;
		if(archeryLVL>2)document.getElementById('arcost').onclick = "";
		wood-=300*archeryLVL;
		metal-=100*archeryLVL;
		gold-=200*archeryLVL;
		document.getElementById('arcost').innerHTML = archeryLVL>2?"Max LVL!":
		'<img src="img/wood.png" alt="wood"/>'+(300*(archeryLVL+1))+'<br><img src="img/metal.png" alt="metal"/>'+(100*(archeryLVL+1))+'<br><img src="img/gold.png" alt="gold"/>'+(200*(archeryLVL+1))+'</td>';
		showNotice("Archery Range Upgraded!");
		return;
	}
	if(type=='st'&&wood>200*(stableLVL+1)&&metal>150*(stableLVL+1)&&gold>250*(stableLVL+1)){
		stableLVL++;
		document.getElementById('stlvl').innerHTML = "Stable lvl:"+stableLVL;
		if(stableLVL>2)document.getElementById('stcost').onclick = "";
		wood-=200*stableLVL;
		metal-=150*stableLVL;
		gold-=250*stableLVL;
		document.getElementById('stcost').innerHTML = stableLVL>2?"Max LVL!":
		'<img src="img/wood.png" alt="wood"/>'+(200*(stableLVL+1))+'<br><img src="img/metal.png" alt="metal"/>'+(150*(stableLVL+1))+'<br><img src="img/gold.png" alt="gold"/>'+(250*(stableLVL+1))+'</td>';
		showNotice("Stable Upgraded!");
		return;
	}
	if(type=='ch'&&wood>400*(churchLVL+1)&&metal>150*(churchLVL+1)&&gold>450*(churchLVL+1)){
		churchLVL++;
		document.getElementById('chlvl').innerHTML = "Church lvl:"+churchLVL;
		if(churchLVL>1)document.getElementById('chcost').onclick = "";
		wood-=400*churchLVL;
		metal-=150*churchLVL;
		gold-=450*churchLVL;
		document.getElementById('chcost').innerHTML = churchLVL>1?"Max LVL!":
		'<img src="img/wood.png" alt="wood"/>'+(400*(churchLVL+1))+'<br><img src="img/metal.png" alt="metal"/>'+(150*(churchLVL+1))+'<br><img src="img/gold.png" alt="gold"/>'+(450*(churchLVL+1))+'</td>';
		showNotice("Church Upgraded!");
		return;
	}
	if(type=='bl'&&wood>150*(blacksmithLVL+1)&&metal>150*(blacksmithLVL+1)&&gold>100*(blacksmithLVL+1)){
		blacksmithLVL++;
		document.getElementById('bllvl').innerHTML = "Smith lvl:"+blacksmithLVL;
		if(blacksmithLVL>3)document.getElementById('blcost').onclick = "";
		wood-=150*blacksmithLVL;
		metal-=150*blacksmithLVL;
		gold-=100*blacksmithLVL;
		document.getElementById('blcost').innerHTML = blacksmithLVL>3?"Max LVL!":
		'<img src="img/wood.png" alt="wood"/>'+(150*(blacksmithLVL+1))+'<br><img src="img/metal.png" alt="metal"/>'+(150*(blacksmithLVL+1))+'<br><img src="img/gold.png" alt="gold"/>'+(100*(blacksmithLVL+1))+'</td>';
		showNotice("Black Smith Upgraded!");
		return;
	}
	showNotice("Not enough resources!");
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
	XPcell.innerHTML = "<div class='retiresol' onclick='retireSol(event)'>&times;</div>";
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
			if(cell.cellIndex==3){//others!
				if(objectsTable.rows[i].children[0].innerHTML=="Small Shield")popupPicker.innerHTML+="<img src='img/sshield.png' title='Small Shield'></img>";
				if(objectsTable.rows[i].children[0].innerHTML=="Large Shield")popupPicker.innerHTML+="<img src='img/lshield.png' title='Large Shield'></img>";	
				if(objectsTable.rows[i].children[0].innerHTML=="Horse")popupPicker.innerHTML+="<img src='img/horse.png' title='Horse'></img>";	
			}
		}
	}
	//console.log(e.target.cellIndex);
	//console.log(e.target.parentNode.rowIndex);
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
	
	sol[0].parentNode.parentNode.removeChild(sol[0].parentNode);
	soliders--;
	document.getElementById('soildersDisplay').innerHTML = soliders;
	document.getElementById('UnemployedDisplay').innerHTML = Math.floor(villagers-(woodsmen+goldMiners+soliders+metalMiners+farmers));
}
function getSol(name){
	var objectsTable = document.getElementById('armoryTable');
	if(name!=""){
		for(var i=1;i<objectsTable.rows.length;i++){
			if(objectsTable.rows[i].children[0].innerHTML==name)return objectsTable.rows[i].children;
		}
	}
		
}

function showNotice(text){
	var otherNotices=document.getElementsByClassName('noticeBox');
	for(var i=0;i<otherNotices.length;i++){
		otherNotices[i].style.bottom=((otherNotices.length-i)*20 +10)+"px";
	}
	if(otherNotices.length>10)otherNotices[0].parentNode.removeChild(otherNotices[0]);
	var iDiv = document.createElement('div');
	iDiv.className = 'noticeBox visible';
	iDiv.innerHTML= text;
	document.getElementById('noticeLog').appendChild(iDiv);
	setTimeout(function(){ iDiv.className='noticeBox hidden' }, 2000); //reset the notice bar
}