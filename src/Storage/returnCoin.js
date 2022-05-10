export function returnCoins(obj, charge) {
    console.log(obj, charge);
    if (obj.amount <= charge) {
        return [obj[500], obj[100], obj[50], obj[10], obj.amount];
        // 반환 개수와 거스름돈
    } else {
        const coins = [500, 100, 50, 10];
        const result = [];
        let amount = 0;
        while (charge) {
            const coin = coins.shift();
            const rest = parseInt(charge / coin);
            if (rest > obj[coin]) {
                charge -= obj[coin] * coin;
                amount += obj[coin] * coin;
                result.push(obj[coin]); // 전부 털어도 모자라니까 현재 코인 개수만큼
            } else {
                charge = charge % coin;
                amount += rest * coin;
                result.push(rest); // 남는다면 해당 코인 개수 만큼만
            }
        }
        result.push(amount);
        return result;
    }
}
