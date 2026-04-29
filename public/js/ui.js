export const DOM = {
    addButton: document.querySelector('#add-item'),
    nameInput: document.querySelector('#item-name'),
    priceInput: document.querySelector('#item-price'),
    typeInput: document.querySelector('#item-type'),
    expenseList: document.querySelector('#expense-list'),
    totalAmount: document.querySelector('#total-amount'),
    clearButton: document.querySelector('#clear-all'),
    setupScreen: document.querySelector('#setup-screen'),
    initialBalanceInput: document.querySelector('#initial-balance'),
    startBtn: document.querySelector('#start-setup')
};

export function renderExpenses(expenses) {
    DOM.expenseList.innerHTML = '';

    expenses.forEach(item => {
        const li = document.createElement('li');
        const isIncome = item.type === 'income';
        const colorClass = isIncome ? 'income-color' : 'expense-color';
        const sign = isIncome ? '+' : '-';

        li.innerHTML = `<span>${item.name}</span> 
<div class="li-actions">
<strong class="${colorClass}">${sign}${item.price} UAH</strong>
<button class="delete-btn" data-id="${item.id}">Delete</button>
</div>`;

        DOM.expenseList.appendChild(li);
    });
}

export function updateTotalUI(totalBalance) {
    DOM.totalAmount.textContent = totalBalance;
}

export function toggleSetupScreen(show) {
    if (show) {
        DOM.setupScreen.style.display = 'flex';
    } else {
        DOM.setupScreen.style.display = 'none';
    }
}