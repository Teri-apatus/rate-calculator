import { calculateCurrencies } from './calculate';
import { CURRENCIES } from './constants';
import { getRates } from './getRates';
import { fillCurrencySelects } from './select';
import { Currencies } from './type';

export function printResult() {
    const calcButtonNode = document.getElementById('calcInput');
    const baseCurrencySelectNode = <HTMLSelectElement>(
        document.getElementById('selectBaseCurrencies')
    );
    const exchangeCurrencySelectNode = <HTMLSelectElement>(
        document.getElementById('selectExchangeCurrencies')
    );
    const outputBaseCurrencyNode = document.getElementById(
        'resultBaseCurrency'
    );
    const outputExchangeCurrencyNode = document.getElementById(
        'resultExchangeCurrency'
    );
    const outputBaseRateNode =
        document.getElementById('outputBaseRate');
    const outputExchangeRateNode = document.getElementById(
        'outputExchangeRate'
    );
    const inputMoneyValueNode = <HTMLInputElement>(
        document.getElementById('inputMoney')
    );

    fillCurrencySelects([
        baseCurrencySelectNode,
        exchangeCurrencySelectNode,
    ]);

    calcButtonNode.addEventListener('click', (event) => {
        event.preventDefault();

        const inputBaseCurrency = getCurrencyValueFromSelect(
            baseCurrencySelectNode
        );
        const inputExchangeCurrency = getCurrencyValueFromSelect(
            exchangeCurrencySelectNode
        );
        addCurrenciesInOutput(
            outputBaseCurrencyNode,
            baseCurrencySelectNode
        );
        addCurrenciesInOutput(
            outputExchangeCurrencyNode,
            exchangeCurrencySelectNode
        );

        addRatesInOutput({
            inputRate: inputMoneyValueNode,
            outputBaseRate: outputBaseRateNode,
            outputExchangeRate: outputExchangeRateNode,
            inputBaseCurrency,
            inputExchangeCurrency,
        });
        showOutput();
    });
}

function addRatesInOutput({
    inputRate,
    outputBaseRate,
    outputExchangeRate,
    inputBaseCurrency,
    inputExchangeCurrency,
}: {
    inputRate: HTMLInputElement;
    outputBaseRate: HTMLElement;
    outputExchangeRate: HTMLElement;
    inputBaseCurrency: Currencies;
    inputExchangeCurrency: Currencies;
}) {
    getRates(inputBaseCurrency, inputExchangeCurrency).then(
        (rate) => {
            outputBaseRate.textContent = inputRate.value;

            const moneyAmountValue = Number(
                outputBaseRate.textContent
            );

            const exchangeValue = calculateCurrencies(
                rate,
                moneyAmountValue
            );
            outputExchangeRate.textContent = String(exchangeValue);
        }
    );
}

function addCurrenciesInOutput(
    outputCurrency: HTMLElement,
    selectCurrency: HTMLSelectElement
) {
    outputCurrency.textContent =
        getCurrencyValueFromSelect(selectCurrency);
}

function getCurrencyValueFromSelect(
    select: HTMLSelectElement
): Currencies {
    const currencyValue = select.selectedOptions[0].value;
    if (currencyValue in CURRENCIES) {
        return currencyValue as Currencies;
    }
    throw new Error('недопустимое значение для валюты');
}

function showOutput() {
    const outputContainerNode =
        document.getElementById('outputContainer');

    if ((outputContainerNode.style.opacity = '0')) {
        outputContainerNode.style.opacity = '1';
    }
}
