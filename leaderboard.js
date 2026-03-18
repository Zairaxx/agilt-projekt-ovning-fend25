let teamName1= localStorage.getItem('teamAName')
let teamName2= localStorage.getItem('teamBName')
let allTeams=[
    {name: teamName1,
    rank: localStorage.getItem('teamARank')},
    {name: teamName2,
    rank: localStorage.getItem('teamBRank')}
]
let rankOrdning = ['Iron', "Bronze", "Silver", "Gold", "Diamond"]
allTeams.sort((a,b)=>{
    return rankOrdning.indexOf(b.rank)-rankOrdning.indexOf(a.rank)
})
let renderLeaderboardTeams =()=>{
    let lista= document.querySelector('.lista')
    allTeams.forEach(renderInfo)
    function renderInfo(team, index){
        let li=document.createElement('li')
        li.innerHTML= `
        <div><h4>${team.name}</h4></div>
        <div><h4>${team.rank}</h4></div>` 
        lista.append(li)
    }
}

