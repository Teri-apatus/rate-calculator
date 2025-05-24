import { CURRENCIES } from './constants';
import { Currencies } from './type';

const svgRequire = require as typeof require & {
    context: (
        path: string,
        deep?: boolean,
        filter?: RegExp
    ) => {
        keys: () => string[];
        (id: string): string;
    };
};

const svgContext = svgRequire.context(
    './images/icons/',
    false,
    /\.svg$/
);

export function fillCurrencySelects(selectsNode: HTMLElement[]) {
    selectsNode.forEach((select) => {
        addOptionsToSelect(select, CURRENCIES);
    });
}

export function addOptionsToSelect(
    select: HTMLElement,
    currencies: object
) {
    for (const [currency, value] of Object.entries(currencies)) {
        const svgName: string = currency.toLowerCase();
        const option = document.createElement('div');
        const spanText = document.createElement('span');

        spanText.innerHTML = value;
        option.append(spanText);
        select.append(option);
        option.classList.add('option-currency');
        option.setAttribute('id', currency);

        try {
            if (hasFlag(currency as Currencies)) {
                const flagImg = document.createElement('img');
                flagImg.setAttribute('width', '15px');
                const iconPath = svgContext(`./${svgName}.svg`);
                flagImg.src = iconPath;
                option.prepend(flagImg);
            }
        } catch (error) {
            console.warn(error, `Flag SVG not found for ${svgName}`);
        }
    }
    getHeightSelect(select);
}

function hasFlag(currency: Currencies): boolean {
    const regexp = /ang|xaf|xcd|xof|xpf/i;
    return !regexp.test(currency);
}

export function getHeightSelect(select: HTMLElement) {
    const optionsAmount = select.childElementCount;
    const MAX_VISIBLE_OPTIONS = 6;

    const heightOption =
        select.firstElementChild.getBoundingClientRect().height;
    const container = select.parentElement;

    if (optionsAmount >= MAX_VISIBLE_OPTIONS) {
        container.style.height = `${
            heightOption * (MAX_VISIBLE_OPTIONS + 2)
        }px`;
        select.style.height = `${
            heightOption * MAX_VISIBLE_OPTIONS
        }px`;
    } else {
        container.style.height = `${
            heightOption * (optionsAmount + 2)
        }px`;
        select.style.height = `${heightOption * optionsAmount}px`;
    }
}
