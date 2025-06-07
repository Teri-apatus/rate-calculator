import { CURRENCIES } from './constants';
import { Currencies, svgContext } from './type';

export function createCustomSelect(
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

        spanText.innerHTML = `${currency} - ${value}`;
        option.append(spanText);
        select.append(option);
        option.classList.add('option-currency', currency);
        option.setAttribute('title', value);
        option.setAttribute('tabindex', '-1');
        option.setAttribute('role', 'option');

        try {
            if (hasFlag(currency as Currencies)) {
                const flagImg = document.createElement('img');
                flagImg.classList.add('icon-flag');
                flagImg.setAttribute('width', '24px');
                flagImg.setAttribute('alt', `${currency} flag`);
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

export function fillCurrencySelects(selectsNode: HTMLElement[]) {
    selectsNode.forEach((select) => {
        createCustomSelect(select, CURRENCIES);
    });
}

function hasFlag(currency: Currencies): boolean {
    const regexp = /ang|xaf|xcd|xof|xpf/i;
    return !regexp.test(currency);
}

function addDefaultCurrency(select: HTMLElement) {
    const rub = select.querySelector('.RUB');
    const usd = select.querySelector('.USD');
    const defaultSelect = select.querySelector('.chosen-currency');

    if (defaultSelect.childElementCount === 0) {
        if (defaultSelect.className.includes('base')) {
            defaultSelect.append(rub);
        } else if (defaultSelect.className.includes('exchange')) {
            defaultSelect.append(usd);
        }
    }
    (<HTMLElement>defaultSelect.firstChild).removeAttribute('role');
}
