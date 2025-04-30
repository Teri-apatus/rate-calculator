import { CURRENCIES } from './constants';

export function makeSelectOptions() {
    const selectsNode = document.getElementsByTagName('select');

    function addOptionsToSelect(select: HTMLSelectElement) {
        for (const rate in CURRENCIES) {
            const spanText = document.createElement('span');
            const iconFlag = document.createElement('img');
            spanText.innerHTML = rate;
            // iconFlag.src = `src/images/icons/${rate.toLowerCase()}.svg`;
            const option = new Option('');
            option.append(iconFlag);
            option.append(spanText);
            select.appendChild(option);
            option.setAttribute('value', rate);
        }
    }

    Array.from(selectsNode).forEach((select: HTMLSelectElement) => {
        if (select.className === 'select-currencies') {
            addOptionsToSelect(select);
        }
    });
}
