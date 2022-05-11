export function returnCoins(obj, charge) {
    console.log(obj, charge);
    if (obj.amount <= charge) {
        return obj;
        // 반환 개수와 거스름돈
    } else {
        const coins = [500, 100, 50, 10];
        const result = {
            500: 0,
            100: 0,
            50: 0,
            10: 0,
            amount: 0,
        };
        while (charge) {
            const coin = coins.shift();
            const rest = parseInt(charge / coin);
            if (rest > obj[coin]) {
                charge -= obj[coin] * coin;
                result.amount = result.amount + obj[coin] * coin;
                result[coin] = obj[coin]; // 전부 털어도 모자라니까 현재 코인 개수만큼
            } else {
                charge = charge % coin;
                result.amount = result.amount + rest * coin;
                result[coin] = rest;
            }
        }

        return result;
    }
}
