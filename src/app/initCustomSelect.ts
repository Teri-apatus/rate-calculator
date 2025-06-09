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
    const toggleSelectNode: HTMLElement =
        selectContainer.querySelector('.toggle-container');
    const searchInputNode: HTMLInputElement =
        selectContainer.querySelector('.search-input');
    const selectCurrenciesNode: HTMLElement =
        selectContainer.querySelector('.select-currencies');

    selectContainer.addEventListener('keydown', (event) => {
        debugger;
        const currActiveElement = <HTMLElement>document.activeElement;
        if (!selectContainer.contains(currActiveElement)) return;
        switch (event.code) {
            case 'Enter': {
                openSelect();
                break;
            }
            case 'Escape': {
                if (selectContainer.classList.contains('open')) {
                    closeSelect(selectContainer);
                } else {
                    selectContainer.blur();
                }
                break;
            }
            case 'Space': {
                openSelect();
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                if (
                    currActiveElement ===
                    selectCurrenciesNode.firstElementChild
                ) {
                    const prevFocusableEl = <HTMLElement>(
                        selectCurrenciesNode.previousElementSibling
                    );
                    prevFocusableEl.focus();
                } else if (currActiveElement === searchInputNode) {
                    closeSelect(selectContainer);
                } else {
                    const prevOption = <HTMLElement>(
                        currActiveElement.previousElementSibling
                    );
                    prevOption.scrollIntoView({
                        block: 'center',
                    });
                    prevOption.focus();
                }

                break;
            }
            case 'ArrowDown': {
                event.preventDefault();
                if (currActiveElement === searchInputNode) {
                    const nextFocusableEl = <HTMLElement>(
                        searchInputNode.nextElementSibling
                            .firstElementChild
                    );
                    nextFocusableEl.focus();
                } else if (
                    currActiveElement ===
                    selectCurrenciesNode.lastElementChild
                ) {
                    (<HTMLElement>(
                        selectCurrenciesNode.firstElementChild
                    )).focus();
                } else {
                    const nextOption = <HTMLElement>(
                        currActiveElement.nextElementSibling
                    );
                    nextOption.scrollIntoView({
                        block: 'center',
                    });
                    nextOption.focus();
                }
                break;
            }
        }
    });

    selectContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        const currentOpenedSelect: HTMLElement =
            document.querySelector('.open') || null;
        const eventTarget = <HTMLElement>event.target;

        if (
            currentOpenedSelect &&
            currentOpenedSelect !== eventTarget.closest('.open')
        ) {
            closeSelect(currentOpenedSelect);
            openSelect();
            return;
        }

        if (selectContainer.classList.contains('open')) {
            if (eventTarget.closest('.chosen-currency')) {
                closeSelect(selectContainer);
            } else if (eventTarget.closest('.select-currencies')) {
                handleSelectOption(eventTarget);
            } else if (eventTarget === searchInputNode) {
                searchInputNode.addEventListener(
                    'input',
                    onSearchInput
                );
            }
        } else {
            openSelect();
        }
    });

    document.body.addEventListener('click', onBodyClick);

    function openSelect() {
        selectContainer.classList.add('open');
        createCustomSelect(selectCurrenciesNode, CURRENCIES);
        searchInputNode.focus();
    }

    function closeSelect(select: HTMLElement) {
        const toggleSelect: HTMLElement = select.querySelector(
            '.toggle-container'
        );
        const searchInput: HTMLInputElement =
            select.querySelector('.search-input');
        toggleSelectNode;
        select.classList.remove('open');
        toggleSelect.style.height = '';
        searchInput.value = '';
        searchInput.removeEventListener('input', onSearchInput);
    }

    function onSearchInput(event: MouseEvent) {
        debugger;
        const eventTarget = <HTMLInputElement>event.target;
        const requiredCurrencies = filterCurrencies(
            eventTarget.value.toLowerCase()
        );
        createCustomSelect(selectCurrenciesNode, requiredCurrencies);
        setHeightOfContainerWhenFiltering(toggleSelectNode);
    }

    function handleSelectOption(clickedElement: HTMLElement) {
        const optionTarget = clickedElement.closest(
            '.option-currency'
        );
        const objectClickedCurrency = extractCurrencyFromClicked(
            optionTarget.textContent
        );
        createCustomSelect(chosenCurrencyNode, objectClickedCurrency);
        closeSelect(selectContainer);
    }

    function onBodyClick(event: MouseEvent) {
        const eventTarget = <HTMLElement>event.target;

        if (
            !eventTarget.closest('.open') &&
            selectContainer.classList.contains('open')
        ) {
            closeSelect(selectContainer);
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

function setHeightOfContainerWhenFiltering(
    toggleSelect: HTMLElement
) {
    const optionsAmount = toggleSelect.querySelectorAll(
        '.option-currency'
    ).length;
    const OPTION_HEIGHT = 40;

    if (optionsAmount < 6) {
        toggleSelect.style.height = `${
            OPTION_HEIGHT * (optionsAmount + 1)
        }px`;
    } else {
        toggleSelect.style.height = '';
    }
}

export function clickSwapButton() {
    swapButtonNode.addEventListener(
        'click',
        (event) => {
            event.preventDefault();
            const textBase = chosenBaseNode.textContent;
            const textExchange = chosenExchangeNode.textContent;
            const objBase = extractCurrencyFromClicked(textBase);
            const objExch = extractCurrencyFromClicked(textExchange);

            createCustomSelect(chosenBaseNode, objExch);
            createCustomSelect(chosenExchangeNode, objBase);
        },
        { once: true }
    );
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
