export function saveToLocalStorage(expenses) {
    localStorage.setItem('finance-data', JSON.stringify(expenses));
}

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