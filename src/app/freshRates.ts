export function isFreshRates(localStorageDate: number) {
    const today = new Date();
    const date = new Date(localStorageDate);
    if (
        today.getFullYear() !== date.getFullYear() ||
        today.getMonth() !== date.getMonth() ||
        today.getDate() !== date.getDate()
    ) {
        return false;
    }

    return true;
}
