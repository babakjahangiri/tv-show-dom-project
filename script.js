//You can edit ALL of the code here

const allEpisodes = getAllEpisodes();
const mainRoot = document.getElementById("root");

function setup() {
  //const allEpisodes = getAllEpisodes();
  // makePageForEpisodes(allEpisodes);
  //const oneEpisode = getOneEpisode();
  // console.log(oneEpisode);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

//window.onload = setup();

//console.log(allEpisodes);

Object.entries(allEpisodes).forEach(function ([index, e]) {
  makeEpisodeItem(e);
});

function makeEpisodeItem(episode) {
  let divEpisode = document.createElement("div"); //make div for each episode
  mainRoot.appendChild(divEpisode);
  divEpisode.className = "episode";

  let h1Episode = document.createElement("h1"); // make it for episode title
  let imgEpisode = document.createElement("img");

  divEpisode.appendChild(h1Episode);
  divEpisode.appendChild(imgEpisode);

  h1Episode.innerText = episode.name;
  imgEpisode.src = episode.image.medium;
  divEpisode.insertAdjacentHTML(`beforeend`, episode.summary);
}
