import { getLatestRatesFromAPI } from './api';
import { LOCAL_STORAGE_KEY_CURRENCY } from './constants';
import { isFreshRates } from './freshRates';
import { saveToLocalStorage } from './saveToLocalStorage';
import {
    Currencies,
    LocalStorageCurrencyType,
    RateValue,
} from './type';

export function getRates(
    baseCurrency: Currencies,
    exchangeCurrency: Currencies
): RateValue {
    let ratesInLocalStorage: LocalStorageCurrencyType | null = null;

    try {
        ratesInLocalStorage = JSON.parse(
            window.localStorage.getItem(LOCAL_STORAGE_KEY_CURRENCY)
        );
    } catch (e) {
        console.log(e);
    }

    const isNeedLoad =
        !ratesInLocalStorage ||
        !isFreshRates(ratesInLocalStorage.date) ||
        !ratesInLocalStorage.baseCurrencies[baseCurrency];

    if (isNeedLoad) {
        getLatestRatesFromAPI(baseCurrency).then((apiResponse) => {
            console.log(apiResponse);
            saveToLocalStorage(apiResponse);
        });
    } else {
        return ratesInLocalStorage.baseCurrencies[baseCurrency][
            exchangeCurrency
        ];
    }
}
