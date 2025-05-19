import { CURRENCIES } from './constants';

function importAll(r: string) {}

export function fillCurrencySelects(
    selectsNode: HTMLSelectElement[]
) {
    selectsNode.forEach((select) => {
        addOptionsToSelect(select);
    });
}

function addOptionsToSelect(select: HTMLSelectElement) {
    for (const [rate, value] of Object.entries(CURRENCIES)) {
        const spanText = document.createElement('span');
        spanText.innerHTML = `${rate} - ${[value]}`;

        const option = new Option('');
        option.append(spanText);
        // const iconsPath = `../src/images/${rate.toLowerCase()}.svg`;
        // option.insertAdjacentHTML(
        //     'afterbegin',
        //     `<img src=${iconsPath} alt="${rate}" />`
        // );
        select.appendChild(option);
        option.setAttribute('value', rate);
        if (rate === 'RUB') {
            option.setAttribute('selected', 'true');
        }
    }
}
