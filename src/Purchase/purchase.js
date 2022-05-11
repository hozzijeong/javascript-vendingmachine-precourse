import { setObjectLocalStorage } from "../Storage/localStorage.js";
import { returnCoins } from "../Storage/returnCoin.js";
import { checkNumber, checkDivideTen } from "../Storage/validation.js";

export default function Purchase($app, initialState) {
    this.state = initialState;
    const ID = {
        chargeInput: "charge-input",
        chargeButton: "charge-button",
        chargeAmount: "charge-amount",
        returnButton: "coin-return-button",
        fifHundred: "coin-500-quantity",
        hundred: "coin-100-quantity",
        fifth: "coin-50-quantity",
        ten: "coin-10-quantity",
        purchaseItem: "product-purchase-item",
        purchaseButton: "purchase-button",
        purchaseName: "product-purchase-name",
        purchasePrice: "product-purchase-price",
        purchaseQuantity: "product-purchase-quantity",
    };
    const $container = document.getElementById("container");
    const insert = (e) => {
        const $charge = document.getElementById(ID.chargeInput);
        const value = parseInt($charge.value); // 여기서 유효성 검사
        if (!checkNumber(value) || !checkDivideTen(value))
            return alert("투입 금액을 확인해주세요");

        this.state.charge = this.state.charge + value;
        setObjectLocalStorage("Charge", this.state.charge);
        $charge.value = "";
        insertRender(this.state.charge);
    };
    const change = (e) => {
        const { charge } = this.state; // 거슬러 줄 돈

        const result = returnCoins(this.state.coin, charge); // 남은 코인 개수들임
        for (const [key, value] of Object.entries(result)) {
            this.state.coin[key] = this.state.coin[key] - value;
        }

        this.state.charge = 0;
        setObjectLocalStorage("Coin", this.state.coin);
        setObjectLocalStorage("Charge", this.state.charge);
        insertRender(this.state.charge);
        coinBoardRender(result);
    };
    const purchase = (e) => {
        const $tr = e.target.closest(`.${ID.purchaseItem}`);
        const [name, price, quantity] = [...$tr.childNodes].filter(
            (x) => x.nodeType === 1,
        );
        this.state.product[name.textContent].quantity -= 1;
        this.state.charge = this.state.charge - parseInt(price.textContent);
        setObjectLocalStorage("Product", this.state.product);
        setObjectLocalStorage("Charge", this.state.charge);
        quantity.textContent = this.state.product[name.textContent].quantity;
        insertRender(this.state.charge);
    };
    this.init = () => {
        while ($container.firstChild)
            $container.removeChild($container.firstChild);
        const $fragment = document.createDocumentFragment();
        const $insertContainer = createInsertContainer();
        const $purchaseBoard = createPurchaseBoard();
        const $changeBoard = createChangeBoard();

        [$insertContainer, $purchaseBoard, $changeBoard].forEach((x) =>
            $fragment.appendChild(x),
        );
        $container.appendChild($fragment);

        insertRender(this.state.charge);
        purchaseBoardRender();
        coinBoardRender();
    };

    const createInsertContainer = () => {
        const $insertContainer = document.createElement("div");
        $insertContainer.insertAdjacentHTML("afterbegin", "<h3>금액 투입</h3>");
        const $addButton = document.createElement("button");
        $addButton.id = ID.chargeButton;
        $addButton.textContent = "투입하기";
        $addButton.addEventListener("click", insert);

        const $input = document.createElement("input");
        $input.id = ID.chargeInput;
        $input.placeholder = "투입할 금액";

        const $amount = document.createElement("p");
        $amount.id = ID.chargeAmount;

        [$input, $addButton, $amount].forEach((x) =>
            $insertContainer.appendChild(x),
        );
        return $insertContainer;
    };
    const createPurchaseBoard = () => {
        const $purchaseBoard = document.createElement("div");
        $purchaseBoard.insertAdjacentHTML(
            "afterbegin",
            "<h3>구매할 수 있는 상품 현황</h3>",
        );
        const $table = document.createElement("table");
        $table.addEventListener("click", purchase);
        const $thead = document.createElement("th");
        const $theadRow = document.createElement("tr");
        const $tbody = document.createElement("tbody");
        ["상품명", "가격", "수량", "구매"].forEach((x) => {
            const $th = document.createElement("th");
            $th.textContent = x;
            $theadRow.appendChild($th);
        });

        $thead.appendChild($theadRow);
        $table.appendChild($thead);
        $table.appendChild($tbody);
        $purchaseBoard.appendChild($table);
        return $purchaseBoard;
    };
    const createChangeBoard = () => {
        const $changeBoard = document.createElement("div");
        $changeBoard.insertAdjacentHTML("afterbegin", "<h3>잔돈</h3>");
        const $change = document.createElement("button");
        $change.textContent = "반환하기";
        $change.addEventListener("click", change);
        $change.id = ID.returnButton;

        const $table = document.createElement("table");
        const $thead = document.createElement("th");
        const $theadRow = document.createElement("tr");
        const $tbody = document.createElement("tbody");
        ["동전", "개수"].forEach((x) => {
            const $th = document.createElement("th");
            $th.textContent = x;
            $theadRow.appendChild($th);
        });

        $thead.appendChild($theadRow);
        $table.appendChild($thead);
        $table.appendChild($tbody);

        [$change, $table].forEach((x) => $changeBoard.appendChild(x));

        return $changeBoard;
    };

    const insertRender = (charge) => {
        const $insert = document.getElementById(ID.chargeAmount);
        $insert.innerHTML = `투입한 금액: ${charge}`;
    };

    const purchaseBoardRender = () => {
        const { product } = this.state;
        const $table = document.querySelector("table");
        const $tbody = [...$table.childNodes].find(
            (x) => x.localName === "tbody",
        );
        for (const object of Object.entries(product)) {
            const $tr = createTr(object);
            $tbody.insertAdjacentHTML("beforeend", $tr);
        }
    };
    const createTr = (object) => {
        const [key, value] = object;

        return `
            <tr class = ${ID.purchaseItem}>
                <td class=${ID.purchaseName} data='data-product-name'>${key}</td>
                <td class=${ID.purchasePrice} data='data-product-price'>${value.price}</td>
                <td class=${ID.purchaseQuantity} data='data-product-quantity'>${value.quantity}</td>
                <td>
                    <button class=${ID.purchaseButton}>구매하기</button>
                </td>
            </tr>
        `;
    };

    const coinBoardRender = (result) => {
        const $tbody = [
            ...document.getElementById(ID.returnButton).closest("div")
                .childNodes,
        ]
            .find((x) => x.localName === "table")
            .querySelector("tbody");

        if ($tbody.firstChild) {
            const fifhundred = document.getElementById(ID.fifHundred);
            const hundred = document.getElementById(ID.hundred);
            const fifth = document.getElementById(ID.fifth);
            const ten = document.getElementById(ID.ten);

            fifhundred.textContent = `${result["500"]}개`;
            hundred.textContent = `${result["100"]}개`;
            fifth.textContent = `${result["50"]}개`;
            ten.textContent = `${result["10"]}개`;
        } else {
            [
                { name: "500", id: ID.fifHundred },
                { name: "100", id: ID.hundred },
                { name: "50", id: ID.fifth },
                { name: "10", id: ID.ten },
            ].forEach((x) => {
                const $tr = document.createElement("tr");
                const $td = document.createElement("td");
                const $quantity = document.createElement("td");
                $td.textContent = x.name + "원";
                $quantity.id = x.id;

                [$td, $quantity].forEach((x) => $tr.appendChild(x));

                $tbody.appendChild($tr);
            });
        }
    };

    this.init();
}
