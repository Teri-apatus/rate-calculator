import { CURRENCIES, THIN_SPACE } from './constants';
import { showCorrectNumber } from './showCorrectNumber';
import { getRates } from './getRates';
import {
    clickSwapButton,
    initCustomSelect,
} from './initCustomSelect';
import { Currencies } from './type';
import {
    baseContainerNode,
    baseSelectNode,
    calcButtonNode,
    exchangeContainerNode,
    exchangeSelectNode,
    inputValueNode,
    loadingAnimationNode,
    outputCalculateNode,
    outputContainerNode,
    outputUnitNode,
    chosenBaseNode,
    chosenExchangeNode,
} from './htmlElements';
import { fillCurrencySelects } from './createCustomSelect';

export function initCurrencyConverter() {
    initCustomSelect(baseContainerNode);
    initCustomSelect(exchangeContainerNode);
    fillCurrencySelects([baseSelectNode, exchangeSelectNode]);
    clickSwapButton();

    calcButtonNode.addEventListener('click', calculateCurrencies);

    inputValueNode.addEventListener('input', () => {
        inputValueNode.value = showCorrectNumber(
            inputValueNode.value
        );
    });
}

function calculateCurrencies(event: MouseEvent) {
    event.preventDefault();

    hideOutput(outputContainerNode);
    startLoadingAnimation(loadingAnimationNode);

    const inputMoneyValue: string = inputValueNode.value;

    const inputBaseCurrency = getCurrencyValueFromSelect(
        chosenBaseNode.textContent
    );
    const inputExchangeCurrency = getCurrencyValueFromSelect(
        chosenExchangeNode.textContent
    );

    addResultInOutput({
        inputValue: inputMoneyValue,
        inputBaseCurrency,
        inputExchangeCurrency,
        outputCalculateResult: outputCalculateNode,
        outputUnitResult: outputUnitNode,
    }).then(() => {
        finishLoadingAnimation(loadingAnimationNode);
        showOutput(outputContainerNode);
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
            const exchangeValue = numberOfMoneyAmount * rate;
            const exchangeValueWithSpaces = showCorrectNumber(
                `${exchangeValue}`
            );

            const calculateResult = `${inputValue} ${inputBaseCurrency} = ${exchangeValueWithSpaces} ${inputExchangeCurrency}`;
            const unitResult = `1 ${inputBaseCurrency} = ${rate} ${inputExchangeCurrency}`;

            outputCalculateResult.textContent = calculateResult;
            outputUnitResult.textContent = unitResult;
        }
    );
}

function getCurrencyValueFromSelect(textSelect: string): Currencies {
    const currencyValue = textSelect.slice(0, 3);
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
