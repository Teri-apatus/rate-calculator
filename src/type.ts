import { CURRENCIES } from './constants';

export type Currencies = keyof typeof CURRENCIES;

export type RateValue = number;

export type Rates = Partial<Record<Currencies, RateValue>>;

export type CurrenciesRates = Partial<{
    [base in Currencies]: Rates;
}>;

export type LocalStorageCurrencyType = {
    date: number;
    baseCurrencies: CurrenciesRates;
};

export type RateResponse = {
    success: boolean;
    terms: string;
    privacy: string;
    timestamp: number;
    date: string;
    base: Currencies;
    rates: Partial<Rates>;
};
