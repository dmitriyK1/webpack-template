import component from './js/component';

console.log(component());

require('./css/main.css');
require('./stylus/main.styl');

var templateHtml = require('./jade/main.jade')();
document.body.insertAdjacentHTML('beforeEnd', templateHtml);

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
