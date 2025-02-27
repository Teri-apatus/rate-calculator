import './main.scss';
import { getLatestRates } from './api';
import { mockData } from './mockData';
import { select } from './constants';

const selection = document.getElementById('selection');
const result = getLatestRates('RUB');

result
    .then((response) => {
        console.log(response);
    })
    .catch((error) => console.log(error));

for (const rate in mockData.rates) {
    const option = new Option(rate);
    select.add(option);
}

selection.appendChild(select);
