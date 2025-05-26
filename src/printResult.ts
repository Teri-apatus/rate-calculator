import { calculateCurrencies } from './calculate';
import { CURRENCIES } from './constants';
import { getRates } from './getRates';
import {
    clickSwapButton,
    fillCurrencySelects,
    selectCurrency,
} from './select';
import { Currencies } from './type';
import { getCurrenciesBySearch } from './search';

export function printResult() {
    const calcButtonNode = document.getElementById('calcInput');

    const selectedBaseCurrencyNode = document.getElementById(
        'selectedBaseCurrency'
    );
    const selectedExchangeCurrencyNode = document.getElementById(
        'selectedExchangeCurrency'
    );

    const baseCurrencySelectNode = document.getElementById(
        'selectBaseCurrencies'
    );
    const exchangeCurrencySelectNode = document.getElementById(
        'selectExchangeCurrencies'
    );

    const outputBaseCurrencyNode = document.getElementById(
        'outputBaseCurrency'
    );
    const outputExchangeCurrencyNode = document.getElementById(
        'outputExchangeCurrency'
    );

    const outputUnitBaseCurrencyNode = document.getElementById(
        'outputUnitBaseCurrency'
    );
    const outputUnitExchangeCurrencyNode = document.getElementById(
        'outputUnitExchangeCurrency'
    );

    const outputBaseRateNode =
        document.getElementById('outputBaseRate');
    const outputExchangeRateNode = document.getElementById(
        'outputExchangeRate'
    );
    const outputUnitExchangeRateNode = document.getElementById(
        'outputUnitExchangeRate'
    );
    const inputMoneyValueNode = <HTMLInputElement>(
        document.getElementById('inputBaseRate')
    );

    const searchBaseInputNode = <HTMLInputElement>(
        document.getElementById('searchBaseCurrency')
    );
    const searchExchangeInputNode = <HTMLInputElement>(
        document.getElementById('searchExchangeCurrency')
    );

    const selectsNode = document.querySelectorAll(
        '.select-container'
    );

    selectsNode.forEach((selectNode: HTMLElement) =>
        selectCurrency(selectNode)
    );

    getCurrenciesBySearch(
        searchBaseInputNode,
        baseCurrencySelectNode
    );
    getCurrenciesBySearch(
        searchExchangeInputNode,
        exchangeCurrencySelectNode
    );

    fillCurrencySelects([
        baseCurrencySelectNode,
        exchangeCurrencySelectNode,
    ]);

    clickSwapButton(
        selectedBaseCurrencyNode,
        selectedExchangeCurrencyNode
    );

    calcButtonNode.addEventListener('click', (event) => {
        event.preventDefault();

        const inputBaseCurrency = getCurrencyValueFromSelect(
            selectedBaseCurrencyNode
        );
        const inputExchangeCurrency = getCurrencyValueFromSelect(
            selectedExchangeCurrencyNode
        );
        addCurrenciesInOutput(
            outputBaseCurrencyNode,
            outputUnitBaseCurrencyNode,
            selectedBaseCurrencyNode
        );
        addCurrenciesInOutput(
            outputExchangeCurrencyNode,
            outputUnitExchangeCurrencyNode,
            selectedExchangeCurrencyNode
        );

        addRatesInOutput({
            inputRate: inputMoneyValueNode,
            outputBaseRate: outputBaseRateNode,
            outputExchangeRate: outputExchangeRateNode,
            outputUnitExchangeRate: outputUnitExchangeRateNode,
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
    outputUnitExchangeRate,
    inputBaseCurrency,
    inputExchangeCurrency,
}: {
    inputRate: HTMLInputElement;
    outputBaseRate: HTMLElement;
    outputExchangeRate: HTMLElement;
    outputUnitExchangeRate: HTMLElement;
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
                moneyAmountValue,
                rate
            );
            const exchangeUnitValue = calculateCurrencies(1, rate);
            outputExchangeRate.textContent = String(exchangeValue);
            outputUnitExchangeRate.textContent =
                String(exchangeUnitValue);
        }
    );
}

function addCurrenciesInOutput(
    outputCurrency: HTMLElement,
    outputUnitCurrency: HTMLElement,
    selectCurrency: HTMLElement
) {
    outputCurrency.textContent =
        getCurrencyValueFromSelect(selectCurrency);
    outputUnitCurrency.textContent = outputCurrency.textContent;
}

function getCurrencyValueFromSelect(select: HTMLElement): Currencies {
    console.log(select);
    const currencyValue = select.textContent.slice(0, 3);
    if (currencyValue in CURRENCIES) {
        console.log(currencyValue);
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
