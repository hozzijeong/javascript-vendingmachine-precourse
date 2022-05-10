import Vendingmachine from "./app.js";
function init() {
    const $app = document.getElementById("app");
    new Vendingmachine($app);
}

init();
