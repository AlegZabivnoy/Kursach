let expenses = []
let totalBalance = 0;

const addButton = document.querySelector('#add-item');
const nameInput = document.querySelector('#item-name');
const priceInput = document.querySelector('#item-price');
const expenseList = document.querySelector('#expense-list');
const totalAmount = document.querySelector('#total-amount');
const clearButton = document.querySelector('#clear-all');

addButton.addEventListener('click', () => {
    const itemName = nameInput.value.trim();
    const itemPrice = parseFloat(priceInput.value);

    if (itemName === '' || isNaN(itemPrice)) {
        alert('Please enter a valid item name and price!');
        return;
    }

    const newExpense = {
        id: Date.now(),
        name: itemName,
        price: itemPrice
    };

    expenses.push(newExpense);
    nameInput.value = '';
    priceInput.value = '';
    nameInput.focus();

    renderExpenses();
    updateTotal();
    });

function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <div class="li-actions"> <strong>${item.price} UAH</strong>
<button class="delete-btn" onclick="deleteExpense(${item.id})">Delete</button>
</div>`;
        expenseList.appendChild(li);
    });
}

function updateTotal() {
    totalBalance = expenses.reduce((sum, item) => sum - item.price, 0);
    totalAmount.textContent = totalBalance;
}

function deleteExpense(id) {
    expenses = expenses.filter(item => item.id !== id);
    renderExpenses();
    updateTotal();
}

if (clearButton) {
    clearButton.addEventListener('click', () => {
        expenses = [];
        renderExpenses();
        updateTotal();
    })
}

// function saveToLocalStorage() {localStorage.setItem('finance-data', JSON.stringify(expenses));}
// function loadFromLocalStorage() {
//     const savedExpenses = JSON.parse(localStorage.getItem('finance-data'));
//
//     if (savedExpenses) {
//         expenses = JSON.parse(savedExpenses);
//         renderExpenses();
//         updateTotal();
//     }
// }
// loadFromLocalStorage();