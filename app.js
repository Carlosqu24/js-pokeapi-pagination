const $main = document.querySelector('main');
const $links = document.querySelector('.links');

const API_URL = "https://pokeapi.co/api/v2/pokemon";

async function getPokemons(url) {
    try {
        $main.innerHTML = `<img class="loader" src="./assets/ripple-loader.svg" alt="Cargando">`;

        let res = await fetch(url);
        let data = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        showPokemons(data);

    } catch (error) {
        let message = error.statusText || "¡Ha ocurrido un error!";
        $main.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
    }
}

async function showPokemons(data) {
    let $template = "";
    let $prevLink = "";
    let $nextLink = "";

    for (let i = 0; i < data.results.length; i++){

        try {
            let res = await fetch(data.results[i].url);
            let pokemon = await res.json();
        
            console.log(pokemon)

            if (!res.ok) throw { status: res.status, statusText: res.statusText }

            $template += `
            <figure class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <figcaption class="name">${pokemon.name}</figcaption>
            </figure>
            `;

            $prevLink = data.previous ? `
            <a href="${data.previous}">Anterior</a>
            ` : "";
            $nextLink = data.next ? `
            <a href="${data.next}">Siguiente</a>` : "";

            $links.innerHTML = $prevLink + " " + $nextLink;

        } catch (error) {
            let message = error.statusText || "¡Ha ocurrido un error!";
            $template += `
            <figure>
                <figcaption>Error ${error.status}: ${message}</figcaption>
            </figure>
            `;
        }
    }

    $main.innerHTML = $template;
}






document.addEventListener('DOMContentLoaded', e => getPokemons(API_URL));

document.addEventListener('click', e => {
    if (e.target.matches('.links a')) {
        e.preventDefault();

        getPokemons(e.target.getAttribute("href"));
    }
})