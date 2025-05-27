import { CURRENCIES } from './constants';
import { addOptionsToSelect, setSelectHeight } from './select';

export function getCurrenciesBySearch(
    searchInput: HTMLInputElement,
    selectContainer: HTMLElement
) {
    const selectNode: HTMLElement = selectContainer.querySelector(
        '.select-currencies'
    );
    searchInput.addEventListener('input', () => {
        const requiredCurrencies = filterCurrencies(
            searchInput.value
        );

        addOptionsToSelect(selectNode, requiredCurrencies);
        setSelectHeight(selectContainer);
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
