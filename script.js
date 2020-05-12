//Get the common data
let allEpisodes;
let allShows;
let currentShowId;
//total number of episodes
let numAllepisodes;

// ---  Get Elements and Make DOM Objects ----
const mainRoot = document.getElementById("root");
const numResults = document.getElementById("num_results");
const drdEpisodes = document.getElementById("drdEpisodes");

// ---  EVENT LISTENERS ----
// Add event listeners for search box
const inputBox = document.querySelector("#search_keyword");
inputBox.addEventListener("input", (event) => {
  console.log("search keyword : " + inputBox.value);
  let keyword = inputBox.value.trim();
  drdEpisodes.getElementsByTagName("option")[0].selected = "selected";
  //inputBox.value.trim() == "" ? makePageforEpisodes() :
  searchData(keyword);
});

// Add event listeners for Shows Select Box
drdShows.addEventListener("change", (event) => {
  currentShowId = drdShows.value;
  findEpisodeByShowId(drdShows.value);
});

// Add event listeners for Episodes Select Box
drdEpisodes.addEventListener("change", (event) => {
  findEpisodeById(drdEpisodes.value);
});
//-------------------------------

//-------- HEADER MAKERS --------------

//--------------------------------------

// Add to DropDown Lists ---------------

function fill_ddList_Shows(showsdata) {
  Object.entries(showsdata).forEach(function ([index, shows]) {
    var opt = document.createElement("option");
    opt.value = shows.id;
    opt.text = shows.name;
    drdShows.appendChild(opt);
  });
  drdShows.getElementsByTagName("option")[0].selected = "selected";
}

function fill_ddList_Episodes(showId) {
  reset_drdEpisodes();
  getEpisodesAsync(showId).then((data) =>
    Object.entries(data).forEach(function ([index, e]) {
      var selectedValue = episodeFormatter(e.season, e.number) + " - " + e.name;
      var opt = document.createElement("option");
      opt.value = e.id;
      opt.text = selectedValue;
      drdEpisodes.appendChild(opt);
    })
  );

  //- makeEpisodesSelect(data)
}

function reset_drdEpisodes() {
  drdEpisodes.innerText = "";
  var opt = document.createElement("option");
  opt.value = 0;
  opt.text = "-- ALL EPISODES --";
  drdEpisodes.appendChild(opt);
  drdEpisodes.getElementsByTagName("option")[0].selected = "selected";
}

function makeEpisodesSelect(episode) {
  var selectvalue =
    episodeFormatter(episode.season, episode.number) + " - " + episode.name;
  var opt = document.createElement("option");
  opt.value = episode.id;
  opt.text = selectvalue;
  drdEpisodes.appendChild(opt);
}

//------------------------------

//---- PAGE Makers ---------------
function make_ShowsGrid(showsData) {
  Object.entries(allShows).forEach(function ([index, e]) {
    makeItem_Shows(e);
  });
}

//---------------------------------
function searchData(keyword) {
  if (currentShowId != 0) {
    getEpisodesAsync(currentShowId).then((e) => {
      let searchResult = e.filter((episode) => {
        return (
          episode.name.toLowerCase().includes(keyword.toLowerCase()) ||
          episode.summary.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      console.log("104 : " + keyword);
      makePageforSearchedepisodes(searchResult);
    });
  }
}

function bindData(dataSource) {
  Object.entries(dataSource).forEach(function ([index, e]) {
    makeEpisodeItem(e);
    //makeEpisodesSelect(e);
  });
}

function makeHeaderNav(showsData, episodesData) {
  numResults.innerText = `Displaying ${numAllepisodes} episode(s)`;
  mainRoot.innerHTML = "";
  bindData(allEpisodes);
}

function makePageforSearchedepisodes(allEpisodes) {
  numResults.innerText =
    "Displaying " + allEpisodes.length + " / " + numAllepisodes + " episode(s)";
  mainRoot.innerHTML = "";
  bindData(allEpisodes);
}

function makePageforEpisodes() {
  currentShowId.then((data) => {
    numResults.innerText = `Displaying ${data.length} episode(s)`;
    mainRoot.innerHTML = "";
    bindData(data);
  });
}

function makePageforAllepisodes(allEpisodes) {
  numResults.innerText = `Displaying ${numAllepisodes} episode(s)`;
  mainRoot.innerHTML = "";
  bindData(allEpisodes);
}

function makeItem_Shows(shows) {
  let divShowItem = document.createElement("div"); //make div for each show
  mainRoot.appendChild(divShowItem);
  divShowItem.className = "shows";

  let h1Shows = document.createElement("h1"); // make it for episode title
  let imgShows = document.createElement("img");

  divShowItem.appendChild(h1Shows);
  divShowItem.appendChild(imgShows);

  h1Shows.innerText = shows.name;
  imgShows.src = shows.image.medium;
  divShowItem.insertAdjacentHTML(`beforeend`, shows.summary);
}

function makeEpisodeItem(episode) {
  let divEpisode = document.createElement("div"); //make div for each episode
  mainRoot.appendChild(divEpisode);
  divEpisode.className = "episode";

  let h1Episode = document.createElement("h1"); // make it for episode title
  let imgEpisode = document.createElement("img");

  divEpisode.appendChild(h1Episode);
  divEpisode.appendChild(imgEpisode);

  h1Episode.innerText =
    episode.name + " - " + episodeFormatter(episode.season, episode.number);

  var mediumSrc = "images/no-image.jpg";
  episode.image == null ? mediumSrc : (mediumSrc = episode.image.medium);

  imgEpisode.src = mediumSrc;

  var summaryAlert = "<p> No summary data is available for this episode <p>";

  divEpisode.insertAdjacentHTML(
    `beforeend`,
    episode.summary == null ? summaryAlert : episode.summary
  );
}

function episodeFormatter(epSeason, epNumber) {
  return `S${formatNumber(epSeason)}E${formatNumber(epNumber)}`;

  function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
  }
}

function findEpisodeByShowId(showId) {
  if (showId != 0) {
    getEpisodesAsync(showId).then((data) => {
      numAllepisodes = data.length;
      makePageforAllepisodes(data);
    });
    fill_ddList_Episodes(showId);
  } else {
    mainRoot.innerHTML = "";
    reset_drdEpisodes();
    make_ShowsGrid(getAllShows());
  }

  console.log(showId);
}

function findEpisodeById(id) {
  getEpisodesAsync(currentShowId).then((data) => {
    if (id == 0) {
      makePageforAllepisodes(data);
    } else {
      makePageforSearchedepisodes(
        data.filter((episode) => {
          return episode.id == id;
        })
      );
    }
  });
}

function setup() {
  fetchShows();
}

window.onload = setup();

async function getEpisodesAsync(showId) {
  return await fetchData(
    "https://api.tvmaze.com/shows/" + showId + "/episodes"
  );
}

//------------------ Fetches ----------------------
function fetchEpisodes1(showId) {
  fetchData("https://api.tvmaze.com/shows/" + showId + "/episodes").then(
    (episodesData) => {
      allEpisodes = episodesData;
      numAllepisodes = episodesData.length;
      // console.log(numAllepisodes);
      makePageforAllepisodes(allEpisodes);
    }
  );
}

function fetchShows() {
  //fetchData("https://api.tvmaze.com/shows")
  allShows = getAllShows();
  currentShowId = 0;
  fill_ddList_Shows(allShows);
  make_ShowsGrid(allShows);
}

function fetchData(ApiUrl) {
  return new Promise((resolve, reject) => {
    fetch(ApiUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("unable to get the Api data");
        }
      })
      .then(function (apiData) {
        resolve(apiData);
      });
  });
}
