import { setObjectLocalStorage } from "../Storage/localStorage.js";
import { checkNumber, checkDivideTen } from "../Storage/validation.js";
export default function Coin($app, initialState) {
    this.state = initialState.coin;
    const ID = {
        input: "vending-machine-charge-input",
        button: "vending-machine-charge-button",
        amount: "vending-machine-charge-amount",
        fifHundred: "vending-machine-coin-500-quantity",
        hundred: "vending-machine-coin-100-quantity",
        fifth: "vending-machine-coin-50-quantity",
        ten: "vending-machine-coin-10-quantity",
    };
    const $container = document.getElementById("container");
    const onclick = (e) => {
        const $input = document.getElementById(ID.input);
        let value = parseInt($input.value);
        if (!checkNumber(value) || !checkDivideTen(value))
            return alert("입력 금액을 확인해주세요");
        calcRandomCoin(value);
        renderAmount();
        setObjectLocalStorage("Coin", this.state);
        renderTable();
        $input.value = "";
    };
    this.init = () => {
        while ($container.firstChild)
            $container.removeChild($container.firstChild);
        const $fragment = document.createDocumentFragment();
        const $addContainer = createInputContainer();
        const $coinBoard = createCoinBoard();

        [$addContainer, $coinBoard].forEach((x) => $fragment.appendChild(x));

        $container.appendChild($fragment);

        renderAmount();
        renderTable();
    };

    const renderAmount = () => {
        const $amount = document.getElementById(ID.amount);
        $amount.innerHTML = `보유 금액: ${
            this.state ? (isNaN(this.state.amount) ? 0 : this.state.amount) : ""
        }`;
    };

    const calcRandomCoin = (value) => {
        this.state.amount += value;
        const arr = [10, 50, 100, 500];
        while (value) {
            const num = MissionUtils.Random.pickNumberInList(arr);
            if (value - num < 0) {
                arr.pop();
                continue;
            }
            value -= num;
            this.state[num]++;
        }
    };

    const renderTable = () => {
        const $table = document.querySelector("table");
        const $tbody = [...$table.childNodes].find(
            (x) => x.localName === "tbody",
        );
        if ($tbody.firstChild) {
            const fifHundred = document.getElementById(ID.fifHundred);
            const hundred = document.getElementById(ID.hundred);
            const fifth = document.getElementById(ID.fifth);
            const ten = document.getElementById(ID.ten);

            fifHundred.textContent = `${this.state["500"]}개`;
            hundred.textContent = `${this.state["100"]}개`;
            fifth.textContent = `${this.state["50"]}개`;
            ten.textContent = `${this.state["10"]}개`;
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

                const num = this.state[x.name];
                $quantity.textContent = `${num}개`;

                [$td, $quantity].forEach((x) => $tr.appendChild(x));

                $tbody.appendChild($tr);
            });
        }
    };

    const createInputContainer = () => {
        const $addContainer = document.createElement("div");
        $addContainer.insertAdjacentHTML(
            "afterbegin",
            "<h3>자판기 동전 충전하기</h3>",
        );
        const $addButton = document.createElement("button");
        $addButton.id = ID.button;
        $addButton.textContent = "충전하기";
        $addButton.addEventListener("click", onclick);

        const $input = document.createElement("input");
        $input.id = ID.input;
        $input.placeholder = "자판기가 보유할 금액";

        const $amount = document.createElement("p");
        $amount.id = ID.amount;

        [$input, $addButton, $amount].forEach((x) =>
            $addContainer.appendChild(x),
        );
        return $addContainer;
    };

    const createCoinBoard = () => {
        const $coinBoard = document.createElement("div");
        $coinBoard.insertAdjacentHTML(
            "afterbegin",
            "<h3>자판기가 보유한 동전</h3>",
        );
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

        $coinBoard.appendChild($table);

        return $coinBoard;
    };
    this.init();
}
