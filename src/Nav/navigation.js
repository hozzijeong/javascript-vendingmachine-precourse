import Manage from "../Manage/manage.js";
import Coin from "../Coin/coin.js";
import Purchase from "../Purchase/purchase.js";

export default function NavigationBar({ $app, initialState, onclick }) {
    this.state = initialState.curPage;
    this.$navBar = document.createElement("div");
    const $container = document.createElement("div");
    this.init = () => {
        [
            { name: "상품 관리", id: "product-add-menu" },
            { name: "잔돈 충전", id: "vending-machine-manage-menu" },
            { name: "상품 구매", id: "product-purchase-menu" },
        ].forEach((x) => {
            const button = document.createElement("button");
            button.id = x.id;
            button.textContent = x.name;
            this.$navBar.appendChild(button);
        });

        this.$navBar.addEventListener("click", onclick);
        $container.id = "container";
        $app.appendChild(this.$navBar);
        $app.appendChild($container);
        this.render(this.state);
    };
    this.render = (page) => {
        switch (page) {
            case "product-purchase-menu":
                return new Purchase($app, initialState);
            case "vending-machine-manage-menu":
                return new Coin($app, initialState);
            case "product-add-menu":
                return new Manage($app, initialState);
        }
    };
}
