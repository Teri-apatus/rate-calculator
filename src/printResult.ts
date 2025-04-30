import { calculateCurrencies } from './calculate';
import { getRates } from './getRates';
import { Currencies } from './type';

export function printResult() {
    const calcButtonNode = document.getElementById('calcInput');
    const selectsNode = document.getElementsByTagName('select');

    calcButtonNode.addEventListener('click', (event) => {
        event.preventDefault();
        addCurrenciesInOutput();
        addRatesInOutput();
    });

    function addRatesInOutput() {
        const outputBaseRateNode =
            document.getElementById('outputBaseRate');
        const outputExchangeRateNode = document.getElementById(
            'outputExchangeRate'
        );
        const moneyValueInputNode = document
            .getElementsByTagName('input')
            .namedItem('moneyValue');

        outputBaseRateNode.textContent = moneyValueInputNode.value;

        const moneyAmountValue: number = Number(
            outputBaseRateNode.textContent
        );

        const baseCurrency: Currencies = getCurrencyValueFromSelect(
            'baseCurrency'
        ) as Currencies;
        const exchangeCurrency: Currencies =
            getCurrencyValueFromSelect(
                'exchangeCurrency'
            ) as Currencies;
        const rate: number = getRates(baseCurrency, exchangeCurrency);

        const exchangeValue: number = calculateCurrencies(
            rate,
            moneyAmountValue
        );
        outputExchangeRateNode.textContent = String(exchangeValue);
    }

    function addCurrenciesInOutput() {
        Array.from(selectsNode).forEach(
            (select: HTMLSelectElement) => {
                if (select.className === 'select-currencies') {
                    const result: HTMLElement =
                        document.getElementById(
                            `result${
                                select.name[0].toUpperCase() +
                                select.name.slice(1)
                            }`
                        );

                    result.textContent = getCurrencyValueFromSelect(
                        select.name
                    );
                }
            }
        );
    }

    function getCurrencyValueFromSelect(currency: string): string {
        return selectsNode.namedItem(`${currency}`).selectedOptions[0]
            .value;
    }
}
