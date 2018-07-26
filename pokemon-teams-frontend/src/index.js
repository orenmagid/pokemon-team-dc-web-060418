const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener("DOMContentLoaded", function() {
  fetchAllTrainers();
});

function fetchAllTrainers() {
  fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(jsonData => jsonData.forEach(trainer => renderTrainer(trainer)));
}

function renderTrainer(trainer) {
  console.log(trainer);
  let main = document.getElementById("main");
  let trainerDiv = document.createElement("div");
  trainerDiv.class = "card";
  trainerDiv.dataset.id = `${trainer.id}`;

  trainerDiv.innerHTML = `<p>${trainer.name}</p>
  <button id="add-button-${trainer.id}">Add Pokemon</button>
  <ul id="ul-${trainer.id}">
  </ul>`;
  main.appendChild(trainerDiv);

  let addButton = document.getElementById(`add-button-${trainer.id}`);

  addButton.addEventListener("click", function() {
    addPokemon(trainer);
  });

  let ul = document.getElementById(`ul-${trainer.id}`);

  trainer.pokemons.forEach(function(pokemon) {
    let li = document.createElement("li");
    li.innerHTML = `${pokemon.nickname} (${
      pokemon.species
    }) <button class="release" id="release-${pokemon.id}">Release</button>`;

    ul.appendChild(li);

    releaseButton = document.getElementById(`release-${pokemon.id}`);
    releaseButton.addEventListener("click", function() {
      releasePokemon(pokemon);
    });
  });
}

function addPokemon(trainer) {
  let data = { trainer_id: trainer.id };
  fetch(POKEMONS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(pokemon => {
      if (pokemon.id) {
        let ul = document.getElementById(`ul-${trainer.id}`);
        let li = document.createElement("li");
        li.id = `li-${pokemon.id}`;
        li.innerHTML = `${pokemon.nickname} (${
          pokemon.species
        }) <button class="release" data-pokemon-id="${
          pokemon.id
        }">Release</button>`;

        ul.appendChild(li);
      }
    });
}

function releasePokemon(pokemon) {
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: "DELETE"
  }).then(response => {
    console.log("Successfully deleted pokemon", pokemon.id);
    let main = document.getElementById("main");
    main.innerHTML = "";
    fetchAllTrainers();
  });
}
