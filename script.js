'use strict';

const accaunt1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111
};

const accaunt2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222
};

const accaunt3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333
};

const accaunt4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444
};

const accaunts = [accaunt1, accaunt2, accaunt3, accaunt4];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumCashBack = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const modal = document.querySelector('.modal');
const ok = document.querySelector('.ok');



function displayMovements(movements, sort) {

    // movements => [200, 450, -400, 3000, -650, -130, 70, 1300],
    containerMovements.innerHTML = '';

    let sortedMovements = (sort) ? [...movements].sort((a, b) => a - b) : movements;
    sortedMovements.forEach(move => {
        let type = move > 0 ? 'deposit' : 'withdrawal';
        const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">
              1 ${type}
            </div>

            <div class="movements__date">24/01/2037</div>
            <div class="movements__value">${move}$</div>
          </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}



function displayBalance(movements) {
    // movements => [200, 450, -400, 3000, -650, -130, 70, 1300],
    let balance = movements.reduce((acc, element) => acc + element, 0);
    labelBalance.textContent = `${balance}$`;
}


function displaySummary(account) {
    // movements => [200, 450, -400, 3000, -650, -130, 70, 1300],
    const income = account.movements
        .filter(move => move > 0)
        .reduce((acc, val) => acc + val, 0);
    labelSumIn.textContent = `${income}$`;
    const outcome = account.movements
        .filter(move => move < 0)
        .reduce((acc, val) => acc + val, 0);
    labelSumOut.textContent = `${Math.abs(outcome)}$`;

    const cashback = account.movements
        .filter(move => move > 0)
        .map(move => move * (account.interestRate / 100))
        .filter(cash => cash > 1)
        .reduce((acc, val) => acc + val);

    labelSumCashBack.textContent = `${cashback}$`
}

accaunts.forEach(acc => {
    let userName = acc.owner.toLowerCase().split(' ').map(el => el[0]).join('');
    acc.userName = userName;
});

function updateUI(user) {
    displayMovements(user.movements);
    displayBalance(user.movements);
    displaySummary(user);
}


ok.addEventListener('click', function () {
    modal.style.display = 'none';
    inputLoginUsername.value = inputLoginPin.value = '';
});

let currentUser;

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    let user = accaunts.find(acc => inputLoginUsername.value.toLowerCase() == acc.userName);

    if (!user || inputLoginPin.value != user.pin) {
        modal.style.display = 'block';
        return;
    };


    currentUser = user;
    inputLoginUsername.value = inputLoginPin.value = '';
    labelWelcome.textContent = `Hi, ${currentUser.owner.split(' ')[0]}!`
    containerApp.style.opacity = 1;

    updateUI(currentUser);
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    let amount = +inputTransferAmount.value;
    let transferTo = accaunts.find(acc => acc.userName == inputTransferTo.value);

    if (!transferTo) {
        alert('User no found');
    } else if (transferTo.userName == currentUser.userName) {
        alert("You cann't transfer yourself");
    } else if (amout > parseInt(labelBalance.textContent)) {
        alert('You have not the amount to transfer');
    } else {
        currentUser.movements.push(-amount);
        transferTo.movements.push(amount);

        inputTransferTo.value = inputTransferAmount.value = '';

        updateUI(currentUser);
    }
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    let loan = +inputLoanAmount.value;
    let isEnough = currentUser.movements.some(el => el >= loan *0.1);

    if (!isEnough && loan <= 0) {
        alert('sorry');
        return;
    }

    currentUser.movements.push(loan);
    inputLoanAmount.value = '';
    updateUI(currentUser);
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    let userName = inputCloseUsername.value;
    let pin = +inputClosePin.value;
    let userIndex = account.findIndex(el => el.userName == userName);

    if (userIndex == -1 || userName != currentUser.userName || currentUser.pin != pin) {
        alert('Credentials are not correct');
        return;
    }

    accaunts.splice(userIndex, 1);
    containerApp.style.opacity = 0;
});

let sort = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();

    sort = !sort;

    displayMovements(currentUser.movements, sort);
    console.log(sort);
});


const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling']
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
