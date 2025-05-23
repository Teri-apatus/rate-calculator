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
        addOptionsToSelect(select);
    });
}

function addOptionsToSelect(select: HTMLElement) {
    for (const [currency, value] of Object.entries(CURRENCIES)) {
        const svgName: string = currency.toLocaleLowerCase();
        const option = document.createElement('div');

        const spanText = document.createElement('span');

        spanText.innerHTML = `${currency} - ${[value]}`;

        select.append(option);
        option.classList.add('option-currency');
        option.setAttribute('id', currency);

        try {
            if (hasFlag(currency as Currencies)) {
                const flagImg = document.createElement('img');
                flagImg.setAttribute('width', '15px');
                const iconPath = svgContext(`./${svgName}.svg`);
                flagImg.src = iconPath;
                option.append(flagImg);
            }
        } catch (error) {
            console.warn(`Flag SVG not found for ${svgName}`);
        }
        option.append(spanText);
    }
}

function hasFlag(currency: Currencies): boolean {
    const regexp = /ang|gtq|xaf|xcd|xof|xpf/i;
    return !regexp.test(currency);
}
