import { CURRENCIES } from './constants';
import { Currencies, svgContext } from './type';

export function createCustomSelect(
    select: HTMLElement,
    currencies: object
) {
    select.replaceChildren();

    for (const [currency, value] of Object.entries(currencies)) {
        const svgName: string = currency.toLowerCase();
        const option = document.createElement('div');
        const spanText = document.createElement('span');

        spanText.innerHTML = `${currency} - ${value}`;
        option.append(spanText);
        select.append(option);
        option.classList.add(
            'option-currency',

            currency
        );
        option.setAttribute('title', value);
        option.setAttribute('tabIndex', '0');
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

    addChosenCurrency(select.closest('.select-container'));
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

function addChosenCurrency(select: HTMLElement) {
    const chosenCurrencyNode = select.querySelector(
        '.chosen-currency'
    );

    if (chosenCurrencyNode.childElementCount === 0) {
        if (chosenCurrencyNode.className.includes('base')) {
            const rub = select.querySelector('.RUB');
            chosenCurrencyNode.append(rub);
        } else if (
            chosenCurrencyNode.className.includes('exchange')
        ) {
            const usd = select.querySelector('.USD');
            chosenCurrencyNode.append(usd);
        }
    }
    const chosenOptionNode = <HTMLElement>(
        chosenCurrencyNode.firstChild
    );
    chosenOptionNode.style.borderRadius = '5px';
    chosenOptionNode.removeAttribute('tabIndex');
    chosenOptionNode.removeAttribute('role');
}
