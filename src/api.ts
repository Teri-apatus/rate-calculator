import { API_KEY, BASE_API_URL } from './constants';
import { mockData } from './mockData';

export function getLatestRates(currency: string) {
    // const promise = fetch(
    //     `${BASE_API_URL}/latest?base=${currency}&api_key=${API_KEY}`
    // )
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Error occurred!');
    //         }

    //         return response.json();
    //     })

    //     .catch((err) => {
    //         console.log(err);
    //     });

    const promise = new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(mockData);
            resolve(mockData);
        }, 1000);
    });

    window.localStorage.setItem(
        'currencys',
        JSON.stringify(mockData.rates)
    );

    const today = new Date();
    const mockDay = new Date(mockData.date);

    console.log(today);
    console.log('mock', mockDay);

    if (
        today.getFullYear() !== mockDay.getFullYear() ||
        today.getMonth() !== mockDay.getMonth() ||
        today.getDate() !== mockDay.getDate()
    ) {
        mockData.rates.AED = 15;
        console.log('загружаем из сервера');
        window.localStorage.setItem(
            'currencys',
            JSON.stringify(mockData.rates)
        );
    } else {
        console.log('берём из mock');
    }

    console.log(mockData.rates.AED);

    return promise;
}
