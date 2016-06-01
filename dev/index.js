import component from './js/component';

console.log(component());

require('./css/main.css');
require('./stylus/main.styl');

var div = document.createElement('div');
var templateHtml = require('./jade/main.jade')();
div.innerHTML = templateHtml;
document.body.appendChild(div);

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

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    document.body.removeChild(div);
  });
}
