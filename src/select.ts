import { CURRENCIES } from './constants';

export function fillCurrencySelects(
    selectsNode: HTMLSelectElement[]
) {
    selectsNode.forEach((select) => {
        addOptionsToSelect(select);
    });
}

function addOptionsToSelect(select: HTMLSelectElement) {
    for (const rate in CURRENCIES) {
        const spanText = document.createElement('span');
        spanText.innerHTML = rate;
        const option = new Option('');
        option.append(spanText);
        // const iconsPath = `../src/images/${rate.toLowerCase()}.svg`;
        // option.insertAdjacentHTML(
        //     'afterbegin',
        //     `<img src=${iconsPath} alt="${rate}" />`
        // );
        select.appendChild(option);
        option.setAttribute('value', rate);
    }
}
