//Get the common data
const allEpisodes = getAllEpisodes();
const numAllepisodes = allEpisodes.length;
const mainRoot = document.getElementById("root");
const numResults = document.getElementById("num_results");

// Add event listeners for search box
const inputBox = document.querySelector("#search_keyword");
inputBox.addEventListener("input", (event) => {
  console.log("search keyword : " + inputBox.value);
  let keyword = inputBox.value.trim();
  inputBox.value.trim() == ""
    ? makePageforAllepisodes(allEpisodes)
    : searchData(keyword);
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
    episode.name +
    " - " +
    "S" +
    formatNumber(episode.season) +
    "E" +
    formatNumber(episode.number);

  imgEpisode.src = episode.image.medium;
  divEpisode.insertAdjacentHTML(`beforeend`, episode.summary);
}

function formatNumber(num) {
  return num < 10 ? `0${num}` : num;
}

function setup() {
  //const allEpisodes = getAllEpisodes();
  makePageforAllepisodes(allEpisodes);
}

window.onload = setup();
