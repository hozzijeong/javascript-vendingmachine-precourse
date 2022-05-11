import { setObjectLocalStorage } from "../Storage/localStorage.js";
import {
    checkNumber,
    checkString,
    checkDivideTen,
} from "../Storage/validation.js";
export default function Manage($app, initialState) {
    this.state = initialState.product;
    this.key = "";
    const $container = document.getElementById("container");
    const onclick = (e) => {
        const $div = [...e.target.closest("div").childNodes];
        const inputs = $div.filter((x) => x instanceof HTMLInputElement);
        const [inputName, inputPrice, inputQuantity] = [...inputs];
        const inputVal = inputName.value.trim();
        if (!checkString(inputVal)) return alert("상품명을 다시 입력해주세요");
        if (!checkNumber(inputPrice.value) || !checkDivideTen(inputPrice.value))
            return alert("가격을 다시 입력해주세요");
        if (!checkNumber(inputQuantity.value))
            return alert("수량을 다시 입력해주세요");

        this.state[inputVal] = this.state[inputVal]
            ? {
                  price:
                      inputPrice.value != this.state[inputVal].price
                          ? inputPrice.value
                          : this.state[inputVal].price,
                  quantity:
                      parseInt(inputQuantity.value) +
                      parseInt(this.state[inputVal].quantity),
              }
            : {
                  price: inputPrice.value,
                  quantity: inputQuantity.value,
              };
        this.key = inputVal;
        setObjectLocalStorage("Product", this.state);

        renderTable(this.state);
        inputs.forEach((x) => (x.value = ""));
    };

    const renderTable = (state, table) => {
        const $table = table ? table : document.querySelector("table");
        const $tbody = [...$table.childNodes].find(
            (x) => x.localName === "tbody",
        );
        if ($tbody.firstChild) {
            const exist = [...$tbody.childNodes].find(
                (x) => x.innerText.split("\t")[0] === this.key,
            );

            if (exist !== undefined) {
                const $price = exist.querySelector(".product-manage-price");
                const $quantity = exist.querySelector(
                    ".product-manage-quantity",
                );
                console.log($price, $quantity);
                $price.textContent = state[this.key].price;
                $quantity.textContent = state[this.key].quantity;
            } else {
                const $tr = createTr([this.key, state[this.key]]);
                $tbody.appendChild($tr);
            }
        } else {
            for (const object of Object.entries(state)) {
                const $tr = createTr(object);
                $tbody.appendChild($tr);
            }
        }
    };

    const createTr = (object) => {
        const [key, value] = object;
        const $tr = document.createElement("tr");
        $tr.className = "product-manage-item";

        const $name = document.createElement("td");
        $name.className = "product-manage-name";
        $name.textContent = key;

        const $price = document.createElement("td");
        $price.className = "product-manage-price";
        $price.textContent = value.price;

        const $quantity = document.createElement("td");
        $quantity.className = "product-manage-quantity";
        $quantity.textContent = value.quantity;

        [$name, $price, $quantity].forEach((x) => $tr.appendChild(x));
        return $tr;
    };

    this.init = () => {
        while ($container.firstChild)
            $container.removeChild($container.firstChild);
        const $fragment = document.createDocumentFragment();

        const $addContainer = createInputContainer();
        const $productBoard = createProducrBoard();

        $fragment.appendChild($addContainer);
        $fragment.appendChild($productBoard);

        $container.appendChild($fragment);
    };

    const createInputContainer = () => {
        const $addContainer = document.createElement("div");
        $addContainer.insertAdjacentHTML("afterbegin", "<h3>상품추가하기</h3>");
        const $addButton = document.createElement("button");
        [
            { name: "상품명", id: "product-name-input" },
            { name: "가격", id: "product-price-input" },
            { name: "수량", id: "product-quantity-input" },
        ].forEach((x) => {
            const $input = document.createElement("input");
            $input.id = x.id;
            $input.placeholder = x.name;
            $addContainer.appendChild($input);
        });
        $addButton.addEventListener("click", onclick);
        $addButton.textContent = "추가하기";
        $addButton.id = "product-add-button";
        $addContainer.appendChild($addButton);

        return $addContainer;
    };

    const createProducrBoard = () => {
        const $productBoard = document.createElement("div");
        $productBoard.insertAdjacentHTML("afterbegin", "<h3>상품 현황</h3>");
        const $table = document.createElement("table");
        const $thead = document.createElement("th");
        const $theadRow = document.createElement("tr");
        const $tbody = document.createElement("tbody");
        ["상품명", "가격", "수량"].forEach((x) => {
            const $th = document.createElement("th");
            $th.textContent = x;
            $theadRow.appendChild($th);
        });

        $thead.appendChild($theadRow);
        $table.appendChild($thead);
        $table.appendChild($tbody);
        if (this.state !== null) renderTable(this.state, $table);
        $productBoard.appendChild($table);

        return $productBoard;
    };

    this.init();
}
