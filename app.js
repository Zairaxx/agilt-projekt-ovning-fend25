let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"


function save() {

    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))

    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)

}
function renameTeam(team) {

    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}


function renderHome() {
    let statistik= document.querySelector('.statistik')
    let statistik2= document.querySelector('.statistik2')
    const dataTeamA = JSON.parse(localStorage.getItem('teamA')) || []
    const dataTeamB = JSON.parse(localStorage.getItem('teamB')) || []
    function avgAge(spelare) {
        if (spelare.length === 0) return 0
        let total = spelare.reduce((sum, s) => sum + Number(s.age), 0)
        return (total / spelare.length).toFixed(0) 
    }
    let rankNumber = {
        "Iron": 1,
        "Bronze": 2,
        "Silver": 3,
        "Gold": 4,
        "Diamond": 5
    }
    const numberToRank = ["Iron", "Bronze", "Silver", "Gold", "Diamond"]
    function getAverageRank(spelare) {
        if (spelare.length === 0) return "Ingen"
        const total = spelare.reduce((sum, p) => {
            return sum + (rankNumber[p.ranking] || 1)
        }, 0)
        const avgNum = total / spelare.length
        const rounded = Math.round(avgNum)
        return numberToRank[rounded - 1]
    }
    document.getElementById("teamAName").textContent = teamAName
    document.getElementById("teamBName").textContent = teamBName
    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    teamA.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `
        <span onclick="goToPlayer('${p.username}')">${p.username}</span>
        <button onclick="changeTeam('${p.username}', 'A')">Change team</button>
        <button onclick="removePlayer('A','${p.username}')">Remove</button>
        `
    listA.appendChild(li)
    })
    statistik.innerHTML=`<div>Antal spelare: ${teamA.length}</div> 
        <div>Avg. ålder: ${avgAge(dataTeamA)}</div>   
        <div>Avg. rank: ${getAverageRank(dataTeamA)}</div>`
    teamB.forEach(p => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `
        <span onclick="goToPlayer('${p.username}')">${p.username}</span>
        <button onclick="changeTeam('${p.username}', 'B')">Change team</button>
        <button onclick="removePlayer('B','${p.username}')">Remove</button>
        `
    listB.appendChild(li)
    })
    statistik2.innerHTML=`<div>Antal spelare: ${teamB.length}</div> 
        <div>Avg. ålder: ${avgAge(dataTeamB)}</div>   
        <div>Avg. rank: ${getAverageRank(dataTeamB)}</div>`
}


function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}

function changeTeam(username, currentTeam) {
    if (currentTeam === "A") {
        if (teamB.length >= 5) {
            alert("Team B is full!");
            return;
        }
        const index = teamA.findIndex(p => p.username === username);
        if (index !== -1) {
            const [player] = teamA.splice(index, 1);
            teamB.push(player);
        }
    } else {
        if (teamA.length >= 5) {
            alert("Team A is full!");
            return;
        }
        const index = teamB.findIndex(p => p.username === username);
        if (index !== -1) {
            const [player] = teamB.splice(index, 1);
            teamA.push(player);
        }
    }

    save();
    renderHome();
}

function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username)
    } else {
        teamB = teamB.filter(p => p.username !== username)
    }
    save()
    renderHome()
}

function usernameExists(username) {
    return teamA.some(p => p.username === username) || teamB.some(p => p.username === username);
}

function renderAddPlayer() {

    const teamSelect = document.getElementById("teamSelect")

    teamSelect.innerHTML = `

<option value="A" ${teamA.length >= 5 ? "disabled" : ""}>
${teamAName}
</option>

<option value="B" ${teamB.length >= 5 ? "disabled" : ""}>
${teamBName}
</option>

`

    document.getElementById("playerForm").addEventListener("submit", e => {

        e.preventDefault()
        const username = document.getElementById("username").value
        if (usernameExists(username)) {
            document.getElementById("error").textContent = "Username already exists";
            return;
        }
        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: document.getElementById("country").value,
            ranking: document.getElementById("ranking").value

        }
        const team = document.getElementById("teamSelect").value
        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }
        save()
        window.location.href = "index.html"

    })

}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer")
    const player = teamA.find(p => p.username === username)||teamB.find(p => p.username === username)
    const profile = document.getElementById("profile")
    profile.innerHTML = `
<div class="profile">
<h2>${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.country}</p>
<p><b>Ranking:</b> ${player?.ranking}</p>
<br>
<button onclick="window.location='index.html'">Back</button>
<button id="editBtn">Edit</button>
</div>

`

;

const editBtn = document.getElementById("editBtn");
    editBtn.addEventListener("click", () => enableEdit(profile, player));
}

function enableEdit(profileDiv, player) {
    profileDiv.innerHTML = `
        <div class="profile">
        <h2>${player?.username}</h2>
        <p><b>First name:</b> <input type="text" value="${player?.firstname}" class="edit-fname"></p>
        <p><b>Last name:</b> <input type="text" value="${player?.lastname}" class="edit-lname"></p>
        <p><b>Age:</b> <input type="number" value="${player?.age}" class="edit-age"></p>
        <p><b>Country:</b> <input type="text" value="${player?.country}" class="edit-country"></p>
        <p><b>Ranking:</b> 
        <select class="edit-ranking" id="ranking" value="${player?.ranking}">
            <option>Iron</option>
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Diamond</option>
        </select>
        </p>
        <button class="saveBtn">Save</button>
        <button class="cancelBtn">Cancel</button>
        </div>
    `;

    profileDiv.querySelector(".saveBtn").addEventListener("click", () => {
        player.firstname = profileDiv.querySelector(".edit-fname")?.value;
        player.lastname = profileDiv.querySelector(".edit-lname")?.value;
        player.age = parseInt(profileDiv.querySelector(".edit-age")?.value);
        player.country = profileDiv.querySelector(".edit-country")?.value;
        player.ranking = profileDiv.querySelector(".edit-ranking")?.value;

        save();
        renderPlayerInfo();
    });

    profileDiv.querySelector(".cancelBtn").addEventListener("click", () => {
        renderPlayerInfo();
    });
}

function sortPlayers() {
    let sortingArr = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Iron']

    let sortDropdown = document.querySelector("#sort");
    if (sortDropdown.value === "age") {
        teamA.sort((a, b) => a.age - b.age);
        teamB.sort((a, b) => a.age - b.age);
    } else if (sortDropdown.value === "username") {
        teamA.sort((a, b) => a.username.localeCompare(b.firstname));
        teamB.sort((a, b) => a.username.localeCompare(b.firstname));
    } else if (sortDropdown.value === "ranking") {
        teamA.sort((a, b) => sortingArr.indexOf(a.ranking) - sortingArr.indexOf(b.ranking));
        teamB.sort((a, b) => sortingArr.indexOf(a.ranking) - sortingArr.indexOf(b.ranking));
    }
    renderHome();
}