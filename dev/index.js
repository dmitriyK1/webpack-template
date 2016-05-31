import component from './js/component';

console.log(component());

require('./css/main.css');

async function sayHi() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(777), 3000);
  });
}

async function speak() {
  var result = await sayHi();
  console.log(result);
}

speak();
