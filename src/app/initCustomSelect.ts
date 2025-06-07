import { createCustomSelect } from './createCustomSelect';
import { CURRENCIES } from './constants';
import {
    chosenBaseNode,
    chosenExchangeNode,
    swapButtonNode,
} from './htmlElements';

export function initCustomSelect(selectContainer: HTMLElement) {
    const chosenCurrencyNode: HTMLElement =
        selectContainer.querySelector('.chosen-currency');
    const searchInputNode: HTMLInputElement =
        selectContainer.querySelector('.search-input');
    const selectCurrenciesNode: HTMLElement =
        selectContainer.querySelector('.select-currencies');
    const selectWrapperNode: HTMLElement =
        selectContainer.closest('.select-wrapper');

    document.body.addEventListener('keyup', (event) => {
        // event.preventDefault();
        // console.log('event', event);
        // console.log('active', document.activeElement);
        // console.log('target', event.target);
        // console.log('curr', event.currentTarget);
    });

    selectContainer.addEventListener('click', (event) => {
        const eventTarget = <HTMLElement>event.target;

        if (!eventTarget.closest(selectContainer.classList[0])) {
            document.body.addEventListener('click', onBodyClick);
        }

        if (eventTarget.closest('.select-currencies')) {
            onSelectClick(eventTarget);
        } else if (eventTarget === searchInputNode) {
            searchInputNode.addEventListener(
                'input',
                onSearchCurrencyInput
            );
        } else if (eventTarget.closest('.chosen-currency')) {
            selectWrapperNode.classList.toggle('open');
        }
        clearSearchField();
    });

    function onSelectClick(clickedElement: HTMLElement) {
        selectWrapperNode.classList.add('open');

        const optionTarget: HTMLElement = clickedElement.closest(
            '.option-currency'
        );
        const objectClickedCurrency = extractCurrencyFromClicked(
            optionTarget.textContent
        );
        createCustomSelect(chosenCurrencyNode, objectClickedCurrency);
        selectWrapperNode.classList.remove('open');
    }

    function onSearchCurrencyInput(event: MouseEvent) {
        const requiredCurrencies = filterCurrencies(
            searchInputNode.value.toLowerCase()
        );
        createCustomSelect(selectCurrenciesNode, requiredCurrencies);
        setSelectHeight(selectContainer);
    }

    function onBodyClick(event: MouseEvent) {
        function isClickInsideSelect(): boolean {
            return Boolean(
                (<HTMLElement>event.target).closest(
                    `.${selectContainer.classList[0]}`
                )
            );
        }

        if (!isClickInsideSelect()) {
            selectWrapperNode.classList.remove('open');
            clearSearchField();
            event.target.removeEventListener(event.type, onBodyClick);
        }
    }

    function clearSearchField() {
        if (!selectWrapperNode.classList.contains('open')) {
            searchInputNode.value = '';
            createCustomSelect(selectCurrenciesNode, CURRENCIES);
            setSelectHeight(selectContainer);
            searchInputNode.removeEventListener(
                'input',
                onSearchCurrencyInput
            );
        }
    }
}

function extractCurrencyFromClicked(textFromClicked: string): {
    [code: string]: string;
} {
    return {
        [textFromClicked.slice(0, 3)]: textFromClicked.slice(6),
    };
}

function setSelectHeight(selectContainer: HTMLElement) {
    const optionsAmount = selectContainer.querySelectorAll(
        '.option-currency'
    ).length;
    const OPTION_HEIGHT = 40;

    if (optionsAmount < 6) {
        selectContainer.style.height = `${
            OPTION_HEIGHT * (optionsAmount + 1)
        }px`;
    } else {
        selectContainer.style.height = '';
    }
}

export function clickSwapButton() {
    swapButtonNode.addEventListener('click', onSwapButtonClick);
}

function onSwapButtonClick(event: MouseEvent) {
    event.preventDefault();
    const textBase = chosenBaseNode.textContent;
    const textExchange = chosenExchangeNode.textContent;
    const objBase = extractCurrencyFromClicked(textBase);
    const objExch = extractCurrencyFromClicked(textExchange);

    createCustomSelect(chosenBaseNode, objExch);
    createCustomSelect(chosenExchangeNode, objBase);
    event.target.removeEventListener(event.type, onSwapButtonClick);
}

function filterCurrencies(inputValue: string): object {
    const filteredCurrencies = Object.fromEntries(
        Object.entries(CURRENCIES).filter((currency) => {
            const isoCurrency = currency[0].toLowerCase();
            const localNameCurrency = currency[1].toLowerCase();

            return (
                isoCurrency.includes(inputValue) ||
                localNameCurrency.includes(inputValue)
            );
        })
    );

    const notFindCurrencies = {
        notFound: 'Не найдено',
    };

    if (JSON.stringify(filteredCurrencies) === '{}') {
        return notFindCurrencies;
    }
    return filteredCurrencies;
}
