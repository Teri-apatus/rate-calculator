import { CURRENCIES } from './constants';
import { Currencies, svgContext } from './type';

export function initCurrencySelect(selectContainer: HTMLElement) {
    const selectedCurrencyNode: HTMLElement =
        selectContainer.querySelector('.selected-currency');
    const searchInputNode: HTMLInputElement =
        selectContainer.querySelector('.search-input');
    const selectCurrenciesNode: HTMLElement =
        selectContainer.querySelector('.select-currencies');

    document.addEventListener('keyup', (event) => {
        // console.log(event);
        // console.log('active', document.activeElement);
    });

    selectContainer.addEventListener('click', (event) => {
        const eventTarget = <HTMLElement>event.target;

        if (!eventTarget.closest('.open')) {
            document.body.addEventListener('click', onBodyClick);
        }

        if (eventTarget.closest('.select-currencies')) {
            initSelectCurrency(eventTarget);
        } else if (eventTarget === searchInputNode) {
            searchInputNode.addEventListener('input', () => {
                initCurrencySearch(searchInputNode.value);
            });
        } else if (eventTarget.closest('.selected-currency')) {
            selectContainer.classList.toggle('open');
            searchInputNode.value = '';
        }
        setSelectHeight(selectContainer);
    });

    function initSelectCurrency(clickedElement: HTMLElement) {
        selectContainer.classList.add('open');
        const targetOption: HTMLElement = clickedElement.closest(
            '.option-currency'
        );
        const objectClickedCurrency = extractCurrencyFromClicked(
            targetOption.textContent
        );
        addOptionsToSelect(
            selectedCurrencyNode,
            objectClickedCurrency
        );
        selectContainer.classList.remove('open');

        searchInputNode.value = '';
        addOptionsToSelect(selectCurrenciesNode, CURRENCIES);
    }

    function initCurrencySearch(inputSearchValue: string) {
        const requiredCurrencies = filterCurrencies(
            inputSearchValue.toLowerCase()
        );
        addOptionsToSelect(selectCurrenciesNode, requiredCurrencies);
        setSelectHeight(selectContainer);
    }

    function onBodyClick(event: MouseEvent) {
        function isClickInsideSelect(): boolean {
            return Boolean(
                (<HTMLElement>event.target).closest(
                    `.${selectContainer.classList[0]}`
                )
            );
        }

        if (!isClickInsideSelect()) {
            selectContainer.classList.remove('open');
            setSelectHeight(selectContainer);
            document.body.removeEventListener('click', onBodyClick);
        }
    }
}

function extractCurrencyFromClicked(textFromClicked: string): {
    [code: string]: string;
} {
    return {
        [textFromClicked.slice(0, 3)]: textFromClicked.slice(6),
    };
}

export function addOptionsToSelect(
    select: HTMLElement,
    currencies: object
) {
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (const [currency, value] of Object.entries(currencies)) {
        const svgName: string = currency.toLowerCase();
        const option = document.createElement('div');
        const spanText = document.createElement('span');

        spanText.innerHTML = `${currency} - ${value}`;
        option.append(spanText);
        select.append(option);
        option.classList.add('option-currency', currency);
        option.setAttribute('title', value);
        option.setAttribute('tabindex', '-1');
        option.setAttribute('role', 'option');

        try {
            if (hasFlag(currency as Currencies)) {
                const flagImg = document.createElement('img');
                flagImg.classList.add('icon-flag');
                flagImg.setAttribute('width', '24px');
                flagImg.setAttribute('alt', `${currency} flag`);
                const iconPath = svgContext(`./${svgName}.svg`);
                flagImg.src = iconPath;
                option.prepend(flagImg);
            }
        } catch (error) {
            console.warn(error, `Flag SVG not found for ${svgName}`);
        }
    }

    addDefaultCurrency(select.closest('.select-container'));
}

function hasFlag(currency: Currencies): boolean {
    const regexp = /ang|xaf|xcd|xof|xpf/i;
    return !regexp.test(currency);
}

function addDefaultCurrency(select: HTMLElement) {
    const rub = select.querySelector('.RUB');
    const usd = select.querySelector('.USD');
    const defaultSelect = select.querySelector('.selected-currency');

    if (defaultSelect.childElementCount === 0) {
        if (defaultSelect.className.includes('base')) {
            defaultSelect.append(rub);
        } else if (defaultSelect.className.includes('exchange')) {
            defaultSelect.append(usd);
        }
    }
    (<HTMLElement>defaultSelect.firstChild).removeAttribute('role');
}

export function setSelectHeight(selectContainer: HTMLElement) {
    const options = selectContainer.querySelectorAll(
        '.option-currency'
    );
    const heightOption = options[0].getBoundingClientRect().height;
    if (!selectContainer.className.includes('open')) {
        selectContainer.style.height = `${heightOption}px`;
    } else {
        const optionsAmount = options.length;

        selectContainer.style.height = `${
            heightOption * (optionsAmount + 1)
        }px`;
    }
}

export function fillCurrencySelects(selectsNode: HTMLElement[]) {
    selectsNode.forEach((select) => {
        addOptionsToSelect(select, CURRENCIES);
    });
}

export function clickSwapButton(
    baseSelect: HTMLElement,
    exchangeSelect: HTMLElement
) {
    const swapButtonNode = document.getElementById('swapButton');

    swapButtonNode.addEventListener('click', (event) => {
        event.preventDefault();
        const textBase = baseSelect.textContent;
        const textExchange = exchangeSelect.textContent;
        const objBase = extractCurrencyFromClicked(textBase);
        const objExch = extractCurrencyFromClicked(textExchange);

        addOptionsToSelect(baseSelect, objExch);
        addOptionsToSelect(exchangeSelect, objBase);
    });
}

function filterCurrencies(inputValue: string): object {
    const filteredCurrencies = Object.fromEntries(
        Object.entries(CURRENCIES).filter((currency) => {
            const isoCurrency = currency[0].toLowerCase();
            const localNameCurrency = currency[1].toLowerCase();
            return (
                isoCurrency.includes(inputValue) ||
                localNameCurrency.includes(inputValue)
            );
        })
    );

    const notFindCurrencies = {
        notFound: 'Не найдено',
    };

    if (JSON.stringify(filteredCurrencies) === '{}') {
        return notFindCurrencies;
    }
    return filteredCurrencies;
}
