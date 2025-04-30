import {
    API_KEY,
    BASE_API_URL,
    CURRENCIES,
    LOCAL_STORAGE_KEY_CURRENCY,
} from './constants';
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
    // const promise = fetch<RateResponse>(
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

// const localStorageData: LocalStorageCurrencyType = {
//     date: 1745960400000,
//     baseCurrencies: {
//         USD: {
//             KRW: 15.853953,
//             KWD: 0.003476,
//             KYD: 0.009287,
//             KZT: 5.642446,
//             LAK: 244.772283,
//             LBP: 1012.955214,
//             LKR: 3.282712,
//             LRD: 2.245187,
//             LSL: 0.207067,
//             LTL: 0.037132,
//         },
//     },
// };
// window.localStorage.setItem(
//     LOCAL_STORAGE_KEY_CURRENCY,
//     JSON.stringify(localStorageData)
// );
