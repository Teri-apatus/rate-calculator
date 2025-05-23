import { calculateCurrencies } from './calculate';
import { CURRENCIES } from './constants';
import { getRates } from './getRates';
import { fillCurrencySelects } from './select';
import { Currencies } from './type';
import swapArrows from './images/icons/swap-arrows.svg';
import { searchFilter } from './search';

export function printResult() {
    const calcButtonNode = document.getElementById('calcInput');

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

    addSwapSvg();
    searchFilter(searchBaseInputNode, baseCurrencySelectNode);

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
            outputUnitBaseCurrencyNode,
            baseCurrencySelectNode
        );
        addCurrenciesInOutput(
            outputExchangeCurrencyNode,
            outputUnitExchangeCurrencyNode,
            exchangeCurrencySelectNode
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
    const currencyValue = select.id;
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

function addSwapSvg() {
    const imgNode = <HTMLImageElement>(
        document.getElementById('swapArrows')
    );
    imgNode.src = swapArrows;
}
