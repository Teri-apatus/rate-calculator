import { CURRENCIES } from './constants';
import { addOptionsToSelect } from './select';

export function getCurrenciesBySearch(
    searchInput: HTMLInputElement,
    select: HTMLElement
) {
    searchInput.addEventListener('input', () => {
        const requiredCurrencies = filterCurrencies(
            searchInput.value
        );

        addOptionsToSelect(select, requiredCurrencies);
        getHeightSelect(select);
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

function getHeightSelect(select: HTMLElement) {
    const optionsAmount = select.childElementCount;
    const heightOption =
        select.firstElementChild.getBoundingClientRect().height;

    select.parentElement.style.height = `${
        heightOption * (optionsAmount + 1)
    }px`;
}
