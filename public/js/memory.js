export function withLogging(fn, config = {}) {
    const { level = 'INFO', format = 'text', transport = console.log } = config;

    return function(...args) {
        const startTime = performance.now();

        const logOutput = (status, resultOrError, execTime) => {
            if (level === 'ERROR' && status !== 'error') return;

            const logEntry = {
                timestmap: new Date().toISOString(),
                level: status === 'error' ? 'ERROR' : level,
                functionName: fn.name,
                arguments: args,
                [status === 'error' ? 'error' : 'result']: resultOrError,
                executionTimeMs: Number(execTime.toFixed(2))
            };

            if (format === 'json') {
                transport(JSON.stringify(logEntry));
            } else {
                transport(`[${logEntry.timestamp}] [${logEntry.level}] ${fn.name}() - ExecTime: ${logEntry.executionTimeMs}ms`);
                if (status === 'error') console.error(resultOrError);
            }
        };

        try {
            const result = fn(...args);
            if (result instanceof Promise) {
                return result
                    .then(res => { logOutput('success', res, performance.now() - startTime); return res; })
                    .catch(err => { logOutput('error', err, performance.now() - startTime); throw err; });
            }
            logOutput('success', result, performance.now() - startTime);
            return result;

        } catch (error) {
            logOutput('error', error, performance.now() - startTime);
            throw error;
        }
    };
}

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