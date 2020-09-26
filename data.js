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

const insertJoke = data => {
  const jokeContainer = document.getElementsByClassName('joke-container');
  const joke = (jokeContainer[0].innerHTML = data.joke);
  return DOMPurify.sanitize(joke);
};

const el = document.getElementsByClassName('joke-button');
const buttonClick = el[0].addEventListener('click', () =>
  getDadJoke().then(data => {
    insertJoke(data);
  })
);

// once the button has been pressed, disable it for 12 hours
