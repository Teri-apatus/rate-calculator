import { API_KEY, BASE_API_URL } from './constants';
import { mockData } from './mockData';
import {
    Currencies,
    LocalStorageCurrencyType,
    RateResponse,
    Rates,
} from './type';

export function getLatestRatesFromAPI(
    currency: string
): Promise<RateResponse> {
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

    const promise = new Promise<RateResponse>(function (
        resolve,
        reject
    ) {
        setTimeout(() => {
            resolve(mockData as RateResponse);
        }, 1000);
    });

    return promise;
}
