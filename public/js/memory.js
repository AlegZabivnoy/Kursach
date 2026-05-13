export const saveToLocalStorage = withLogging(function saveToLocalStorageRaw(expenses) {
    localStorage.setItem('finance-data', JSON.stringify(expenses));
}, {
    level: 'DEBUG',
    format: 'json'
});

export function loadFromLocalStorage() {
    const savedData = localStorage.getItem('finance-data');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return [];
}

export function calculateTotal(expenses) {
    return expenses.reduce((acc, item) => {
        return item.type === 'income' ? acc + item.price : acc - item.price;
    }, 0);
}

export function sortExpenses(expenses, sortType) {
    const sortedExpenses = [...expenses];

    switch (sortType) {
        case 'newest':
            return sortedExpenses.sort((a, b) => b.id - a.id);
        case 'oldest':
            return sortedExpenses.sort((a, b) => a.id - b.id);
        case 'highest':
            return sortedExpenses.sort((a, b) => b.price - a.price);
        case 'lowest':
            return sortedExpenses.sort((a, b) => a.price - b.price);
        default:
            return sortedExpenses;
    }
}

function* createIdGenerator() {
    let id = Date.now();
    while (true) {
        yield id++;
    }
}
export const idGen = createIdGenerator();