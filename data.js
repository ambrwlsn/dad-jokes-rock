import DOMPurify from 'dompurify';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

async function getDadJoke() {
  let response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json'
    }
  });
  let data = await response.json();
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

const buttonClick = jokeButton[0].addEventListener('click', () =>
  getDadJoke().then(data => {
    insertJoke(data);
  })
);

// once the button has been pressed, disable it for 12 hours
