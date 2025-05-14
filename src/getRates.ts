import { getLatestRatesFromAPI } from './api';
import { LOCAL_STORAGE_KEY_CURRENCY } from './constants';
import { isFreshRates } from './freshRates';
import {
    mapFromAPIToLocalStorage,
    saveToLocalStorage,
} from './saveToLocalStorage';
import {
    Currencies,
    LocalStorageCurrencyType,
    RateValue,
} from './type';

export function getRates(
    baseCurrency: Currencies,
    exchangeCurrency: Currencies
): Promise<RateValue> {
    let ratesInLocalStorage: LocalStorageCurrencyType =
        getRatesFromLocalStorage();

    const isNeedLoad =
        !ratesInLocalStorage ||
        !isFreshRates(ratesInLocalStorage.date) ||
        !ratesInLocalStorage.baseCurrencies[baseCurrency];

    if (isNeedLoad) {
        return getLatestRatesFromAPI(baseCurrency).then(
            (apiResponse) => {
                const apiResponsePreparedForSavingToLS =
                    mapFromAPIToLocalStorage(apiResponse);
                saveToLocalStorage(
                    apiResponsePreparedForSavingToLS,
                    baseCurrency
                );

                return apiResponsePreparedForSavingToLS
                    .baseCurrencies[baseCurrency][exchangeCurrency];
            }
        );
    }

    return Promise.resolve<RateValue>(
        ratesInLocalStorage.baseCurrencies[baseCurrency][
            exchangeCurrency
        ]
    );
}

function getRatesFromLocalStorage(): LocalStorageCurrencyType {
    let ratesInLocalStorage: LocalStorageCurrencyType | null = null;

    try {
        ratesInLocalStorage = JSON.parse(
            window.localStorage.getItem(LOCAL_STORAGE_KEY_CURRENCY)
        );
    } catch (e) {
        console.log(e);
    }

    return ratesInLocalStorage;
    // .baseCurrencies[baseCurrency][
    //     exchangeCurrency
    // ];
}
