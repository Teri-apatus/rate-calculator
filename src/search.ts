import { CURRENCIES } from './constants';
import { addOptionsToSelect } from './select';

export function getCurrenciesBySearch(
    searchInputNode: HTMLInputElement,
    selectCurrenciesNode: HTMLElement
) {
    const select = document.createElement('div');
    selectCurrenciesNode.after(select);
    select.classList.add('select-currencies');

    searchInputNode.addEventListener('input', () => {
        selectCurrenciesNode.style.display = 'none';
        filterCurrencies(searchInputNode, select);
    });
}

function filterCurrencies(
    input: HTMLInputElement,
    select: HTMLElement
) {
    const filteredCurrencies = Object.fromEntries(
        Object.entries(CURRENCIES).filter((currency) => {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            return currency[1]
                .toLowerCase()
                .includes(input.value.toLowerCase());
        })
    );

    const notFindCurrencies = {
        notFound: 'Не найдено',
    };

    if (JSON.stringify(filteredCurrencies) === '{}') {
        addOptionsToSelect(select, notFindCurrencies);
    } else {
        addOptionsToSelect(select, filteredCurrencies);
    }
}
