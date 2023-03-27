const api_url = "https://pokeapi.co/api/v2/pokemon";

const pokeCard = document.querySelector("[data-poke-card]");
const pokeName = document.querySelector("[data-poke-name]");
const pokeImg = document.querySelector("[data-poke-img]");
const pokeImgContainer = document.querySelector("[data-poke-img-container]");
const pokeId = document.querySelector("[data-poke-id]");
const pokeTypes = document.querySelector("[data-poke-types]");
const pokeStats = document.querySelector("[data-poke-stats]");

//let defaultPokemons = [];
const pokemonList = [5, 89, 400, 78, 1000, 456, 590, 610, 980, 165, 267, 340];
const typeColors = {
  electric: "#FFEA70",
  normal: "#B09398",
  fire: "#FF675C",
  water: "#0596C7",
  ice: "#AFEAFD",
  rock: "#999799",
  flying: "#7AE7C7",
  grass: "#4A9681",
  psychic: "#FFC6D9",
  ghost: "#561D25",
  bug: "#A2FAA3",
  poison: "#795663",
  ground: "#D2B074",
  dragon: "#DA627D",
  steel: "#1D8A99",
  fighting: "#2F2F2F",
  default: "#2A1A1F",
};

function defaultPokemon() {
  for (var i = 0; i < 12; i++) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonList[i])
      .then((data) => data.json())
      .then((data) => {
        // Create a card for the Pokemon
        const card = document.createElement("section");
        card.classList.add("pokemon-card");

        // Add the Pokemon's name to the card
        const name = document.createElement("h3");
        name.textContent = data.name;
        card.appendChild(name);

        // Add the Pokemon's sprite to the card
        const sprite = document.createElement("img");
        sprite.src = data.sprites.front_default;
        sprite.alt = `${data.name} sprite`;
        card.appendChild(sprite);

        // Add the Pokemon's types to the card
        const types = document.createElement("section");
        types.classList.add("types");

        data.types.forEach((type) => {
          const typeItem = document.createElement("section");
          typeItem.style.color = typeColors[type.type.name];
          typeItem.textContent = type.type.name;
          types.appendChild(typeItem);
        });
        card.appendChild(types);

        // Add the Pokemon's stats to the card
        const stats = document.createElement("section");
        stats.classList.add("stats");
        ["hp", "attack", "defense", "speed"].forEach((stat) => {
          const statItem = document.createElement("section");
          statItem.textContent = `${stat}: ${
            data.stats.find((s) => s.stat.name === stat).base_stat
          }`;
          stats.appendChild(statItem);
        });
        card.appendChild(stats);

        // Add an event listener to the Pokemon's name to redirect to Poke Wiki
        name.addEventListener("click", () => {
          window.location.href = `https://bulbapedia.bulbagarden.net/wiki/${data.name}_(Pok%C3%A9mon)`;
        });

        // Add the card to the page
        document.querySelector(".grid").appendChild(card);
      })
      .catch((error) =>
        console.error(`Error fetching ${pokemon} data: ${error}`)
      );
  }
}

//--------------------here we search a pokemon----------------------

const searchPokemon = (event) => {
  event.preventDefault();
  const { value } = event.target.pokemon;
  fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
    .then((data) => data.json())
    .then((response) => renderPokemonData(response))
    .catch(() => renderNotFound());
};

//function tio render a pokemon
const renderPokemonData = (data) => {
  const sprite = data.sprites.front_default;
  const { stats, types } = data;
  pokeName.textContent = data.name;
  pokeImg.setAttribute("src", sprite);
  pokeId.textContent = `Nº ${data.id}`;
  let colors = setCardColor(types);
  pokeImg.style.background = `radial-gradient(${colors[1]} 33%, ${colors[0]} 33%)`;
  pokeImg.style.backgroundSize = " 5px 5px";
  renderPokemonTypes(types);
  renderPokemonStats(stats);
};

//function to change the colors depend if the pokemon has one or two types
const setCardColor = (types) => {
  const colorOne = typeColors[types[0].type.name];
  const colorTwo = types[1]
    ? typeColors[types[1].type.name]
    : typeColors.default;
  return colorOne, colorTwo;
};

//function to render types of pokemons
const renderPokemonTypes = (types) => {
  pokeTypes.innerHTML = "";
  types.forEach((type) => {
    const typeTextElement = document.createElement("section");
    typeTextElement.style.color = typeColors[type.type.name];
    typeTextElement.textContent = type.type.name;
    pokeTypes.appendChild(typeTextElement);
  });
};

//funtion to render the stats
const renderPokemonStats = (stats) => {
  pokeStats.innerHTML = "";
  stats.forEach((stat) => {
    const statElement = document.createElement("section");
    const statElementName = document.createElement("section");
    const statElementAmount = document.createElement("section");
    statElementName.textContent = stat.stat.name;
    statElementAmount.textContent = stat.base_stat;
    statElement.appendChild(statElementName);
    statElement.appendChild(statElementAmount);
    pokeStats.appendChild(statElement);
  });
};

//function if not found one pokemon
const renderNotFound = () => {
  pokeName.textContent = "No encontrado";
  pokeImg.setAttribute(
    "src",
    "https://twinfinite.net/wp-content/uploads/2016/11/mimikyu-2.jpg?resize=700%2C394"
  );
  pokeImg.style.background = "#fff";
  pokeTypes.innerHTML = "";
  pokeStats.innerHTML = "";
  pokeId.innerHTML = "";
};

function filterPokemon(event) {
  const searchInput = event.target.value.trim().toLowerCase();
  const pokemonCards = document.querySelectorAll(".pokemon-card");
  let searchPoke = document.getElementById("searchPoke");
  pokemonCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    if (name.includes(searchInput)) {
      card.style.display = "block";
      searchPoke.style.display = "none";
    } else {
      card.style.display = "none";
      searchPoke.style.display = "block";
    }
  });
}

//funtion to reset the code
document.addEventListener("DOMContentLoaded", () => {
  showInitialPokemon();
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", filterPokemon);

  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    filterPokemon({ target: searchInput });
  });
});

function showInitialPokemon() {
  let searchPoke = document.getElementById("searchPoke");
  searchPoke.style.display = "none";
  defaultPokemon();
}
