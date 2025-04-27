export function calculateCurrencies(
    moneyAmount: number,
    rate: number
) {
    return (1 / rate) * moneyAmount;
}
