import { CURRENCIES } from './constants';
import { getCurrenciesBySearch } from './search';
import { Currencies, svgContext } from './type';

export function selectCurrency(selectContainer: HTMLElement) {
    const selectionResultElementNode: HTMLElement =
        selectContainer.querySelector('.selected-currency');
    const toggleContainerNode: HTMLElement =
        selectContainer.querySelector('.toggle-wrapper');
    const searchInputNode: HTMLInputElement =
        selectContainer.querySelector('.search-input');
    const selectCurrenciesNode: HTMLElement =
        selectContainer.querySelector('.select-currencies');

    document.addEventListener('click', (event) => {
        const eventTarget = <HTMLElement>event.target;

        if (
            !eventTarget.closest(`.${selectContainer.classList[0]}`)
        ) {
            toggleContainerNode.classList.remove('open');
        } else if (eventTarget.closest('.select-currencies')) {
            const targetOption: HTMLElement = eventTarget.closest(
                '.option-currency'
            );
            const objectClickedCurrency = extractCurrencyFromClicked(
                targetOption.textContent
            );
            addOptionsToSelect(
                selectionResultElementNode,
                objectClickedCurrency
            );
            toggleContainerNode.classList.toggle('open');
            searchInputNode.value = '';
            addOptionsToSelect(selectCurrenciesNode, CURRENCIES);
            setSelectHeight(toggleContainerNode);
        } else if (eventTarget === searchInputNode) {
            getCurrenciesBySearch(
                <HTMLInputElement>eventTarget,
                selectCurrenciesNode
            );
            setSelectHeight(toggleContainerNode);
        } else if (eventTarget.closest('.selected-currency')) {
            toggleContainerNode.classList.toggle('open');
        }
    });
}

function extractCurrencyFromClicked(textFromClicked: string): {
    [code: string]: string;
} {
    return {
        [textFromClicked.slice(0, 3)]: textFromClicked,
    };
}

export function addOptionsToSelect(
    select: HTMLElement,
    currencies: object
) {
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (const [currency, value] of Object.entries(currencies)) {
        const svgName: string = currency.toLowerCase();
        const option = document.createElement('div');
        const spanText = document.createElement('span');

        spanText.innerHTML = value;
        option.append(spanText);
        select.append(option);
        option.classList.add('option-currency', currency);
        option.setAttribute('title', value);
        option.setAttribute('role', 'option');

        try {
            if (hasFlag(currency as Currencies)) {
                const flagImg = document.createElement('img');
                flagImg.classList.add('icon-flag');
                flagImg.setAttribute('width', '24px');
                const iconPath = svgContext(`./${svgName}.svg`);
                flagImg.src = iconPath;
                option.prepend(flagImg);
            }
        } catch (error) {
            console.warn(error, `Flag SVG not found for ${svgName}`);
        }
    }
    addDefaultCurrency(select.closest('.select-container'));
}

function hasFlag(currency: Currencies): boolean {
    const regexp = /ang|xaf|xcd|xof|xpf/i;
    return !regexp.test(currency);
}

function addDefaultCurrency(select: HTMLElement) {
    const rub = select.querySelector('.RUB');
    const usd = select.querySelector('.USD');
    const defaultSelect = select.querySelector('.selected-currency');

    if (defaultSelect.childElementCount === 0) {
        if (
            defaultSelect.className.includes('selected-base-currency')
        ) {
            defaultSelect.append(rub);
        } else if (
            defaultSelect.className.includes(
                'selected-exchange-currency'
            )
        ) {
            defaultSelect.append(usd);
        }
    }
}

function setSelectHeight(selectContainer: HTMLElement) {
    const options = selectContainer.querySelectorAll(
        '.option-currency'
    );
    const optionsAmount = options.length;
    const heightOption = options[0].getBoundingClientRect().height;

    selectContainer.style.height = `${
        heightOption * (optionsAmount + 2)
    }px`;
}

export function fillCurrencySelects(selectsNode: HTMLElement[]) {
    selectsNode.forEach((select) => {
        addOptionsToSelect(select, CURRENCIES);
    });
}
