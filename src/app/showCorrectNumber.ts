import { THIN_SPACE } from './constants';

export function showCorrectNumber(value: string): string {
    const withoutSpace = value.replace(
        new RegExp(THIN_SPACE, 'g'),
        ''
    );
    const correctNumber = setNumberWithTwoDecimalPlaces(withoutSpace);
    return correctNumber.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
}

function setNumberWithTwoDecimalPlaces(value: string): string {
    const parts = value.split(/[,.]/);
    const integerPart = parts[0];
    const decimalSeparator = value[parts[0].length] ? '.' : '';
    const fractionalPart = parts[1] || '';

    if (fractionalPart.length >= 2 || parts.length > 1) {
        return (
            integerPart +
            decimalSeparator +
            fractionalPart.slice(0, 2)
        );
    }

    return value;
}
