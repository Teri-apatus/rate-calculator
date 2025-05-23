import { addOptionsToSelect, getHeightSelect } from './select';

export function searchFilter(
    searchInputNode: HTMLInputElement,
    selectCurrenciesNode: HTMLElement
) {
    const options = <NodeListOf<HTMLElement>>(
        selectCurrenciesNode.childNodes
    );
    const select = document.createElement('div');
    selectCurrenciesNode.after(select);
    select.classList.add('select-currencies');

    searchInputNode.addEventListener('input', () => {
        filterOptions({
            input: searchInputNode,
            originalSelect: selectCurrenciesNode,
            select,
            options,
        });
    });
}

function filterOptions({
    input,
    originalSelect,
    select,
    options,
}: {
    input: HTMLInputElement;
    originalSelect: HTMLElement;
    select: HTMLElement;
    options: NodeListOf<HTMLElement>;
}) {
    originalSelect.style.display = 'none';
    const filteredOptions = Array.from(options).filter((option) => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        return option.textContent
            .toLowerCase()
            .includes(input.value.toLowerCase());
    });

    for (const option of filteredOptions) {
        const clonedOpt = option.cloneNode(true);
        select.append(clonedOpt);
    }
    getHeightSelect(select);
}
