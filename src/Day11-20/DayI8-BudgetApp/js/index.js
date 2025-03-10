
//    //function to open budget form
//     const budgetForm = document.getElementById('budgetForm');
//     budgetForm.addEventListener('click', openBudgetForm);
//     function openBudgetForm() {
//         budgetForm.classList.remove('hidden');
//         budgetForm.classList.add('slide-in');
//     };

//     //functio to open expenses form
//     const ExpensesForm = document.getElementById('ExpensesForm');
//     ExpensesForm.addEventListener('click', openExpensesForm);
//     function openExpensesForm() {
//         ExpensesForm.classList.remove('hidden');
//         ExpensesForm.classList.add('slide-in');
        
//     };

    let currentBudget = 0;
    let expenses = [];
    let editingIndex = null;

    // Update summary displays
    function updateSummary() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const balance = currentBudget - totalExpenses;
        
        document.getElementById('total-budget').textContent = currentBudget.toFixed(2);
        document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
        document.getElementById('totalBalance').textContent = balance.toFixed(2);
    }

    // Render expenses list
    function renderExpenses() {
        const expensesList = document.getElementById('expensesList');
        expensesList.innerHTML = '';
        
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.className = `text-slate-600 font-normal ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'}`;
            
            row.innerHTML = `
                <td class="p-4">${expense.name}</td>
                <td class="p-4">${parseFloat(expense.amount).toFixed(2)}</td>
                <td class="p-4">
                    <button onclick="editExpense(${index})" class="mr-2">
                        <i class="fas fa-edit text-violet-500 hover:text-violet-600"></i>
                    </button>
                    <button onclick="deleteExpense(${index})">
                        <i class="fas fa-trash text-red-500 hover:text-red-600"></i>
                    </button>
                </td>
            `;
            expensesList.appendChild(row);
        });
    }

    // Validate budget
    function validateBudget(value) {
        const errorElement = document.getElementById('budgetError');
        errorElement.className = 'mt-2 p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded';
        
        if (!value) {
            errorElement.textContent = 'Budget amount is required';
            errorElement.classList.remove('hidden');
            return false;
        }
        
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            errorElement.textContent = 'Please enter a valid positive number';
            errorElement.classList.remove('hidden');
            return false;
        }

        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        if (parsedValue < totalExpenses) {
            errorElement.textContent = 'New budget cannot be less than current expenses';
            errorElement.classList.remove('hidden');
            return false;
        }

        errorElement.classList.add('hidden');
        return true;
    }

    // Validate expense
    function validateExpense(name, amount) {
        const nameError = document.getElementById('nameError');
        const amountError = document.getElementById('amountError');
        let isValid = true;

        nameError.className = 'mt-2 p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded';
        amountError.className = 'mt-2 p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded';

        if (!name.trim()) {
            nameError.textContent = 'Item name is required';
            nameError.classList.remove('hidden');
            isValid = false;
        } else {
            nameError.classList.add('hidden');
        }

        if (!amount) {
            amountError.textContent = 'Amount is required';
            amountError.classList.remove('hidden');
            isValid = false;
        } else {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                amountError.textContent = 'Please enter a valid positive number';
                amountError.classList.remove('hidden');
                isValid = false;
            } else {
                const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                const currentExpenseAmount = editingIndex !== null ? parseFloat(expenses[editingIndex].amount) : 0;
                if (parsedAmount + totalExpenses - currentExpenseAmount > currentBudget) {
                    amountError.textContent = 'Amount exceeds available budget';
                    amountError.classList.remove('hidden');
                    isValid = false;
                } else {
                    amountError.classList.add('hidden');
                }
            }
        }

        return isValid;
    }

    // Budget form functions
    function openBudgetForm() {
        document.getElementById('budgetForm').classList.remove('hidden');
        document.getElementById('budgetError').classList.add('hidden');
        document.getElementById('budgetInput').value = '';
    }

    function closeBudgetForm() {
        document.getElementById('budgetForm').classList.add('hidden');
        document.getElementById('budgetError').classList.add('hidden');
    }

    function setBudget() {
        const budgetInput = document.getElementById('budgetInput');
        if (validateBudget(budgetInput.value)) {
            currentBudget = parseFloat(budgetInput.value);
            updateSummary();
            closeBudgetForm();
        }
    }

    // Expense form functions
    function openExpensesForm() {
        document.getElementById('ExpensesForm').classList.remove('hidden');
        document.getElementById('nameError').classList.add('hidden');
        document.getElementById('amountError').classList.add('hidden');
        document.getElementById('itemNameList').value = '';
        document.getElementById('itemAmountList').value = '';
        document.getElementById('expenseFormTitle').textContent = 'Add expenses';
        document.getElementById('addExpenseBtn').textContent = 'Add Expenses';
        editingIndex = null;
    }

    function closeExpensesForm() {
        document.getElementById('ExpensesForm').classList.add('hidden');
        document.getElementById('nameError').classList.add('hidden');
        document.getElementById('amountError').classList.add('hidden');
        editingIndex = null;
    }

    function addOrUpdateExpense() {
        const nameInput = document.getElementById('itemNameList');
        const amountInput = document.getElementById('itemAmountList');
        
        if (validateExpense(nameInput.value, amountInput.value)) {
            const expense = {
                name: nameInput.value.trim(),
                amount: parseFloat(amountInput.value)
            };

            if (editingIndex !== null) {
                expenses[editingIndex] = expense;
            } else {
                expenses.push(expense);
            }

            updateSummary();
            renderExpenses();
            closeExpensesForm();
        }
    }

    function editExpense(index) {
        editingIndex = index;
        const expense = expenses[index];
        
        document.getElementById('itemNameList').value = expense.name;
        document.getElementById('itemAmountList').value = expense.amount;
        document.getElementById('expenseFormTitle').textContent = 'Edit expense';
        document.getElementById('addExpenseBtn').textContent = 'Update Expense';
        
        document.getElementById('ExpensesForm').classList.remove('hidden');
        document.getElementById('nameError').classList.add('hidden');
        document.getElementById('amountError').classList.add('hidden');
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        updateSummary();
        renderExpenses();
    }

    // Initialize
    document.getElementById('addExpenseBtn').addEventListener('click', addOrUpdateExpense);
    updateSummary();
    renderExpenses();
     


