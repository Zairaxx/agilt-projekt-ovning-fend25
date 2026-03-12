let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"


function save(){

localStorage.setItem("teamA", JSON.stringify(teamA))
localStorage.setItem("teamB", JSON.stringify(teamB))
localStorage.setItem("teamAName", teamAName)
localStorage.setItem("teamBName", teamBName)

}


function usernameExists(username){

return teamA.some(p => p.username === username) ||
       teamB.some(p => p.username === username)

}


function renderHome(){

const teamAList = document.getElementById("teamAList")
const teamBList = document.getElementById("teamBList")

if(!teamAList || !teamBList) return

document.getElementById("teamAName").textContent = teamAName
document.getElementById("teamBName").textContent = teamBName

teamAList.innerHTML = ""
teamBList.innerHTML = ""


teamA.forEach((p,index)=>{

const li = document.createElement("li")

li.innerHTML = `
<span onclick="goToPlayer('${p.username}')">${p.username}</span>

<div class="playerButtons">
<button onclick="leaveTeam('A', ${index})">Leave Team</button>
<button onclick="changeTeam('A', ${index})">Change Team</button>
</div>
`

teamAList.appendChild(li)

})


teamB.forEach((p,index)=>{

const li = document.createElement("li")

li.innerHTML = `
<span onclick="goToPlayer('${p.username}')">${p.username}</span>

<div class="playerButtons">
<button onclick="leaveTeam('B', ${index})">Leave Team</button>
<button onclick="changeTeam('B', ${index})">Change Team</button>
</div>
`

teamBList.appendChild(li)

})

}


function leaveTeam(team,index){

if(team === "A"){
teamA.splice(index,1)
}else{
teamB.splice(index,1)
}

save()
renderHome()

}


function changeTeam(team,index){

if(team === "A"){

if(teamB.length >= 5){
alert("Team B is full")
return
}

const player = teamA.splice(index,1)[0]
teamB.push(player)

}else{

if(teamA.length >= 5){
alert("Team A is full")
return
}

const player = teamB.splice(index,1)[0]
teamA.push(player)

}

save()
renderHome()

}


function goToPlayer(username){

localStorage.setItem("selectedPlayer", username)

window.location.href = "playerinfo.html"

}


function renderPlayerInfo(){

const profile = document.getElementById("profile")

if(!profile) return

const username = localStorage.getItem("selectedPlayer")

const player =
teamA.find(p => p.username === username) ||
teamB.find(p => p.username === username)

if(!player) return


profile.innerHTML = `

<div class="profile">

<h2>${player.username}</h2>

<p><b>Name:</b> ${player.firstname} ${player.lastname}</p>
<p><b>Age:</b> ${player.age}</p>
<p><b>Country:</b> ${player.country}</p>
<p><b>Ranking:</b> ${player.ranking}</p>

<br>

<button onclick="window.location='index.html'">Back</button>

</div>

`

}


function renderAddPlayer(){

const form = document.getElementById("playerForm")

if(!form) return

const teamSelect = document.getElementById("teamSelect")

teamSelect.innerHTML = `

<option value="A" ${teamA.length>=5?"disabled":""}>
${teamAName}
</option>

<option value="B" ${teamB.length>=5?"disabled":""}>
${teamBName}
</option>

`

form.addEventListener("submit", e=>{

e.preventDefault()

const username = document.getElementById("username").value.trim()

if(usernameExists(username)){
document.getElementById("error").textContent="Username already exists"
return
}

const player={

username: username,
firstname: document.getElementById("firstname").value,
lastname: document.getElementById("lastname").value,
age: document.getElementById("age").value,
country: document.getElementById("country").value,
ranking: document.getElementById("ranking").value

}

const team = teamSelect.value

if(team === "A") teamA.push(player)
if(team === "B") teamB.push(player)

save()

window.location.href="index.html"

})

}


renderHome()
renderAddPlayer()
renderPlayerInfo()