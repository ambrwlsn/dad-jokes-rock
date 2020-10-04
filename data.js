import DOMPurify from 'dompurify';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const term = urlParams.get('term');

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
  console.log(data);
  return data;
}

const jokeButton = document.getElementsByClassName('joke-button');
const pressedButton = require('./img/button-2.png');
const nonPressedButton = require('./img/button-1.png');

var img = document.createElement('img');
img.src = nonPressedButton;
jokeButton[0].appendChild(img);

img.addEventListener('mousedown', () => {
  img.src = pressedButton;
});

img.addEventListener('mouseup', () => {
  img.src = nonPressedButton;
});

const insertJoke = data => {
  const jokeContainer = document.getElementsByClassName('joke-container');
  const joke = (jokeContainer[0].innerHTML = data.joke);
  return DOMPurify.sanitize(joke);
};

const insertSearchedJokes = data => {
  const jokeContainer = document.getElementsByClassName('joke-list');
  const jokes = data.results;

  if (term && jokes.length === 0) {
    const noJokeMarkup = `<div>No jokes found! Try a different search term.</div>`
    jokeContainer[0].insertAdjacentHTML('afterbegin', noJokeMarkup);
  }

  const listItems = jokes
    .map(joke => {
      return `<li>${joke.joke}</li>`;
    })
    .join('');

  const jokeMarkup = `<ul>${listItems}</ul>`;

  jokeContainer[0].insertAdjacentHTML('afterbegin', jokeMarkup);
};

jokeButton[0].addEventListener('click', () =>
  getDadJoke().then(data => {
    insertJoke(data);
  })
);

const jokeSearchButton = document
  .getElementsByClassName('search-button')[0]
  .addEventListener('submit', (event) => {
    event.preventDefault();
  });


searchDadJokes().then(data => {
  insertSearchedJokes(data);
})

// once the button has been pressed, disable it for 12 hours