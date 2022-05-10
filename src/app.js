import NavigationBar from "./Nav/navigation.js";
import { getLocalStorage } from "./Storage/localStorage.js";
export default function Vendingmachine($app) {
    this.state = {
        curPage: "product-add-menu",
        product: getLocalStorage("Product") ? getLocalStorage("Product") : {},
        coin: getLocalStorage("Coin")
            ? getLocalStorage("Coin")
            : { 500: 0, 100: 0, 50: 0, 10: 0, amount: 0 },
        charge: getLocalStorage("Charge") ? getLocalStorage("Charge") : 0,
    };
    const navBar = new NavigationBar({
        $app,
        initialState: this.state,
        onclick: (e) => {
            navBar.render(e.target.id);
        },
    });
    const init = () => {
        $app.insertAdjacentHTML("afterbegin", "<h1>🍟자판기🍟</h1>");
        navBar.init();
    };

    init();
}
