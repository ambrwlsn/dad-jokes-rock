import DOMPurify from 'dompurify';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getRandomInt } from './helpers.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const term = urlParams.get('term');
const APIKey =
  process.env.NODE_ENV === 'production'
    ? process.env.API_KEY
    : process.env.API_KEY;

async function getDadJoke() {
  let response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json'
    }
  });
  let data = await response.json();
  return data;
}

async function searchDadJokes() {
  let response = await fetch(`https://icanhazdadjoke.com/search?term=${term}`, {
    headers: {
      Accept: 'application/json'
    }
  });
  let data = await response.json();
  return data;
}

async function searchPicture() {
  let response = await fetch(`https://api.pexels.com/v1/search?query=${term}`, {
    headers: {
      Authorization: APIKey
    }
  });
  let data = await response.json();

  if (!data) {
    return;
  }

  return data;
}

const jokeButton = document.getElementsByClassName('joke-button');
const pressedButton = require('./img/button-2.png');
const nonPressedButton = require('./img/button-1.png');

var img = document.createElement('img');
img.src = nonPressedButton;
img.width = 150
img.setAttribute('alt', 'New joke');
jokeButton[0].appendChild(img);

img.addEventListener('mousedown', () => {
  img.src = pressedButton;
  img.width = 150
});

img.addEventListener('mouseup', () => {
  img.src = nonPressedButton;
  img.width = 150
});

const searchField = document.getElementById('joke-search');

if (term) {
  searchField.value = term;
}

const insertJoke = data => {
  const jokeContainer = document.getElementsByClassName('single-joke');
  const joke = (jokeContainer[0].innerHTML = data.joke);
  return DOMPurify.sanitize(joke);
};

const insertSearchedJokes = data => {
  const jokeContainer = document.getElementsByClassName('joke-list');
  const jokes = data.results;

  if (term && jokes.length === 0) {
    const noJokeMarkup = `<div class="empty-message">No jokes found! Try a different search term.</div>`;
    jokeContainer[0].insertAdjacentHTML('afterbegin', noJokeMarkup);
  }
  if (!term) {
    const noTermEntered = `<div class="empty-message">No search term entered. Please try a word.</div>`;
    jokeContainer[0].insertAdjacentHTML('afterbegin', noTermEntered);

    return null;
  }

  const listItems = jokes
    .map(joke => {
      return `<li>${joke.joke}</li>`;
    })
    .join('');

  const jokeMarkup = `<ul>${listItems}</ul>`;

  jokeContainer[0].insertAdjacentHTML('afterbegin', jokeMarkup);
};

const insertSearchedJokeImage = data => {
  const jokeImage = document.getElementsByClassName('joke-image')[0];
  const tinyImage = data.src.tiny;

  if (!term || (term && !tinyImage)) {
    return null;
  }

  jokeImage.src = tinyImage;
  jokeImage.alt = `A photo with a ${term} in it.`;
};

jokeButton[0].addEventListener('click', () =>
  getDadJoke().then(data => {
    insertJoke(data);
  })
);

const jokeSearchButton = document
  .getElementsByClassName('search-button')[0]
  .addEventListener('submit', event => {
    event.preventDefault();
  });

searchDadJokes()
  .then(data => {
    insertSearchedJokes(data);
  })
  .then(
    searchPicture().then(data => {
      insertSearchedJokeImage(
        data.photos[getRandomInt(Math.min(15, data.total_results))]
      );
    })
  );

// once the button has been pressed, disable it for 12 hours
// only return searched jokes that contain the whole term (e.g. from "hat: ""hat", not "that")
// re-populate the search field with the search term
// add a clear button when there's a search term
