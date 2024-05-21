// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    checkAuthentication();
    if (isUserLoggedIn()) {
        displayExpenses();
    }
});

function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        localStorage.setItem(`user_${username}_password`, password);
        alert('Sign up successful! Please log in.');
    } else {
        alert('Please fill in all fields.');
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const storedPassword = localStorage.getItem(`user_${username}_password`);

    if (password === storedPassword) {
        localStorage.setItem('loggedInUser', username);
        checkAuthentication();
        displayExpenses();
    } else {
        alert('Invalid credentials.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    checkAuthentication();
}

function checkAuthentication() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        document.getElementById('welcome-message').innerText = `Welcome, ${loggedInUser}!`;
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('app-container').style.display = 'none';
    }
}

function addExpense() {
    const category = document.getElementById('expense-category').value;
    const amount = document.getElementById('expense-amount').value;
    const comments = document.getElementById('expense-comments').value;

    if (category && amount) {
        const expense = {
            id: Date.now(),
            category,
            amount,
            comments,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        };

        const loggedInUser = localStorage.getItem('loggedInUser');
        const userExpenses = JSON.parse(localStorage.getItem(`user_${loggedInUser}_expenses`)) || [];
        userExpenses.push(expense);
        localStorage.setItem(`user_${loggedInUser}_expenses`, JSON.stringify(userExpenses));

        displayExpenses();
    } else {
        alert('Please fill in the required fields.');
    }
}

function displayExpenses() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const expenses = JSON.parse(localStorage.getItem(`user_${loggedInUser}_expenses`)) || [];
    const tbody = document.getElementById('expenses-tbody');
    tbody.innerHTML = '';

    expenses.sort((a, b) => b.id - a.id).forEach(expense => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.createdAt}</td>
            <td>${expense.updatedAt}</td>
            <td>${expense.comments}</td>
            <td>
                <button onclick="editExpense(${expense.id})">Edit</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function editExpense(id) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const expenses = JSON.parse(localStorage.getItem(`user_${loggedInUser}_expenses`)) || [];
    const expense = expenses.find(expense => expense.id === id);

    const newCategory = prompt('Edit category:', expense.category);
    const newAmount = prompt('Edit amount:', expense.amount);
    const newComments = prompt('Edit comments:', expense.comments);

    if (newCategory && newAmount) {
        expense.category = newCategory;
        expense.amount = newAmount;
        expense.comments = newComments;
        expense.updatedAt = new Date().toLocaleString();

        localStorage.setItem(`user_${loggedInUser}_expenses`, JSON.stringify(expenses));
        displayExpenses();
    } else {
        alert('Please fill in the required fields.');
    }
}

function deleteExpense(id) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const expenses = JSON.parse(localStorage.getItem(`user_${loggedInUser}_expenses`)) || [];
    const filteredExpenses = expenses.filter(expense => expense.id !== id);

    localStorage.setItem(`user_${loggedInUser}_expenses`, JSON.stringify(filteredExpenses));
    displayExpenses();
}

function isUserLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}