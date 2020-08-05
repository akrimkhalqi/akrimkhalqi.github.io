const API_KEY = "d62d01acb58c4c108ede1d3584264ef7";
const BASE_URL = "https://api.football-data.org/v2/";
const LEAGUE_ID = 2014;
const STANDING = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const MATCH = `${BASE_URL}competitions/${LEAGUE_ID}/matches`;
const TEAM = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;

function fetchApi(url) {
    return fetch(url, {
        headers: {
            "X-Auth-Token": API_KEY
        }
    });
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

// Variabel untuk menampung data teams
let teamData;

function getAllTeams() {
    if ("caches" in window) {
        caches.match(TEAM).then(response => {
            if (response) {
                response.json().then(data => {
                    teamData = data;
                    showTeams(data);
                });
            }
        });
    }

    fetchApi(TEAM)
        .then(status)
        .then(json)
        .then(data => {
            teamData = data;
            showTeams(data);
        })
        .catch(error);

}

function showTeams(data) {
    let teams = "";
    let teamsElement = document.getElementById("laligaTeams");

    data.teams.forEach(function (team) {
        teams += `
            <tr>
                <td><img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                <td>${team.name}</td>
                <td>${team.tla}</td>
                <td>${team.address}</td>
                <td>${team.venue}</td>
                <td>
                    <a href="${team.website}" target="_blank">Official Website ${team.name}</a>
                </td>
                <td>
                    <a class="waves-effect waves-light btn-small materialize-red" onclick="saveFavorite(${team.id})" id="btnSave" style"display: block;"><i class="material-icons">favorite</i></a>
                    <a class="waves-effect waves-light btn-small materialize-red" onclick="deleteFavorite(${team.id})" id="btnDelete" style="display: none;"><i class="material-icons">favorite</i></a>
                </td>
            </tr>
        `;
    });

    teamsElement.innerHTML = `
        <table class="striped responsive-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Team Name</th>
                    <th>Short Name</th>
                    <th>Adress</th>
                    <th>Vanue</th>
                    <th>Official</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="teams">
                ${teams}
            </tbody>
        </table>         
    `;
}

function getAllStandings() {
    if ("caches" in window) {
        caches.match(STANDING).then(response => {
            if (response) {
                response.json().then(data => {
                    showStanding(data);
                });
            }
        });
    }

    fetchApi(STANDING)
        .then(status)
        .then(json)
        .then(data => {
            showStanding(data);
        })
        .catch(error);
}

function showStanding(data) {
    let standings = "";
    let standingElement = document.getElementById("laligaStanding");

    data.standings[0].table.forEach(function (standing) {
        standings += `
            <tr>
                <td class="center">${standing.position}</td>
                <td>
                    <img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/>
                </td>
                <td>
                    ${standing.team.name}
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
        `;
    });

    standingElement.innerHTML = `
        <table class="striped responsive-table">
            <thead>
                <tr>
                    <th class="center">Position</th>
                    <th></th>
                    <th>Team Name</th>
                    <th>PG</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>P</th>
                </tr>
            </thead>
            <tbody id="standings">
                ${standings}
            </tbody>
        </table>         
    `;
}

function getAllMatches() {
    if ("caches" in window) {
        caches.match(MATCH).then(response => {
            if (response) {
                response.json().then(data => {
                    showMatches(data);
                });
            }
        });
    }

    fetchApi(MATCH)
        .then(status)
        .then(json)
        .then(data => {
            showMatches(data);
        })
        .catch(error);
}

function showMatches(data) {
    let matches = "";
    let matchesElement = document.getElementById("laligaMatches");

    data.matches.forEach(function (match) {
        matches += `
            <div class="col s12 m6">
                <div class="card"> 
                    <div class="card-content blue-grey darken-2 white-text center">
                        <h5>Matchday ${match.matchday} of 38</h5>
                    </div>
                    <div class="card-action row center">
                        <div class="col s5">
                            <p>
                                ${match.homeTeam.name}<br>
                                ${match.score.fullTime.homeTeam}
                            </p>
                        </div>
                        <div class="col s2">
                            <h5>VS</h5>
                        </div>
                        <div class="col s5">
                            <p>
                                ${match.awayTeam.name}<br>
                                ${match.score.fullTime.awayTeam}
                            </p>
                        </div>
                    </div>
                    <div class="card-action row center">
                        <h5>${dmy(new Date(match.utcDate))}</h5>
                    </div>
                </div>
            </div>
        `;
    });

    matchesElement.innerHTML = `
        <div class="row">
            ${matches}
        </div>
    `;
}

function dmy(date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}



function getFavorite() {
    dbGetAllTeam().then(teams => {
        showFavorite(teams);
    });
}

function showFavorite(data) {
    let favorite = "";
    data.forEach(team => {
        favorite += `
            <div class="col s12">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
                    </div>
                    <div class="card-content">
                        <span class = "card-title activator grey-text text-darken-4"> ${team.name}
                            <i class="material-icons right">more_vert</i>
                        </span>
                        <h5>Delete From Favorite
                            <a class="btn-floating waves-effect waves-light red right" onclick = "deleteFavorite(${team.id})">
                                <i class="material-icons right">delete</i>
                            </a>
                        </h5>
                    </div>
                    <div class="card-reveal">
                        <span class = "card-title grey-text text-darken-4" > ${team.name}
                            <i class="material-icons right">close</i>
                        </span>
                        <p>
                            ${team.address}<br>
                            ${team.venue}<br>
                            <a href="${team.website}" target="_blank">Official Website ${team.name}</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    if (data.length == 0) {
        favorite += `<div class="card-panel materialize-red darken-4"><h6 class="center-align white-text">No Favorite Team Found!</6></div>`;
    }
    document.getElementById("laligaFavorite").innerHTML = favorite;
}

function saveFavorite(teamId) {
    const team = teamData.teams.filter(data => data.id == teamId)[0];
    let btnSave = document.getElementById("btnSave");
    let btnDelete = document.getElementById("btnDelete");
    dbInsertTeam(team).then(() => {
        btnSave.style.diplay = "none";
        btnDelete.style.display = "block";
        M.toast({
            html: `${team.name} Team has been added to Favorites!`
        });
    });
}

function deleteFavorite(teamId) {
    let c = confirm("Delete this team from Favorite?");
    if (c == true) {
        dbDeleteTeam(teamId).then(() => {
            M.toast({
                html: `Team has been deleted!`
            });
            getFavorite();
        })
    }
}