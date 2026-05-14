import { withLogging } from './memory.js';

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
    startBtn: document.querySelector('#start-setup'),
    sortBy: document.querySelector('#sort-by'),
    openCalcBtn: document.querySelector('#open-calc-btn'),
    calcDialog: document.querySelector('#calc-dialog'),
    calcDisplay: document.querySelector('#calc-display'),
    calcGrid: document.querySelector('.calc-grid'),
    calcApply: document.querySelector('#calc-apply'),
    calcClose: document.querySelector('#calc-close'),
    historyBtn: document.querySelector('#toggle-history'),
    sidebar: document.querySelector('#history-sidebar'),
    closeSidebarBtn: document.querySelector('#close-sidebar'),
    sidebarOverlay: document.querySelector('#sidebar-overlay'),
    exportFormat: document.querySelector('#export-format'),
    exportBtn: document.querySelector('#export-btn'),
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

export const initExchangeRates = withLogging(async function initExchangeRatesRaw() {
    const usdElement = document.getElementById('rate-usd');
    const eurElement = document.getElementById('rate-eur');

    try {
        const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        const data = await response.json();
        const usd = data.find(item => item.cc === 'USD');
        const eur = data.find(item => item.cc === 'EUR');

        if (usd && eur) {
            usdElement.textContent = Number(usd.rate).toFixed(2);
            eurElement.textContent = Number(eur.rate).toFixed(2);
        }

        return 'rates successfully updated';

    } catch (error) {
        usdElement.textContent = 'Error';
        eurElement.textContent = 'Error';
        throw error;
    }
},{ level: 'INFO', format: 'text' });