import { calculateCurrencies } from './calculate';
import { CURRENCIES, THIN_SPACE } from './constants';
import { showCorrectNumber } from './showCorrectNumber';
import { getRates } from './getRates';
import {
    clickSwapButton,
    fillCurrencySelects,
    initCurrencySelect,
} from './select';
import { Currencies } from './type';

export function initCurrencyConverter() {
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

    const outputCalculateResultNode = document.getElementById(
        'outputCalculateResult'
    );
    const outputUnitResultNode = document.getElementById(
        'outputUnitResult'
    );
    const inputMoneyValueNode = <HTMLInputElement>(
        document.getElementById('inputBaseRate')
    );

    const selectsNode = document.querySelectorAll(
        '.select-container'
    );

    selectsNode.forEach((selectNode: HTMLElement) =>
        initCurrencySelect(selectNode)
    );

    const outputResultNode: HTMLElement =
        document.getElementById('resultContainer');

    const loadingAnimationNode =
        document.getElementById('loadAnimation');

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

        hideOutput(outputResultNode);
        startLoadingAnimation(loadingAnimationNode);

        const inputMoneyValue: string = inputMoneyValueNode.value;

        const inputBaseCurrency = getCurrencyValueFromSelect(
            selectedBaseCurrencyNode
        );
        const inputExchangeCurrency = getCurrencyValueFromSelect(
            selectedExchangeCurrencyNode
        );

        addResultInOutput({
            inputValue: inputMoneyValue,
            inputBaseCurrency,
            inputExchangeCurrency,
            outputCalculateResult: outputCalculateResultNode,
            outputUnitResult: outputUnitResultNode,
        }).then(() => {
            finishLoadingAnimation(loadingAnimationNode);
            showOutput(outputResultNode);
        });
    });

    inputMoneyValueNode.addEventListener('input', () => {
        inputMoneyValueNode.value = showCorrectNumber(
            inputMoneyValueNode.value
        );
    });
}

function startLoadingAnimation(loadingCircle: HTMLElement) {
    loadingCircle.classList.add('loading');
}

function finishLoadingAnimation(loadingCircle: HTMLElement) {
    loadingCircle.classList.remove('loading');
}

async function addResultInOutput({
    inputValue,
    inputBaseCurrency,
    inputExchangeCurrency,
    outputCalculateResult,
    outputUnitResult,
}: {
    inputValue: string;
    inputBaseCurrency: Currencies;
    inputExchangeCurrency: Currencies;
    outputCalculateResult: HTMLElement;
    outputUnitResult: HTMLElement;
}) {
    await getRates(inputBaseCurrency, inputExchangeCurrency).then(
        (rate) => {
            const numberOfMoneyAmount = Number(
                inputValue.split(THIN_SPACE).join('')
            );
            const exchangeValue = calculateCurrencies(
                numberOfMoneyAmount,
                rate
            );

            const exchangeValueWithSpaces = showCorrectNumber(
                `${exchangeValue}`
            );

            const calculateResult = `${inputValue} ${inputBaseCurrency} = ${exchangeValueWithSpaces} ${inputExchangeCurrency}`;
            const unitResult = `1 ${inputBaseCurrency} = ${rate.toFixed(
                4
            )} ${inputExchangeCurrency}`;

            outputCalculateResult.textContent = calculateResult;
            outputUnitResult.textContent = unitResult;
        }
    );
}

function getCurrencyValueFromSelect(select: HTMLElement): Currencies {
    const currencyValue = select.textContent.slice(0, 3);
    if (currencyValue in CURRENCIES) {
        return currencyValue as Currencies;
    }
    throw new Error('недопустимое значение для валюты');
}

function showOutput(outputResult: HTMLElement) {
    outputResult.style.opacity = '1';
}

function hideOutput(outputResult: HTMLElement) {
    outputResult.style.opacity = '0';
}
