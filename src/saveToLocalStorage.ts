import { LOCAL_STORAGE_KEY_CURRENCY } from './constants';
import {
    Currencies,
    LocalStorageCurrencyType,
    RateResponse,
} from './type';

export function saveToLocalStorage(apiResponse: RateResponse) {
    let ratesInLocalStorage: LocalStorageCurrencyType | null = null;
    const baseCurrency: Currencies = apiResponse.base;

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
        if (ratesInLocalStorage !== null) {
            if (castDataFromApi.date === ratesInLocalStorage.date) {
                if (
                    castDataFromApi.baseCurrencies[baseCurrency] !==
                    ratesInLocalStorage.baseCurrencies[baseCurrency]
                ) {
                    return true;
                }
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
