import './main.scss';
import { getLatestRatesFromAPI } from './api';
import { mockData } from './mockData';
import { LOCAL_STORAGE_KEY_CURRENCY, select } from './constants';
import {
    Currencies,
    CurrenciesRates,
    LocalStorageCurrencyType,
    RateResponse,
    RateValue,
} from './type';

const selection = document.getElementById('selection');

for (const rate in mockData.rates) {
    const option = new Option(rate);
    select.add(option);
}
select.id = 'selectCurrencies';
selection.appendChild(select);

function isFreshRates(dateNumber: number) {
    const today = new Date();
    const date = new Date(dateNumber);
    if (
        today.getFullYear() !== date.getFullYear() ||
        today.getMonth() !== date.getMonth() ||
        today.getDate() !== date.getDate()
    ) {
        return false;
    }
    return true;
}

function getRates(
    baseCurrency: Currencies,
    exchangeCurrency: Currencies,
    localStorageDate: Date
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
            saveToLocalStorage(apiResponse);
        });
    } else {
        return ratesInLocalStorage.baseCurrencies[baseCurrency][
            exchangeCurrency
        ];
    }

    function saveToLocalStorage(apiResponse: RateResponse) {
        const castDataFromApi: LocalStorageCurrencyType =
            mapFromAPIToLocalStorage(apiResponse);

        const dataToSave: LocalStorageCurrencyType =
            getDataToSave(castDataFromApi);

        localStorage.setItem(
            LOCAL_STORAGE_KEY_CURRENCY,
            JSON.stringify(dataToSave)
        );

        function mapFromAPIToLocalStorage(
            apiResponse: RateResponse
        ): LocalStorageCurrencyType {
            return {
                date: new Date(apiResponse.date).getTime(),
                baseCurrencies: {
                    [apiResponse.base]: apiResponse.rates,
                },
            };
        }

        function isNeedToCombineWithOldData(
            castDataFromApi: LocalStorageCurrencyType,
            ratesInLocalStorage: LocalStorageCurrencyType
        ): boolean {
            if (castDataFromApi.date === ratesInLocalStorage.date) {
                if (
                    castDataFromApi.baseCurrencies[baseCurrency] !==
                    ratesInLocalStorage.baseCurrencies[baseCurrency]
                ) {
                    return true;
                }
            }
            return false;
        }

        function mergeDataToSave(
            dataFromApi: LocalStorageCurrencyType,
            dataFromLS: LocalStorageCurrencyType
        ): LocalStorageCurrencyType {
            const result: LocalStorageCurrencyType = {
                date: dataFromApi.date,
                baseCurrencies: {
                    ...dataFromLS.baseCurrencies,
                    ...dataFromApi.baseCurrencies,
                },
            };
            return result;
        }

        function getDataToSave(
            castDataFromApi: LocalStorageCurrencyType
        ) {
            if (
                isNeedToCombineWithOldData(
                    castDataFromApi,
                    ratesInLocalStorage
                )
            ) {
                return mergeDataToSave(
                    castDataFromApi,
                    ratesInLocalStorage
                );
            }
            return castDataFromApi;
        }
    }
}

const data = getRates('USD', 'KRW', new Date('2025-04-27'));

console.log('data', data); // 15.853953
console.log(getLatestRatesFromAPI('AOA'));
