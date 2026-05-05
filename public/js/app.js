import {DOM, renderExpenses, updateTotalUI, toggleSetupScreen, initExchangeRates} from './ui.js';
import {saveToLocalStorage, loadFromLocalStorage, calculateTotal, sortExpenses} from './memory.js';

let expenses = loadFromLocalStorage();

function updateApp() {
    const currentSort = DOM.sortBy.value;
    const sortedExpenses = sortExpenses(expenses, currentSort);

    renderExpenses(sortedExpenses);
    const totalBalance = calculateTotal(expenses);
    updateTotalUI(totalBalance);
    saveToLocalStorage(expenses);
}

DOM.sortBy.addEventListener('change', () => {
    updateApp();
});

DOM.startBtn.addEventListener('click', () => {
    const val = parseFloat(DOM.initialBalanceInput.value);
    const source = "Starting Balance";

    if (isNaN(val)) {
        alert("Please enter a starting balance");
        return;
    }

    const firstTransaction = {
        id: Date.now(), name: source, price: val, type: 'income'
    };

    expenses.push(firstTransaction)
    toggleSetupScreen(false);
    updateApp();
});

DOM.addButton.addEventListener('click', () => {
    const itemName = DOM.nameInput.value.trim();
    const itemPrice = parseFloat(DOM.priceInput.value);
    const itemType = DOM.typeInput.value;

    if (itemName === '' || isNaN(itemPrice)) {
        alert('Please enter a valid item name or price!');
        return;
    }

    const newExpense = {
        id: Date.now(), name: itemName, price: itemPrice, type: itemType
    };

    expenses.push(newExpense);
    DOM.nameInput.value = '';
    DOM.priceInput.value = '';
    DOM.nameInput.focus();
    updateApp();

    const tg = window.Telegram.WebApp;

    if (tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
        tg.sendData(JSON.stringify(newExpense));
    }
});

DOM.expenseList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.getAttribute('data-id')); // Достаем ID
        expenses = expenses.filter(item => item.id !== id);
        updateApp();
    }
});

if (DOM.clearButton) {
    DOM.clearButton.addEventListener('click', () => {
        expenses = [];
        updateApp();
    });
}

function init() {
    if (expenses.length > 0) {
        toggleSetupScreen(false);
    }
    updateApp();
    initExchangeRates();
}

init();

if (DOM.openCalcBtn) {
    DOM.openCalcBtn.addEventListener('click', () => {
        DOM.calcDisplay.value = '';
        DOM.calcDialog.showModal();
    });

    DOM.calcClose.addEventListener('click', () => DOM.calcDialog.close());

    DOM.calcGrid.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const val = e.target.textContent;

        if (val === 'C') {
            DOM.calcDisplay.value = '';
        } else if (val === '=') {
            try {
                DOM.calcDisplay.value = new Function('return ' + DOM.calcDisplay.value)();
            } catch {
                DOM.calcDisplay.value = 'Error';
            }
        } else {
            if (DOM.calcDisplay.value === 'Error') DOM.calcDisplay.value = '';
            DOM.calcDisplay.value += val;
        }
    });

    DOM.calcApply.addEventListener('click', () => {
        if (DOM.calcDisplay.value && DOM.calcDisplay.value !== 'Error') {
            DOM.priceInput.value = DOM.calcDisplay.value;
        }
        DOM.calcDialog.close();
    });
}