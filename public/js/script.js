let expenses = []
let totalBalance = 0;

const addButton = document.querySelector('#add-item');
const nameInput = document.querySelector('#item-name');
const priceInput = document.querySelector('#item-price');
const typeInput = document.querySelector('#item-type');
const expenseList = document.querySelector('#expense-list');
const totalAmount = document.querySelector('#total-amount');
const clearButton = document.querySelector('#clear-all');
const setupScreen = document.querySelector('#setup-screen');
const initialBalanceInput = document.querySelector('#initial-balance');
const startBtn = document.querySelector('#start-setup');

startBtn.addEventListener('click', () => {
    const val = parseFloat(initialBalanceInput.value);
    const source = "Starting Balance";

    if (isNaN(val)) {
        alert("Please enter a starting balance");
        return;
    }

    const firstTransaction = {
        id: Date.now(), name: source, price: val, type: 'income'
    };

    expenses.push(firstTransaction);
    setupScreen.style.display = 'none';
    renderExpenses();
    updateTotal();
    saveToLocalStorage();
});

addButton.addEventListener('click', () => {
    const itemName = nameInput.value.trim();
    const itemPrice = parseFloat(priceInput.value);
    const itemType = typeInput.value;

    if (itemName === '' || isNaN(itemPrice)) {
        alert('Please enter a valid item name or price!');
        return;
    }

    const newExpense = {
        id: Date.now(), name: itemName, price: itemPrice, type: itemType
    };

    expenses.push(newExpense);
    nameInput.value = '';
    priceInput.value = '';
    nameInput.focus();

    renderExpenses();
    updateTotal();
    saveToLocalStorage();
});

function renderExpenses() {
    expenseList.innerHTML = '';

    expenses.forEach(item => {
        const li = document.createElement('li');
        const isIncome = item.type === 'income';
        const colorClass = isIncome ? 'income-color' : 'expense-color';
        const sign = isIncome ? '+' : '-'

        li.innerHTML = `<span>${item.name}</span> 
<div class="li-actions">
<strong class="${colorClass}">${sign}${item.price} UAH</strong>
<button class="delete-btn" onclick="deleteExpense(${item.id})">Delete</button>
</div>`;

        expenseList.appendChild(li);
    });
}

function updateTotal() {
    const transactionSum = expenses.reduce((acc, item) => {
        return item.type === 'income' ? acc + item.price : acc - item.price;
    }, 0);

    totalBalance = transactionSum;
    totalAmount.textContent = totalBalance;
}

function deleteExpense(id) {
    expenses = expenses.filter(item => item.id !== id);
    renderExpenses();
    updateTotal();
    saveToLocalStorage();
}

if (clearButton) {
    clearButton.addEventListener('click', () => {
        expenses = [];
        renderExpenses();
        updateTotal();
        saveToLocalStorage();
    });
}

function saveToLocalStorage() {
    localStorage.setItem('finance-data', JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('finance-data');

    if (savedData) {
        expenses = JSON.parse(savedData);

        if (expenses.length > 0) {
            setupScreen.style.display = 'none';
        }

        renderExpenses();
        updateTotal();
    }
}

loadFromLocalStorage();
