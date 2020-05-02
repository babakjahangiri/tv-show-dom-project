//Get the common data
let allEpisodes;
const ApiUrl = "https://api.tvmaze.com/shows";
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
  inputBox.value.trim() == ""
    ? makePageforAllepisodes(allEpisodes)
    : searchData(keyword);
});

// Add event listeners for Episodes Select Box
drdEpisodes.addEventListener("change", (event) => {
  findEpisodeById(drdEpisodes.value);
});

function searchData(keyword) {
  let searchResult = allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(keyword.toLowerCase()) ||
      episode.summary.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  makePageforSearchedepisodes(searchResult);
}

function bindData(allEpisodes) {
  Object.entries(allEpisodes).forEach(function ([index, e]) {
    makeEpisodeItem(e);
    makeEpisodesSelect(e);
  });
}

function makePageforAllepisodes(allEpisodes) {
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

function makeEpisodeItem(episode) {
  let divEpisode = document.createElement("div"); //make div for each episode
  mainRoot.appendChild(divEpisode);
  divEpisode.className = "episode";

  let h1Episode = document.createElement("h1"); // make it for episode title
  let imgEpisode = document.createElement("img");

  divEpisode.appendChild(h1Episode);
  divEpisode.appendChild(imgEpisode);

  h1Episode.innerText =
    episode.name + " - " + episodeFormater(episode.season, episode.number);
  imgEpisode.src = episode.image.medium;
  divEpisode.insertAdjacentHTML(`beforeend`, episode.summary);
}

function episodeFormater(epSeason, epNumber) {
  return `S${formatNumber(epSeason)}E${formatNumber(epNumber)}`;

  function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
  }
}

function makeEpisodesSelect(episode) {
  var selectvalue =
    episodeFormater(episode.season, episode.number) + " - " + episode.name;
  var opt = document.createElement("option");
  opt.value = episode.id;
  opt.text = selectvalue;
  drdEpisodes.appendChild(opt);
}

function findEpisodeById(id) {
  if (id == 0) {
    makePageforAllepisodes(allEpisodes);
  } else {
    makePageforSearchedepisodes(
      allEpisodes.filter((episode) => {
        return episode.id == id;
      })
    );
  }
}

function setup() {
  fetchData().then((data) => {
    allEpisodes = data;
    numAllepisodes = data.length;
    // console.log(numAllepisodes);
    makePageforAllepisodes(allEpisodes);
  });
}

window.onload = setup();

function fetchData() {
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
