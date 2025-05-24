import { CURRENCIES } from './constants';
import { addOptionsToSelect } from './select';

export function getCurrenciesBySearch(
    searchInputNode: HTMLInputElement,
    selectCurrenciesNode: HTMLElement
) {
    const select = document.createElement('div');

    let searchInputValue = '';
    selectCurrenciesNode.after(select);
    select.classList.add('select-currencies');

    searchInputNode.addEventListener('input', () => {
        searchInputValue = searchInputNode.value;
        selectCurrenciesNode.style.display = 'none';
        const requiredCurrencies = filterCurrencies(searchInputValue);
        addOptionsToSelect(select, requiredCurrencies);
    });
}

function filterCurrencies(inputValue: string) {
    const filteredCurrencies = Object.fromEntries(
        Object.entries(CURRENCIES).filter((currency) => {
            return currency[1]
                .toLowerCase()
                .includes(inputValue.toLowerCase());
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
