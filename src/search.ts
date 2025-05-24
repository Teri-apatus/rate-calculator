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
        filterCurrencies(searchInputValue, select);
    });
}

function filterCurrencies(inputValue: string, select: HTMLElement) {
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
        addOptionsToSelect(select, notFindCurrencies);
    } else {
        addOptionsToSelect(select, filteredCurrencies);
    }
}

// список нод
// если происходит событие input, то скрыть всё
// далее CURRENCIES отфильтровать и данные перенести в объект
